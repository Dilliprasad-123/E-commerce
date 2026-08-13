/**
 * Apex Sports — product listing (index.html only)
 * Renders category chips + product grid, with live search, category
 * filtering, and wishlist toggling. Add-to-cart / wishlist buttons write
 * through the Cart / Wishlist modules.
 */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const money = (n) => `$${n.toFixed(2)}`;

  const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  let activeCategory = "All";
  let searchTerm = "";

  function renderChips() {
    const wrap = $("categoryChips");
    wrap.innerHTML = CATEGORIES.map((cat) => `
      <button data-cat="${cat}" class="chip-transition px-4 py-2 rounded-full text-sm font-semibold border
        ${cat === activeCategory
          ? "bg-apex-500 border-apex-500 text-pitch-950"
          : "bg-pitch-900 border-pitch-700 text-slate-300 hover:border-apex-400 hover:text-apex-300"}">
        ${cat}
      </button>
    `).join("");
    wrap.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        renderChips();
        renderProducts();
      });
    });
  }

  function renderProducts() {
    const grid = $("productGrid");
    const cartState = Cart.getState();

    const filtered = PRODUCTS.filter((p) => {
      const matchesCat = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = (p.name + " " + p.category).toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });

    $("noResults").classList.toggle("hidden", filtered.length !== 0);

    grid.innerHTML = filtered.map((p) => {
      const qty = cartState[p.id] || 0;
      const wished = Wishlist.has(p.id);
      return `
      <div class="card-hover group relative bg-pitch-900 border border-pitch-700 rounded-2xl p-5 flex flex-col">
        ${p.tag ? `<span class="absolute top-4 right-4 z-10 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-lime-400/15 text-lime-400 border border-lime-400/30">${p.tag}</span>` : ""}
        <button data-wish="${p.id}" class="absolute top-4 left-4 z-10 p-2 rounded-full bg-pitch-950/70 border border-pitch-700 backdrop-blur-sm hover:border-apex-400 transition-colors" aria-label="${wished ? "Remove from wishlist" : "Add to wishlist"}">
          <i data-lucide="heart" class="w-4 h-4 ${wished ? "text-rose-400 fill-current" : "text-slate-300"}"></i>
        </button>
        <a href="product.html?id=${p.id}" class="block">
          <div class="w-full aspect-square rounded-xl overflow-hidden bg-pitch-800 border border-pitch-700 mb-4">
            <img src="${p.image}" alt="${p.name}" loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
          </div>
          <span class="text-[11px] font-mono uppercase tracking-widest text-apex-400 mb-1 block">${p.category}</span>
          <h3 class="font-semibold text-slate-100 leading-snug mb-2 hover:text-apex-300 transition-colors">${p.name}</h3>
        </a>
        <div class="mt-auto flex items-center justify-between pt-3">
          <span class="font-display text-2xl text-white">${money(p.price)}</span>
          ${qty === 0 ? `
            <button data-add="${p.id}" class="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-pitch-800 border border-pitch-700 text-slate-200 text-sm font-semibold hover:bg-apex-500 hover:border-apex-500 hover:text-pitch-950 transition-colors">
              <i data-lucide="plus" class="w-4 h-4"></i> Add
            </button>
          ` : `
            <div class="flex items-center gap-2 bg-pitch-800 border border-apex-500/50 rounded-md px-1">
              <button data-dec="${p.id}" class="w-7 h-7 flex items-center justify-center text-apex-300 hover:text-lime-400" aria-label="Decrease quantity">
                <i data-lucide="minus" class="w-3.5 h-3.5"></i>
              </button>
              <span class="text-sm font-mono w-4 text-center">${qty}</span>
              <button data-inc="${p.id}" class="w-7 h-7 flex items-center justify-center text-apex-300 hover:text-lime-400" aria-label="Increase quantity">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          `}
        </div>
      </div>`;
    }).join("");

    lucide.createIcons();

    grid.querySelectorAll("[data-add]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.add);
        Cart.addItem(id, 1);
        window.showToast?.(`${PRODUCTS.find((p) => p.id === id).name} added to bag`, "shopping-bag");
      }));
    grid.querySelectorAll("[data-inc]").forEach((btn) =>
      btn.addEventListener("click", () => Cart.addItem(Number(btn.dataset.inc), 1)));
    grid.querySelectorAll("[data-dec]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.dec);
        const current = Cart.getState()[id] || 0;
        Cart.setQty(id, current - 1);
      }));
    grid.querySelectorAll("[data-wish]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = Number(btn.dataset.wish);
        Wishlist.toggle(id);
        const name = PRODUCTS.find((p) => p.id === id).name;
        window.showToast?.(Wishlist.has(id) ? `${name} added to wishlist` : `${name} removed from wishlist`, "heart");
      }));
  }

  $("searchInput").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderProducts();
  });
  $("navSearchBtn").addEventListener("click", () => {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $("searchInput").focus(), 400);
  });

  // Re-render when the cart or wishlist changes (e.g. from the drawer, or another tab).
  window.addEventListener("cartUpdated", renderProducts);
  window.addEventListener("wishlistUpdated", renderProducts);

  renderChips();
  renderProducts();
});
