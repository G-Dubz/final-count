// pages/api/chat.js
// Server-side API route using Google Gemini — free tier available at aistudio.google.com

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, messages } = req.body;

  if (!system || !messages) {
    return res.status(400).json({ error: "Missing system or messages" });
  }

  try {
    // Convert Anthropic-style messages to Gemini format
    // Gemini uses "user" / "model" roles and a "parts" array
    const geminiContents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Prepend the system prompt as the first user turn
    // (Gemini Flash supports systemInstruction natively)
    const body = {
      system_instruction: {
        parts: [{ text: system }],
      },
      contents: geminiContents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const model  = "gemini-2.0-flash";
    const url    = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);
      return res.status(response.status).json({ error: data.error?.message || "Gemini API error" });
    }

    // Normalize Gemini response to the same shape the dashboard expects
    // Dashboard reads: data.content[0].text
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({
      content: [{ type: "text", text }],
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

