/* ==========================================================================
   POST /api/create-order

   Body:  { items:[{productId,packId,qty}], customer:{...}, paymentMethod }
   Reply: { orderRef, razorpayOrderId, amount, currency, keyId }   (online)
          { orderRef, paymentMethod:"cod" }                        (COD)

   The amount is computed here from the server's own catalogue. Nothing the
   browser sends about price is trusted or even read.
   ========================================================================== */

const { priceOrder, cleanCustomer, makeOrderRef } = require("./_pricing");
const { applyCors, readJson, fail, saveOrder, notifyShop, formatOrderEmail } = require("./_lib");

module.exports = async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return fail(res, 405, "Method not allowed");

  const body = await readJson(req);
  const paymentMethod = body.paymentMethod === "cod" ? "cod" : "online";

  if (paymentMethod === "cod" && process.env.ENABLE_COD === "false") {
    return fail(res, 400, "Cash on delivery is not available at the moment.");
  }

  let customer, pricing;
  try {
    customer = cleanCustomer(body.customer);
    pricing = priceOrder(body.items, paymentMethod);
  } catch (err) {
    return fail(res, 400, err.message);
  }

  const orderRef = makeOrderRef();

  const record = {
    orderRef,
    createdAt: new Date().toISOString(),
    status: paymentMethod === "cod" ? "confirmed-cod" : "awaiting-payment",
    paymentMethod,
    customer,
    pricing
  };

  /* Cash on delivery: nothing to charge, so the order is done here. */
  if (paymentMethod === "cod") {
    saveOrder(record);
    await notifyShop(`New COD order ${orderRef} — ₹${pricing.total}`, formatOrderEmail(record));
    return res.status(200).json({ orderRef, paymentMethod: "cod", total: pricing.total });
  }

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error("[create-order] Razorpay keys are not configured");
    return fail(res, 500, "Online payment is not configured yet. Please call 00000 00000 to order.");
  }

  // Required lazily so cash-on-delivery keeps working even if the Razorpay SDK
  // is not installed.
  let Razorpay;
  try {
    Razorpay = require("razorpay");
  } catch (e) {
    console.error("[create-order] razorpay package is not installed — run: npm install");
    return fail(res, 500, "Online payment is not configured yet. Please call 00000 00000 to order.");
  }

  try {
    const rzp = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });

    // Razorpay keeps these notes against the order, which makes the dashboard a
    // usable record even before you attach a real database.
    const rzpOrder = await rzp.orders.create({
      amount: pricing.amountPaise,
      currency: "INR",
      receipt: orderRef,
      notes: {
        orderRef,
        customer: `${customer.name} · ${customer.phone}`,
        email: customer.email,
        address: [customer.address1, customer.address2, customer.city,
                  customer.state, customer.pincode].filter(Boolean).join(", "),
        items: pricing.lines.map(l => `${l.qty}×${l.name} (${l.packLabel})`).join(", ").slice(0, 480)
      }
    });

    record.razorpayOrderId = rzpOrder.id;
    saveOrder(record);

    return res.status(200).json({
      orderRef,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: RAZORPAY_KEY_ID          // public key id, safe to return
    });
  } catch (err) {
    console.error("[create-order] Razorpay error:", err && (err.message || err));
    return fail(res, 502, "We could not reach the payment gateway. Please try again in a moment.");
  }
};
