import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const openaiApiKey =
  process.env.OPENAI_API_KEY ||
  process.env.OPENAI_KEY ||
  process.env.OPENAI_APIKEY ||
  process.env.OPENAI;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Study chatbot backend is running." });
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "The request body must include a messages array." });
  }

  if (!openai) {
    return res.status(500).json({
      error:
        "Missing OpenAI API key in environment. Set OPENAI_API_KEY, OPENAI_KEY, OPENAI_APIKEY, or OPENAI and restart the backend.",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 700,
      temperature: 0.75,
    });

    const assistantMessage = completion.choices?.[0]?.message?.content || "";
    return res.json({ message: assistantMessage, usage: completion.usage });
  } catch (error) {
    console.error("OpenAI request failed:", error);
    const message = error?.message || "Failed to call OpenAI API.";
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Study chatbot backend running on http://localhost:${port}`);
});
