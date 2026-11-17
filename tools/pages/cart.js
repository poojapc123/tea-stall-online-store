const { pageHeadBanner } = require("../layout");

module.exports = {
  file: "cart.html",
  title: "Your Basket — Sharon Tea Stall",
  description: "Review the teas in your basket before checkout.",
  body: `
${pageHeadBanner("Your Basket", "Everything you have chosen, in one place. Free delivery starts at ₹999.", "Basket")}

<section class="section">
  <div class="shell">
    <div class="cart-layout" id="cart-full">
      <div>
        <div class="panel">
          <h3>Items <span id="cart-item-count" style="color:var(--muted);font-size:1rem;font-family:var(--font-body)"></span></h3>
          <div id="cart-rows"></div>
        </div>
        <div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-top:22px">
          <a class="btn btn--ghost" href="shop.html">← Continue shopping</a>
          <button class="link-danger" id="clear-cart">Empty basket</button>
        </div>
      </div>

      <aside class="panel panel--summary">
        <h3>Order summary</h3>
        <div class="progress-ship" id="ship-progress"></div>
        <div id="summary-lines"></div>
        <a class="btn btn--primary btn--block btn--lg mt-3" href="checkout.html">Proceed to checkout</a>
        <div class="trust-row">
          <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 5-3 8.5-7 9.5C8 20.5 5 17 5 12V6z"/><path d="m9 12 2 2 4-4"/></svg> Secure payment</div>
          <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h11v11H2z"/><path d="M13 9h4l3 3.5V17h-7z"/><circle cx="6.5" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg> Dispatch in 24 h</div>
        </div>
      </aside>
    </div>

    <div class="empty-state hidden" id="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.4a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6"/></svg>
      <h3>Your basket is empty</h3>
      <p>Thirteen blends are waiting. The masala tea is the usual place to start.</p>
      <a class="btn btn--primary mt-3" href="shop.html">Browse the collection</a>
    </div>
  </div>
</section>`,
  scripts: `<script src="assets/js/cart-page.js"></script>`
};
