"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { hasToken, fetchProfile, subscribeToAuth, getCachedProfile } from "@/lib/auth-client";

/**
 * Gates dashboard routes on the real backend token, not a fake
 * localStorage session. Two checks happen:
 *   1. Synchronous: is there a token at all? No token -> redirect
 *      immediately, no network call needed.
 *   2. Asynchronous: is the token actually valid? Calls GET
 *      /api/v1/users/me — if the backend rejects it (expired,
 *      revoked, malformed), we sign out and redirect, rather than
 *      trusting a token that looks present but doesn't work.
 */
export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authed" | "rejected">(
    () => (hasToken() ? "checking" : "rejected")
  );

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!hasToken()) {
        if (!cancelled) setStatus("rejected");
        return;
      }
      const profile = await fetchProfile();
      if (cancelled) return;
      setStatus(profile ? "authed" : "rejected");
    };

    check();
    const unsubscribe = subscribeToAuth(check);

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (status === "rejected") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status !== "authed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
          <ShieldCheck className="h-5 w-5 text-[var(--color-accent)]" />
          <span className="text-sm">Checking session...</span>
        </div>
      </div>
    );
  }

  return children;
};

export { getCachedProfile };
