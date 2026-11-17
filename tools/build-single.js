#!/usr/bin/env node
/* ==========================================================================
   Single-file build.

   Emits ONE self-contained sharon-tea-stall.html on the Desktop: all CSS,
   all JavaScript and all 13 products inlined. No server, no npm, no build
   step to view it — double-click and it runs, online or offline.

   The CSS and the product catalogue are READ from assets/, so this file can
   never drift out of sync with the multi-page site.

   Run:  node tools/build-single.js
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const read = p => fs.readFileSync(path.join(ROOT, p), "utf8");
const read_b64 = p => fs.readFileSync(path.join(ROOT, p)).toString("base64");

const CSS = read("assets/css/style.css");
const CATALOG_JS = read("assets/js/products.js");
const CART_JS = read("assets/js/cart.js");

/* The registered logo, inlined once as a <symbol> and referenced twice, so the
   single file stays self-contained without carrying the artwork twice. */
const LOGO_SVG = read("assets/img/sharon-logo.svg");
const LOGO_SYMBOL = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">' +
  '<symbol id="sharon-logo" viewBox="0 0 1800 1800">' +
  LOGO_SVG.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "") +
  "</symbol></svg>";
const LOGO_USE = '<svg class="brand__logo" viewBox="0 0 1800 1800" role="img" aria-label="Sharon Tea Stall"><use href="#sharon-logo"/></svg>';
const FAVICON_PNG = read_b64("assets/img/favicon-32.png");

/* ── Extra CSS the single-page version needs (drawer, modals) ──────────── */
const EXTRA_CSS = `
/* ── Overlay, cart drawer and modals ─────────────────────────────────── */
.overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(8, 25, 15, .55);
  backdrop-filter: blur(3px);
  opacity: 0; visibility: hidden;
  transition: opacity .3s var(--ease), visibility .3s var(--ease);
}
.overlay.is-open { opacity: 1; visibility: visible; }

.drawer {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 110;
  width: min(430px, 100vw);
  background: var(--cream);
  box-shadow: var(--shadow-lg);
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform .35s var(--ease);
}
.drawer.is-open { transform: none; }
.drawer__head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 22px 24px; border-bottom: 1px solid var(--line);
  background: #fff;
}
.drawer__head h3 { font-size: 1.25rem; }
.drawer__body { flex: 1; overflow-y: auto; padding: 8px 24px; }
.drawer__foot { padding: 22px 24px; border-top: 1px solid var(--line); background: #fff; }

.icon-btn {
  width: 40px; height: 40px; flex: none;
  border: 1px solid var(--line); border-radius: 12px;
  background: #fff; color: var(--ink-soft);
  display: grid; place-items: center; cursor: pointer;
  transition: all .2s var(--ease);
}
.icon-btn:hover { background: var(--leaf-50); color: var(--leaf-700); border-color: var(--leaf-200); }
.icon-btn svg { width: 18px; height: 18px; }

.modal {
  position: fixed; z-index: 110;
  top: 50%; left: 50%; transform: translate(-50%, -46%) scale(.97);
  width: min(940px, calc(100vw - 32px));
  max-height: calc(100vh - 48px); overflow-y: auto;
  background: var(--cream); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  opacity: 0; visibility: hidden;
  transition: opacity .28s var(--ease), transform .28s var(--ease), visibility .28s var(--ease);
}
.modal.is-open { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }
.modal--narrow { width: min(560px, calc(100vw - 32px)); }
.modal__close { position: absolute; top: 16px; right: 16px; z-index: 2; }
.modal__inner { padding: clamp(24px, 4vw, 40px); }

body.is-locked { overflow: hidden; }

/* Section anchor offset so the sticky header never covers a heading. */
section[id] { scroll-margin-top: 92px; }

@media (max-width: 620px) {
  .modal { width: calc(100vw - 20px); max-height: calc(100vh - 24px); }
  .drawer { width: 100vw; }
}
`;

/* ── Page body ─────────────────────────────────────────────────────────── */

const BODY = `
<div class="topbar">
  <div class="shell topbar__inner">
    <span class="topbar__promo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M2 6h11v11H2z"/><path d="M13 9h4l3 3.5V17h-7z"/><circle cx="6.5" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg>
      Free shipping across India on orders above ₹999
    </span>
    <div class="topbar__links">
      <a href="tel:+910000000000">📞 +91 00000 00000</a>
      <a href="mailto:hello@teastall-demo.com">hello@teastall-demo.com</a>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="shell site-header__inner">
    <a class="brand" href="#top">
      <span class="brand__mark">${LOGO_USE}</span>
      <span class="brand__text">
        <span class="brand__name">Sharon Tea</span>
        <span class="brand__tag">Stall · Est. 2007</span>
      </span>
    </a>

    <nav class="nav" id="nav">
      <a href="#top">Home</a>
      <a href="#about">About</a>
      <a href="#shop">Shop</a>
      <a href="#catering">Catering</a>
      <a href="#franchise">Franchise</a>
      <a href="#contact">Contact</a>
    </nav>

    <div class="header-actions">
      <button class="cart-btn" id="open-cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.4a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6"/></svg>
        <span class="label">Basket</span>
        <span class="cart-count" data-cart-count data-empty="true">0</span>
      </button>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span></span></button>
    </div>
  </div>
</header>

<main id="top">

<!-- ══ Hero ═════════════════════════════════════════════════════════════ -->
<section class="hero">
  <div class="shell hero__inner">
    <div class="hero__copy">
      <span class="eyebrow">Est. 2007 — Bangalore</span>
      <h1>A warm cup<br>for <em>every</em><br>moment</h1>
      <p>
        Where friends gather, ideas bloom, and office breaks become something to
        look forward to. Over 100 teas, brewed with care.
      </p>
      <div class="hero__cta">
        <a class="btn btn--gold btn--lg" href="#shop">Explore our menu</a>
        <a class="btn btn--light btn--lg" href="#about">Our story →</a>
      </div>
      <div class="hero__note">
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Organic leaf, always</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Ground fresh each week</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Free delivery over ₹999</span>
      </div>
    </div>

    <div class="hero__art">
      <div class="hero__art-glow"></div>
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="cupG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#faf8f1"/><stop offset="100%" stop-color="#d8e4d6"/></linearGradient>
          <linearGradient id="teaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0b354"/><stop offset="100%" stop-color="#a9642f"/></linearGradient>
          <linearGradient id="saucerG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#eef3ea"/><stop offset="100%" stop-color="#c2d2c0"/></linearGradient>
        </defs>
        <g opacity=".5">
          <circle cx="200" cy="200" r="168" fill="none" stroke="#7cc793" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="5 9"/>
          <g fill="#4faa6b" fill-opacity=".7">
            <path d="M200 20c9 6 12 14 8 23-8 2-15-2-19-9 3-6 6-11 11-14z"/>
            <path d="M356 210c-6 9-14 12-23 8-2-8 2-15 9-19 6 3 11 6 14 11z"/>
            <path d="M44 190c6-9 14-12 23-8 2 8-2 15-9 19-6-3-11-6-14-11z"/>
            <path d="M200 380c-9-6-12-14-8-23 8-2 15 2 19 9-3 6-6 11-11 14z"/>
          </g>
        </g>
        <g stroke="#b3e0c1" stroke-width="5" stroke-linecap="round" fill="none" opacity=".75">
          <path d="M168 132c-14-16-14-30 0-46s14-30 0-46"><animate attributeName="opacity" values=".25;.75;.25" dur="4.5s" repeatCount="indefinite"/></path>
          <path d="M200 126c-12-14-12-26 0-40s12-26 0-40"><animate attributeName="opacity" values=".7;.2;.7" dur="4.5s" repeatCount="indefinite"/></path>
          <path d="M232 132c-14-16-14-30 0-46s14-30 0-46"><animate attributeName="opacity" values=".4;.8;.4" dur="5.5s" repeatCount="indefinite"/></path>
        </g>
        <ellipse cx="200" cy="330" rx="128" ry="26" fill="url(#saucerG)"/>
        <ellipse cx="200" cy="324" rx="128" ry="26" fill="#faf8f1"/>
        <ellipse cx="200" cy="322" rx="86" ry="17" fill="#e3ece1"/>
        <path d="M104 168h192l-16 118a44 44 0 0 1-43 38h-74a44 44 0 0 1-43-38z" fill="url(#cupG)"/>
        <ellipse cx="200" cy="168" rx="96" ry="24" fill="#eef3ea"/>
        <ellipse cx="200" cy="170" rx="86" ry="19" fill="url(#teaG)"/>
        <ellipse cx="200" cy="170" rx="86" ry="19" fill="#000" opacity=".08"/>
        <path d="M296 194c34-6 52 10 50 34-2 24-24 36-58 32" fill="none" stroke="#dbe6d9" stroke-width="17" stroke-linecap="round"/>
        <g transform="translate(214 166) rotate(-18)"><path d="M0-9c9 5 11 13 8 21-7 2-14-1-17-8 2-6 4-10 9-13z" fill="#2f8a4f"/></g>
        <rect x="122" y="228" width="156" height="7" rx="3.5" fill="#e0b354" opacity=".85"/>
      </svg>

      <div class="hero__badge hero__badge--tl">
        <span class="hero__badge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-9 6-15 16-16 1 10-5 16-14 16H4z"/><path d="M4 20c4-6 8-9 12-11"/></svg></span>
        <span><strong>100+</strong><small>tea varieties</small></span>
      </div>
      <div class="hero__badge hero__badge--br">
        <span class="hero__badge-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.2 6.6.9-4.8 4.6 1.2 6.6L12 17.2 6.1 20.3l1.2-6.6L2.5 9.1l6.6-.9z"/></svg></span>
        <span><strong>4.8 / 5</strong><small>from 1,200+ reviews</small></span>
      </div>
    </div>
  </div>
</section>

<svg class="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 44c180 34 360 46 540 34s360-48 540-52 240 14 360 26v42H0z" fill="currentColor"/>
</svg>

<!-- ══ Stats ════════════════════════════════════════════════════════════ -->
<section>
  <div class="shell">
    <div class="stats">
      <div class="stat"><div class="stat__num"><span data-count-to="6000">0</span><sup>+</sup></div><div class="stat__label">Customers</div></div>
      <div class="stat"><div class="stat__num"><span data-count-to="823">0</span></div><div class="stat__label">Events catered</div></div>
      <div class="stat"><div class="stat__num"><span data-count-to="7">0</span></div><div class="stat__label">Branches</div></div>
      <div class="stat"><div class="stat__num"><span data-count-to="100">0</span><sup>+</sup></div><div class="stat__label">Tea varieties</div></div>
    </div>
  </div>
</section>

<!-- ══ Why us ═══════════════════════════════════════════════════════════ -->
<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">Why Sharon Tea</span>
      <h2>Nothing hurried, <em>nothing hidden</em></h2>
      <p class="lead" style="margin-inline:auto">
        We are a stall before we are a brand. What we seal into a packet is what we
        pour into a cup — same road, same morning.
      </p>
    </div>
    <div class="grid grid--4">
      <article class="feature reveal">
        <div class="feature__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-9 6-15 16-16 1 10-5 16-14 16H4z"/><path d="M4 20c4-6 8-9 12-11"/></svg></div>
        <h3>Ethically sourced</h3>
        <p>Single-origin leaves from certified estates in Assam, the Nilgiris and Idukki. No colour, no essence.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg></div>
        <h3>Fresh-brewed, never pre-mixed</h3>
        <p>Whole spices ground in small weekly batches. The oils are still alive when the packet is sealed.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg></div>
        <h3>Sealed the same day</h3>
        <p>Triple-layer pouches with a one-way valve. The aroma stays in and the monsoon stays out.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h11v11H2z"/><path d="M13 9h4l3 3.5V17h-7z"/><circle cx="6.5" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg></div>
        <h3>Sent across India</h3>
        <p>Out of Bangalore in a day, tracked all the way to your door. Free above ₹999.</p>
      </article>
    </div>
  </div>
</section>

<!-- ══ About ════════════════════════════════════════════════════════════ -->
<section class="section section--tint" id="about">
  <div class="shell split">
    <div class="split__media reveal">
      <div class="frame">
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-label="The Sharon Tea stall">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ddf1e3"/><stop offset="100%" stop-color="#f0f9f2"/></linearGradient>
            <linearGradient id="awn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2f8a4f"/><stop offset="100%" stop-color="#1c5030"/></linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#sky)"/>
          <circle cx="330" cy="62" r="34" fill="#e0b354" opacity=".55"/>
          <g fill="#7cc793" opacity=".55">
            <circle cx="52" cy="150" r="34"/><rect x="48" y="150" width="8" height="46" fill="#4faa6b"/>
            <circle cx="360" cy="160" r="28"/><rect x="356" y="160" width="7" height="38" fill="#4faa6b"/>
          </g>
          <rect x="96" y="146" width="208" height="98" rx="8" fill="#faf8f1"/>
          <path d="M84 146h232l-14-34H98z" fill="url(#awn)"/>
          <g fill="#e0b354">
            <path d="M98 112h28l-6 34h-28z" opacity=".9"/><path d="M154 112h28l-6 34h-28z" opacity=".9"/>
            <path d="M210 112h28l-6 34h-28z" opacity=".9"/><path d="M266 112h28l-6 34h-28z" opacity=".9"/>
          </g>
          <rect x="96" y="238" width="208" height="10" rx="3" fill="#1c5030"/>
          <rect x="118" y="186" width="34" height="52" rx="5" fill="#2f8a4f"/>
          <rect x="160" y="196" width="26" height="42" rx="4" fill="#a9642f"/>
          <rect x="196" y="190" width="30" height="48" rx="5" fill="#c9962f"/>
          <g fill="#faf8f1"><circle cx="252" cy="212" r="16"/><rect x="236" y="228" width="32" height="6" rx="3"/></g>
          <g stroke="#4faa6b" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6">
            <path d="M246 190c-6-7-6-13 0-20s6-13 0-20"/><path d="M260 186c-5-6-5-11 0-17s5-11 0-17"/>
          </g>
          <rect x="150" y="158" width="100" height="20" rx="6" fill="#0d2818"/>
          <text x="200" y="172" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#ddf1e3" letter-spacing="2">SHARON TEA</text>
          <rect y="244" width="400" height="56" fill="#b3e0c1" opacity=".5"/>
        </svg>
      </div>
      <span class="split__accent"></span>
    </div>

    <div class="split__copy">
      <span class="eyebrow">Our story</span>
      <h2>It started with <em>one kettle</em></h2>
      <p class="lead">
        In 2007 there was a kettle, a corner of Bangalore, and a single blend. The
        recipe has not moved since. Only the queue has — six thousand of you now,
        every day.
      </p>
      <ul class="checklist">
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>Weighed by hand</strong><span>The same two people have measured every spice ratio since the first morning.</span></span>
        </li>
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>Nothing waits in a warehouse</strong><span>We grind to the week ahead. A blend that is out of stock is a blend being made.</span></span>
        </li>
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
          <span><strong>The stall is still open</strong><span>Come and taste before you buy a packet. We would rather you did.</span></span>
        </li>
      </ul>
      <a class="btn btn--primary" href="#shop">Browse the collection</a>
    </div>
  </div>
</section>

<!-- ══ Who we're for ════════════════════════════════════════════════════ -->
<section class="section section--sand">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">Who we're for</span>
      <h2>Every cup tells <em>a story</em></h2>
      <p class="lead" style="margin-inline:auto">
        Whether you're catching up with old friends, celebrating a birthday, or
        just stepping away from your desk — there is a cup here for you.
      </p>
    </div>

    <div class="grid grid--4">
      <article class="feature reveal">
        <div class="feature__icon">👫</div>
        <h3>Friends Gathering</h3>
        <p>A menu wide enough that everyone finds their favourite. Perfect for catch-ups that stretch into the evening.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">💼</div>
        <h3>Office Breaks</h3>
        <p>Just 15 minutes? We've got you. Quick brews and a calm that makes the afternoon feel possible again.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">🎂</div>
        <h3>Celebrations</h3>
        <p>Birthdays, promotions, farewells — any reason to gather. Tell us and we'll prepare something special.</p>
      </article>
      <article class="feature reveal">
        <div class="feature__icon">📖</div>
        <h3>Solo Rituals</h3>
        <p>A book, a quiet half hour, and a pot of tulsi. Sometimes the best company is your own thoughts and a really good brew.</p>
      </article>
    </div>
  </div>
</section>

<!-- ══ Shop ═════════════════════════════════════════════════════════════ -->
<section class="section" id="shop">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">What we brew</span>
      <h2>Our <em>menu</em></h2>
      <p class="lead" style="margin-inline:auto">
        Showing our 100+ varieties — ask at the stall for today's board. Every 250 g
        packet is sealed the week it is ground.
      </p>
    </div>

    <div class="shop-toolbar">
      <div class="filter-list" id="category-filters" style="display:flex;flex-wrap:wrap;gap:8px;margin:0"></div>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <input type="search" id="search" placeholder="Search teas…" autocomplete="off"
               style="padding:10px 16px;border:1px solid var(--line);border-radius:var(--radius-pill);background:#fff;font-size:.9rem;min-width:180px">
        <select class="inline" id="sort" aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>
    </div>

    <p class="result-count" id="result-count" style="margin-bottom:22px;color:var(--muted);font-size:.92rem"></p>

    <div class="grid grid--4" id="product-grid"></div>

    <div class="empty-state hidden" id="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <h3>No teas match that</h3>
      <p>Try a different category or clear your search.</p>
      <button class="btn btn--ghost btn--sm mt-2" id="reset-filters">Clear filters</button>
    </div>
  </div>
</section>

<!-- ══ At the counter ════════════════════════════════════════════════════ -->
<section class="section section--tint">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">The space</span>
      <h2>Designed for <em>lingering</em></h2>
      <p class="lead" style="margin-inline:auto">
        We believe a great tea shop is as much about the space as the cup. Every
        corner is thought through.
      </p>
    </div>

    <div class="grid grid--3">
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left;font-size:2rem">01</div>
        <h3 style="margin-top:10px">Warm, unhurried atmosphere</h3>
        <p>Soft lighting, natural textures, and background music at the perfect volume — low enough to hear your friends.</p>
      </article>
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left;font-size:2rem">02</div>
        <h3 style="margin-top:10px">Fast service, back to work on time</h3>
        <p>Because a work break should not turn into a work session. Six thousand cups a day, and the queue still moves.</p>
      </article>
      <article class="feature reveal">
        <div class="stat__num" style="text-align:left;font-size:2rem">03</div>
        <h3 style="margin-top:10px">Taste before you buy</h3>
        <p>Every blend on the board is yours to try at the counter. Tell us the occasion and we'll prepare something special.</p>
      </article>
    </div>
  </div>
</section>

<!-- ══ Catering ═════════════════════════════════════════════════════════ -->
<section class="section section--sand" id="catering">
  <div class="shell split split--flip">
    <div class="split__media reveal">
      <div class="frame">
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-label="Catering setup">
          <rect width="400" height="300" fill="#f0f9f2"/>
          <circle cx="200" cy="140" r="112" fill="#ddf1e3"/>
          <rect x="150" y="96" width="100" height="118" rx="14" fill="#2f8a4f"/>
          <rect x="140" y="86" width="120" height="18" rx="8" fill="#143a23"/>
          <rect x="176" y="70" width="48" height="18" rx="8" fill="#c9962f"/>
          <circle cx="200" cy="150" r="17" fill="#e0b354"/>
          <rect x="192" y="196" width="16" height="22" rx="4" fill="#0d2818"/>
          <rect x="120" y="214" width="160" height="12" rx="5" fill="#1c5030"/>
          <g fill="#faf8f1">
            <rect x="96" y="234" width="34" height="30" rx="6"/><rect x="140" y="234" width="34" height="30" rx="6"/>
            <rect x="226" y="234" width="34" height="30" rx="6"/><rect x="270" y="234" width="34" height="30" rx="6"/>
          </g>
          <g fill="#a9642f"><rect x="100" y="240" width="26" height="8" rx="3"/><rect x="144" y="240" width="26" height="8" rx="3"/><rect x="230" y="240" width="26" height="8" rx="3"/><rect x="274" y="240" width="26" height="8" rx="3"/></g>
          <path d="M20 44c90 34 270 34 360 0" fill="none" stroke="#4faa6b" stroke-width="2.5"/>
          <g fill="#e0b354"><path d="M70 56l16 4-11 16z"/><path d="M150 68l16 3-11 16z"/><path d="M240 68l16-3-5 19z"/><path d="M320 54l16-6-3 19z"/></g>
        </svg>
      </div>
    </div>

    <div class="split__copy">
      <span class="eyebrow">Catering service</span>
      <h2>Eight hundred gatherings, <em>and counting</em></h2>
      <p class="lead">
        A wedding, a birthday, a house-warming, an office floor at four o'clock. We bring
        the urns, the cups, the staff — and enough tea for everyone to have a third.
      </p>
      <div class="grid grid--2 mt-3" style="gap:16px">
        <div class="chip" style="justify-content:flex-start">🎊 Weddings &amp; receptions</div>
        <div class="chip" style="justify-content:flex-start">🎂 Birthdays</div>
        <div class="chip" style="justify-content:flex-start">🏢 Corporate events</div>
        <div class="chip" style="justify-content:flex-start">🏠 Family functions</div>
      </div>
      <div class="grid grid--3 mt-3" style="gap:14px">
        <div><div class="stat__num" style="font-size:1.5rem">₹45</div><div class="stat__label">Essential / guest</div></div>
        <div><div class="stat__num" style="font-size:1.5rem">₹68</div><div class="stat__label">Celebration / guest</div></div>
        <div><div class="stat__num" style="font-size:1.5rem">50</div><div class="stat__label">Guest minimum</div></div>
      </div>
      <div class="hero__cta mt-3">
        <a class="btn btn--primary" href="#contact">Plan your event</a>
        <a class="btn btn--ghost" href="tel:+910000000000">Call to discuss</a>
      </div>
    </div>
  </div>
</section>

<!-- ══ Testimonials ═════════════════════════════════════════════════════ -->
<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">Regulars say</span>
      <h2>Heard over a <em>warm cup</em></h2>
    </div>
    <div class="grid grid--3">
      <article class="quote reveal">
        <span class="quote__mark">&ldquo;</span>
        <p>Eleven years of the masala tea. I moved to Pune, ordered a packet out of nostalgia, and the first sip put me back on Bangalore. That is the whole review.</p>
        <div class="quote__who"><span class="quote__avatar">RK</span><span><strong>Ramesh Kumar</strong><small>Pune · customer since 2014</small></span></div>
      </article>
      <article class="quote reveal">
        <span class="quote__mark">&ldquo;</span>
        <p>They poured for my daughter's wedding — 600 guests, hot from six in the morning until midnight, and not one complaint. Cheerful the whole way through.</p>
        <div class="quote__who"><span class="quote__avatar">LD</span><span><strong>Lakshmi Devi</strong><small>Jayanagar, Bangalore</small></span></div>
      </article>
      <article class="quote reveal">
        <span class="quote__mark">&ldquo;</span>
        <p>The ginger elaichi lives in our office pantry. I make no claims about productivity, but the four o'clock queue is real, and it is the only thing the whole floor agrees on.</p>
        <div class="quote__who"><span class="quote__avatar">AN</span><span><strong>Aditya Nair</strong><small>Operations Lead, Koramangala</small></span></div>
      </article>
    </div>
  </div>
</section>

<!-- ══ Franchise ════════════════════════════════════════════════════════ -->
<section class="section" style="padding-top:0" id="franchise">
  <div class="shell">
    <div class="cta-band reveal">
      <div>
        <span class="eyebrow" style="color:var(--gold-400)">Franchise</span>
        <h2>Open a stall <em>of your own</em></h2>
        <p>
          Seven corners so far. We send the blends, the branding, the equipment and two
          weeks of training — you bring the corner and the early mornings. Setup
          ₹4–7 lakh, typical payback 12–20 months.
        </p>
      </div>
      <div style="display:flex;gap:14px;flex-wrap:wrap">
        <a class="btn btn--gold btn--lg" href="#contact">Enquire now</a>
        <a class="btn btn--light btn--lg" href="tel:+910000000000">Call us</a>
      </div>
    </div>
  </div>
</section>

<!-- ══ Contact ══════════════════════════════════════════════════════════ -->
<section class="section section--dark" id="contact">
  <div class="shell split">
    <div class="split__copy">
      <span class="eyebrow" style="color:var(--gold-400)">Come find us</span>
      <h2>Visit <em>us</em></h2>
      <p class="lead">
        The first stall is still the best one. Come at seven if you want it quiet, or at
        six in the evening to watch six thousand cups happen.
      </p>
      <ul class="checklist" style="margin-top:26px">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.8"/></svg>
          <span><strong style="color:#fff">Address</strong><span style="color:rgba(255,255,255,.7)">#00, Demo Street, 1st Stage, Indiranagar, Bangalore – 560038</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></svg>
          <span><strong style="color:#fff">Open daily</strong><span style="color:rgba(255,255,255,.7)">6:00 am – 11:00 pm, all seven days</span></span></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16.9v2.5a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.6 2 2 0 0 1 3.1 1.4h2.5a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L6.7 9.3a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
          <span><strong style="color:#fff">Phone &amp; email</strong><span style="color:rgba(255,255,255,.7)">+91 00000 00000 · hello@teastall-demo.com</span></span></li>
      </ul>
      <a class="btn btn--gold" href="https://www.google.com/maps/search/?api=1&query=Bangalore" target="_blank" rel="noopener">Open in Google Maps</a>
    </div>

    <div class="split__media reveal">
      <div class="panel" style="background:#fff">
        <h3>Send a message</h3>
        <form id="contact-form" novalidate style="margin-top:18px">
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
              </select>
              <span class="error">Please pick a subject.</span>
            </div>
            <div class="field span-2">
              <label for="ct-msg">Message</label>
              <textarea id="ct-msg" name="message" required></textarea>
              <span class="error">Please write a short message.</span>
            </div>
          </div>
          <button class="btn btn--primary btn--block btn--lg mt-3" type="submit">Send message</button>
          <div id="contact-status" class="mt-3"></div>
        </form>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">
      <div>
        <a class="brand" href="#top">
          <span class="brand__mark">${LOGO_USE}</span>
          <span class="brand__text"><span class="brand__name">Sharon Tea</span><span class="brand__tag">Stall · Est. 2007</span></span>
        </a>
        <p>Hand-blended organic tea from Indiranagar, Bangalore. Poured at the stall since 2007, sealed and sent across India since 2021.</p>
        <div class="socials">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg></a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13v-2c0-.6.4-1 1-1z"/></svg></a>
          <a href="https://wa.me/910000000000" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm5.3 14c-.2.6-1.3 1.2-1.8 1.2s-1.2.3-3.9-1.1a12 12 0 0 1-4.2-4.6c-.4-.8-.5-1.5-.5-2.1 0-.7.4-1.3.8-1.6.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.1.2-.3.3-.1.6a9 9 0 0 0 3.7 3.2c.3.1.5.1.7-.1l.8-.9c.2-.2.4-.2.6-.1l2 1c.2.1.4.2.4.3s0 .6-.2 1z"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>
          <li><a href="#about">About us</a></li>
          <li><a href="#shop">Shop</a></li>
          <li><a href="#catering">Catering</a></li>
          <li><a href="#franchise">Franchise</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Shop</h4>
        <ul id="footer-cats"></ul>
      </div>
      <div>
        <h4>Visit the stall</h4>
        <ul class="contact-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.8"/></svg>
            <span>#00, Demo Street, 1st Stage,<br>Indiranagar, Bangalore – 560038</span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16.9v2.5a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.6 2 2 0 0 1 3.1 1.4h2.5a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L6.7 9.3a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
            <span><a href="tel:+910000000000">+91 00000 00000</a></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>
            <span><a href="mailto:hello@teastall-demo.com">hello@teastall-demo.com</a></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></svg>
            <span>Open daily, 6:00 am – 11:00 pm</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year">2026</span> Sharon Tea Stall. All rights reserved.</span>
      <nav><span style="opacity:.6">Demo build — no real payments are taken</span></nav>
    </div>
  </div>
</footer>

<!-- ══ Overlay, cart drawer, modals ═════════════════════════════════════ -->
<div class="overlay" id="overlay"></div>

<aside class="drawer" id="cart-drawer" aria-label="Your basket">
  <div class="drawer__head">
    <h3>Your basket <span id="drawer-count" style="color:var(--muted);font-size:1rem;font-family:var(--font-body)"></span></h3>
    <button class="icon-btn" id="close-cart" aria-label="Close basket">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
  </div>
  <div class="drawer__body" id="drawer-body"></div>
  <div class="drawer__foot" id="drawer-foot"></div>
</aside>

<div class="modal" id="product-modal" role="dialog" aria-modal="true" aria-label="Product details">
  <button class="icon-btn modal__close" id="close-product" aria-label="Close">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  </button>
  <div class="modal__inner" id="product-modal-body"></div>
</div>

<div class="modal modal--narrow" id="checkout-modal" role="dialog" aria-modal="true" aria-label="Checkout">
  <button class="icon-btn modal__close" id="close-checkout" aria-label="Close">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  </button>
  <div class="modal__inner" id="checkout-modal-body"></div>
</div>
`;

/* ── App script ────────────────────────────────────────────────────────── */

const APP_JS = String.raw`
/* ==========================================================================
   Single-file storefront app: nav, reveal, counters, shop, product modal,
   cart drawer, demo checkout, contact form.

   NOTE: checkout here is a DEMO — it takes no money and stores no order.
   For real payments use the multi-page build, which posts to /api and lets
   Razorpay handle the money. A single HTML file cannot hold a payment secret
   safely, because every visitor downloads it.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.SharonCatalog;
  var Cart = window.SharonCart;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var $ = function (id) { return document.getElementById(id); };

  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor" style="width:15px;height:15px"><path d="m12 2 2.9 6.2 6.6.9-4.8 4.6 1.2 6.6L12 17.2 6.1 20.3l1.2-6.6L2.5 9.1l6.6-.9z"/></svg>';
  var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>';

  /* ── Toasts ──────────────────────────────────────────────────────────── */
  function toast(msg) {
    var stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.innerHTML = TICK + "<span>" + esc(msg) + "</span>";
    stack.appendChild(el);
    setTimeout(function () {
      el.classList.add("is-out");
      el.addEventListener("animationend", function () { el.remove(); }, { once: true });
    }, 2600);
  }

  /* ── Header, nav, reveal, counters ───────────────────────────────────── */
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("is-stuck", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var toggle = document.querySelector(".nav-toggle");
  toggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  navLinks.forEach(function (a) {
    a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
  });

  // Highlight the section currently on screen.
  var sections = navLinks
    .map(function (a) { return $(a.getAttribute("href").slice(1)); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: "0px 0px -40px" });
    Array.prototype.forEach.call(els, function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  }

  (function counters() {
    var nums = document.querySelectorAll("[data-count-to]");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(nums, function (n) { n.textContent = n.dataset.countTo; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var target = parseInt(e.target.dataset.countTo, 10);
        if (reduce) { e.target.textContent = target.toLocaleString("en-IN"); return; }
        var start = performance.now();
        (function tick(now) {
          var p = Math.min(1, (now - start) / 1400);
          var eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(target * eased).toLocaleString("en-IN");
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: .4 });
    Array.prototype.forEach.call(nums, function (n) { io.observe(n); });
  })();

  /* ── Overlay / panel plumbing ────────────────────────────────────────── */
  var overlay = $("overlay");
  var openPanels = [];

  function openPanel(el) {
    el.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.classList.add("is-locked");
    if (openPanels.indexOf(el) === -1) openPanels.push(el);
  }
  function closePanel(el) {
    el.classList.remove("is-open");
    openPanels = openPanels.filter(function (p) { return p !== el; });
    if (!openPanels.length) {
      overlay.classList.remove("is-open");
      document.body.classList.remove("is-locked");
    }
  }
  function closeAll() { openPanels.slice().forEach(closePanel); }

  overlay.addEventListener("click", closeAll);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  /* ── Shop ────────────────────────────────────────────────────────────── */
  var state = { cat: "all", q: "", sort: "featured" };
  var grid = $("product-grid"), emptyEl = $("empty"), countEl = $("result-count");

  function productCard(p) {
    var price = C.unitPrice(p.id, "250g"), mrp = C.unitMrp(p.id, "250g");
    var cat = (C.CATEGORIES.filter(function (c) { return c.id === p.category; })[0] || {}).name || "";
    var badge = p.badge
      ? '<span class="product-card__tag ' + (p.badgeStyle === "leaf" ? "product-card__tag--leaf" : "") + '">' + esc(p.badge) + "</span>"
      : "";
    return '<article class="product-card reveal">' +
      '<div class="product-card__media" data-view="' + esc(p.id) + '" style="cursor:pointer">' + badge + C.packetSVG(p, { steam: false }) + "</div>" +
      '<div class="product-card__body">' +
        '<span class="product-card__cat">' + esc(cat) + "</span>" +
        '<h3><a href="#" data-view="' + esc(p.id) + '">' + esc(p.name) + "</a></h3>" +
        '<p class="product-card__desc">' + esc(p.short) + "</p>" +
        '<div class="product-card__foot"><div>' +
          '<span class="price">' + C.formatINR(price) + "</span>" +
          (mrp > price ? '<small style="text-decoration:line-through;color:var(--muted);margin-left:6px">' + C.formatINR(mrp) + "</small>" : "") +
          '<small style="display:block">250 g pack</small>' +
        "</div>" +
        '<button class="btn btn--primary btn--sm" data-add="' + esc(p.id) + '" data-pack="250g">Add</button>' +
        "</div></div></article>";
  }

  function renderFilters() {
    $("category-filters").innerHTML = C.CATEGORIES.map(function (c) {
      return '<button type="button" data-cat="' + c.id + '" class="btn btn--sm ' +
        (c.id === state.cat ? "btn--primary" : "btn--ghost") + '">' + esc(c.name) + "</button>";
    }).join("");
  }

  function applyShop() {
    var list = C.PRODUCTS.slice();
    if (state.cat !== "all") list = list.filter(function (p) { return p.category === state.cat; });
    if (state.q) {
      var q = state.q.toLowerCase();
      list = list.filter(function (p) {
        return p.name.toLowerCase().indexOf(q) > -1 ||
               p.short.toLowerCase().indexOf(q) > -1 ||
               p.notes.some(function (n) { return n.toLowerCase().indexOf(q) > -1; });
      });
    }
    if (state.sort === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });

    grid.innerHTML = list.map(productCard).join("");
    emptyEl.classList.toggle("hidden", list.length > 0);
    grid.classList.toggle("hidden", list.length === 0);
    countEl.textContent = list.length + (list.length === 1 ? " tea" : " teas");
    initReveal();
  }

  $("category-filters").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]");
    if (!b) return;
    state.cat = b.dataset.cat;
    renderFilters();
    applyShop();
  });
  $("sort").addEventListener("change", function (e) { state.sort = e.target.value; applyShop(); });
  var t;
  $("search").addEventListener("input", function (e) {
    clearTimeout(t);
    var v = e.target.value.trim();
    t = setTimeout(function () { state.q = v; applyShop(); }, 200);
  });
  $("reset-filters").addEventListener("click", function () {
    state = { cat: "all", q: "", sort: "featured" };
    $("search").value = ""; $("sort").value = "featured";
    renderFilters(); applyShop();
  });

  $("footer-cats").innerHTML = C.CATEGORIES.filter(function (c) { return c.id !== "all"; })
    .map(function (c) { return '<li><a href="#shop" data-cat-link="' + c.id + '">' + esc(c.name) + "</a></li>"; })
    .join("");
  $("footer-cats").addEventListener("click", function (e) {
    var a = e.target.closest("[data-cat-link]");
    if (!a) return;
    state.cat = a.dataset.catLink;
    renderFilters(); applyShop();
  });

  /* ── Add to cart (delegated) ─────────────────────────────────────────── */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-add]");
    if (!btn) return;
    e.preventDefault();
    var p = C.findProduct(btn.dataset.add);
    if (!p) return;
    Cart.add(p.id, btn.dataset.pack || "250g", parseInt(btn.dataset.qty, 10) || 1);
    toast(p.name + " added to your basket");
  });

  /* ── Product modal ───────────────────────────────────────────────────── */
  var productModal = $("product-modal");
  var modalState = { id: null, pack: "250g", qty: 1 };

  function renderProductModal() {
    var p = C.findProduct(modalState.id);
    if (!p) return;
    var price = C.unitPrice(p.id, modalState.pack), mrp = C.unitMrp(p.id, modalState.pack);
    var off = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    var cat = (C.CATEGORIES.filter(function (c) { return c.id === p.category; })[0] || {}).name || "";

    $("product-modal-body").innerHTML =
      '<div class="product-detail">' +
        '<div class="product-detail__media">' + C.packetSVG(p) + "</div>" +
        "<div>" +
          '<span class="product-card__cat">' + esc(cat) + "</span>" +
          '<h2 style="margin:6px 0 12px">' + esc(p.name) + "</h2>" +
          '<div class="rating" style="margin-bottom:14px">' + STAR + STAR + STAR + STAR + STAR +
            '<span style="margin-left:4px">4.8 · 1,200+ reviews</span></div>' +
          "<p>" + esc(p.description) + "</p>" +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;margin:18px 0">' +
            p.notes.map(function (n) { return '<span class="chip">' + esc(n) + "</span>"; }).join("") +
          "</div>" +
          '<div style="margin:20px 0 16px">' +
            '<span class="price" style="font-size:2rem">' + C.formatINR(price) + "</span>" +
            (mrp > price ? '<span style="text-decoration:line-through;color:var(--muted);margin-left:10px">' + C.formatINR(mrp) + "</span>" : "") +
            (off ? '<span class="chip" style="margin-left:10px">' + off + "% off</span>" : "") +
            '<div style="font-size:.85rem;color:var(--muted);margin-top:6px">Inclusive of all taxes · ' + esc(C.getPack(modalState.pack).note) + "</div>" +
          "</div>" +
          '<div class="field" style="margin-bottom:18px"><label>Pack size</label><div class="variant-row" id="m-packs">' +
            C.PACKS.map(function (pk) {
              return '<button type="button" class="variant ' + (pk.id === modalState.pack ? "is-active" : "") + '" data-pack="' + pk.id + '">' +
                esc(pk.label) + "<small>" + C.formatINR(C.unitPrice(p.id, pk.id)) + "</small></button>";
            }).join("") +
          "</div></div>" +
          '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">' +
            '<div class="qty"><button type="button" id="m-down" aria-label="Decrease">−</button>' +
            '<input type="number" id="m-qty" value="' + modalState.qty + '" min="1" max="99" aria-label="Quantity">' +
            '<button type="button" id="m-up" aria-label="Increase">+</button></div>' +
            '<button class="btn btn--primary btn--lg" id="m-add">Add to basket</button>' +
          "</div>" +
          '<dl class="meta-list">' +
            "<div><dt>Brewing</dt><dd style=\"font-weight:500\">" + esc(p.brew) + "</dd></div>" +
            "<div><dt>Shelf life</dt><dd>12 months from packing</dd></div>" +
            "<div><dt>Dispatch</dt><dd>Within 24 hours from Bangalore</dd></div>" +
          "</dl>" +
        "</div>" +
      "</div>";

    $("m-packs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-pack]");
      if (!b) return;
      modalState.pack = b.dataset.pack;
      renderProductModal();
    });
    var qtyEl = $("m-qty");
    $("m-up").addEventListener("click", function () {
      modalState.qty = Math.min(99, modalState.qty + 1); qtyEl.value = modalState.qty;
    });
    $("m-down").addEventListener("click", function () {
      modalState.qty = Math.max(1, modalState.qty - 1); qtyEl.value = modalState.qty;
    });
    qtyEl.addEventListener("change", function () {
      modalState.qty = Math.min(99, Math.max(1, parseInt(qtyEl.value, 10) || 1));
      qtyEl.value = modalState.qty;
    });
    $("m-add").addEventListener("click", function () {
      Cart.add(p.id, modalState.pack, modalState.qty);
      toast(p.name + " (" + C.getPack(modalState.pack).label + ") added");
      closePanel(productModal);
    });
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-view]");
    if (!el) return;
    e.preventDefault();
    modalState = { id: el.dataset.view, pack: "250g", qty: 1 };
    renderProductModal();
    productModal.scrollTop = 0;
    openPanel(productModal);
  });
  $("close-product").addEventListener("click", function () { closePanel(productModal); });

  /* ── Cart drawer ─────────────────────────────────────────────────────── */
  var drawer = $("cart-drawer");
  $("open-cart").addEventListener("click", function () { openPanel(drawer); });
  $("close-cart").addEventListener("click", function () { closePanel(drawer); });

  function renderDrawer() {
    var t = Cart.totals();
    $("drawer-count").textContent = t.lines.length ? "(" + Cart.count() + ")" : "";

    if (!t.lines.length) {
      $("drawer-body").innerHTML =
        '<div class="empty-state" style="padding:50px 10px">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.4a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6"/></svg>' +
        "<h3>Your basket is empty</h3><p>Thirteen blends are waiting.</p></div>";
      $("drawer-foot").innerHTML =
        '<button class="btn btn--primary btn--block" id="drawer-shop">Browse the collection</button>';
      $("drawer-shop").addEventListener("click", function () {
        closePanel(drawer);
        $("shop").scrollIntoView({ behavior: "smooth" });
      });
      return;
    }

    $("drawer-body").innerHTML = t.lines.map(function (l) {
      return '<div class="cart-row" data-id="' + esc(l.productId) + '" data-pack="' + esc(l.packId) + '" style="grid-template-columns:72px 1fr">' +
        '<div class="cart-row__media" style="width:72px;height:72px">' + C.packetSVG(l.product, { steam: false }) + "</div>" +
        "<div>" +
          '<div class="cart-row__name">' + esc(l.product.name) + "</div>" +
          '<div class="cart-row__variant">' + esc(l.pack.label) + " · " + C.formatINR(l.unit) + " each</div>" +
          '<div class="cart-row__controls">' +
            '<div class="qty"><button type="button" data-step="-1" aria-label="Decrease">−</button>' +
            '<input type="number" value="' + l.qty + '" min="1" max="99" aria-label="Quantity">' +
            '<button type="button" data-step="1" aria-label="Increase">+</button></div>' +
            '<button class="link-danger" data-remove>Remove</button>' +
          "</div>" +
          '<div style="font-weight:700;color:var(--leaf-700);margin-top:8px">' + C.formatINR(l.lineTotal) + "</div>" +
        "</div></div>";
    }).join("");

    var pct = Math.min(100, (t.subtotal / C.SHIPPING.freeAbove) * 100);
    $("drawer-foot").innerHTML =
      '<div class="progress-ship"><div class="progress-ship__bar"><div class="progress-ship__fill" style="width:' + pct + '%"></div></div>' +
      "<p>" + (t.qualifiesFreeShipping ? "🎉 You've unlocked free delivery." : "Add " + C.formatINR(t.freeShippingGap) + " more for free delivery.") + "</p></div>" +
      '<div class="summary-line"><span>Subtotal</span><span>' + C.formatINR(t.subtotal) + "</span></div>" +
      '<div class="summary-line"><span>GST (5%)</span><span>' + C.formatINR(t.gst) + "</span></div>" +
      '<div class="summary-line ' + (t.shipping === 0 ? "summary-line--free" : "") + '"><span>Delivery</span><span>' +
        (t.shipping === 0 ? "FREE" : C.formatINR(t.shipping)) + "</span></div>" +
      '<div class="summary-line summary-line--total"><span>Total</span><span>' + C.formatINR(t.total) + "</span></div>" +
      '<button class="btn btn--primary btn--block btn--lg mt-3" id="go-checkout">Checkout</button>' +
      '<button class="link-danger" id="clear-cart" style="display:block;margin:14px auto 0">Empty basket</button>';

    $("go-checkout").addEventListener("click", function () {
      closePanel(drawer);
      openCheckout();
    });
    $("clear-cart").addEventListener("click", function () {
      if (confirm("Empty your basket?")) Cart.clear();
    });
  }

  $("drawer-body").addEventListener("click", function (e) {
    var row = e.target.closest(".cart-row");
    if (!row) return;
    if (e.target.closest("[data-remove]")) { Cart.remove(row.dataset.id, row.dataset.pack); return; }
    var step = e.target.closest("[data-step]");
    if (step) {
      var input = row.querySelector("input");
      Cart.setQty(row.dataset.id, row.dataset.pack, parseInt(input.value, 10) + parseInt(step.dataset.step, 10));
    }
  });
  $("drawer-body").addEventListener("change", function (e) {
    if (e.target.tagName !== "INPUT") return;
    var row = e.target.closest(".cart-row");
    Cart.setQty(row.dataset.id, row.dataset.pack, e.target.value);
  });

  /* ── Demo checkout ───────────────────────────────────────────────────── */
  var checkoutModal = $("checkout-modal");

  var RULES = {
    name: function (v) { return v.trim().length >= 2; },
    phone: function (v) { return /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")); },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    address1: function (v) { return v.trim().length >= 5; },
    city: function (v) { return v.trim().length >= 2; },
    pincode: function (v) { return /^[1-9]\d{5}$/.test(v.trim()); },
    subject: function (v) { return !!v; },
    message: function (v) { return v.trim().length >= 10; }
  };

  function validate(el) {
    var rule = RULES[el.name], field = el.closest(".field");
    if (!rule || !field) return true;
    if (!el.hasAttribute("required") && !el.value.trim()) { field.classList.remove("has-error"); return true; }
    var ok = rule(el.value);
    field.classList.toggle("has-error", !ok);
    return ok;
  }

  function openCheckout() {
    var t = Cart.totals();
    if (!t.lines.length) { toast("Your basket is empty"); return; }

    $("checkout-modal-body").innerHTML =
      '<span class="eyebrow">Checkout</span><h2 style="margin-bottom:8px">Where should it go?</h2>' +
      '<div class="notice" style="margin:16px 0 22px">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 22 20H2z"/><path d="M12 9.5v5M12 17.5h.01"/></svg>' +
        "<span><strong>Demo checkout.</strong> No payment is taken and no order is placed. " +
        "Real payments need the multi-page build with the Razorpay API — see README.</span></div>" +
      '<form id="co-form" novalidate><div class="form-grid">' +
        '<div class="field"><label for="co-name">Full name</label><input id="co-name" name="name" required><span class="error">Please enter your name.</span></div>' +
        '<div class="field"><label for="co-phone">Mobile number</label><input id="co-phone" name="phone" inputmode="numeric" required><span class="error">Enter a valid 10-digit number.</span></div>' +
        '<div class="field span-2"><label for="co-email">Email</label><input id="co-email" name="email" type="email" required><span class="error">Enter a valid email address.</span></div>' +
        '<div class="field span-2"><label for="co-a1">Address</label><input id="co-a1" name="address1" required><span class="error">Please enter your address.</span></div>' +
        '<div class="field"><label for="co-city">City</label><input id="co-city" name="city" required><span class="error">Please enter your city.</span></div>' +
        '<div class="field"><label for="co-pin">PIN code</label><input id="co-pin" name="pincode" inputmode="numeric" required><span class="error">Enter a valid 6-digit PIN.</span></div>' +
      "</div>" +
      '<div style="margin-top:22px;padding-top:20px;border-top:1px solid var(--line)">' +
        '<div class="summary-line"><span>Subtotal</span><span>' + C.formatINR(t.subtotal) + "</span></div>" +
        '<div class="summary-line"><span>GST (5%)</span><span>' + C.formatINR(t.gst) + "</span></div>" +
        '<div class="summary-line ' + (t.shipping === 0 ? "summary-line--free" : "") + '"><span>Delivery</span><span>' +
          (t.shipping === 0 ? "FREE" : C.formatINR(t.shipping)) + "</span></div>" +
        '<div class="summary-line summary-line--total"><span>Total</span><span>' + C.formatINR(t.total) + "</span></div>" +
      "</div>" +
      '<button class="btn btn--primary btn--block btn--lg mt-3" type="submit">Place demo order · ' + C.formatINR(t.total) + "</button>" +
      "</form>";

    var form = $("co-form");
    form.addEventListener("blur", function (e) { if (e.target.name in RULES) validate(e.target); }, true);
    form.addEventListener("input", function (e) {
      var f = e.target.closest(".field");
      if (f && f.classList.contains("has-error")) validate(e.target);
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name && !validate(el)) ok = false; });
      if (!ok) { form.querySelector(".has-error input").focus(); return; }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Processing…";
      setTimeout(function () {
        var ref = "DEMO-" + Date.now().toString(36).toUpperCase();
        var total = C.formatINR(Cart.totals().total);
        var name = form.elements.name.value.trim();
        Cart.clear();
        $("checkout-modal-body").innerHTML =
          '<div class="text-center"><div class="success-badge">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
          "<h2>Thank you, " + esc(name.split(" ")[0]) + "</h2>" +
          '<p class="lead" style="margin-inline:auto">This was a demo order — nothing was charged and nothing will be dispatched.</p>' +
          '<p style="margin-top:18px">Reference <strong style="color:var(--leaf-700)">' + ref + "</strong> · " + total + "</p>" +
          '<button class="btn btn--primary mt-4" id="co-done">Back to the shop</button></div>';
        $("co-done").addEventListener("click", function () { closePanel(checkoutModal); });
      }, 900);
    });

    checkoutModal.scrollTop = 0;
    openPanel(checkoutModal);
  }

  $("close-checkout").addEventListener("click", function () { closePanel(checkoutModal); });

  /* ── Contact form ────────────────────────────────────────────────────── */
  var cform = $("contact-form");
  cform.addEventListener("blur", function (e) { if (e.target.name in RULES) validate(e.target); }, true);
  cform.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    Array.prototype.forEach.call(cform.elements, function (el) { if (el.name && !validate(el)) ok = false; });
    if (!ok) {
      $("contact-status").innerHTML = '<div class="notice notice--error"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 22 20H2z"/><path d="M12 9.5v5M12 17.5h.01"/></svg><span>Please correct the highlighted fields.</span></div>';
      return;
    }
    var data = {};
    Array.prototype.forEach.call(cform.elements, function (el) { if (el.name) data[el.name] = el.value.trim(); });
    var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
    $("contact-status").innerHTML = '<div class="notice">' + TICK +
      "<span>Your mail app is opening with this message ready to send. If nothing happens, email " +
      '<a href="mailto:hello@teastall-demo.com">hello@teastall-demo.com</a> or call ' +
      '<a href="tel:+910000000000">00000 00000</a>.</span></div>';
    window.location.href = "mailto:hello@teastall-demo.com?subject=" +
      encodeURIComponent("Website enquiry — " + data.name) + "&body=" + encodeURIComponent(body);
  });

  /* ── Boot ────────────────────────────────────────────────────────────── */
  $("year").textContent = new Date().getFullYear();
  renderFilters();
  applyShop();
  Cart.onChange(function () { renderDrawer(); Cart.paintBadge(); });
  renderDrawer();
  Cart.paintBadge();
  initReveal();
})();
`;

/* ── Assemble ──────────────────────────────────────────────────────────── */

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sharon Tea Stall — Fresh Organic Tea from Bangalore Since 2007</title>
<meta name="description" content="100+ varieties of fresh, organic tea hand-blended in Bangalore. Masala, elaichi, ginger, tulsi and more — delivered across India.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="data:image/png;base64,${FAVICON_PNG}">
<style>
${CSS}
${EXTRA_CSS}
</style>
</head>
<body>
${LOGO_SYMBOL}
${BODY}
<script>
${CATALOG_JS}
</script>
<script>
${CART_JS}
</script>
<script>
${APP_JS}
</script>
</body>
</html>
`;

const OUT_LOCAL = path.join(ROOT, "sharon-tea-stall.html");
fs.writeFileSync(OUT_LOCAL, html, "utf8");
console.log(`  ✓ ${OUT_LOCAL}  (${(html.length / 1024).toFixed(0)} KB)`);

/* Also drop a copy straight on the Desktop for convenience. */
const desktop = path.join(require("os").homedir(), "Desktop");
if (fs.existsSync(desktop)) {
  const OUT_DESKTOP = path.join(desktop, "sharon-tea-stall.html");
  fs.writeFileSync(OUT_DESKTOP, html, "utf8");
  console.log(`  ✓ ${OUT_DESKTOP}`);
}
