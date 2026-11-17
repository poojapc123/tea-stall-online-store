const { pageHeadBanner } = require("../layout");

/* The three footer pages. Content is a starting draft written to match how the
   stall actually operates — have it checked before publishing. */

const shipping = {
  file: "shipping.html",
  title: "Shipping & Returns — Sharon Tea Stall",
  description: "Delivery timelines, charges and the returns policy for Sharon Tea Stall orders.",
  body: `
${pageHeadBanner("Shipping & Returns", "How your tea gets to you, and what happens if something is wrong with it.", "Shipping")}

<section class="section">
  <div class="shell" style="max-width:820px">

    <div class="panel">
      <h3>Delivery charges</h3>
      <div class="summary-line"><span>Orders of ₹999 and above</span><span style="color:var(--leaf-500)">FREE</span></div>
      <div class="summary-line"><span>Orders below ₹999</span><span>₹60 flat</span></div>
      <div class="summary-line"><span>Cash-on-delivery handling</span><span>₹30</span></div>
      <p style="font-size:.9rem;color:var(--muted);margin-top:14px">
        GST at 5% applies to packaged tea and is shown separately at checkout.
      </p>
    </div>

    <div class="panel">
      <h3>Dispatch &amp; timelines</h3>
      <ul class="checklist">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>Same-day dispatch before 2pm</strong><span>Orders placed after 2pm, or on Sundays, go out the next working morning.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>Bangalore: 1–2 working days</strong><span>Often the same evening for Indiranagar and nearby areas.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>Rest of India: 3–6 working days</strong><span>North-east, J&amp;K and island territories may take 7–10 days.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>Tracking by SMS and email</strong><span>Sent the moment your parcel leaves Bangalore.</span></span></li>
      </ul>
      <p style="font-size:.9rem;color:var(--muted);margin-top:18px">
        We currently ship within India only. For international orders, write to us
        and we will quote a courier rate.
      </p>
    </div>

    <div class="panel">
      <h3>Returns &amp; refunds</h3>
      <p>
        Tea is a food product, so we cannot accept a return simply because a blend
        was not to your taste — though do tell us, because we would rather
        recommend a better one.
      </p>
      <p class="mt-2"><strong>We will replace or refund in full if:</strong></p>
      <ul class="checklist mt-2">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>The packet arrives damaged, open or wet.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>You received a different blend or pack size from the one you ordered.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>The product is past, or close to, its best-before date on arrival.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>Your order never arrived and tracking shows no movement for 10 days.</span></span></li>
      </ul>
      <p class="mt-3">
        Tell us within <strong>7 days of delivery</strong> — call
        <a href="tel:+910000000000">00000 00000</a> or email
        <a href="mailto:hello@teastall-demo.com">hello@teastall-demo.com</a>
        with your order reference and a photo. Approved refunds go back to the
        original payment method within 5–7 working days.
      </p>
    </div>

    <div class="panel">
      <h3>Cancellations</h3>
      <p>
        Orders can be cancelled free of charge until they are dispatched — usually a
        window of a few hours. Once a parcel has left Bangalore it cannot be
        cancelled, but the returns terms above still apply.
      </p>
    </div>

  </div>
</section>`
};

const privacy = {
  file: "privacy.html",
  title: "Privacy Policy — Sharon Tea Stall",
  description: "How Sharon Tea Stall collects, uses and protects your personal information.",
  body: `
${pageHeadBanner("Privacy Policy", "What we collect, why we collect it, and what we will never do with it.", "Privacy")}

<section class="section">
  <div class="shell" style="max-width:820px">

    <div class="notice mb-3">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 22 20H2z"/><path d="M12 9.5v5M12 17.5h.01"/></svg>
      <span>This is a working draft written to match how the site actually behaves.
      Have it reviewed by a lawyer before publishing, particularly for DPDP Act compliance.</span>
    </div>

    <div class="panel">
      <h3>What we collect</h3>
      <ul class="checklist">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>Order details</strong><span>Your name, phone number, email and delivery address — collected only when you place an order or send an enquiry.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>Your basket</strong><span>Stored in your own browser (localStorage). It never reaches us until you check out.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>Payment confirmation</strong><span>A Razorpay payment and order ID. We never see or store your card number, UPI PIN or bank credentials.</span></span></li>
      </ul>
    </div>

    <div class="panel">
      <h3>How we use it</h3>
      <p>
        To pack and deliver your order, to send you the receipt and tracking updates,
        to answer your enquiry, and to meet our tax and accounting obligations.
        That is the entire list.
      </p>
      <p class="mt-2">
        <strong>We do not sell, rent or trade your personal information to anyone.</strong>
        We share it only with the courier delivering your parcel and the payment
        gateway processing your payment.
      </p>
    </div>

    <div class="panel">
      <h3>Your rights</h3>
      <p>
        You can ask us for a copy of the information we hold about you, ask us to
        correct it, or ask us to delete it once we are no longer legally required to
        keep it. Email
        <a href="mailto:hello@teastall-demo.com">hello@teastall-demo.com</a>
        and we will respond within 30 days.
      </p>
    </div>

    <div class="panel">
      <h3>Cookies</h3>
      <p>
        This site sets no advertising or tracking cookies. Your basket is kept in
        your browser's local storage so it survives a refresh — you can clear it at
        any time by emptying your basket or clearing site data.
      </p>
    </div>

    <div class="panel">
      <h3>Contact</h3>
      <p>
        Sharon Tea Stall, #00, Demo Street, 1st Stage, Indiranagar,
        Bangalore – 560038<br>
        <a href="tel:+910000000000">+91 00000 00000</a> ·
        <a href="mailto:hello@teastall-demo.com">hello@teastall-demo.com</a>
      </p>
    </div>

  </div>
</section>`
};

const terms = {
  file: "terms.html",
  title: "Terms & Conditions — Sharon Tea Stall",
  description: "The terms that apply when you order from Sharon Tea Stall.",
  body: `
${pageHeadBanner("Terms & Conditions", "The rules that apply when you buy from us. Short, because there is not much to say.", "Terms")}

<section class="section">
  <div class="shell" style="max-width:820px">

    <div class="notice mb-3">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 22 20H2z"/><path d="M12 9.5v5M12 17.5h.01"/></svg>
      <span>Draft terms provided as a starting point. Have them reviewed by a lawyer before publishing.</span>
    </div>

    <div class="panel">
      <h3>Orders and pricing</h3>
      <p>
        All prices are in Indian Rupees and include GST where shown. We may change
        prices at any time, but never after you have placed an order. If a blend is
        listed in error at the wrong price, we will contact you and either honour it
        or cancel and refund in full — your choice.
      </p>
    </div>

    <div class="panel">
      <h3>Availability</h3>
      <p>
        We grind to a weekly forecast, so a blend can sell out. If we cannot fulfil
        part of your order we will call you and refund that portion within 5–7
        working days.
      </p>
    </div>

    <div class="panel">
      <h3>Payment</h3>
      <p>
        Online payments are processed by Razorpay. We do not receive or store your
        card, UPI or bank details at any point. Cash on delivery is available on
        eligible PIN codes with a ₹30 handling fee.
      </p>
    </div>

    <div class="panel">
      <h3>Product information</h3>
      <p>
        Tea is an agricultural product. Colour, aroma and strength vary a little
        between harvests, and the packet artwork on this site is illustrative. All
        blends are prepared in a facility that also handles nuts and dairy — if you
        have a serious allergy, call us before ordering.
      </p>
    </div>

    <div class="panel">
      <h3>Catering and franchise</h3>
      <p>
        Catering rates shown on this site are indicative. A booking is confirmed only
        on receipt of the 30% advance against a written quote. Franchise figures are
        based on existing branches and are not a guarantee of returns; a separate
        agreement governs any franchise relationship.
      </p>
    </div>

    <div class="panel">
      <h3>Governing law</h3>
      <p>
        These terms are governed by the laws of India. Any dispute is subject to the
        exclusive jurisdiction of the courts of Bangalore, Karnataka.
      </p>
    </div>

  </div>
</section>`
};

module.exports = [shipping, privacy, terms];
