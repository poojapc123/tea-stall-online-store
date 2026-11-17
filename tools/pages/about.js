const { pageHeadBanner } = require("../layout");

module.exports = {
  file: "about.html",
  title: "About Us — Sharon Tea Stall, Indiranagar",
  description: "From one kettle on Bangalore in 2007 to seven branches. The story of Sharon Tea Stall, Bangalore.",
  body: `
${pageHeadBanner(
  "Our Story",
  "One kettle, one recipe, one very long queue. Not much has changed since 2007 — and that is rather the point.",
  "About"
)}

<section class="section">
  <div class="shell split">
    <div class="split__media reveal">
      <div class="frame">
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-label="The first kettle">
          <rect width="400" height="300" fill="#f0f9f2"/>
          <circle cx="200" cy="150" r="118" fill="#ddf1e3"/>
          <g stroke="#4faa6b" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".6">
            <path d="M176 76c-10-12-10-22 0-34s10-22 0-34"/><path d="M200 68c-9-10-9-19 0-29s9-19 0-29"/>
            <path d="M224 76c-10-12-10-22 0-34s10-22 0-34"/>
          </g>
          <ellipse cx="200" cy="248" rx="108" ry="20" fill="#b3e0c1" opacity=".7"/>
          <path d="M132 148h136l-12 88a26 26 0 0 1-26 22h-60a26 26 0 0 1-26-22z" fill="#2f8a4f"/>
          <path d="M132 148h136l-12 88a26 26 0 0 1-26 22h-60a26 26 0 0 1-26-22z" fill="#0d2818" opacity=".18"/>
          <ellipse cx="200" cy="148" rx="68" ry="16" fill="#4faa6b"/>
          <ellipse cx="200" cy="146" rx="56" ry="12" fill="#143a23"/>
          <path d="M268 176c30-4 44 10 42 30-2 20-22 30-50 26" fill="none" stroke="#1c5030" stroke-width="14" stroke-linecap="round"/>
          <path d="M132 178c-24 2-34 12-32 26" fill="none" stroke="#1c5030" stroke-width="12" stroke-linecap="round"/>
          <rect x="176" y="124" width="48" height="16" rx="7" fill="#c9962f"/>
          <rect x="146" y="204" width="108" height="8" rx="4" fill="#e0b354" opacity=".9"/>
          <text x="200" y="238" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="#ddf1e3" letter-spacing="4">2007</text>
        </svg>
      </div>
      <span class="split__accent"></span>
    </div>

    <div class="split__copy">
      <span class="eyebrow">How it started</span>
      <h2>A corner, a kettle, and <em>one blend</em></h2>
      <p class="lead">
        In 2007 we set a kettle down at #00, Demo Street, Indiranagar, with one blend
        and no plan at all. The idea was simple and a little unfashionable — grind our
        own spices every week, refuse premix, and never cut the leaf with anything
        cheaper.
      </p>
      <p style="margin-top:18px;color:var(--muted)">
        Eighteen years on, the recipe has not moved a gram. Seven branches have opened,
        eight hundred gatherings have been poured for, and six thousand people a day
        still queue for a cup that costs less than a bus fare.
      </p>
      <p style="margin-top:18px;color:var(--muted)">
        We began sealing packets in 2021, because the people who had left Bangalore
        would not stop asking. Everything on this site is the tea we are pouring at
        the stall this morning.
      </p>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">Our rules</span>
      <h2>Four shortcuts we <em>never take</em></h2>
      <p class="lead" style="margin-inline:auto">
        Most of what makes the tea good is a list of things we have refused to do.
      </p>
    </div>
    <div class="grid grid--4">
      <article class="feature reveal">
        <div class="feature__icon">🚫</div>
        <h3>No premix</h3>
        <p>Every spice arrives whole and is ground here. Premix is cheaper, faster, and tastes like it.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">🌿</div>
        <h3>No essence</h3>
        <p>If the packet says rose, there are rose petals in it. Flavouring syrup has never come through the door.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">📅</div>
        <h3>No old stock</h3>
        <p>We grind to the week ahead. A blend showing out of stock is a blend being made, not a blend being hoarded.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">💚</div>
        <h3>No secret price</h3>
        <p>The packet costs what the stall charges, plus shipping. There is no online markup.</p>
      </article>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">Milestones</span>
      <h2>Eighteen years, <em>briefly</em></h2>
    </div>
    <div class="grid grid--4">
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left">2007</div>
        <h3 style="margin-top:10px">The first kettle</h3>
        <p>One kettle on Bangalore, Indiranagar, and a single masala blend to pour from it.</p>
      </article>
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left">2012</div>
        <h3 style="margin-top:10px">Catering begins</h3>
        <p>A neighbour asks us to pour at a wedding. Eight hundred gatherings later, we still say yes.</p>
      </article>
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left">2018</div>
        <h3 style="margin-top:10px">Franchising starts</h3>
        <p>The first branch outside Indiranagar opens. Seven are running today.</p>
      </article>
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left">2021</div>
        <h3 style="margin-top:10px">Packets ship</h3>
        <p>Sealed pouches start going out across India, so the people who left Bangalore stop writing to complain.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--dark">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center" style="color:var(--gold-400)">By the numbers</span>
      <h2>Sharon Tea, <em>in four numbers</em></h2>
    </div>
    <div class="grid grid--4 text-center">
      <div><div class="stat__num" style="color:var(--gold-400)"><span data-count-to="6000">0</span>+</div><div class="stat__label" style="color:rgba(255,255,255,.6)">Customers</div></div>
      <div><div class="stat__num" style="color:var(--gold-400)"><span data-count-to="100">0</span>+</div><div class="stat__label" style="color:rgba(255,255,255,.6)">Varieties on the board</div></div>
      <div><div class="stat__num" style="color:var(--gold-400)"><span data-count-to="823">0</span></div><div class="stat__label" style="color:rgba(255,255,255,.6)">Events catered</div></div>
      <div><div class="stat__num" style="color:var(--gold-400)"><span data-count-to="7">0</span></div><div class="stat__label" style="color:rgba(255,255,255,.6)">Branches</div></div>
    </div>
    <div class="text-center mt-4">
      <a class="btn btn--gold btn--lg" href="shop.html">Taste it yourself</a>
    </div>
  </div>
</section>`
};
