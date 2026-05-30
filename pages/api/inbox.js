// pages/api/inbox.js
// Dashboard polls this every 5 seconds to get new incoming messages.
// Returns the latest messages from the KV inbox store.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const since = req.query.since; // ISO timestamp — only return messages newer than this

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    // KV not configured — return empty so dashboard doesn't crash
    return res.status(200).json({ messages: [], configured: false });
  }

  try {
    const kvRes  = await fetch(`${process.env.KV_REST_API_URL}/get/fc_inbox`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    });
    const kvData = await kvRes.json();
    const inbox  = kvData.result ? JSON.parse(kvData.result) : [];

    const filtered = since
      ? inbox.filter(m => new Date(m.timestamp) > new Date(since))
      : inbox.slice(0, 50);

    return res.status(200).json({ messages: filtered, configured: true });
  } catch (err) {
    console.error("Inbox fetch error:", err);
    return res.status(500).json({ error: "Failed to load inbox", messages: [] });
  }
}
