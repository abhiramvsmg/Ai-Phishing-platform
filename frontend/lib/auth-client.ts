import { api, tokenStore } from "@/lib/api";

/**
 * Single source of truth for "is anyone logged in": the real JWT in
 * tokenStore. There used to be a second, parallel fake session in
 * localStorage (sentinel.session / sentinel.users) that AuthGate and
 * Navbar read instead of the real token — meaning the dashboard could
 * show as "logged in" even when the real token was missing, expired,
 * or never issued. That system has been removed entirely. If you're
 * looking for it, don't rebuild it — read the token instead.
 */

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const AUTH_EVENT = "auth-change";
const PROFILE_CACHE_KEY = "auth_profile_cache";

let cachedProfile: AuthUser | null = null;
let cachedProfileRaw: string | null = null;
let inFlightProfileFetch: Promise<AuthUser | null> | null = null;

const canUseStorage = () =>
  typeof window !== "undefined" && Boolean(window.sessionStorage);

const notifyAuthChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
};

/**
 * Cheap synchronous check for whether a token exists at all. This is
 * what AuthGate uses to decide instantly (no network round trip)
 * whether to even attempt rendering the dashboard — a real profile
 * fetch still happens after, to catch an expired/invalid token.
 */
export const hasToken = (): boolean => {
  return tokenStore.get() !== null;
};

/**
 * Returns the last-known profile synchronously, reading from a small
 * sessionStorage cache (so a page refresh doesn't show a loading
 * flicker before the network call resolves). This is a cache of real
 * backend data, not a substitute for it — fetchProfile() below is
 * what actually validates the token against the server.
 */
export const getCachedProfile = (): AuthUser | null => {
  if (!canUseStorage()) return cachedProfile;

  const raw = window.sessionStorage.getItem(PROFILE_CACHE_KEY);
  if (raw === cachedProfileRaw) return cachedProfile;

  if (!raw) {
    cachedProfile = null;
    cachedProfileRaw = null;
    return null;
  }

  try {
    cachedProfile = JSON.parse(raw) as AuthUser;
    cachedProfileRaw = raw;
    return cachedProfile;
  } catch {
    return null;
  }
};

const setCachedProfile = (profile: AuthUser | null) => {
  cachedProfile = profile;
  cachedProfileRaw = profile ? JSON.stringify(profile) : null;

  if (canUseStorage()) {
    if (profile) {
      window.sessionStorage.setItem(PROFILE_CACHE_KEY, cachedProfileRaw!);
    } else {
      window.sessionStorage.removeItem(PROFILE_CACHE_KEY);
    }
  }
};

/**
 * Validates the current token against the real backend and returns
 * the actual logged-in user, or null if there's no token or it's
 * rejected. Deduplicates concurrent calls (e.g. AuthGate and Navbar
 * both mounting at once) into a single network request.
 */
export const fetchProfile = async (): Promise<AuthUser | null> => {
  if (!hasToken()) {
    setCachedProfile(null);
    return null;
  }

  if (inFlightProfileFetch) {
    return inFlightProfileFetch;
  }

  inFlightProfileFetch = (async () => {
    try {
      const profile = await api.users.me();
      setCachedProfile(profile);
      return profile;
    } catch {
      // Token was rejected (expired, malformed, revoked) — clear
      // everything so the UI doesn't show a stale logged-in state.
      tokenStore.clear();
      setCachedProfile(null);
      return null;
    } finally {
      inFlightProfileFetch = null;
    }
  })();

  return inFlightProfileFetch;
};

export const registerUser = async (details: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const email = details.email.trim().toLowerCase();

  try {
    await api.auth.register({
      name: details.fullName.trim(),
      email,
      password: details.password,
    });
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Could not create account.",
    };
  }

  try {
    await api.auth.login({ email, password: details.password });
  } catch (err) {
    // Registered successfully but auto-login failed — tell the
    // person plainly rather than silently faking a logged-in state.
    return {
      ok: false,
      message:
        "Account created, but automatic sign-in failed. Please log in.",
    };
  }

  await fetchProfile();
  notifyAuthChange();

  return { ok: true, message: "Account created." };
};

export const signInUser = async (email: string, password: string) => {
  try {
    await api.auth.login({ email: email.trim().toLowerCase(), password });
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Email or password is incorrect.",
    };
  }

  await fetchProfile();
  notifyAuthChange();

  return { ok: true, message: "Signed in." };
};

export const signOutUser = () => {
  tokenStore.clear();
  setCachedProfile(null);
  notifyAuthChange();
};

export const subscribeToAuth = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(AUTH_EVENT, onStoreChange);
  return () => window.removeEventListener(AUTH_EVENT, onStoreChange);
};
