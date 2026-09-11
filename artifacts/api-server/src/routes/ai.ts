import { Router, type Request, type Response, type NextFunction } from "express";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

const aiRouter = Router();

aiRouter.post("/chat", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages, provider = "gemini" } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    let model;
    if (provider === "groq") {
      const groq = createOpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: process.env.GROQ_API_KEY || "",
      });
      model = groq("llama-3.1-8b-instant"); // Fast model on Groq
    } else {
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY || "",
      });
      model = google("gemini-2.5-flash");
    }

    // Stream plain text chunks to the Express response
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    const result = streamText({
      model,
      system: "You are CampusOS AI, a frictionless GenZ student assistant for Lovely Professional University. Keep answers very concise, helpful, and use modern slang naturally (no cap).",
      messages,
    });

    // Stream each text chunk as plain text (not the AI SDK data protocol)
    for await (const chunk of result.textStream) {
      res.write(chunk);
    }

    res.end();
  } catch (err) {
    // If headers already sent, we can't send a JSON error
    if (res.headersSent) {
      res.end();
    } else {
      next(err);
    }
  }
});

export default aiRouter;
