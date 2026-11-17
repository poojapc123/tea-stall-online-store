/* ==========================================================================
   Sharon Tea Stall — Cart engine
   Persists to localStorage. Stores ONLY {productId, packId, qty} — never
   prices. Money is recomputed from the catalogue on every render, and the
   server recomputes it again at checkout, so a tampered cart cannot change
   what a customer is charged.
   ========================================================================== */

window.SharonCart = (function () {
  "use strict";

  const KEY = "sharon_cart_v1";
  const C = window.SharonCatalog;
  const listeners = [];

  /* ── Storage ─────────────────────────────────────────────────────────── */

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      // Drop anything that no longer exists in the catalogue.
      return raw
        .filter(l => l && C.findProduct(l.productId) && C.getPack(l.packId))
        .map(l => ({
          productId: String(l.productId),
          packId: String(l.packId),
          qty: Math.min(99, Math.max(1, parseInt(l.qty, 10) || 1))
        }));
    } catch (e) {
      return [];
    }
  }

  function write(lines) {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch (e) {
      /* private mode / quota — cart just won't persist */
    }
    listeners.forEach(fn => fn(lines));
    paintBadge();
  }

  function onChange(fn) {
    listeners.push(fn);
    return fn;
  }

  /* ── Mutations ───────────────────────────────────────────────────────── */

  function add(productId, packId, qty) {
    if (!C.findProduct(productId)) return false;
    const lines = read();
    const n = Math.min(99, Math.max(1, parseInt(qty, 10) || 1));
    const hit = lines.find(l => l.productId === productId && l.packId === packId);
    if (hit) hit.qty = Math.min(99, hit.qty + n);
    else lines.push({ productId, packId, qty: n });
    write(lines);
    return true;
  }

  function setQty(productId, packId, qty) {
    const n = parseInt(qty, 10);
    if (!n || n < 1) return remove(productId, packId);
    const lines = read();
    const hit = lines.find(l => l.productId === productId && l.packId === packId);
    if (hit) hit.qty = Math.min(99, n);
    write(lines);
  }

  function remove(productId, packId) {
    write(read().filter(l => !(l.productId === productId && l.packId === packId)));
  }

  function clear() { write([]); }

  /* ── Derived values ──────────────────────────────────────────────────── */

  /** Cart lines enriched with product + live pricing. */
  function detailed() {
    return read().map(l => {
      const product = C.findProduct(l.productId);
      const pack = C.getPack(l.packId);
      const unit = C.unitPrice(l.productId, l.packId);
      const mrp = C.unitMrp(l.productId, l.packId);
      return {
        ...l,
        product, pack, unit, mrp,
        lineTotal: unit * l.qty,
        lineSaving: (mrp - unit) * l.qty
      };
    });
  }

  function count() {
    return read().reduce((n, l) => n + l.qty, 0);
  }

  /**
   * Order maths. Mirrored exactly by api/_pricing.js on the server — if you
   * change a rule here, change it there too or checkout will reject the order.
   */
  function totals(opts) {
    const o = opts || {};
    const lines = detailed();
    const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
    const saving = lines.reduce((n, l) => n + l.lineSaving, 0);
    const S = C.SHIPPING;

    const shipping = subtotal === 0 ? 0 : (subtotal >= S.freeAbove ? 0 : S.flatRate);
    const codFee = o.paymentMethod === "cod" ? S.codFee : 0;
    const gst = Math.round(subtotal * S.gstRate);
    const total = subtotal + shipping + codFee + gst;

    return {
      lines, subtotal, saving, shipping, codFee, gst, total,
      freeShippingGap: Math.max(0, S.freeAbove - subtotal),
      qualifiesFreeShipping: subtotal >= S.freeAbove
    };
  }

  /* ── Header badge ────────────────────────────────────────────────────── */

  function paintBadge() {
    const n = count();
    document.querySelectorAll("[data-cart-count]").forEach(el => {
      el.textContent = n;
      el.setAttribute("data-empty", n === 0 ? "true" : "false");
    });
  }

  /* Keep tabs in sync. */
  window.addEventListener("storage", e => {
    if (e.key === KEY) {
      listeners.forEach(fn => fn(read()));
      paintBadge();
    }
  });

  document.addEventListener("DOMContentLoaded", paintBadge);

  return {
    read, add, setQty, remove, clear,
    detailed, count, totals, onChange, paintBadge
  };
})();
