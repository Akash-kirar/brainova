import { GoogleGenAI } from "@google/genai";
import { applyCors, requireMethod } from "../_cors.js";

const aiSystemInstruction =
  "You are Nova AI, a smart, powerful, and friendly personal brain training coach. " +
  "Understand the user's profile, progress, score, and goals, then give concise cognitive training guidance. " +
  "Give text-only responses. If the user's score is zero, acknowledge it correctly. " +
  "If the user asks for a calculation plan, append [CALC_PLAN]. If they ask for a training plan widget, append [VIEW_PLAN].";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (requireMethod(req, res, "POST")) return;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: "Gemini API key is not configured on this deployment" });
  }

  const { message, context, history } = req.body || {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
    const recentHistory = Array.isArray(history)
      ? history
          .slice(-8)
          .map((item) => `${item.role === "model" ? "Nova" : "User"}: ${String(item.text || "").slice(0, 1000)}`)
          .join("\n")
      : "";
    const prompt = [
      recentHistory ? `Recent conversation:\n${recentHistory}` : "",
      typeof context === "string" ? context.slice(0, 4000) : "",
      `User: ${message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: aiSystemInstruction,
      },
    });

    res.status(200).json({ text: response.text || "I could not generate a response right now." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not generate AI response" });
  }
}
