/* ==========================================================================
   Server-side pricing — the authority.

   Reuses the SAME catalogue file the browser loads, so prices can never drift
   between the shop page and the amount charged. The browser sends only
   {productId, packId, qty}; every rupee is recomputed here.

   This mirrors totals() in assets/js/cart.js. Change one, change both.
   ========================================================================== */

const catalog = require("../assets/js/products.js");

const MAX_QTY_PER_LINE = 99;
const MAX_LINES = 30;

/** Throws on anything malformed — the caller turns that into a 400. */
function priceOrder(items, paymentMethod) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your basket is empty.");
  }
  if (items.length > MAX_LINES) {
    throw new Error("Too many different items in one order.");
  }

  const seen = new Set();
  const lines = items.map(raw => {
    const product = catalog.findProduct(String(raw.productId || ""));
    if (!product) throw new Error("One of the teas in your basket is no longer available.");

    const pack = catalog.PACKS.find(p => p.id === String(raw.packId || ""));
    if (!pack) throw new Error("Invalid pack size.");

    const key = product.id + "|" + pack.id;
    if (seen.has(key)) throw new Error("Duplicate line in basket.");
    seen.add(key);

    const qty = parseInt(raw.qty, 10);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) {
      throw new Error("Invalid quantity.");
    }

    const unit = catalog.unitPrice(product.id, pack.id);
    return {
      productId: product.id,
      name: product.name,
      packId: pack.id,
      packLabel: pack.label,
      qty,
      unit,
      lineTotal: unit * qty
    };
  });

  const S = catalog.SHIPPING;
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const shipping = subtotal >= S.freeAbove ? 0 : S.flatRate;
  const codFee = paymentMethod === "cod" ? S.codFee : 0;
  const gst = Math.round(subtotal * S.gstRate);
  const total = subtotal + shipping + codFee + gst;

  return {
    lines, subtotal, shipping, codFee, gst, total,
    amountPaise: total * 100          // Razorpay works in the smallest unit
  };
}

/* ── Customer validation ───────────────────────────────────────────────── */

const REQUIRED = ["name", "phone", "email", "address1", "city", "state", "pincode"];

function cleanCustomer(input) {
  const c = input || {};
  const out = {};

  for (const key of REQUIRED) {
    const v = String(c[key] == null ? "" : c[key]).trim();
    if (!v) throw new Error("Missing delivery detail: " + key);
    out[key] = v.slice(0, 200);
  }
  out.address2 = String(c.address2 || "").trim().slice(0, 200);
  out.notes = String(c.notes || "").trim().slice(0, 500);

  if (!/^[6-9]\d{9}$/.test(out.phone.replace(/\D/g, ""))) {
    throw new Error("Enter a valid 10-digit Indian mobile number.");
  }
  out.phone = out.phone.replace(/\D/g, "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(out.email)) {
    throw new Error("Enter a valid email address.");
  }
  if (!/^[1-9]\d{5}$/.test(out.pincode)) {
    throw new Error("Enter a valid 6-digit PIN code.");
  }

  return out;
}

/** Human-readable reference: STS-<base36 time>-<random>. */
function makeOrderRef() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return "STS-" + t + "-" + r;
}

module.exports = { priceOrder, cleanCustomer, makeOrderRef, catalog };
