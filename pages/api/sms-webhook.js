// pages/api/sms-webhook.js
// Twilio calls this URL when a guest replies to an RSVP text.
// We parse the reply with Claude, respond to the guest, and store the message.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const from    = req.body.From;   // guest's phone number
  const to      = req.body.To;     // our Twilio number
  const msgBody = req.body.Body;   // what the guest typed

  if (!from || !msgBody) {
    return res.status(400).send("Missing From or Body");
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  // ── Load conversation history from KV store (Vercel KV / Upstash Redis) ──
  // For now we use a simple JSON file approach via the file system.
  // In production you'd use Vercel KV: https://vercel.com/docs/storage/vercel-kv
  // We store conversations keyed by phone number.

  let conversationHistory = [];
  let guestName = from; // fallback
  let weddingContext = {};

  try {
    // Try to load from Vercel KV if available
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const kvRes = await fetch(`${process.env.KV_REST_API_URL}/get/convo_${from.replace(/\D/g,"")}`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
      });
      const kvData = await kvRes.json();
      if (kvData.result) {
        const stored = JSON.parse(kvData.result);
        conversationHistory = stored.history || [];
        guestName           = stored.guestName || from;
        weddingContext      = stored.weddingContext || {};
      }
    }
  } catch (e) {
    console.error("KV load error:", e);
  }

  // Add the guest's new message to history
  conversationHistory.push({ role: "user", content: msgBody });

  // ── Generate AI response ──────────────────────────────────────────────────
  const firstName   = guestName.split(" ")[0] || "there";
  const coupleNames = [weddingContext?.bride, weddingContext?.groom].filter(Boolean).join(" & ") || "the couple";
  const weddingDate = weddingContext?.date
    ? new Date(weddingContext.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";
  const events  = (weddingContext?.events || []).join(", ");
  const toneMap = { warm:"warm and friendly", formal:"professional and elegant", casual:"relaxed and conversational", fun:"playful and cheerful" };
  const toneDesc = toneMap[weddingContext?.tone || "warm"] || "warm and friendly";

  const systemPrompt = `You are FinalCount, a ${toneDesc} AI wedding RSVP assistant texting on behalf of ${coupleNames}${weddingDate ? ` whose wedding is on ${weddingDate}` : ""}. You are texting their guest: ${guestName}.
${events ? `\nThe wedding has these events: ${events}.` : ""}

Your job:
- Understand the guest's reply — they may confirm, decline, mention plus-ones, dietary needs, or event-specific attendance
- Reply warmly and concisely — this is SMS, keep it under 160 characters when possible
- After your reply, on the very last line append a JSON status update (no markdown, no backticks):
{"status":"Confirmed","events":"All events","dietary":"None","plusOne":"No"}

Use "Confirmed", "Declined", or "Pending". Use "None" / "No" when not mentioned.
Address the guest by their first name: ${firstName}.`;

  let aiReplyText = `Thanks for getting back to us! We've noted your response. If you have any questions, just reply here.`;
  let parsedStatus = null;

  try {
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: systemPrompt,
        messages: conversationHistory,
      }),
    });

    const aiData = await aiRes.json();
    const raw    = aiData.content?.[0]?.text?.trim() || "";
    const lines  = raw.split("\n");
    const last   = lines[lines.length - 1].trim();

    try { parsedStatus = JSON.parse(last); } catch {}

    aiReplyText = parsedStatus
      ? lines.slice(0, -1).join("\n").trim()
      : raw;
  } catch (e) {
    console.error("Claude error:", e);
  }

  // Add AI reply to history
  conversationHistory.push({ role: "assistant", content: aiReplyText });

  // ── Save updated conversation to KV ──────────────────────────────────────
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await fetch(`${process.env.KV_REST_API_URL}/set/convo_${from.replace(/\D/g,"")}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          result: JSON.stringify({
            history: conversationHistory,
            guestName,
            weddingContext,
            parsedStatus,
            lastUpdated: new Date().toISOString(),
          }),
        }),
      });
    }
  } catch (e) {
    console.error("KV save error:", e);
  }

  // ── Store inbound message for dashboard polling ───────────────────────────
  // Push to an "inbox" list in KV so the dashboard can display it
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      // Get existing inbox
      const inboxRes = await fetch(`${process.env.KV_REST_API_URL}/get/fc_inbox`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
      });
      const inboxData = await inboxRes.json();
      const inbox = inboxData.result ? JSON.parse(inboxData.result) : [];

      inbox.unshift({
        from,
        guestName,
        message: msgBody,
        reply:   aiReplyText,
        parsedStatus,
        timestamp: new Date().toISOString(),
      });

      // Keep last 500 messages
      const trimmed = inbox.slice(0, 500);

      await fetch(`${process.env.KV_REST_API_URL}/set/fc_inbox`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ result: JSON.stringify(trimmed) }),
      });
    }
  } catch (e) {
    console.error("Inbox save error:", e);
  }

  // ── Send reply via Twilio ────────────────────────────────────────────────
  try {
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: fromNumber,
          To:   from,
          Body: aiReplyText,
        }),
      }
    );
  } catch (e) {
    console.error("Twilio send error:", e);
  }

  // Twilio expects a TwiML response — sending empty response is fine since we
  // already sent the reply programmatically above
  res.setHeader("Content-Type", "text/xml");
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
}

export const config = {
  api: { bodyParser: { type: "application/x-www-form-urlencoded" } },
};
