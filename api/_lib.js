/* ==========================================================================
   Shared helpers for the serverless functions: CORS, body parsing, order
   persistence and the shop notification email.
   ========================================================================== */

const fs = require("fs");
const path = require("path");

/* ── CORS ──────────────────────────────────────────────────────────────── */

/**
 * Set ALLOWED_ORIGIN in your environment to your real domain, e.g.
 * https://www.teastall-demo.com. Defaults to "*" so local testing works.
 */
function applyCors(req, res) {
  const allowed = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return true; }
  return false;
}

/** Vercel parses JSON for you; this covers plain Node/Express too. */
async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return await new Promise(resolve => {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
      if (data.length > 1e6) { req.destroy(); resolve({}); }   // 1 MB cap
    });
    req.on("end", () => {
      try { resolve(JSON.parse(data || "{}")); } catch (e) { resolve({}); }
    });
  });
}

function fail(res, status, message) {
  res.status(status).json({ error: message });
}

/* ── Order storage ─────────────────────────────────────────────────────── */

/**
 * Appends orders to a JSONL file. Good enough for a single small shop and for
 * local development.
 *
 * IMPORTANT on serverless (Vercel/Netlify): the filesystem is ephemeral, so
 * this file is NOT durable — treat it as a debug log only. Your durable record
 * is the Razorpay dashboard (we attach the customer and items as order notes)
 * plus the notification email below. For real order management, replace this
 * function with a database write.
 */
const ORDERS_FILE = process.env.ORDERS_FILE
  || path.join(process.env.VERCEL ? "/tmp" : path.join(__dirname, ".."), "orders.jsonl");

function saveOrder(record) {
  try {
    fs.appendFileSync(ORDERS_FILE, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    console.error("[orders] could not persist order", record.orderRef, err.message);
  }
}

function readOrder(orderRef) {
  try {
    const lines = fs.readFileSync(ORDERS_FILE, "utf8").trim().split("\n");
    // Last write wins — records are appended, never edited in place.
    for (let i = lines.length - 1; i >= 0; i--) {
      const rec = JSON.parse(lines[i]);
      if (rec.orderRef === orderRef) return rec;
    }
  } catch (err) { /* file may not exist yet */ }
  return null;
}

/* ── Notification email (optional) ─────────────────────────────────────── */

/**
 * Sends the shop an email when an order is paid. Silently does nothing if SMTP
 * is not configured — a missing email must never fail a paid order.
 */
async function notifyShop(subject, textBody) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SHOP_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return;

  let nodemailer;
  try {
    nodemailer = require("nodemailer");
  } catch (e) {
    console.warn("[mail] nodemailer not installed — skipping notification");
    return;
  }

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    await transport.sendMail({
      from: `"Sharon Tea Stall" <${SMTP_USER}>`,
      to: SHOP_EMAIL || "hello@teastall-demo.com",
      subject,
      text: textBody
    });
  } catch (err) {
    console.error("[mail] notification failed:", err.message);
  }
}

/** Plain-text order summary used in the notification email. */
function formatOrderEmail(record) {
  const lines = record.pricing.lines
    .map(l => `  ${l.qty} × ${l.name} (${l.packLabel})  ₹${l.lineTotal}`)
    .join("\n");
  const c = record.customer;
  return `Order ${record.orderRef}
Payment: ${record.paymentMethod}${record.paymentId ? " · " + record.paymentId : ""}

ITEMS
${lines}

Subtotal   ₹${record.pricing.subtotal}
GST (5%)   ₹${record.pricing.gst}
Delivery   ₹${record.pricing.shipping}${record.pricing.codFee ? `\nCOD fee    ₹${record.pricing.codFee}` : ""}
TOTAL      ₹${record.pricing.total}

DELIVER TO
${c.name}
${c.address1}${c.address2 ? "\n" + c.address2 : ""}
${c.city}, ${c.state} - ${c.pincode}
${c.phone} · ${c.email}
${c.notes ? "\nNotes: " + c.notes : ""}
`;
}

module.exports = {
  applyCors, readJson, fail,
  saveOrder, readOrder, ORDERS_FILE,
  notifyShop, formatOrderEmail
};
