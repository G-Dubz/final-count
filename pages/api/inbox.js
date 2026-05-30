// pages/api/inbox.js
// Dashboard polls this every 5 seconds to get new incoming messages

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const KV_URL   = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({ messages: [], configured: false });
  }

  try {
    const r = await fetch(`${KV_URL}/get/fc_inbox`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const d = await r.json();

    // Upstash returns { result: "stringified JSON" } or { result: null }
    let inbox = [];
    if (d.result) {
      try {
        inbox = JSON.parse(d.result);
      } catch {
        inbox = [];
      }
    }

    const since = req.query.since;
    const filtered = since
      ? inbox.filter(m => new Date(m.timestamp) > new Date(since))
      : inbox.slice(0, 50);

    return res.status(200).json({ messages: filtered, configured: true });
  } catch(err) {
    console.error("Inbox fetch error:", err.message);
    return res.status(500).json({ error: err.message, messages: [], configured: true });
  }
}
