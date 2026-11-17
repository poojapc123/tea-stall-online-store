/* ==========================================================================
   POST /api/verify-payment

   Confirms that a payment really came from Razorpay by checking the HMAC
   signature. Without this step anyone could POST a fake success and get an
   order marked paid, so it is not optional.

   Body:  { orderRef, razorpay_order_id, razorpay_payment_id, razorpay_signature }
   ========================================================================== */

const crypto = require("crypto");
const { applyCors, readJson, fail, readOrder, saveOrder, notifyShop, formatOrderEmail } = require("./_lib");

module.exports = async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return fail(res, 405, "Method not allowed");

  const body = await readJson(req);
  const { orderRef, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!orderRef || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return fail(res, 400, "Incomplete payment details.");
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error("[verify-payment] RAZORPAY_KEY_SECRET is not set");
    return fail(res, 500, "Payment verification is not configured.");
  }

  // Razorpay signs "<order_id>|<payment_id>" with your key secret.
  const expected = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(String(razorpay_signature), "utf8");
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    console.error("[verify-payment] SIGNATURE MISMATCH for", orderRef, razorpay_payment_id);
    return fail(res, 400, "We could not verify this payment. Please contact us before paying again.");
  }

  const existing = readOrder(orderRef);

  // The order record may be missing on ephemeral serverless storage. The
  // signature is what proves the payment, so we confirm regardless and let the
  // webhook be the durable record.
  const record = existing || {
    orderRef,
    createdAt: new Date().toISOString(),
    paymentMethod: "online",
    customer: {},
    pricing: { lines: [], subtotal: 0, gst: 0, shipping: 0, codFee: 0, total: 0 }
  };

  record.status = "paid";
  record.paidAt = new Date().toISOString();
  record.paymentId = razorpay_payment_id;
  record.razorpayOrderId = razorpay_order_id;
  saveOrder(record);

  if (existing) {
    await notifyShop(
      `Payment received ${orderRef} — ₹${record.pricing.total}`,
      formatOrderEmail(record)
    );
  }

  return res.status(200).json({ ok: true, orderRef, status: "paid" });
};
