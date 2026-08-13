/**
 * Apex Sports — shared UI wiring
 * Handles the cart drawer, cart/wishlist badges, the account menu, toasts,
 * and mobile nav. Expects the standard nav/drawer markup (see index.html)
 * to be present on the page. Safe to include on every page.
 */
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const $ = (id) => document.getElementById(id);
  const money = (n) => `$${n.toFixed(2)}`;

  // ---------- Mobile menu ----------
  const mobileMenuBtn = $("mobileMenuBtn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      $("mobileMenu").classList.toggle("hidden");
    });
  }

  // ---------- Toast ----------
  function showToast(message, icon = "check-circle") {
    const toast = $("toast");
    if (!toast) return;
    toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 text-apex-400"></i><span>${message}</span>`;
    toast.classList.remove("hidden");
    toast.classList.remove("toast-in");
    void toast.offsetWidth;
    toast.classList.add("toast-in");
    lucide.createIcons();
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add("hidden"), 2200);
  }
  window.showToast = showToast;

  // ---------- Cart drawer open/close ----------
  function openCart() {
    $("cartOverlay").classList.remove("hidden");
    requestAnimationFrame(() => $("cartOverlay").classList.remove("opacity-0"));
    $("cartDrawer").classList.remove("translate-x-full");
  }
  function closeCart() {
    $("cartDrawer").classList.add("translate-x-full");
    $("cartOverlay").classList.add("opacity-0");
    setTimeout(() => $("cartOverlay").classList.add("hidden"), 300);
  }
  window.openCart = openCart;
  window.closeCart = closeCart;

  const cartBtn = $("cartBtn");
  if (cartBtn) cartBtn.addEventListener("click", openCart);
  const cartCloseBtn = $("cartCloseBtn");
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
  const cartOverlay = $("cartOverlay");
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  // ---------- Cart rendering ----------
  function renderCart() {
    const badge = $("cartCount");
    const count = Cart.getCount();
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle("hidden", count === 0);
    }

    const itemsWrap = $("cartItems");
    const emptyState = $("cartEmptyState");
    const footer = $("cartFooter");
    if (!itemsWrap) return; // drawer markup not on this page

    const items = Cart.getItems();

    if (items.length === 0) {
      itemsWrap.classList.add("hidden");
      footer.classList.add("hidden");
      emptyState.classList.remove("hidden");
      return;
    }
    itemsWrap.classList.remove("hidden");
    footer.classList.remove("hidden");
    emptyState.classList.add("hidden");

    itemsWrap.innerHTML = items.map(({ product, qty }) => `
      <div class="flex gap-4 items-center bg-pitch-950/60 border border-pitch-800 rounded-xl p-3">
        <div class="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-pitch-800 border border-pitch-700">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-100 truncate">${product.name}</p>
          <p class="text-xs text-slate-500 font-mono mt-0.5">${money(product.price)} each</p>
          <div class="flex items-center gap-2 mt-2">
            <button data-cart-dec="${product.id}" class="w-6 h-6 flex items-center justify-center rounded bg-pitch-800 border border-pitch-700 text-slate-300 hover:border-apex-400" aria-label="Decrease quantity">
              <i data-lucide="minus" class="w-3 h-3"></i>
            </button>
            <span class="text-xs font-mono w-4 text-center">${qty}</span>
            <button data-cart-inc="${product.id}" class="w-6 h-6 flex items-center justify-center rounded bg-pitch-800 border border-pitch-700 text-slate-300 hover:border-apex-400" aria-label="Increase quantity">
              <i data-lucide="plus" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <span class="text-sm font-mono text-apex-300">${money(product.price * qty)}</span>
          <button data-cart-remove="${product.id}" class="text-slate-600 hover:text-rose-400 transition-colors" aria-label="Remove item">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `).join("");

    const subtotal = Cart.getSubtotal();
    const shipping = subtotal > 0 && subtotal < 75 ? 6.99 : 0;
    $("cartSubtotal").textContent = money(subtotal);
    $("cartShipping").textContent = subtotal === 0 ? money(0) : (shipping === 0 ? "Free" : money(shipping));
    $("cartTotal").textContent = money(subtotal + shipping);

    lucide.createIcons();

    itemsWrap.querySelectorAll("[data-cart-inc]").forEach((b) =>
      b.addEventListener("click", () => Cart.addItem(Number(b.dataset.cartInc), 1)));
    itemsWrap.querySelectorAll("[data-cart-dec]").forEach((b) =>
      b.addEventListener("click", () => {
        const id = Number(b.dataset.cartDec);
        const current = Cart.getState()[id] || 0;
        Cart.setQty(id, current - 1);
      }));
    itemsWrap.querySelectorAll("[data-cart-remove]").forEach((b) =>
      b.addEventListener("click", () => Cart.removeItem(Number(b.dataset.cartRemove))));
  }

  window.addEventListener("cartUpdated", renderCart);
  renderCart();

  // ---------- Wishlist badge ----------
  function renderWishlistBadge() {
    const badge = $("wishlistCount");
    if (!badge || typeof Wishlist === "undefined") return;
    const count = Wishlist.getCount();
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  }
  window.addEventListener("wishlistUpdated", renderWishlistBadge);
  renderWishlistBadge();

  // ---------- Account menu ----------
  function renderAccount() {
    const area = $("accountArea");
    const mobileArea = $("mobileAccountArea");
    if (!area || typeof Auth === "undefined") return;

    const user = Auth.getCurrentUser();

    if (user) {
      const initials = user.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "U";
      area.innerHTML = `
        <button id="accountBtn" class="flex items-center justify-center w-9 h-9 rounded-full bg-pitch-800 border border-pitch-700 text-apex-300 font-mono text-xs font-bold hover:border-apex-400 transition-colors" aria-haspopup="true" aria-expanded="false" aria-label="Account menu">
          ${initials}
        </button>
        <div id="accountDropdown" class="hidden absolute right-0 mt-2 w-56 rounded-lg bg-pitch-900 border border-pitch-700 shadow-xl py-2 z-50">
          <div class="px-4 py-2.5 border-b border-pitch-800">
            <p class="text-sm font-semibold text-slate-100 truncate">${user.name}</p>
            <p class="text-xs text-slate-500 truncate">${user.email}</p>
          </div>
          <a href="wishlist.html" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-pitch-800 hover:text-apex-300 transition-colors">
            <i data-lucide="heart" class="w-4 h-4"></i> Wishlist
          </a>
          <button id="signOutBtn" class="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-pitch-800 hover:text-rose-400 transition-colors">
            <i data-lucide="log-out" class="w-4 h-4"></i> Sign out
          </button>
        </div>
      `;
      $("accountBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        $("accountDropdown").classList.toggle("hidden");
      });
      $("signOutBtn").addEventListener("click", () => {
        Auth.signOut();
        showToast("Signed out", "log-out");
      });

      if (mobileArea) {
        mobileArea.innerHTML = `
          <p class="text-sm font-semibold text-slate-200">${user.name}</p>
          <p class="text-xs text-slate-500 mb-3">${user.email}</p>
          <button id="mobileSignOutBtn" class="text-sm font-semibold text-rose-400">Sign out</button>
        `;
        $("mobileSignOutBtn").addEventListener("click", () => Auth.signOut());
      }
    } else {
      area.innerHTML = `
        <a href="signin.html" class="px-3 py-2 rounded-md text-sm font-semibold text-slate-200 border border-pitch-700 hover:border-apex-400 hover:text-apex-300 transition-colors whitespace-nowrap">
          Sign In
        </a>
      `;
      if (mobileArea) {
        mobileArea.innerHTML = `
          <a href="signin.html" class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-apex-500 text-pitch-950 text-sm font-bold">
            Sign In <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        `;
      }
    }
    lucide.createIcons();
  }

  document.addEventListener("click", () => {
    $("accountDropdown")?.classList.add("hidden");
  });

  window.addEventListener("authChanged", renderAccount);
  renderAccount();

  // ---------- Checkout (gated behind sign-in; real flow lives in checkout.html) ----------
  const checkoutBtn = $("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (Cart.getCount() === 0) return;
      if (typeof Auth !== "undefined" && !Auth.isLoggedIn()) {
        window.location.href = "signin.html?redirect=checkout.html";
        return;
      }
      window.location.href = "checkout.html";
    });
  }
});
