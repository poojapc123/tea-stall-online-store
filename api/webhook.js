/* ==========================================================================
   POST /api/webhook  — Razorpay server-to-server notifications.

   This is the authoritative record of what was actually paid. The browser
   callback in verify-payment.js can be lost (customer closes the tab, phone
   dies, network drops); the webhook cannot. Configure it in the Razorpay
   dashboard under Settings → Webhooks with events:

     payment.captured, payment.failed, order.paid, refund.processed

   Signature check uses RAZORPAY_WEBHOOK_SECRET (the secret you type into the
   dashboard), which is NOT the same value as RAZORPAY_KEY_SECRET.
   ========================================================================== */

const crypto = require("crypto");
const { saveOrder, readOrder, notifyShop, formatOrderEmail } = require("./_lib");

function rawBody(req) {
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  if (typeof req.rawBody === "string") return Promise.resolve(Buffer.from(req.rawBody));
  return new Promise(resolve => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] RAZORPAY_WEBHOOK_SECRET is not set");
    return res.status(500).end();
  }

  const buf = await rawBody(req);
  const expected = crypto.createHmac("sha256", secret).update(buf).digest("hex");
  const got = String(req.headers["x-razorpay-signature"] || "");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(got, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    console.error("[webhook] signature mismatch — ignoring");
    return res.status(400).end();
  }

  let event;
  try { event = JSON.parse(buf.toString("utf8")); }
  catch (e) { return res.status(400).end(); }

  const payment = event.payload && event.payload.payment && event.payload.payment.entity;
  const orderRef = (payment && payment.notes && payment.notes.orderRef) || null;

  console.log("[webhook]", event.event, orderRef || "(no ref)", payment && payment.id);

  if (orderRef) {
    const record = readOrder(orderRef);
    if (record) {
      if (event.event === "payment.captured") {
        record.status = "paid";
        record.paidAt = new Date().toISOString();
        record.paymentId = payment.id;
        saveOrder(record);
        await notifyShop(
          `Payment captured ${orderRef} — ₹${record.pricing.total}`,
          formatOrderEmail(record)
        );
      } else if (event.event === "payment.failed") {
        record.status = "payment-failed";
        record.failureReason = (payment.error_description || "unknown").slice(0, 300);
        saveOrder(record);
      } else if (event.event === "refund.processed") {
        record.status = "refunded";
        saveOrder(record);
      }
    }
  }

  // Always 200 once the signature is valid, or Razorpay will keep retrying.
  return res.status(200).json({ received: true });
}

module.exports = handler;
/* Raw body required — parsing it first would change the bytes we hash.
   (Assigned after module.exports so it is not overwritten.) */
module.exports.config = { api: { bodyParser: false } };
