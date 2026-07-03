"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Mail, Lock, User, Check } from "lucide-react";
import { registerUser } from "@/lib/auth-client";
import { ErrorBanner } from "@/components/ui/primitives";

const checklist = [
  "Free to use, no credit card required",
  "Real VirusTotal + Google Safe Browsing checks",
  "Your scan history stays private to your account",
];

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError("Fill in your name and email.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptedTerms) {
      setError("Accept the terms to create your account.");
      return;
    }

    setIsSubmitting(true);
    const result = await registerUser({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    });

    if (!result.ok) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] grid lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center px-12 border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] order-1">
        <div className="max-w-sm space-y-8">
          <div>
            <p className="text-[12px] font-mono uppercase tracking-wide text-[var(--color-accent)] mb-3">Get started</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight">
              Set up in under a minute.
            </h2>
          </div>
          <div className="space-y-4">
            {checklist.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="p-1 rounded bg-[var(--color-accent-soft)] shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[var(--color-accent)]" />
                </div>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 order-2">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-7">
              <ShieldCheck className="w-6 h-6 text-[var(--color-accent)]" strokeWidth={2.25} />
              <span className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">PhishGuard</span>
            </Link>
            <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-1">Create account</h1>
            <p className="text-[13px] text-[var(--color-text-muted)]">Start scanning URLs and emails for threats</p>
          </div>

          <form onSubmit={handleSubmit} className="panel p-7 space-y-3.5">
            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                  className="w-full pl-9 pr-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                  className="w-full pl-9 pr-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="w-full pl-9 pr-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-[var(--color-text-secondary)]">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="w-full pl-9 pr-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-[12px] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
                className="w-3.5 h-3.5 mt-0.5 rounded border border-[var(--color-border-strong)] accent-[var(--color-accent)] cursor-pointer"
              />
              <span className="text-[var(--color-text-muted)]">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-[var(--color-accent)] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-[var(--color-accent)] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && <ErrorBanner message={error} />}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-strong)] text-[#06140F] font-medium rounded transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-[13px]"
            >
              {isSubmitting ? "Creating account..." : "Create account"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-[13px] text-[var(--color-text-muted)]">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--color-accent)] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
