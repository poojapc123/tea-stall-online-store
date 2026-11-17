module.exports = {
  file: "product.html",
  title: "Tea — Sharon Tea Stall",
  description: "Sharon Tea Stall blend details, tasting notes and brewing instructions.",
  body: `
<section class="section" id="product-root">
  <div class="shell">
    <nav class="crumbs" style="justify-content:flex-start;color:var(--muted);margin-bottom:28px">
      <a href="index.html">Home</a> <span>/</span> <a href="shop.html">Shop</a>
      <span>/</span> <span id="crumb-name">Tea</span>
    </nav>

    <div class="product-detail" id="product-detail"><!-- rendered by JS --></div>
  </div>
</section>

<section class="section section--tint" style="padding-top:0" id="related-wrap">
  <div class="shell" style="padding-top:clamp(64px,8vw,104px)">
    <div class="section-head section-head--center">
      <span class="eyebrow eyebrow--center">You might also like</span>
      <h2>From <em>the same shelf</em></h2>
    </div>
    <div class="grid grid--4" id="related"><!-- rendered by JS --></div>
  </div>
</section>`,
  scripts: `<script src="assets/js/product.js"></script>`
};
