/* Shop listing — category filter, search and sort, all client-side. */
(function () {
  "use strict";

  const C = window.SharonCatalog;
  const UI = window.SharonUI;

  const grid = document.getElementById("product-grid");
  const empty = document.getElementById("empty");
  const countEl = document.getElementById("result-count");
  const sortEl = document.getElementById("sort");
  const searchEl = document.getElementById("search");
  const filterHost = document.getElementById("category-filters");

  // Category can be deep-linked: shop.html?cat=spiced
  const params = new URLSearchParams(location.search);
  let state = {
    cat: params.get("cat") || "all",
    q: (params.get("q") || "").trim(),
    sort: "featured"
  };
  if (!C.CATEGORIES.some(c => c.id === state.cat)) state.cat = "all";
  if (state.q) searchEl.value = state.q;

  function countIn(catId) {
    return catId === "all"
      ? C.PRODUCTS.length
      : C.PRODUCTS.filter(p => p.category === catId).length;
  }

  function renderFilters() {
    filterHost.innerHTML = C.CATEGORIES.map(c => `
      <button type="button" data-cat="${c.id}" class="${c.id === state.cat ? "is-active" : ""}">
        <span>${c.name}</span><span class="count">${countIn(c.id)}</span>
      </button>`).join("");
  }

  function apply() {
    let list = C.PRODUCTS.slice();

    if (state.cat !== "all") list = list.filter(p => p.category === state.cat);

    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.short.toLowerCase().includes(q) ||
        p.notes.some(n => n.toLowerCase().includes(q))
      );
    }

    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = list.map(UI.productCard).join("");
    empty.classList.toggle("hidden", list.length > 0);
    grid.classList.toggle("hidden", list.length === 0);
    countEl.textContent = list.length + (list.length === 1 ? " tea" : " teas")
      + (state.cat !== "all"
          ? " in " + (C.CATEGORIES.find(c => c.id === state.cat) || {}).name
          : "");

    UI.initReveal();
    syncUrl();
  }

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.q) p.set("q", state.q);
    const qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  filterHost.addEventListener("click", e => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.cat = btn.dataset.cat;
    renderFilters();
    apply();
  });

  sortEl.addEventListener("change", () => { state.sort = sortEl.value; apply(); });

  let t;
  searchEl.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = searchEl.value.trim(); apply(); }, 200);
  });

  document.getElementById("reset-filters").addEventListener("click", () => {
    state = { cat: "all", q: "", sort: "featured" };
    searchEl.value = "";
    sortEl.value = "featured";
    renderFilters();
    apply();
  });

  renderFilters();
  apply();
})();
