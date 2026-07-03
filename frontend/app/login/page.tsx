"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Eye, EyeOff, Mail, Lock, Globe, Brain, FileSearch } from "lucide-react";
import { signInUser } from "@/lib/auth-client";
import { ErrorBanner } from "@/components/ui/primitives";
import { BackgroundOrbs } from "@/components/ui/BackgroundOrbs";
import { ShieldScene } from "@/components/three/ShieldScene";

const sideFeatures = [
  { icon: Globe, text: "VirusTotal + Google Safe Browsing on every URL scan" },
  { icon: Brain, text: "Transparent risk scoring, not a black box" },
  { icon: FileSearch, text: "Full scan history with PDF/CSV export" },
];

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.email.trim() || !formData.password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setIsSubmitting(true);
    const result = await signInUser(formData.email, formData.password);
    if (!result.ok) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)] grid lg:grid-cols-2 overflow-hidden">
      <BackgroundOrbs />
      <div className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-7">
              <ShieldCheck className="w-6 h-6 text-[var(--color-accent-cyan)]" strokeWidth={2.25} />
              <span className="text-lg font-semibold tracking-tight gradient-text">PhishGuard</span>
            </Link>
            <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-1">Sign in</h1>
            <p className="text-[13px] text-[var(--color-text-muted)]">Access your security dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="glass glass-signal p-7 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="you@company.com" autoComplete="email" required
                  className="w-full pl-9 pr-3 py-2.5 glass-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                  placeholder="••••••••" autoComplete="current-password" required
                  className="w-full pl-9 pr-9 py-2.5 glass-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-cyan)] transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {error && <ErrorBanner message={error} />}

            <button type="submit" disabled={isSubmitting} className="w-full py-2.5 gradient-button text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-[13px]">
              {isSubmitting ? "Signing in..." : "Sign in"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-[13px] text-[var(--color-text-muted)]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[var(--color-accent-cyan)] hover:underline font-medium">Create one</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden lg:flex flex-col items-center justify-center px-12 border-l border-[var(--color-border-subtle)] overflow-hidden">
        <div className="absolute inset-0 flex items-start justify-end pt-8 pr-4 opacity-50 pointer-events-none">
          <div className="w-[420px] h-[420px]">
            <ShieldScene />
          </div>
        </div>

        <div className="relative max-w-sm space-y-8">
          <div>
            <p className="text-[12px] font-mono uppercase tracking-wide text-[var(--color-accent-cyan)] mb-3">Why PhishGuard</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight">
              Real threat intelligence, not guesswork.
            </h2>
          </div>
          <div className="space-y-5">
            {sideFeatures.map((f) => (
              <div key={f.text} className="flex items-start gap-3 glass-sm p-3.5">
                <div className="p-2 rounded-lg bg-[var(--color-accent-soft)] shrink-0">
                  <f.icon className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                </div>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed pt-1.5">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}