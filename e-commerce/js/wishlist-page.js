/**
 * Apex Sports — wishlist page (wishlist.html only)
 * Renders the saved-products grid from the Wishlist module.
 */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const money = (n) => `$${n.toFixed(2)}`;

  function render() {
    const grid = $("wishlistGrid");
    const empty = $("wishlistEmptyState");
    const items = Wishlist.getItems();

    if (items.length === 0) {
      grid.classList.add("hidden");
      empty.classList.remove("hidden");
      return;
    }
    grid.classList.remove("hidden");
    empty.classList.add("hidden");

    grid.innerHTML = items.map((p) => `
      <div class="card-hover group relative bg-pitch-900 border border-pitch-700 rounded-2xl p-5 flex flex-col">
        ${p.tag ? `<span class="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-lime-400/15 text-lime-400 border border-lime-400/30">${p.tag}</span>` : ""}
        <button data-remove="${p.id}" class="absolute top-4 left-4 z-10 p-2 rounded-full bg-pitch-950/70 border border-pitch-700 backdrop-blur-sm text-rose-400 hover:border-rose-400 transition-colors" aria-label="Remove from wishlist">
          <i data-lucide="heart" class="w-4 h-4 fill-current"></i>
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
          <button data-add="${p.id}" class="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-pitch-800 border border-pitch-700 text-slate-200 text-sm font-semibold hover:bg-apex-500 hover:border-apex-500 hover:text-pitch-950 transition-colors">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add
          </button>
        </div>
      </div>`).join("");

    lucide.createIcons();

    grid.querySelectorAll("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        Wishlist.remove(Number(btn.dataset.remove));
      }));
    grid.querySelectorAll("[data-add]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = Number(btn.dataset.add);
        Cart.addItem(id, 1);
        window.showToast?.(`${PRODUCTS.find((p) => p.id === id).name} added to bag`, "shopping-bag");
      }));
  }

  window.addEventListener("wishlistUpdated", render);
  render();
});
