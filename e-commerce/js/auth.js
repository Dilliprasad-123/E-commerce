/**
 * Apex Sports — Auth module
 *
 * IMPORTANT: This is a client-side-only demo auth system for prototyping
 * and coursework. Accounts and sessions live in localStorage on the
 * visitor's own browser — there is no server, so this does NOT provide
 * real security. Passwords are run through a simple non-cryptographic
 * hash purely to avoid storing them as plain text in devtools; it is not
 * a substitute for a proper backend with bcrypt/argon2 + server sessions.
 * Swap this module out first when a real backend is introduced.
 *
 * Dispatches an "authChanged" event on window whenever the session
 * changes, so any page's UI layer can re-render without modules knowing
 * about each other (mirrors the Cart / Wishlist pattern).
 */
const Auth = (() => {
  const USERS_KEY = "apex_users_v1";
  const SESSION_KEY = "apex_session_v1";

  function hash(str) {
    // djb2 — obfuscation only, NOT cryptographically secure.
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = (h * 33) ^ str.charCodeAt(i);
    }
    return String(h >>> 0);
  }

  function readUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Auth: failed to read users", e);
      return [];
    }
  }

  function writeUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Auth: failed to persist users", e);
    }
  }

  function readSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeSession(session) {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    window.dispatchEvent(new CustomEvent("authChanged", { detail: session }));
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function signUp(name, email, password) {
    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();

    if (!name || !email || !password) {
      return { ok: false, error: "Please fill in every field." };
    }
    if (!EMAIL_RE.test(email)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: "An account with that email already exists. Try signing in instead." };
    }

    users.push({ name, email, passwordHash: hash(password) });
    writeUsers(users);
    writeSession({ name, email });
    return { ok: true };
  }

  function signIn(email, password) {
    email = (email || "").trim().toLowerCase();
    const users = readUsers();
    const user = users.find((u) => u.email === email);

    if (!user || user.passwordHash !== hash(password || "")) {
      return { ok: false, error: "Incorrect email or password." };
    }

    writeSession({ name: user.name, email: user.email });
    return { ok: true };
  }

  function signOut() {
    writeSession(null);
  }

  function getCurrentUser() {
    return readSession();
  }

  function isLoggedIn() {
    return !!readSession();
  }

  return { signUp, signIn, signOut, getCurrentUser, isLoggedIn };
})();
