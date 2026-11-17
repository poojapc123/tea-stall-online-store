/* ==========================================================================
   Sharon Tea Stall — Product catalogue
   Single source of truth for the storefront. The checkout API re-reads this
   file server-side so prices can never be tampered with from the browser.

   PRICING NOTE: `price` is the selling price, `mrp` the struck-through list
   price. Values marked `priceConfirmed: false` were not published on the live
   site and are placeholders — confirm with the client before going live.
   ========================================================================== */

(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SharonCatalog = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* Palette per tea — drives the generated packet artwork. */
  const CATEGORIES = [
    { id: "all", name: "All Teas" },
    { id: "classic", name: "Classic" },
    { id: "spiced", name: "Spiced" },
    { id: "herbal", name: "Herbal & Wellness" },
    { id: "refreshing", name: "Refreshing" },
    { id: "dessert", name: "Dessert" }
  ];

  const PRODUCTS = [
    {
      id: "regular-tea",
      name: "Regular Tea",
      category: "classic",
      price: 180, mrp: 190, priceConfirmed: false,
      badge: "Bestseller", badgeStyle: "leaf",
      short: "Strong, malty and honest. The cup that built the stall.",
      description:
        "Assam CTC pulled the way Bangalore likes it — strong enough to stand up to milk, smooth enough for a second cup. The first tea we ever poured, and still the one most people come back for.",
      notes: ["Malty", "Full-bodied", "Milk-friendly"],
      brew: "1 tsp per cup · boil 3–4 min · add milk & sugar to taste",
      colors: { base: "#2f8a4f", deep: "#143a23", accent: "#e0b354" }
    },
    {
      id: "masala-tea",
      name: "Masala Tea",
      category: "spiced",
      price: 190, mrp: 200, priceConfirmed: true,
      badge: "Most Loved", badgeStyle: "gold",
      short: "Nine whole spices, ground fresh every week. Never a premix.",
      description:
        "Cardamom, clove, cinnamon, black pepper, ginger, nutmeg, star anise, mace and fennel, ground in small batches so the oils are still alive when the packet reaches you. Warming without the sharpness. This is the cup the queue forms for.",
      notes: ["Warming", "Aromatic", "Nine-spice"],
      brew: "1 tsp per cup · boil 4 min with milk · sweeten generously",
      colors: { base: "#b5652a", deep: "#5c2f11", accent: "#e0b354" }
    },
    {
      id: "elaichi-tea",
      name: "Elaichi Tea",
      category: "spiced",
      price: 190, mrp: 200, priceConfirmed: true,
      badge: "", badgeStyle: "",
      short: "Green cardamom from Idukki, crushed pod and all.",
      description:
        "Whole green cardamom from the Idukki hills, crushed pod and seed together, so you get the sweet floral top note and the deeper camphor beneath it. The one our regulars ask for when the family is over.",
      notes: ["Floral", "Sweet", "Gentle"],
      brew: "1 tsp per cup · boil 3 min · best with full-fat milk",
      colors: { base: "#4faa6b", deep: "#1c5030", accent: "#f2efe4" }
    },
    {
      id: "cinnamon-tea",
      name: "Cinnamon Tea",
      category: "spiced",
      price: 190, mrp: 200, priceConfirmed: true,
      badge: "", badgeStyle: "",
      short: "True Ceylon bark — sweet and woody, never bitter.",
      description:
        "True Ceylon bark rather than the harsher cassia most blends use — naturally sweet, woody, and easy on the sugar spoon. A quiet cup for a slow evening.",
      notes: ["Woody", "Naturally sweet", "Low-sugar friendly"],
      brew: "1 tsp per cup · boil 4 min · lovely without sugar",
      colors: { base: "#a9642f", deep: "#4a2812", accent: "#e8c88f" }
    },
    {
      id: "cinnamon-elaichi-tea",
      name: "Cinnamon Elaichi Tea",
      category: "spiced",
      price: 200, mrp: 210, priceConfirmed: false,
      badge: "", badgeStyle: "",
      short: "Warm bark, bright pod. Our two best sellers in one cup.",
      description:
        "Ceylon cinnamon carries the base, green cardamom lifts the finish — warm going in, bright coming out. Our regulars asked for this pairing long before we sealed it into a packet.",
      notes: ["Warm", "Bright finish", "Balanced"],
      brew: "1 tsp per cup · boil 4 min with milk",
      colors: { base: "#8f7a35", deep: "#3f3512", accent: "#dfe9c2" }
    },
    {
      id: "ginger-tea",
      name: "Ginger Tea",
      category: "spiced",
      price: 220, mrp: 230, priceConfirmed: true,
      badge: "", badgeStyle: "",
      short: "Sun-dried sonth with real heat. The monsoon cup.",
      description:
        "Sun-dried ginger, coarsely broken so the heat builds through the boil instead of arriving all at once. Sharp, clearing, and exactly what a Bangalore monsoon evening asks for.",
      notes: ["Sharp", "Warming", "Throat-clearing"],
      brew: "1 tsp per cup · boil 5 min for full heat",
      colors: { base: "#c9962f", deep: "#6b4f10", accent: "#faf0cf" }
    },
    {
      id: "ginger-elaichi-tea",
      name: "Ginger Elaichi Tea",
      category: "spiced",
      price: 240, mrp: 250, priceConfirmed: true,
      badge: "Premium", badgeStyle: "gold",
      short: "Heat and perfume, held in balance.",
      description:
        "Sun-dried ginger for the heat, Idukki cardamom for the perfume, held in a ratio we argued about for two years. The one we pour when we want to impress someone.",
      notes: ["Complex", "Warming", "Aromatic"],
      brew: "1 tsp per cup · boil 4 min with milk · no extra spice needed",
      colors: { base: "#7fae3e", deep: "#33541a", accent: "#f6e7b0" }
    },
    {
      id: "ginger-mint-tea",
      name: "Ginger Mint Tea",
      category: "refreshing",
      price: 230, mrp: 240, priceConfirmed: true,
      badge: "", badgeStyle: "",
      short: "Heat that finishes cool. Excellent iced.",
      description:
        "Ginger warms the throat, spearmint cools the finish. The one blend that is as good over ice at four o'clock as it is hot at seven.",
      notes: ["Cooling finish", "Iced-tea ready", "Digestive"],
      brew: "1 tsp per cup · boil 3 min · chill over ice with lime",
      colors: { base: "#3fa88a", deep: "#12463a", accent: "#d6f2e6" }
    },
    {
      id: "mint-tea",
      name: "Mint Tea",
      category: "refreshing",
      price: 190, mrp: 200, priceConfirmed: true,
      badge: "", badgeStyle: "",
      short: "Whole spearmint leaf, dried in shade to hold its colour.",
      description:
        "Shade-dried whole spearmint leaf, never powdered, so the oils stay put until you brew it. Clean, cooling, and the cup we push across the counter after a heavy meal.",
      notes: ["Cooling", "Clean", "After-meal"],
      brew: "1 tsp per cup · steep 3 min in hot water · no milk",
      colors: { base: "#4bbf87", deep: "#155c3d", accent: "#e2f8ec" }
    },
    {
      id: "tulsi-tea",
      name: "Tulsi Tea",
      category: "herbal",
      price: 200, mrp: 210, priceConfirmed: false,
      badge: "", badgeStyle: "",
      short: "Holy basil, shade-dried. Peppery, clean, caffeine-free.",
      description:
        "Rama and Krishna tulsi, shade-dried to protect the oils. Peppery, faintly clove-like, and without a trace of caffeine — which is why it is our most ordered evening tea.",
      notes: ["Caffeine-free", "Peppery", "Evening cup"],
      brew: "1 tsp per cup · steep 4 min in hot water · honey optional",
      colors: { base: "#5d9e57", deep: "#22461f", accent: "#e8f4d9" }
    },
    {
      id: "tulsi-elaichi-tea",
      name: "Tulsi Elaichi Tea",
      category: "herbal",
      price: 220, mrp: 230, priceConfirmed: false,
      badge: "", badgeStyle: "",
      short: "Herbal calm with a cardamom lift. Caffeine-free.",
      description:
        "Green cardamom softens tulsi's peppery edge without burying the herb underneath. Caffeine-free, and gentle enough for the last cup of the night.",
      notes: ["Caffeine-free", "Soothing", "Fragrant"],
      brew: "1 tsp per cup · steep 4 min · a little honey suits it",
      colors: { base: "#6cae7b", deep: "#27512f", accent: "#eef6dd" }
    },
    {
      id: "rose-tea",
      name: "Rose Tea",
      category: "herbal",
      price: 210, mrp: 220, priceConfirmed: false,
      badge: "New", badgeStyle: "leaf",
      short: "Whole Kannauj petals. Delicate, floral, unmistakable.",
      description:
        "Whole Kannauj petals folded through a light black leaf. Delicate enough that we ask you to pull it a minute early — over-steep it and the flower turns soapy.",
      notes: ["Floral", "Delicate", "Light-bodied"],
      brew: "1 tsp per cup · steep 2–3 min only · light milk or none",
      colors: { base: "#c2607f", deep: "#5c1f34", accent: "#fbe0e8" }
    },
    {
      id: "chocolate-tea",
      name: "Chocolate Tea",
      category: "dessert",
      price: 210, mrp: 220, priceConfirmed: true,
      badge: "Kids' Favourite", badgeStyle: "gold",
      short: "Real cocoa nibs, not syrup. Dessert in a cup.",
      description:
        "Roasted cocoa nibs from Idukki in a strong Assam base — actual cocoa, never a flavouring syrup. Rich, a little bitter under the sweetness, and quietly stolen from the children.",
      notes: ["Rich", "Cocoa", "Dessert"],
      brew: "1.5 tsp per cup · boil 4 min with milk · sweeten to taste",
      colors: { base: "#7b4a2d", deep: "#331708", accent: "#e8c9a0" }
    }
  ];

  /* Pack sizes. PLACEHOLDER: the 500 g multiplier is our assumption — the live
     site published a single price range only. Confirm before launch. */
  const PACKS = [
    { id: "250g", label: "250 g", multiplier: 1,    note: "makes ~100 cups" },
    { id: "500g", label: "500 g", multiplier: 1.85, note: "save 8%" }
  ];

  const SHIPPING = {
    freeAbove: 999,          // ₹ — free shipping threshold
    flatRate: 60,            // ₹ — otherwise
    codFee: 30,              // ₹ — cash-on-delivery handling
    gstRate: 0.05            // 5% GST on packaged tea
  };

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function getPack(packId) {
    return PACKS.find(p => p.id === packId) || PACKS[0];
  }

  function findProduct(id) {
    return PRODUCTS.find(p => p.id === id) || null;
  }

  /** Authoritative unit price. Rounded to whole rupees. */
  function unitPrice(productId, packId) {
    const product = findProduct(productId);
    if (!product) return null;
    return Math.round(product.price * getPack(packId).multiplier);
  }

  function unitMrp(productId, packId) {
    const product = findProduct(productId);
    if (!product) return null;
    return Math.round(product.mrp * getPack(packId).multiplier);
  }

  function formatINR(paise) {
    return "₹" + Number(paise).toLocaleString("en-IN");
  }

  /**
   * Generated packet artwork. Deterministic per product, so the same tea looks
   * identical on the card, the detail page and in the cart.
   */
  function packetSVG(product, opts) {
    const o = opts || {};
    const c = product.colors;
    const uid = "g_" + product.id.replace(/[^a-z0-9]/gi, "");
    const steam = o.steam === false ? "" : `
      <g opacity=".45" stroke="${c.accent}" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M86 44c-7-8-7-15 0-23s7-15 0-23"><animate attributeName="opacity" values=".2;.6;.2" dur="4s" repeatCount="indefinite"/></path>
        <path d="M104 40c-6-7-6-13 0-20s6-13 0-20"><animate attributeName="opacity" values=".5;.15;.5" dur="4s" repeatCount="indefinite"/></path>
      </g>`;

    return `
<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${product.name} packet">
  <defs>
    <linearGradient id="${uid}_body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.base}"/>
      <stop offset="100%" stop-color="${c.deep}"/>
    </linearGradient>
    <linearGradient id="${uid}_sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff" stop-opacity=".26"/>
      <stop offset="42%" stop-color="#fff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".16"/>
    </linearGradient>
  </defs>

  ${steam}

  <!-- pouch body -->
  <path d="M46 62h108a10 10 0 0 1 10 10v122a14 14 0 0 1-14 14H50a14 14 0 0 1-14-14V72a10 10 0 0 1 10-10z"
        fill="url(#${uid}_body)"/>
  <path d="M46 62h108a10 10 0 0 1 10 10v122a14 14 0 0 1-14 14H50a14 14 0 0 1-14-14V72a10 10 0 0 1 10-10z"
        fill="url(#${uid}_sheen)"/>

  <!-- crimped top seal -->
  <rect x="40" y="46" width="120" height="20" rx="6" fill="${c.deep}"/>
  <g stroke="${c.base}" stroke-opacity=".55" stroke-width="2">
    <path d="M50 50v12M60 50v12M70 50v12M80 50v12M90 50v12M100 50v12M110 50v12M120 50v12M130 50v12M140 50v12M150 50v12"/>
  </g>

  <!-- label panel -->
  <rect x="58" y="92" width="84" height="86" rx="10" fill="#faf8f1" opacity=".95"/>

  <!-- leaf emblem -->
  <g transform="translate(100 122)">
    <path d="M0-18c13 8 17 20 12 33-11 3-22-2-27-13C-19-9-12-15 0-18z" fill="${c.base}"/>
    <path d="M-14 18C-8 6 0-6 10-13" stroke="${c.deep}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  </g>

  <!-- brand rule + name -->
  <rect x="74" y="146" width="52" height="2.5" rx="1.25" fill="${c.accent}"/>
  <text x="100" y="164" text-anchor="middle" font-family="Georgia, serif" font-size="11"
        font-weight="700" fill="${c.deep}">SHARON</text>

  <!-- bottom gusset -->
  <path d="M36 186h128v8a14 14 0 0 1-14 14H50a14 14 0 0 1-14-14z" fill="#000" opacity=".14"/>
</svg>`.trim();
  }

  return {
    CATEGORIES, PRODUCTS, PACKS, SHIPPING,
    findProduct, getPack, unitPrice, unitMrp, formatINR, packetSVG
  };
});
