"use client";

import React, { useEffect, useState } from "react";
import { User, Lock, Loader2, Check, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { fetchProfile, AuthUser } from "@/lib/auth-client";
import { ErrorBanner, PrimaryButton } from "@/components/ui/primitives";

export default function SettingsPage() {
  const [profile, setProfile] = useState<AuthUser | null>(null);

  const [name, setName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile().then((p) => {
      setProfile(p);
      if (p) setName(p.name);
    });
  }, []);

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setNameSaved(false);
    if (!name.trim()) {
      setNameError("Name can't be empty.");
      return;
    }
    setNameSaving(true);
    try {
      const updated = await api.users.updateName(name.trim());
      setProfile((prev) => (prev ? { ...prev, name: updated.name } : prev));
      setNameSaved(true);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Could not update name");
    } finally {
      setNameSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSaved(false);
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwSaving(true);
    try {
      await api.users.changePassword(currentPassword, newPassword);
      setPwSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">Manage your account details</p>
      </div>

      <div className="panel-signal p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
          <span className="text-base font-medium text-[var(--color-accent)]">
            {profile?.name?.charAt(0).toUpperCase() ?? <User className="w-5 h-5" />}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-medium text-[var(--color-text-primary)]">{profile?.name ?? "..."}</p>
          <p className="text-[12px] font-mono text-[var(--color-text-muted)]">{profile?.email ?? ""}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-accent)]">
          <Shield className="w-3.5 h-3.5" />
          {profile?.role ?? "USER"}
        </div>
      </div>

      <form onSubmit={handleNameSave} className="panel p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">Profile</h2>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Email</label>
          <input type="email" value={profile?.email ?? ""} disabled className="w-full px-3 py-2.5 panel-sm text-[13px] font-data opacity-50 cursor-not-allowed" />
          <p className="text-[11px] text-[var(--color-text-muted)]">Email can't be changed.</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]"
          />
        </div>

        {nameError && <ErrorBanner message={nameError} />}

        <div className="flex items-center gap-3">
          <PrimaryButton type="submit" disabled={nameSaving}>
            {nameSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save changes"}
          </PrimaryButton>
          {nameSaved && (
            <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-accent)] font-mono">
              <Check className="w-3.5 h-3.5" /> saved
            </span>
          )}
        </div>
      </form>

      <form onSubmit={handlePasswordSave} className="panel p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">Password</h2>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Current password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" required
            className="w-full px-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">New password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" minLength={8} required
            className="w-full px-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Confirm new password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" minLength={8} required
            className="w-full px-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]" />
        </div>

        {pwError && <ErrorBanner message={pwError} />}

        <div className="flex items-center gap-3">
          <PrimaryButton type="submit" disabled={pwSaving}>
            {pwSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Update password"}
          </PrimaryButton>
          {pwSaved && (
            <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-accent)] font-mono">
              <Check className="w-3.5 h-3.5" /> updated
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
