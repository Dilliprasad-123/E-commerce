/**
 * Apex Sports — Cart module
 * Framework-free cart store persisted to localStorage so it survives
 * navigation between index.html and product.html. Dispatches a
 * "cartUpdated" event on window whenever it changes, so any page's
 * UI layer can re-render without the modules knowing about each other.
 */
const Cart = (() => {
  const STORAGE_KEY = "apex_cart_v1";

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error("Cart: failed to read from storage", e);
      return {};
    }
  }

  function write(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Cart: failed to persist cart", e);
    }
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: state }));
  }

  function getState() {
    return read();
  }

  function getItems() {
    // Returns [{ product, qty }] using the PRODUCTS catalog for details.
    const state = read();
    return Object.entries(state)
      .map(([id, qty]) => {
        const product = (typeof PRODUCTS !== "undefined")
          ? PRODUCTS.find((p) => p.id === Number(id))
          : null;
        return product ? { product, qty } : null;
      })
      .filter(Boolean);
  }

  function addItem(id, qty = 1) {
    const state = read();
    state[id] = (state[id] || 0) + qty;
    if (state[id] <= 0) delete state[id];
    write(state);
  }

  function setQty(id, qty) {
    const state = read();
    if (qty <= 0) {
      delete state[id];
    } else {
      state[id] = qty;
    }
    write(state);
  }

  function removeItem(id) {
    const state = read();
    delete state[id];
    write(state);
  }

  function clear() {
    write({});
  }

  function getCount() {
    const state = read();
    return Object.values(state).reduce((sum, qty) => sum + qty, 0);
  }

  function getSubtotal() {
    return getItems().reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  }

  return { getState, getItems, addItem, setQty, removeItem, clear, getCount, getSubtotal };
})();
