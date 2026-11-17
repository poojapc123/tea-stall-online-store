const { pageHeadBanner, ICON } = require("../layout");

module.exports = {
  file: "checkout.html",
  title: "Checkout — Sharon Tea Stall",
  description: "Secure checkout for your Sharon Tea order.",
  body: `
${pageHeadBanner("Checkout", "One page, no account needed. Payments are processed securely by Razorpay.", "Checkout")}

<section class="section">
  <div class="shell">

    <div id="demo-banner" class="notice hidden" style="margin-bottom:26px">
      ${ICON.warn}
      <span><strong>Demo mode is on.</strong> No real payment will be taken and no order is stored.
      Set <code>DEMO_MODE: false</code> in <code>assets/js/config.js</code> once your Razorpay
      keys and the <code>/api</code> functions are deployed.</span>
    </div>

    <div id="checkout-empty" class="empty-state hidden">
      <h3>There is nothing to check out</h3>
      <p>Your basket is empty.</p>
      <a class="btn btn--primary mt-3" href="shop.html">Browse the collection</a>
    </div>

    <form class="cart-layout" id="checkout-form" novalidate>
      <div>
        <div class="panel">
          <h3>Contact</h3>
          <div class="form-grid">
            <div class="field">
              <label for="name">Full name</label>
              <input id="name" name="name" autocomplete="name" required>
              <span class="error">Please enter your name.</span>
            </div>
            <div class="field">
              <label for="phone">Mobile number</label>
              <input id="phone" name="phone" inputmode="numeric" autocomplete="tel" placeholder="10-digit number" required>
              <span class="error">Enter a valid 10-digit Indian mobile number.</span>
            </div>
            <div class="field span-2">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required>
              <span class="error">Enter a valid email address.</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <h3>Delivery address</h3>
          <div class="form-grid">
            <div class="field span-2">
              <label for="address1">Flat / house no., building, street</label>
              <input id="address1" name="address1" autocomplete="address-line1" required>
              <span class="error">Please enter your address.</span>
            </div>
            <div class="field span-2">
              <label for="address2">Area, landmark <span style="color:var(--muted);font-weight:400">(optional)</span></label>
              <input id="address2" name="address2" autocomplete="address-line2">
            </div>
            <div class="field">
              <label for="city">City</label>
              <input id="city" name="city" autocomplete="address-level2" required>
              <span class="error">Please enter your city.</span>
            </div>
            <div class="field">
              <label for="state">State</label>
              <select id="state" name="state" required>
                <option value="">Select state</option>
                <option>Andhra Pradesh</option><option>Assam</option><option>Bihar</option>
                <option>Chhattisgarh</option><option>Delhi</option><option>Goa</option>
                <option>Gujarat</option><option>Haryana</option><option>Himachal Pradesh</option>
                <option>Jharkhand</option><option selected>Karnataka</option><option>Kerala</option>
                <option>Madhya Pradesh</option><option>Maharashtra</option><option>Odisha</option>
                <option>Punjab</option><option>Rajasthan</option><option>Tamil Nadu</option>
                <option>Telangana</option><option>Uttar Pradesh</option><option>Uttarakhand</option>
                <option>West Bengal</option><option>Other</option>
              </select>
              <span class="error">Please select your state.</span>
            </div>
            <div class="field">
              <label for="pincode">PIN code</label>
              <input id="pincode" name="pincode" inputmode="numeric" autocomplete="postal-code" required>
              <span class="error">Enter a valid 6-digit PIN code.</span>
            </div>
            <div class="field">
              <label for="notes">Delivery notes <span style="color:var(--muted);font-weight:400">(optional)</span></label>
              <input id="notes" name="notes" placeholder="Ring the bell twice…">
            </div>
          </div>
        </div>

        <div class="panel">
          <h3>Payment</h3>
          <label class="pay-option is-active" data-pay="online">
            <input type="radio" name="payment" value="online" checked>
            <span>
              <strong>Pay online</strong>
              <small>UPI, cards, net-banking and wallets — handled securely by Razorpay. Your card details never touch our servers.</small>
            </span>
          </label>
          <label class="pay-option" data-pay="cod" id="cod-option">
            <input type="radio" name="payment" value="cod">
            <span>
              <strong>Cash on delivery</strong>
              <small>Pay the courier when your tea arrives. A ₹30 handling fee applies.</small>
            </span>
          </label>

          <div id="checkout-error" class="notice notice--error hidden mt-3">
            ${ICON.warn}<span id="checkout-error-text"></span>
          </div>
        </div>
      </div>

      <aside class="panel panel--summary">
        <h3>Your order</h3>
        <div id="checkout-items" style="max-height:280px;overflow-y:auto;margin-bottom:18px"></div>
        <div id="checkout-summary"></div>
        <button class="btn btn--primary btn--block btn--lg mt-3" type="submit" id="pay-btn">Pay securely</button>
        <p style="font-size:.8rem;color:var(--muted);text-align:center;margin-top:14px">
          By placing this order you agree to our <a href="terms.html">Terms</a> and <a href="privacy.html">Privacy Policy</a>.
        </p>
        <div class="trust-row">
          <div>${ICON.shield} 256-bit encrypted</div>
          <div>${ICON.check} PCI-DSS compliant</div>
        </div>
      </aside>
    </form>

  </div>
</section>`,
  scripts: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script src="assets/js/checkout.js"></script>`
};
