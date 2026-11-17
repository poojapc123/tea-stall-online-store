/* Confirmation page — renders the receipt stashed by checkout.js. */
(function () {
  "use strict";

  const C = window.SharonCatalog;
  const esc = window.SharonUI.escapeHtml;
  const params = new URLSearchParams(location.search);
  const ref = params.get("ref");

  document.getElementById("order-ref").textContent = ref || "—";
  if (params.get("demo")) document.getElementById("demo-note").classList.remove("hidden");

  let order = null;
  try { order = JSON.parse(sessionStorage.getItem("sharon_last_order") || "null"); }
  catch (e) { /* ignore */ }

  const panel = document.getElementById("receipt");

  // Someone landing here directly (or after a refresh) has no stashed receipt.
  if (!order || order.ref !== ref) {
    panel.innerHTML = `
      <h3>Order summary</h3>
      <p style="color:var(--muted)">
        Your receipt is no longer available in this browser session, but your order
        is safe. We have emailed a copy — if it has not arrived within an hour,
        call us on <a href="tel:+910000000000">00000 00000</a> quoting
        <strong>${esc(ref || "your order reference")}</strong>.
      </p>`;
    return;
  }

  document.getElementById("receipt-lines").innerHTML = order.lines.map(l => `
    <div style="display:flex;justify-content:space-between;gap:14px;padding:11px 0;border-bottom:1px solid var(--line)">
      <span>${esc(l.name)} <span style="color:var(--muted)">· ${esc(l.pack)} × ${l.qty}</span></span>
      <strong style="color:var(--ink);white-space:nowrap">${C.formatINR(l.lineTotal)}</strong>
    </div>`).join("")
    + `<div class="summary-line summary-line--total"><span>Total paid</span><span>${C.formatINR(order.total)}</span></div>`;

  const methodLabel = order.method === "cod"
    ? "Cash on delivery"
    : order.method === "demo" ? "Demo — not charged" : "Paid online (Razorpay)";

  document.getElementById("receipt-meta").innerHTML = `
    <dl class="meta-list" style="margin:0;padding:0;border:0">
      <div><dt>Delivering to</dt><dd style="font-weight:500">${esc(order.name)}</dd></div>
      <div><dt>Address</dt><dd style="font-weight:500">${esc(order.address)}</dd></div>
      <div><dt>Contact</dt><dd style="font-weight:500">${esc(order.phone)} · ${esc(order.email)}</dd></div>
      <div><dt>Payment</dt><dd style="font-weight:500">${esc(methodLabel)}</dd></div>
      <div><dt>Expected delivery</dt><dd style="font-weight:500">3–6 working days</dd></div>
    </dl>`;

  // Deliberately kept in sessionStorage so the customer can refresh and still
  // print. The next order overwrites it, and the ref check above stops a stale
  // receipt ever being shown against a different order.
})();
