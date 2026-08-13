# Apex Sports

Pro-grade sports equipment, sold online. A dark, emerald-and-lime "night pitch" aesthetic built for athletes.

**Store domain:** `apexsports.store`
Short, on-brand, and the `.store` TLD signals e-commerce intent at a glance — a good fit for a gear retailer versus a generic `.com`. (Domain registration itself is out of scope for this repo; this documents the chosen name for when the team registers it.)

## Sprint 1 — Project Foundation & Core Shopping Flow

**Scope delivered:**
- [x] Store domain chosen (`apexsports.store`) — see above
- [x] GitHub repository created (see "Publishing to GitHub" below)
- [x] Project scaffolded — static, dependency-free, no build step
- [x] Homepage with hero + full product listing (search + category filter)
- [x] Product detail page (specs, stock, related items)
- [x] Cart: add, remove, update quantity, live total — persists across pages via `localStorage`

## Sprint 2 — Wishlist & Authentication

**Scope delivered:**
- [x] Wishlist / Save for Later — heart icon on every product card and the product detail page, backed by a `Wishlist` module (`js/wishlist.js`) that mirrors the `Cart` pattern and persists to `localStorage`
- [x] Dedicated Wishlist page (`wishlist.html`) to browse, remove, or move saved items into the cart
- [x] Sign Up (`signup.html`) and Sign In (`signin.html`) pages, backed by an `Auth` module (`js/auth.js`)
- [x] Browsing (home, product pages, wishlist) works with **no login required**
- [x] Clicking **Checkout** redirects unauthenticated users to Sign In, with a `?redirect=checkout.html` param that sends them straight back after signing in
- [x] `checkout.html` itself is guarded — visiting it directly while signed out redirects to Sign In first

> ⚠️ **Auth is a client-side demo, not production security.** There is no backend in this project yet, so `js/auth.js` stores accounts and sessions in the browser's `localStorage` and only lightly obfuscates passwords (not a real cryptographic hash like bcrypt/argon2). It's intentionally built the same way `js/cart.js` is — a small, swappable module — so it can be replaced with real server-backed auth (JWT/session cookies, hashed + salted passwords, HTTPS-only) without touching the rest of the app. **Do not reuse a real password when testing.**

## Sprint 3 — Checkout, Responsive UI & Testing

**Scope delivered:**
- [x] Full checkout flow (`checkout.html` + `js/checkout.js`): shipping address form, mock payment form, live order summary pulled from the cart, client-side validation, and an order confirmation state (order ID + "continue shopping")
- [x] Checkout redirects unauthenticated users to Sign In / Sign Up (see Sprint 2) and redirects away if the cart is empty
- [x] Responsive pass across every page (hero grid, product grid, forms, cart drawer, nav) down to small mobile widths, using Tailwind's `sm:` / `lg:` breakpoints
- [x] Account menu in the nav (avatar initials + dropdown when signed in, "Sign In" button when signed out), synced across pages via an `authChanged` event, mirroring how the cart badge syncs via `cartUpdated`
- [x] Manual test pass — see "Manual test checklist" below

**Explicitly out of scope:** a real backend/API, real payment processing (Stripe/PayPal etc.), and order history. The checkout flow is fully wired end-to-end but the "Place order" step simulates success locally — no card data leaves the browser and nothing is charged.

## Tech stack

Plain HTML/CSS/JS — no framework, no bundler, nothing to `npm install`. This keeps the project trivial to run and review.

- **Tailwind CSS** (via CDN) for styling
- **Lucide** (via CDN) for icons
- **`localStorage`** for cart, wishlist, and auth persistence (no backend)

## Project structure

```
apex-sports/
├── index.html            # Homepage + product listing
├── product.html           # Product detail page (?id=<productId>)
├── wishlist.html            # Saved / wishlisted products
├── signin.html                # Sign in page
├── signup.html                  # Sign up page
├── checkout.html                  # Shipping + payment form, order summary, confirmation
├── css/
│   └── style.css                    # Shared design tokens & custom styles
├── js/
│   ├── data.js                        # Product catalog (single source of truth)
│   ├── auth.js                          # Client-side demo auth: sign up / sign in / session
│   ├── cart.js                            # Cart logic: add/remove/update qty, persisted to localStorage
│   ├── wishlist.js                          # Wishlist logic: add/remove/toggle, persisted to localStorage
│   ├── ui.js                                  # Shared UI: cart drawer, account menu, toasts, mobile nav — every page
│   ├── listing.js                               # Homepage-only: search, category filter, grid + wishlist hearts
│   ├── detail.js                                  # product.html-only: single product + related items + wishlist toggle
│   ├── wishlist-page.js                             # wishlist.html-only: renders saved products
│   └── checkout.js                                    # checkout.html-only: auth/cart guard, summary, place order
└── README.md
```

## Running locally in VS Code

No build step or `npm install` required.

1. Open the `apex-sports` folder in VS Code (`File → Open Folder…`).
2. Easiest: install the **Live Server** extension (by Ritwick Dey), right-click `index.html` → **Open with Live Server**. It'll auto-reload as you edit.
3. Or from VS Code's integrated terminal, with Python installed:
   ```bash
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```
   Opening `index.html` directly via `file://` mostly works too, but a local server avoids occasional `fetch`/module quirks — use it if anything looks off.

### Try the new flow
1. Browse the shop and tap the heart on any product card (or on `product.html`) — it's saved to **Wishlist**.
2. Open the bag and hit **Checkout** while signed out → you're sent to **Sign In**, with a link to **Create an account**.
3. Sign up (any name/email/6+ char password) → you're returned straight to checkout.
4. Fill in the shipping + demo payment form and place the order → confirmation screen with an order ID.
5. Use the avatar in the top-right to sign out; browsing still works with no account.

## How the cart / wishlist / auth modules work

Each is a small, framework-free module that persists to `localStorage` and fires a `window` event on change, so the nav badges, drawer, and page grids all stay in sync without knowing about each other:

| Module | Storage key | Event | Key functions |
|---|---|---|---|
| `Cart` (`js/cart.js`) | `apex_cart_v1` | `cartUpdated` | `addItem`, `setQty`, `removeItem`, `getItems`, `getCount`, `getSubtotal`, `clear` |
| `Wishlist` (`js/wishlist.js`) | `apex_wishlist_v1` | `wishlistUpdated` | `add`, `remove`, `toggle`, `has`, `getItems`, `getCount`, `clear` |
| `Auth` (`js/auth.js`) | `apex_users_v1` (accounts) / `apex_session_v1` (session) | `authChanged` | `signUp`, `signIn`, `signOut`, `getCurrentUser`, `isLoggedIn` |

## Manual test checklist

Run through this before submitting / after any change:

- **Listing:** search filters by name/category; category chips filter; "no results" state shows for a nonsense search.
- **Cart:** add from grid and from product page; qty +/- in the drawer and on the grid stay in sync; badge count updates; subtotal/shipping/total math is correct; free shipping kicks in at $75.
- **Wishlist:** heart toggles on the grid, product page, and wishlist page all stay in sync; empty state shows when nothing is saved; "Add" from the wishlist page moves the item into the cart without removing it from the wishlist.
- **Auth:** sign up with a new email succeeds and logs you in; signing up with an existing email is rejected; wrong password on sign in is rejected; account initials + dropdown appear once signed in; sign out returns to the signed-out nav state; session persists across a page refresh.
- **Checkout gating:** clicking Checkout while signed out goes to Sign In and returns to `checkout.html` after signing in; visiting `checkout.html` directly while signed out also redirects; visiting it with an empty cart redirects to the shop.
- **Checkout flow:** order summary matches the cart; empty required fields block submission with an error; invalid card number/expiry/CVC are rejected; a valid submission clears the cart and shows the confirmation screen with an order ID.
- **Responsive:** resize down to a small phone width (~360px) on the homepage, product page, wishlist, sign in/up, and checkout — nav collapses to the hamburger menu, grids stack to one column, forms stay usable, cart drawer goes full-width.
- **Reduced motion:** with "prefers reduced motion" enabled in OS settings, animations shorten (already handled in `css/style.css`).

## Publishing to GitHub

```bash
# 1. Create a new empty repo on github.com (no README/license — this repo already has one)
#    e.g. github.com/new → name it "apex-sports"

# 2. From inside the apex-sports folder:
git init                      # skip if already a git repo
git add .
git commit -m "Sprint 2 & 3: wishlist, auth, checkout, responsive polish"

# 3. Point your local repo at GitHub and push
git remote add origin https://github.com/<your-username>/apex-sports.git
git branch -M main
git push -u origin main
```

## Next steps (beyond this submission)

- Real backend/API + database instead of the static `data.js` catalog and `localStorage` auth
- Real payment processing (e.g. Stripe) in place of the demo checkout form
- Order history tied to a real user account
- Password reset / email verification
