const { pageHeadBanner } = require("../layout");

module.exports = {
  file: "franchise.html",
  title: "Franchise Opportunity — Sharon Tea Stall",
  description: "Open a Sharon Tea Stall in your city. 7 branches running. We provide blends, branding, equipment and training.",
  body: `
${pageHeadBanner(
  "Franchise",
  "Seven branches so far. We send the blends, the branding, the equipment and the training — you bring the corner and the early mornings.",
  "Franchise"
)}

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">Why franchise with us</span>
      <h2>A small footprint with <em>a very long queue</em></h2>
      <p class="lead" style="margin-inline:auto">
        A tea stall needs less space, less staff and less capital than almost any
        other food business — and it sells every single day of the year.
      </p>
    </div>

    <div class="grid grid--3">
      <article class="feature reveal">
        <div class="feature__icon">📐</div>
        <h3>120–250 sq ft is enough</h3>
        <p>A corner unit, a kiosk in an office lobby, a stall in a market. No kitchen licence for the standard format.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">📦</div>
        <h3>Blends supplied weekly</h3>
        <p>You never blend anything. Sealed, ground-that-week packets arrive from Bangalore on a fixed schedule.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">🎓</div>
        <h3>Two weeks of training</h3>
        <p>Your team learns at the Indiranagar stall — brewing, portioning, billing, hygiene, and the rhythm of a queue.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">🎨</div>
        <h3>Branding done for you</h3>
        <p>Signage, uniforms, cups, menu boards and social templates. You do not hire a designer.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">📊</div>
        <h3>Billing &amp; stock system</h3>
        <p>A simple POS with daily sales and stock reporting, so reordering is one tap and not a guess.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">🤝</div>
        <h3>Territory protection</h3>
        <p>No second Sharon stall within 2 km of yours. Your catchment stays yours.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--dark">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center" style="color:var(--gold-400)">Investment</span>
      <h2>What it costs <em>to open</em></h2>
      <p class="lead" style="margin-inline:auto">
        Indicative ranges for a standard 150 sq ft format. Actual figures depend on
        your city, rent and fit-out standard.
      </p>
    </div>

    <div class="grid grid--4 text-center">
      <div>
        <div class="stat__num" style="color:var(--gold-400)">₹4–7 L</div>
        <div class="stat__label" style="color:rgba(255,255,255,.6)">Total setup</div>
      </div>
      <div>
        <div class="stat__num" style="color:var(--gold-400)">₹1.5 L</div>
        <div class="stat__label" style="color:rgba(255,255,255,.6)">Franchise fee</div>
      </div>
      <div>
        <div class="stat__num" style="color:var(--gold-400)">6%</div>
        <div class="stat__label" style="color:rgba(255,255,255,.6)">Royalty on sales</div>
      </div>
      <div>
        <div class="stat__num" style="color:var(--gold-400)">12–20 mo</div>
        <div class="stat__label" style="color:rgba(255,255,255,.6)">Typical payback</div>
      </div>
    </div>

    <p class="text-center mt-4" style="font-size:.86rem;color:rgba(255,255,255,.55);max-width:70ch;margin-inline:auto">
      These are indicative figures based on existing branches, not a guarantee of
      returns. What you earn depends on your location, your footfall, and how early
      you are willing to get up.
    </p>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">The process</span>
      <h2>From enquiry to first cup <em>in about ten weeks</em></h2>
    </div>
    <div class="grid grid--4">
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left;font-size:2rem">01</div>
        <h3 style="margin-top:10px">Enquiry &amp; call</h3>
        <p>You send the form below. We call within two working days to understand your city and budget.</p>
      </article>
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left;font-size:2rem">02</div>
        <h3 style="margin-top:10px">Site approval</h3>
        <p>You shortlist locations; we visit or review footfall data before signing off on one.</p>
      </article>
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left;font-size:2rem">03</div>
        <h3 style="margin-top:10px">Agreement &amp; fit-out</h3>
        <p>Five-year agreement, then four to six weeks of fit-out using our drawings and vendors.</p>
      </article>
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left;font-size:2rem">04</div>
        <h3 style="margin-top:10px">Training &amp; launch</h3>
        <p>Two weeks of training in Bangalore, then we run your first three days on site with you.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="shell" style="max-width:820px">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">Apply</span>
      <h2>Tell us <em>where you would open</em></h2>
      <p class="lead" style="margin-inline:auto">
        We answer every enquiry, including the ones we cannot take.
      </p>
    </div>

    <form class="panel" id="franchise-form" novalidate>
      <div class="form-grid">
        <div class="field">
          <label for="f-name">Your name</label>
          <input id="f-name" name="name" required>
          <span class="error">Please enter your name.</span>
        </div>
        <div class="field">
          <label for="f-phone">Mobile number</label>
          <input id="f-phone" name="phone" inputmode="numeric" required>
          <span class="error">Enter a valid 10-digit mobile number.</span>
        </div>
        <div class="field">
          <label for="f-email">Email</label>
          <input id="f-email" name="email" type="email" required>
          <span class="error">Enter a valid email address.</span>
        </div>
        <div class="field">
          <label for="f-city">Preferred city / area</label>
          <input id="f-city" name="city" required>
          <span class="error">Please tell us where.</span>
        </div>
        <div class="field">
          <label for="f-budget">Investment capacity</label>
          <select id="f-budget" name="budget" required>
            <option value="">Select</option>
            <option>Under ₹4 lakh</option>
            <option>₹4–7 lakh</option>
            <option>₹7–12 lakh</option>
            <option>Above ₹12 lakh</option>
          </select>
          <span class="error">Please select a range.</span>
        </div>
        <div class="field">
          <label for="f-exp">Food business experience</label>
          <select id="f-exp" name="experience" required>
            <option value="">Select</option>
            <option>None — first venture</option>
            <option>Under 2 years</option>
            <option>2–5 years</option>
            <option>Over 5 years</option>
          </select>
          <span class="error">Please select an option.</span>
        </div>
        <div class="field span-2">
          <label for="f-msg">Anything else? <span style="color:var(--muted);font-weight:400">(optional)</span></label>
          <textarea id="f-msg" name="message" placeholder="Do you already have a site in mind?"></textarea>
        </div>
      </div>
      <button class="btn btn--primary btn--lg mt-3" type="submit">Submit enquiry</button>
      <div id="franchise-status" class="mt-3"></div>
    </form>
  </div>
</section>`,
  scripts: `<script src="assets/js/forms.js"></script>`
};
