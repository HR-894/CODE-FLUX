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

    // Stream the text to the Express response
    const result = streamText({
      model,
      system: "You are CampusOS AI, a frictionless GenZ student assistant for Lovely Professional University. Keep answers very concise, helpful, and use modern slang naturally (no cap).",
      messages,
    });

    result.pipeDataStreamToResponse(res);
  } catch (err) {
    next(err);
  }
});

export default aiRouter;
