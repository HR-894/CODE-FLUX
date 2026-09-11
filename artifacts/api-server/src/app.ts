import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { ZodError, type ZodIssue } from "zod";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Disable Express fingerprinting header
app.disable("x-powered-by");

// Trust proxy for proper rate limiting behind reverse proxies (like Vercel)
app.set("trust proxy", 1);

// Request logging
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Baseline Security Response Headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Configurable CORS protection
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or configured origins
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS")); // Reject unauthorized origins
      }
    },
    credentials: true,
  }),
);

// Payload size limit to prevent buffer exhaustion DoS attacks
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Mount API routes
app.use("/api", router);

// Centralized Error Handling Middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    const issues = err.issues as ZodIssue[];
    res.status(400).json({
      error: "Validation failed",
      details: issues.map((issue: ZodIssue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Malformed JSON payload" });
    return;
  }

  logger.error({ err }, "Unhandled server error");
  const isProd = process.env.NODE_ENV === "production";
  res.status(500).json({
    error: isProd ? "Internal server error" : (err instanceof Error ? err.message : "Internal error"),
  });
});

export default app;
