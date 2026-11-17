const { pageHeadBanner } = require("../layout");

module.exports = {
  file: "shop.html",
  title: "Shop All Teas — Sharon Tea Stall",
  description: "Browse all 13 signature blends from Sharon Tea Stall — masala, elaichi, ginger, tulsi, rose, chocolate and more. Sealed fresh, shipped across India.",
  body: `
${pageHeadBanner(
  "The Collection",
  "What we brew, sealed into packets. Ask at the stall for today's board — there are over a hundred varieties on it.",
  "Shop"
)}

<section class="section">
  <div class="shell shop-layout">

    <aside>
      <div class="filters">
        <h4>Categories</h4>
        <div class="filter-list" id="category-filters"><!-- rendered by JS --></div>

        <h4>Sort by</h4>
        <div class="field">
          <label class="sr-only" for="sort">Sort products</label>
          <select id="sort">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        <h4 class="mt-3">Search</h4>
        <div class="field">
          <label class="sr-only" for="search">Search teas</label>
          <input type="search" id="search" placeholder="Try &quot;ginger&quot;…" autocomplete="off">
        </div>
      </div>

      <div class="filters mt-3">
        <h4>Not sure where to start?</h4>
        <p style="font-size:.9rem;color:var(--muted);margin-bottom:16px">
          Tell us how you take your tea and we will point you at a blend. We have opinions.
        </p>
        <a class="btn btn--ghost btn--sm btn--block" href="tel:+910000000000">Call 00000 00000</a>
      </div>
    </aside>

    <div>
      <div class="shop-toolbar">
        <span class="result-count" id="result-count">Loading…</span>
        <span class="chip">🚚 Free delivery over ₹999</span>
      </div>
      <div class="grid grid--3" id="product-grid"><!-- rendered by JS --></div>
      <div class="empty-state hidden" id="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <h3>No teas match that</h3>
        <p>Try a different category or clear your search.</p>
        <button class="btn btn--ghost btn--sm mt-2" id="reset-filters">Clear filters</button>
      </div>
    </div>

  </div>
</section>`,
  scripts: `<script src="assets/js/shop.js"></script>`
};
