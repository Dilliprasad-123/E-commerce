/**
 * Apex Sports — checkout (checkout.html only)
 * Gates checkout behind auth, renders the live order summary from Cart,
 * and simulates placing an order (no real payment gateway — see README).
 */
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  const $ = (id) => document.getElementById(id);
  const money = (n) => `$${n.toFixed(2)}`;

  // Guard: must be signed in to reach checkout.
  if (!Auth.isLoggedIn()) {
    window.location.href = "signin.html?redirect=checkout.html";
    return;
  }

  // Guard: nothing to check out.
  if (Cart.getCount() === 0) {
    window.location.href = "index.html#shop";
    return;
  }

  function renderSummary() {
    const items = Cart.getItems();
    $("summaryItems").innerHTML = items.map(({ product, qty }) => `
      <div class="flex gap-3 items-center">
        <div class="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-pitch-800 border border-pitch-700">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-slate-100 truncate">${product.name}</p>
          <p class="text-xs text-slate-500 font-mono">Qty ${qty}</p>
        </div>
        <span class="text-sm font-mono text-slate-300">${money(product.price * qty)}</span>
      </div>
    `).join("");

    const subtotal = Cart.getSubtotal();
    const shipping = subtotal > 0 && subtotal < 75 ? 6.99 : 0;
    $("summarySubtotal").textContent = money(subtotal);
    $("summaryShipping").textContent = shipping === 0 ? "Free" : money(shipping);
    $("summaryTotal").textContent = money(subtotal + shipping);
  }

  function showError(msg) {
    $("checkoutErrorText").textContent = msg;
    $("checkoutError").classList.remove("hidden");
  }

  const EXPIRY_RE = /^(0[1-9]|1[0-2])\/\d{2}$/;

  $("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    $("checkoutError").classList.add("hidden");

    const requiredIds = ["fullName", "phone", "address", "city", "state", "zip", "cardName", "cardNumber", "cardExpiry", "cardCvc"];
    for (const id of requiredIds) {
      if (!$(id).value.trim()) {
        showError("Please fill in every field to place your order.");
        $(id).focus();
        return;
      }
    }

    const digitsOnly = $("cardNumber").value.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(digitsOnly)) {
      showError("Enter a valid card number.");
      $("cardNumber").focus();
      return;
    }
    if (!EXPIRY_RE.test($("cardExpiry").value.trim())) {
      showError("Enter the card expiry as MM/YY.");
      $("cardExpiry").focus();
      return;
    }
    if (!/^\d{3,4}$/.test($("cardCvc").value.trim())) {
      showError("Enter a valid CVC.");
      $("cardCvc").focus();
      return;
    }

    // Simulate placing the order — no backend/payment processor yet.
    const orderId = "APX-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const user = Auth.getCurrentUser();
    $("confirmName").textContent = user?.name ? `, ${user.name.split(" ")[0]}` : "";
    $("confirmOrderId").textContent = orderId;

    Cart.clear();
    $("checkoutView").classList.add("hidden");
    $("confirmationView").classList.remove("hidden");
    lucide.createIcons();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("cartUpdated", renderSummary);
  renderSummary();
});
