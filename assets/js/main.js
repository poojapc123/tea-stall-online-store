/* ==========================================================================
   Sharon Tea Stall — Shared UI
   Nav, sticky header, scroll reveal, counters, toasts, product-card renderer.
   ========================================================================== */

window.SharonUI = (function () {
  "use strict";

  const C = window.SharonCatalog;

  /* ── Icons (inline so nothing depends on an icon font) ───────────────── */
  const ICON = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.4a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.2 6.6.9-4.8 4.6 1.2 6.6L12 17.2 6.1 20.3l1.2-6.6L2.5 9.1l6.6-.9z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-9 6-15 16-16 1 10-5 16-14 16H4z"/><path d="M4 20c4-6 8-9 12-11"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h11v11H2z"/><path d="M13 9h4l3 3.5V17h-7z"/><circle cx="6.5" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 5-3 8.5-7 9.5C8 20.5 5 17 5 12V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16.9v2.5a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.6 2 2 0 0 1 3.1 1.4h2.5a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L6.7 9.3a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.8"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13v-2c0-.6.4-1 1-1z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm5.3 14c-.2.6-1.3 1.2-1.8 1.2s-1.2.3-3.9-1.1a12 12 0 0 1-4.2-4.6c-.4-.8-.5-1.5-.5-2.1 0-.7.4-1.3.8-1.6.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.1.2-.3.3-.1.6a9 9 0 0 0 3.7 3.2c.3.1.5.1.7-.1l.8-.9c.2-.2.4-.2.6-.1l2 1c.2.1.4.2.4.3s0 .6-.2 1z"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 22 20H2z"/><path d="M12 9.5v5M12 17.5h.01"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M17 5.2a3.5 3.5 0 0 1 0 5.6M18 14.4a6.5 6.5 0 0 1 3.5 5.6"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>'
  };

  /* ── Header behaviour ────────────────────────────────────────────────── */

  function initHeader() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");

    if (header) {
      const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      document.querySelectorAll(".nav a").forEach(a =>
        a.addEventListener("click", () => {
          document.body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        })
      );
    }

    // Mark the current page in the nav.
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a[href]").forEach(a => {
      if (a.getAttribute("href") === here) a.classList.add("is-active");
    });
  }

  /* ── Scroll reveal ───────────────────────────────────────────────────── */

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: "0px 0px -40px" });
    els.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el); });
  }

  /* ── Animated stat counters ──────────────────────────────────────────── */

  function initCounters() {
    const nums = document.querySelectorAll("[data-count-to]");
    if (!nums.length || !("IntersectionObserver" in window)) {
      nums.forEach(n => { n.textContent = n.dataset.countTo; });
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const target = parseInt(e.target.dataset.countTo, 10);
        if (reduce) { e.target.textContent = target.toLocaleString("en-IN"); return; }
        const start = performance.now(), dur = 1400;
        (function tick(now) {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(target * eased).toLocaleString("en-IN");
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: .4 });
    nums.forEach(n => io.observe(n));
  }

  /* ── Toasts ──────────────────────────────────────────────────────────── */

  function toast(message, icon) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.innerHTML = (icon || ICON.checkCircle) + "<span>" + escapeHtml(message) + "</span>";
    stack.appendChild(el);
    setTimeout(() => {
      el.classList.add("is-out");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }, 2600);
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function productCard(product) {
    const price = C.unitPrice(product.id, "250g");
    const mrp = C.unitMrp(product.id, "250g");
    const badge = product.badge
      ? `<span class="product-card__tag ${product.badgeStyle === "leaf" ? "product-card__tag--leaf" : ""}">${escapeHtml(product.badge)}</span>`
      : "";
    const cat = (C.CATEGORIES.find(c => c.id === product.category) || {}).name || "";

    return `
      <article class="product-card reveal">
        <div class="product-card__media">
          ${badge}
          ${C.packetSVG(product, { steam: false })}
        </div>
        <div class="product-card__body">
          <span class="product-card__cat">${escapeHtml(cat)}</span>
          <h3><a href="product.html?id=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h3>
          <p class="product-card__desc">${escapeHtml(product.short)}</p>
          <div class="product-card__foot">
            <div>
              <span class="price">${C.formatINR(price)}</span>
              ${mrp > price ? `<small style="text-decoration:line-through;color:var(--muted);margin-left:6px">${C.formatINR(mrp)}</small>` : ""}
              <small style="display:block">250 g pack</small>
            </div>
            <button class="btn btn--primary btn--sm" data-add="${escapeHtml(product.id)}" data-pack="250g">Add</button>
          </div>
        </div>
      </article>`;
  }

  /** Delegated add-to-cart for any [data-add] button on the page. */
  function initAddButtons() {
    document.addEventListener("click", e => {
      const btn = e.target.closest("[data-add]");
      if (!btn) return;
      e.preventDefault();
      const id = btn.dataset.add;
      const pack = btn.dataset.pack || "250g";
      const qty = parseInt(btn.dataset.qty, 10) || 1;
      const product = C.findProduct(id);
      if (!product) return;
      window.SharonCart.add(id, pack, qty);
      toast(product.name + " added to your basket");
    });
  }

  function init() {
    initHeader();
    initReveal();
    initCounters();
    initAddButtons();
    window.SharonCart.paintBadge();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { ICON, toast, productCard, escapeHtml, initReveal };
})();
