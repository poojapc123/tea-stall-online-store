/* Basket page — line editing plus the live order summary. */
(function () {
  "use strict";

  const C = window.SharonCatalog;
  const Cart = window.SharonCart;
  const UI = window.SharonUI;
  const esc = UI.escapeHtml;

  const full = document.getElementById("cart-full");
  const empty = document.getElementById("cart-empty");
  const rowsHost = document.getElementById("cart-rows");
  const summaryHost = document.getElementById("summary-lines");
  const shipHost = document.getElementById("ship-progress");
  const countEl = document.getElementById("cart-item-count");

  function rowHTML(l) {
    return `
      <div class="cart-row" data-id="${esc(l.productId)}" data-pack="${esc(l.packId)}">
        <div class="cart-row__media">${C.packetSVG(l.product, { steam: false })}</div>
        <div>
          <div class="cart-row__name"><a href="product.html?id=${encodeURIComponent(l.productId)}">${esc(l.product.name)}</a></div>
          <div class="cart-row__variant">${esc(l.pack.label)} pack · ${C.formatINR(l.unit)} each</div>
          <div class="cart-row__controls">
            <div class="qty">
              <button type="button" data-step="-1" aria-label="Decrease">−</button>
              <input type="number" value="${l.qty}" min="1" max="99" aria-label="Quantity for ${esc(l.product.name)}">
              <button type="button" data-step="1" aria-label="Increase">+</button>
            </div>
            <button class="link-danger" data-remove>Remove</button>
          </div>
        </div>
        <div class="cart-row__price">
          ${C.formatINR(l.lineTotal)}
          ${l.lineSaving > 0 ? `<div style="font-size:.78rem;color:var(--leaf-500);font-family:var(--font-body);font-weight:600">Saved ${C.formatINR(l.lineSaving)}</div>` : ""}
        </div>
      </div>`;
  }

  function render() {
    const t = Cart.totals();

    if (!t.lines.length) {
      full.classList.add("hidden");
      empty.classList.remove("hidden");
      return;
    }
    full.classList.remove("hidden");
    empty.classList.add("hidden");

    rowsHost.innerHTML = t.lines.map(rowHTML).join("");
    countEl.textContent = "(" + Cart.count() + ")";

    // Free-shipping progress
    const pct = Math.min(100, (t.subtotal / C.SHIPPING.freeAbove) * 100);
    shipHost.innerHTML = `
      <div class="progress-ship__bar"><div class="progress-ship__fill" style="width:${pct}%"></div></div>
      <p>${t.qualifiesFreeShipping
        ? "🎉 You've unlocked free delivery."
        : "Add " + C.formatINR(t.freeShippingGap) + " more for free delivery."}</p>`;

    summaryHost.innerHTML = `
      <div class="summary-line"><span>Subtotal</span><span>${C.formatINR(t.subtotal)}</span></div>
      ${t.saving > 0 ? `<div class="summary-line summary-line--free"><span>You save</span><span>− ${C.formatINR(t.saving)}</span></div>` : ""}
      <div class="summary-line"><span>GST (5%)</span><span>${C.formatINR(t.gst)}</span></div>
      <div class="summary-line ${t.shipping === 0 ? "summary-line--free" : ""}">
        <span>Delivery</span><span>${t.shipping === 0 ? "FREE" : C.formatINR(t.shipping)}</span>
      </div>
      <div class="summary-line summary-line--total"><span>Total</span><span>${C.formatINR(t.total)}</span></div>`;
  }

  rowsHost.addEventListener("click", e => {
    const row = e.target.closest(".cart-row");
    if (!row) return;
    const { id, pack } = row.dataset;

    if (e.target.closest("[data-remove]")) {
      Cart.remove(id, pack);
      return;
    }
    const stepBtn = e.target.closest("[data-step]");
    if (stepBtn) {
      const input = row.querySelector("input");
      Cart.setQty(id, pack, parseInt(input.value, 10) + parseInt(stepBtn.dataset.step, 10));
    }
  });

  rowsHost.addEventListener("change", e => {
    if (e.target.tagName !== "INPUT") return;
    const row = e.target.closest(".cart-row");
    Cart.setQty(row.dataset.id, row.dataset.pack, e.target.value);
  });

  document.getElementById("clear-cart").addEventListener("click", () => {
    if (confirm("Empty your basket?")) Cart.clear();
  });

  Cart.onChange(render);
  render();
})();
