"use client";

import { Search, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCachedProfile,
  fetchProfile,
  signOutUser,
  subscribeToAuth,
  AuthUser,
} from "@/lib/auth-client";

export const Navbar = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<AuthUser | null>(() => getCachedProfile());

  useEffect(() => {
    fetchProfile().then(setProfile);
    return subscribeToAuth(() => setProfile(getCachedProfile()));
  }, []);

  const handleLogout = () => {
    signOutUser();
    router.push("/login");
  };

  return (
    <header className="relative z-10 h-16 glass-sm rounded-none border-x-0 border-t-0 sticky top-0 flex items-center justify-between px-6">
      <div className="flex-1 max-w-sm">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search scans, reports..."
            className="w-full glass-sm px-3 py-2 pl-9 text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <div className="w-px h-6 bg-[var(--color-border-subtle)]" />

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-medium text-[var(--color-text-primary)] leading-tight">
              {profile?.name ?? "..."}
            </p>
            <p className="text-[11px] font-mono text-[var(--color-text-muted)]">{profile?.email ?? ""}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-cyan)] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-risk-high)] transition-colors"
          aria-label="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};