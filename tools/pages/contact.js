const { pageHeadBanner, ICON } = require("../layout");

module.exports = {
  file: "contact.html",
  title: "Contact Us — Sharon Tea Stall, Indiranagar Bangalore",
  description: "Visit the stall at #00, Demo Street, Indiranagar, Bangalore. Call +91 00000 00000 or email hello@teastall-demo.com.",
  body: `
${pageHeadBanner(
  "Get in Touch",
  "Come to the stall, call us, or write. We answer all three — the first one fastest.",
  "Contact"
)}

<section class="section">
  <div class="shell">
    <div class="grid grid--3 mb-3">
      <article class="feature reveal text-center">
        <div class="feature__icon" style="margin-inline:auto">${ICON.phone}</div>
        <h3>Call the stall</h3>
        <p>Fastest for orders, catering dates and anything urgent.</p>
        <a class="btn btn--primary btn--sm mt-2" href="tel:+910000000000">+91 00000 00000</a>
      </article>
      <article class="feature reveal text-center">
        <div class="feature__icon" style="margin-inline:auto">${ICON.mail}</div>
        <h3>Email us</h3>
        <p>Best for quotes, invoices and franchise paperwork.</p>
        <a class="btn btn--ghost btn--sm mt-2" href="mailto:hello@teastall-demo.com">hello@teastall-demo.com</a>
      </article>
      <article class="feature reveal text-center">
        <div class="feature__icon" style="margin-inline:auto">${ICON.pin}</div>
        <h3>Visit us</h3>
        <p>#00, Demo Street, 1st Stage, Indiranagar, Bangalore – 560038</p>
        <a class="btn btn--ghost btn--sm mt-2" href="https://www.google.com/maps/search/?api=1&query=Bangalore" target="_blank" rel="noopener">Open in Maps</a>
      </article>
    </div>
  </div>
</section>

<section class="section section--tint" style="padding-top:0">
  <div class="shell split" style="padding-top:clamp(64px,8vw,104px)">
    <div class="split__copy">
      <span class="eyebrow">Send a message</span>
      <h2>We reply within <em>one working day</em></h2>
      <p class="lead">
        If your enquiry has a date attached, the <a href="catering.html">catering form</a>
        is quicker — it asks the questions we need answered anyway.
      </p>

      <form class="panel mt-3" id="contact-form" novalidate>
        <div class="form-grid">
          <div class="field">
            <label for="ct-name">Your name</label>
            <input id="ct-name" name="name" required>
            <span class="error">Please enter your name.</span>
          </div>
          <div class="field">
            <label for="ct-phone">Mobile number</label>
            <input id="ct-phone" name="phone" inputmode="numeric" required>
            <span class="error">Enter a valid 10-digit mobile number.</span>
          </div>
          <div class="field span-2">
            <label for="ct-email">Email</label>
            <input id="ct-email" name="email" type="email" required>
            <span class="error">Enter a valid email address.</span>
          </div>
          <div class="field span-2">
            <label for="ct-subject">Subject</label>
            <select id="ct-subject" name="subject" required>
              <option value="">Select</option>
              <option>Order or delivery question</option>
              <option>Catering</option>
              <option>Franchise</option>
              <option>Bulk / corporate supply</option>
              <option>Feedback</option>
              <option>Something else</option>
            </select>
            <span class="error">Please pick a subject.</span>
          </div>
          <div class="field span-2">
            <label for="ct-msg">Message</label>
            <textarea id="ct-msg" name="message" required></textarea>
            <span class="error">Please write a short message.</span>
          </div>
        </div>
        <button class="btn btn--primary btn--lg mt-3" type="submit">Send message</button>
        <div id="contact-status" class="mt-3"></div>
      </form>
    </div>

    <div class="split__media reveal">
      <div class="frame" style="background:#143a23;aspect-ratio:3/4">
        <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" aria-label="Map showing the stall in Indiranagar">
          <rect width="300" height="400" fill="#143a23"/>
          <g stroke="#2f8a4f" stroke-opacity=".4" stroke-width="1.5">
            <path d="M0 70h300M0 150h300M0 240h300M0 320h300M60 0v400M140 0v400M220 0v400"/>
          </g>
          <path d="M0 240h140V0" fill="none" stroke="#e0b354" stroke-width="8" stroke-opacity=".9"/>
          <path d="M140 240h160" fill="none" stroke="#4faa6b" stroke-width="6" stroke-opacity=".7"/>
          <g fill="#1c5030" opacity=".85">
            <rect x="160" y="262" width="52" height="42" rx="5"/><rect x="228" y="258" width="48" height="46" rx="5"/>
            <rect x="60" y="266" width="56" height="38" rx="5"/><rect x="166" y="160" width="60" height="48" rx="5"/>
            <rect x="24" y="120" width="48" height="52" rx="5"/>
          </g>
          <g transform="translate(140 240)">
            <circle r="34" fill="#2f8a4f" opacity=".22">
              <animate attributeName="r" values="20;44;20" dur="3.2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values=".45;0;.45" dur="3.2s" repeatCount="indefinite"/>
            </circle>
            <path d="M0-30c10 0 18 8 18 18 0 14-18 30-18 30S-18 2-18-12c0-10 8-18 18-18z" fill="#e0b354"/>
            <circle cy="-12" r="7" fill="#143a23"/>
          </g>
          <text x="150" y="356" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#b3e0c1" letter-spacing="3">INDIRANAGAR</text>
          <text x="150" y="378" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#7cc793" letter-spacing="2">BANGALORE · 1ST STAGE</text>
        </svg>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">When we're open</span>
      <h2>Opening <em>hours</em></h2>
    </div>
    <div class="grid grid--3">
      <article class="feature reveal text-center">
        <h3>Monday – Friday</h3>
        <p style="font-size:1.1rem;color:var(--leaf-700);font-weight:600">6:00 am – 11:00 pm</p>
      </article>
      <article class="feature reveal text-center">
        <h3>Saturday – Sunday</h3>
        <p style="font-size:1.1rem;color:var(--leaf-700);font-weight:600">6:00 am – 11:30 pm</p>
      </article>
      <article class="feature reveal text-center">
        <h3>Public holidays</h3>
        <p style="font-size:1.1rem;color:var(--leaf-700);font-weight:600">Open as usual</p>
      </article>
    </div>
  </div>
</section>`,
  scripts: `<script src="assets/js/forms.js"></script>`
};
