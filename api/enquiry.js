/* ==========================================================================
   POST /api/enquiry — contact, catering and franchise form submissions.

   Body: { kind: "Contact"|"Catering"|"Franchise", data: {...} }

   If SMTP is not configured this returns 503 on purpose, so the browser falls
   back to opening the customer's mail client instead of pretending the
   message was sent.
   ========================================================================== */

const { applyCors, readJson, fail, notifyShop } = require("./_lib");

const KINDS = ["Contact", "Catering", "Franchise"];
const MAX_FIELD = 2000;

module.exports = async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return fail(res, 405, "Method not allowed");

  const body = await readJson(req);
  const kind = KINDS.includes(body.kind) ? body.kind : "Contact";
  const data = body.data && typeof body.data === "object" ? body.data : null;

  if (!data) return fail(res, 400, "Nothing to send.");

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const phone = String(data.phone || "").replace(/\D/g, "");

  if (name.length < 2) return fail(res, 400, "Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail(res, 400, "Enter a valid email address.");
  if (!/^[6-9]\d{9}$/.test(phone)) return fail(res, 400, "Enter a valid 10-digit mobile number.");

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    // Honest failure — the front end will hand the message to the mail client.
    return fail(res, 503, "Email is not configured on the server.");
  }

  const lines = Object.entries(data)
    .filter(([, v]) => String(v || "").trim())
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
      return `${label}: ${String(v).trim().slice(0, MAX_FIELD)}`;
    });

  await notifyShop(
    `${kind} enquiry — ${name}`,
    `New ${kind.toLowerCase()} enquiry from the website:\n\n${lines.join("\n")}\n`
  );

  return res.status(200).json({ ok: true });
};
