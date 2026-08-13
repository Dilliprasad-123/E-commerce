/**
 * Apex Sports — Wishlist module
 * Framework-free "save for later" store persisted to localStorage so it
 * survives navigation between pages, mirroring js/cart.js. Dispatches a
 * "wishlistUpdated" event on window whenever it changes.
 */
const Wishlist = (() => {
  const STORAGE_KEY = "apex_wishlist_v1";

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Wishlist: failed to read from storage", e);
      return [];
    }
  }

  function write(ids) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error("Wishlist: failed to persist wishlist", e);
    }
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: ids }));
  }

  function getIds() {
    return read();
  }

  function has(id) {
    return read().includes(Number(id));
  }

  function getItems() {
    // Returns [product, ...] using the PRODUCTS catalog for details.
    const ids = read();
    return ids
      .map((id) => (typeof PRODUCTS !== "undefined" ? PRODUCTS.find((p) => p.id === id) : null))
      .filter(Boolean);
  }

  function add(id) {
    id = Number(id);
    const ids = read();
    if (!ids.includes(id)) {
      ids.push(id);
      write(ids);
    }
  }

  function remove(id) {
    id = Number(id);
    write(read().filter((x) => x !== id));
  }

  function toggle(id) {
    if (has(id)) {
      remove(id);
    } else {
      add(id);
    }
  }

  function clear() {
    write([]);
  }

  function getCount() {
    return read().length;
  }

  return { getIds, has, getItems, add, remove, toggle, clear, getCount };
})();
