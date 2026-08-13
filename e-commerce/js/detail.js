/**
 * Apex Sports — product detail (product.html only)
 * Reads ?id= from the URL, renders the matching product from PRODUCTS,
 * wires up the quantity stepper + add-to-cart + wishlist toggle, and
 * shows related items from the same category.
 */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const money = (n) => `$${n.toFixed(2)}`;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    $("notFound").classList.remove("hidden");
    $("productDetail").classList.add("hidden");
    $("relatedSection").classList.add("hidden");
    $("breadcrumb").innerHTML = "";
    lucide.createIcons();
    return;
  }

  document.title = `${product.name} — Apex Sports`;

  $("breadcrumb").innerHTML = `
    <a href="index.html" class="hover:text-apex-300 transition-colors">Shop</a>
    <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
    <a href="index.html#shop" class="hover:text-apex-300 transition-colors">${product.category}</a>
    <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
    <span class="text-slate-300">${product.name}</span>
  `;

  let qty = 1;

  function heartClasses(wished) {
    return wished
      ? "border-rose-400/60 text-rose-400"
      : "border-pitch-700 text-slate-300 hover:border-apex-400 hover:text-apex-300";
  }

  function render() {
    const wished = Wishlist.has(product.id);
    $("productDetail").innerHTML = `
      <div class="grid lg:grid-cols-2 gap-12">
        <div class="relative">
          ${product.tag ? `<span class="absolute top-4 left-4 z-10 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-lime-400/15 text-lime-400 border border-lime-400/30 backdrop-blur-sm">${product.tag}</span>` : ""}
          <div class="aspect-square rounded-2xl overflow-hidden bg-pitch-800 border border-pitch-700">
            <img src="${product.image}" alt="${product.name}"
              class="w-full h-full object-cover">
          </div>
        </div>

        <div>
          <span class="text-xs font-mono uppercase tracking-widest text-apex-400">${product.category}</span>
          <h1 class="font-display text-5xl text-white mt-2 leading-tight">${product.name}</h1>
          <p class="font-display text-4xl text-apex-300 mt-4">${money(product.price)}</p>

          <p class="text-slate-400 mt-6 leading-relaxed">${product.description}</p>

          <div class="mt-6">
            <h2 class="text-sm font-semibold text-slate-200 mb-3">Specs</h2>
            <ul class="space-y-2">
              ${product.specs.map((s) => `
                <li class="flex items-start gap-2 text-sm text-slate-400">
                  <i data-lucide="check" class="w-4 h-4 text-apex-400 mt-0.5 shrink-0"></i> ${s}
                </li>`).join("")}
            </ul>
          </div>

          <p class="mt-6 text-sm flex items-center gap-2 ${product.stock > 10 ? "text-apex-300" : "text-lime-400"}">
            <i data-lucide="${product.stock > 10 ? "check-circle" : "alert-triangle"}" class="w-4 h-4"></i>
            ${product.stock > 10 ? "In stock" : `Only ${product.stock} left`}
          </p>

          <div class="mt-8 flex items-center gap-3">
            <div class="flex items-center gap-1 bg-pitch-900 border border-pitch-700 rounded-md px-1">
              <button id="qtyDec" class="w-10 h-11 flex items-center justify-center text-apex-300 hover:text-lime-400" aria-label="Decrease quantity">
                <i data-lucide="minus" class="w-4 h-4"></i>
              </button>
              <span id="qtyDisplay" class="w-8 text-center font-mono text-lg">${qty}</span>
              <button id="qtyInc" class="w-10 h-11 flex items-center justify-center text-apex-300 hover:text-lime-400" aria-label="Increase quantity">
                <i data-lucide="plus" class="w-4 h-4"></i>
              </button>
            </div>

            <button id="addToCartBtn" class="flex-1 py-3.5 rounded-md bg-apex-500 text-pitch-950 font-bold hover:bg-apex-400 transition-colors flex items-center justify-center gap-2">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to bag
            </button>

            <button id="wishlistToggleBtn" class="w-14 h-[46px] shrink-0 flex items-center justify-center rounded-md border transition-colors ${heartClasses(wished)}" aria-label="${wished ? "Remove from wishlist" : "Add to wishlist"}">
              <i data-lucide="heart" class="w-4 h-4 ${wished ? "fill-current" : ""}"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();

    $("qtyInc").addEventListener("click", () => {
      qty = Math.min(qty + 1, product.stock);
      $("qtyDisplay").textContent = qty;
    });
    $("qtyDec").addEventListener("click", () => {
      qty = Math.max(qty - 1, 1);
      $("qtyDisplay").textContent = qty;
    });
    $("addToCartBtn").addEventListener("click", () => {
      Cart.addItem(product.id, qty);
      window.showToast?.(`${qty} × ${product.name} added to bag`, "shopping-bag");
    });
    $("wishlistToggleBtn").addEventListener("click", () => {
      Wishlist.toggle(product.id);
      window.showToast?.(Wishlist.has(product.id) ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`, "heart");
      render();
      renderRelated();
    });
  }

  function renderRelated() {
    const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    if (related.length === 0) {
      $("relatedSection").classList.add("hidden");
      return;
    }
    $("relatedGrid").innerHTML = related.map((p) => `
      <a href="product.html?id=${p.id}" class="card-hover block bg-pitch-900 border border-pitch-700 rounded-2xl p-5">
        <div class="w-full aspect-square rounded-xl overflow-hidden bg-pitch-800 border border-pitch-700 mb-4">
          <img src="${p.image}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover">
        </div>
        <span class="text-[11px] font-mono uppercase tracking-widest text-apex-400 mb-1 block">${p.category}</span>
        <h3 class="font-semibold text-slate-100 text-sm leading-snug mb-2">${p.name}</h3>
        <span class="font-display text-xl text-white">${money(p.price)}</span>
      </a>
    `).join("");
    lucide.createIcons();
  }

  render();
  renderRelated();
});
