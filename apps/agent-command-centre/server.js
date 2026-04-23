import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SKY_RADIANT_SYSTEM_PROMPT =
  "You are the Sky Radiant India Amazon Seller Agent — expert advisor for a white-label Amazon.in seller. Sky Radiant buys products from Indian suppliers, brands them under Sky Radiant, and sells on Amazon.in and other platforms (Flipkart, Nykaa, Meesho, JioMart). Strategy: WHITE LABEL only · Under 3% return rate target · Repeat buyers priority · 35%+ net margin. Portfolio: ₹26L monthly revenue · 38% margin · 2.1% return rate · 72% repeat rate · ₹3.1Cr annual target. Be sharp, India-specific, practical. Use ₹. Max 4 paragraphs.";

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "1mb" }));

app.post("/api/ai", async (req, res) => {
  try {
    const { messages = [], systemPrompt } = req.body || {};

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Missing GROQ_API_KEY in .env" });
    }

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt || SKY_RADIANT_SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.5
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: "Groq request failed", details: errorText });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "No response generated.";

    return res.json({ content, raw: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
});

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("*", (_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Sky Radiant Command Centre running on port ${PORT}`);
});
