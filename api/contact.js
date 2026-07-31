export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, message, _hp } = req.body || {};
  if (_hp) return res.status(200).json({ ok: true });
  if (!name || !message) return res.status(400).json({ error: "name and message required" });

  const alertText = [
    `New contact form message — games.rubyxqube.com`,
    ``,
    `Name:    ${name}`,
    email ? `Email:   ${email}` : null,
    ``,
    message,
  ].filter(Boolean).join("\n");

  const { NTFY_TOPIC } = process.env;
  if (NTFY_TOPIC) {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: { "Title": "New message — RubyxQube Games", "Priority": "high", "Tags": "bell,video_game", "Content-Type": "text/plain" },
      body: alertText,
    }).catch(err => console.error("ntfy error:", err.message));
  }

  const { RESEND_API_KEY, ALERT_EMAIL, FROM_EMAIL } = process.env;
  if (RESEND_API_KEY && ALERT_EMAIL) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL || "onboarding@resend.dev",
        to: [ALERT_EMAIL],
        subject: `New message — ${name}`,
        text: alertText,
        ...(email ? { reply_to: email } : {}),
      }),
    }).catch(err => console.error("Resend error:", err.message));
  }

  return res.status(200).json({ ok: true });
}
