const { ICON } = require("../layout");

module.exports = {
  file: "order-success.html",
  title: "Order Confirmed — Sharon Tea Stall",
  description: "Thank you for your order from Sharon Tea Stall.",
  body: `
<section class="section">
  <div class="shell" style="max-width:760px">

    <div class="text-center">
      <div class="success-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <span class="eyebrow eyebrow--center">Order confirmed</span>
      <h1>Thank you — your tea is on its way</h1>
      <p class="lead" style="margin-inline:auto">
        Your receipt is on its way by email. Orders placed before 2pm leave Bangalore the
        same day; everything else goes out the next morning.
      </p>
      <p style="margin-top:20px;font-size:1.05rem">
        Order reference: <strong id="order-ref" style="color:var(--leaf-700);font-family:var(--font-display);font-size:1.3rem">—</strong>
      </p>
    </div>

    <div id="demo-note" class="notice hidden mt-4">
      ${ICON.warn}
      <span><strong>This was a demo order.</strong> No payment was taken and nothing has been
      dispatched. Turn off <code>DEMO_MODE</code> in <code>assets/js/config.js</code> to take real orders.</span>
    </div>

    <div class="panel mt-4" id="receipt">
      <h3>Order summary</h3>
      <div id="receipt-lines"></div>
      <div id="receipt-meta" class="mt-3" style="padding-top:20px;border-top:1px solid var(--line)"></div>
    </div>

    <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:34px">
      <a class="btn btn--primary" href="shop.html">Continue shopping</a>
      <button class="btn btn--ghost" onclick="window.print()">Print receipt</button>
      <a class="btn btn--ghost" href="contact.html">Need help?</a>
    </div>

    <div class="cta-band mt-4" style="margin-top:56px">
      <div>
        <h2 style="font-size:1.6rem">While you wait</h2>
        <p>Follow the stall on Instagram — we post the week's grind every Monday.</p>
      </div>
      <a class="btn btn--gold" href="https://www.instagram.com/" target="_blank" rel="noopener">Follow @sharonteastall</a>
    </div>

  </div>
</section>`,
  scripts: `<script src="assets/js/order-success.js"></script>`
};
