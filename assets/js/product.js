/* Product detail — reads ?id= from the URL and renders from the catalogue. */
(function () {
  "use strict";

  const C = window.SharonCatalog;
  const UI = window.SharonUI;
  const esc = UI.escapeHtml;

  const id = new URLSearchParams(location.search).get("id");
  const product = id ? C.findProduct(id) : null;
  const host = document.getElementById("product-detail");

  if (!product) {
    document.getElementById("related-wrap").classList.add("hidden");
    host.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <h3>We couldn't find that tea</h3>
        <p>It may have been renamed or is out of season.</p>
        <a class="btn btn--primary mt-2" href="shop.html">Back to the shop</a>
      </div>`;
    return;
  }

  document.title = product.name + " — Sharon Tea Stall";
  document.getElementById("crumb-name").textContent = product.name;

  let packId = C.PACKS[0].id;
  let qty = 1;

  const catName = (C.CATEGORIES.find(c => c.id === product.category) || {}).name || "";

  function priceBlock() {
    const price = C.unitPrice(product.id, packId);
    const mrp = C.unitMrp(product.id, packId);
    const off = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    return `
      <span class="price" style="font-size:2rem">${C.formatINR(price)}</span>
      ${mrp > price ? `<span style="text-decoration:line-through;color:var(--muted);margin-left:10px">${C.formatINR(mrp)}</span>` : ""}
      ${off ? `<span class="chip" style="margin-left:10px">${off}% off</span>` : ""}
      <div style="font-size:.85rem;color:var(--muted);margin-top:6px">Inclusive of all taxes · ${esc(C.getPack(packId).note)}</div>`;
  }

  function render() {
    host.innerHTML = `
      <div class="product-detail__media">${C.packetSVG(product)}</div>

      <div>
        <span class="product-card__cat">${esc(catName)}</span>
        <h1 style="font-size:clamp(1.9rem,3.6vw,2.7rem);margin:6px 0 12px">${esc(product.name)}</h1>

        <div class="rating" style="margin-bottom:16px">
          ${UI.ICON.star.repeat(5)}
          <span style="margin-left:4px">4.8 · 1,200+ reviews</span>
        </div>

        <p class="lead" style="font-size:1.02rem">${esc(product.description)}</p>

        <div style="display:flex;flex-wrap:wrap;gap:8px;margin:22px 0">
          ${product.notes.map(n => `<span class="chip">${esc(n)}</span>`).join("")}
        </div>

        <div id="price-block" style="margin:26px 0 20px">${priceBlock()}</div>

        <div class="field" style="margin-bottom:22px">
          <label>Pack size</label>
          <div class="variant-row" id="packs">
            ${C.PACKS.map(p => `
              <button type="button" class="variant ${p.id === packId ? "is-active" : ""}" data-pack="${p.id}">
                ${esc(p.label)}<small>${C.formatINR(C.unitPrice(product.id, p.id))}</small>
              </button>`).join("")}
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">
          <div class="qty">
            <button type="button" id="qty-down" aria-label="Decrease quantity">−</button>
            <input type="number" id="qty" value="${qty}" min="1" max="99" aria-label="Quantity">
            <button type="button" id="qty-up" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn--primary btn--lg" id="add-to-cart">Add to basket</button>
          <button class="btn btn--gold btn--lg" id="buy-now">Buy now</button>
        </div>

        <dl class="meta-list">
          <div><dt>Brewing</dt><dd style="font-weight:500">${esc(product.brew)}</dd></div>
          <div><dt>Shelf life</dt><dd>12 months from packing</dd></div>
          <div><dt>Storage</dt><dd>Cool, dry place · reseal after use</dd></div>
          <div><dt>Dispatch</dt><dd>Within 24 hours from Bangalore</dd></div>
        </dl>

        <div class="trust-row">
          <div>${UI.ICON.shield} Secure payment</div>
          <div>${UI.ICON.truck} Free over ₹999</div>
          <div>${UI.ICON.leaf} 100% organic</div>
        </div>
      </div>`;

    wire();
  }

  function wire() {
    document.getElementById("packs").addEventListener("click", e => {
      const btn = e.target.closest("[data-pack]");
      if (!btn) return;
      packId = btn.dataset.pack;
      document.querySelectorAll("#packs .variant").forEach(b =>
        b.classList.toggle("is-active", b.dataset.pack === packId));
      document.getElementById("price-block").innerHTML = priceBlock();
    });

    const qtyInput = document.getElementById("qty");
    const clamp = () => {
      qty = Math.min(99, Math.max(1, parseInt(qtyInput.value, 10) || 1));
      qtyInput.value = qty;
    };
    qtyInput.addEventListener("change", clamp);
    qtyInput.addEventListener("blur", clamp);
    document.getElementById("qty-up").addEventListener("click", () => { qtyInput.value = ++qty > 99 ? (qty = 99) : qty; });
    document.getElementById("qty-down").addEventListener("click", () => { qtyInput.value = --qty < 1 ? (qty = 1) : qty; });

    document.getElementById("add-to-cart").addEventListener("click", () => {
      window.SharonCart.add(product.id, packId, qty);
      UI.toast(product.name + " (" + C.getPack(packId).label + ") added to your basket");
    });

    document.getElementById("buy-now").addEventListener("click", () => {
      window.SharonCart.add(product.id, packId, qty);
      location.href = "checkout.html";
    });
  }

  function renderRelated() {
    const related = C.PRODUCTS
      .filter(p => p.id !== product.id)
      .sort((a, b) => (b.category === product.category) - (a.category === product.category))
      .slice(0, 4);
    document.getElementById("related").innerHTML = related.map(UI.productCard).join("");
    UI.initReveal();
  }

  render();
  renderRelated();
})();
