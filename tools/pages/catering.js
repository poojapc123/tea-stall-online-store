const { pageHeadBanner } = require("../layout");

module.exports = {
  file: "catering.html",
  title: "Tea Catering in Bangalore — Weddings, Corporate & Family Events",
  description: "Sharon Tea Stall catering: weddings, birthdays, corporate events and family functions across Bangalore. 823 events served. Minimum 50 guests.",
  body: `
${pageHeadBanner(
  "Catering Service",
  "823 gatherings since 2012. We bring the urns, the cups, the staff, and enough tea for everyone to have a third.",
  "Catering"
)}

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">What we cater</span>
      <h2>Every gathering, <em>the same standard</em></h2>
      <p class="lead" style="margin-inline:auto">
        Sixty people in a living room or six hundred under a shamiana — the tea is
        made the same way and served just as hot.
      </p>
    </div>

    <div class="grid grid--4">
      <article class="feature reveal">
        <div class="feature__icon">💍</div>
        <h3>Weddings &amp; receptions</h3>
        <p>Multi-day service, early mornings included. Up to 1,000 guests, two urn stations, four pairs of hands.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">🎂</div>
        <h3>Birthdays</h3>
        <p>Chocolate tea for the children, masala for everyone pretending they came for the children.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">🏢</div>
        <h3>Corporate events</h3>
        <p>Conferences, town halls, and the four o'clock lull. GST invoice provided; monthly billing available.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">🏠</div>
        <h3>Family functions</h3>
        <p>House-warmings, naming ceremonies, festivals. We work around your kitchen, never through it.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="shell split">
    <div class="split__media reveal">
      <div class="frame">
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-label="Catering service in progress">
          <rect width="400" height="300" fill="#faf8f1"/>
          <rect y="200" width="400" height="100" fill="#ddf1e3"/>
          <!-- table -->
          <rect x="40" y="192" width="320" height="14" rx="5" fill="#1c5030"/>
          <path d="M56 206h288l-16 76H72z" fill="#2f8a4f" opacity=".22"/>
          <!-- urns -->
          <g>
            <rect x="88" y="112" width="66" height="80" rx="10" fill="#2f8a4f"/>
            <rect x="80" y="104" width="82" height="14" rx="6" fill="#143a23"/>
            <rect x="112" y="92" width="18" height="14" rx="5" fill="#c9962f"/>
            <rect x="114" y="176" width="14" height="16" rx="4" fill="#0d2818"/>
          </g>
          <g>
            <rect x="246" y="112" width="66" height="80" rx="10" fill="#a9642f"/>
            <rect x="238" y="104" width="82" height="14" rx="6" fill="#4a2812"/>
            <rect x="270" y="92" width="18" height="14" rx="5" fill="#e0b354"/>
            <rect x="272" y="176" width="14" height="16" rx="4" fill="#0d2818"/>
          </g>
          <!-- steam -->
          <g stroke="#7cc793" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7">
            <path d="M112 88c-6-8-6-14 0-22s6-14 0-22"/><path d="M130 84c-5-6-5-12 0-18s5-12 0-18"/>
            <path d="M270 88c-6-8-6-14 0-22s6-14 0-22"/><path d="M288 84c-5-6-5-12 0-18s5-12 0-18"/>
          </g>
          <!-- cup pyramid -->
          <g fill="#ffffff" stroke="#dbe6d9" stroke-width="1.5">
            <rect x="178" y="164" width="26" height="28" rx="5"/><rect x="208" y="164" width="26" height="28" rx="5"/>
            <rect x="193" y="134" width="26" height="28" rx="5"/>
          </g>
          <g fill="#c9962f" opacity=".8"><rect x="182" y="170" width="18" height="7" rx="3"/><rect x="212" y="170" width="18" height="7" rx="3"/><rect x="197" y="140" width="18" height="7" rx="3"/></g>
          <!-- staff silhouettes -->
          <g fill="#143a23" opacity=".85">
            <circle cx="52" cy="150" r="13"/><path d="M34 200c0-12 8-22 18-22s18 10 18 22z"/>
            <circle cx="348" cy="150" r="13"/><path d="M330 200c0-12 8-22 18-22s18 10 18 22z"/>
          </g>
        </svg>
      </div>
    </div>

    <div class="split__copy">
      <span class="eyebrow">How it works</span>
      <h2>Four steps, and <em>no surprises</em> on the day</h2>
      <ul class="checklist" style="margin-top:24px">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>1 · Tell us the numbers</strong><span>Guest count, venue, and the hours you need tea flowing. Call or use the form below.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>2 · Pick your blends</strong><span>Two blends are included. Add more for ₹8 per guest. Tasting at the stall is free.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>3 · Confirm with 30% advance</strong><span>Written quote, fixed price. The balance is due on the day.</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>4 · We arrive 90 minutes early</strong><span>Set-up, service and clean-up are ours. You never lift an urn.</span></span></li>
      </ul>
      <div class="notice">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 22 20H2z"/><path d="M12 9.5v5M12 17.5h.01"/></svg>
        <span>Minimum 50 guests. Weekend dates in wedding season book out 3–4 weeks ahead — call early.</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">Packages</span>
      <h2>What it <em>costs</em></h2>
      <p class="lead" style="margin-inline:auto">
        Per-guest rates for unlimited service within the booked hours. Travel beyond
        25 km from Indiranagar is charged at actuals.
      </p>
    </div>

    <div class="grid grid--3">
      <article class="feature reveal">
        <span class="chip">50–150 guests</span>
        <h3 style="margin-top:16px">Essential</h3>
        <div class="price" style="font-size:2rem;margin:10px 0">₹45 <small>/ guest</small></div>
        <ul class="checklist" style="margin:20px 0 0">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>2 tea blends</span></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>4 hours of service</span></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>1 urn station, 2 staff</span></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>Paper cups included</span></span></li>
        </ul>
      </article>

      <article class="feature reveal" style="border-color:var(--leaf-400);box-shadow:var(--shadow)">
        <span class="chip" style="background:var(--gold-400);color:var(--leaf-950)">Most booked</span>
        <h3 style="margin-top:16px">Celebration</h3>
        <div class="price" style="font-size:2rem;margin:10px 0">₹68 <small>/ guest</small></div>
        <ul class="checklist" style="margin:20px 0 0">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>4 tea blends + filter coffee</span></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>8 hours of service</span></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>2 urn stations, 4 staff</span></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>Branded cups + snack pairing</span></span></li>
        </ul>
      </article>

      <article class="feature reveal">
        <span class="chip">300+ guests</span>
        <h3 style="margin-top:16px">Grand</h3>
        <div class="price" style="font-size:2rem;margin:10px 0">On request</div>
        <ul class="checklist" style="margin:20px 0 0">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>Unlimited blends</span></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>Multi-day service</span></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>Live counters, custom uniforms</span></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><span>Dedicated event manager</span></span></li>
        </ul>
      </article>
    </div>

    <p class="text-center mt-4" style="font-size:.88rem;color:var(--muted)">
      Rates are indicative and exclude GST. Final quote depends on date, venue and service hours.
    </p>
  </div>
</section>

<section class="section section--sand">
  <div class="shell" style="max-width:820px">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">Enquire</span>
      <h2>Tell us <em>about your event</em></h2>
      <p class="lead" style="margin-inline:auto">We reply within one working day. If the date is inside a week, please call instead.</p>
    </div>

    <form class="panel" id="catering-form" novalidate>
      <div class="form-grid">
        <div class="field">
          <label for="c-name">Your name</label>
          <input id="c-name" name="name" required>
          <span class="error">Please enter your name.</span>
        </div>
        <div class="field">
          <label for="c-phone">Mobile number</label>
          <input id="c-phone" name="phone" inputmode="numeric" required>
          <span class="error">Enter a valid 10-digit mobile number.</span>
        </div>
        <div class="field">
          <label for="c-email">Email</label>
          <input id="c-email" name="email" type="email" required>
          <span class="error">Enter a valid email address.</span>
        </div>
        <div class="field">
          <label for="c-type">Event type</label>
          <select id="c-type" name="eventType" required>
            <option value="">Select</option>
            <option>Wedding / reception</option>
            <option>Birthday</option>
            <option>Corporate event</option>
            <option>Family function</option>
            <option>Other</option>
          </select>
          <span class="error">Please choose an event type.</span>
        </div>
        <div class="field">
          <label for="c-date">Event date</label>
          <input id="c-date" name="date" type="date" required>
          <span class="error">Please pick a date.</span>
        </div>
        <div class="field">
          <label for="c-guests">Approximate guests</label>
          <input id="c-guests" name="guests" type="number" min="50" placeholder="Minimum 50" required>
          <span class="error">Minimum 50 guests.</span>
        </div>
        <div class="field span-2">
          <label for="c-venue">Venue / area</label>
          <input id="c-venue" name="venue" placeholder="e.g. Jayanagar, Bangalore" required>
          <span class="error">Please tell us where.</span>
        </div>
        <div class="field span-2">
          <label for="c-msg">Anything else? <span style="color:var(--muted);font-weight:400">(optional)</span></label>
          <textarea id="c-msg" name="message" placeholder="Service hours, preferred blends, parking…"></textarea>
        </div>
      </div>
      <button class="btn btn--primary btn--lg mt-3" type="submit">Send enquiry</button>
      <div id="catering-status" class="mt-3"></div>
    </form>
  </div>
</section>`,
  scripts: `<script src="assets/js/forms.js"></script>`
};
