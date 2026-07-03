"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck, ArrowRight, Brain, Lock, Zap, Globe, FileSearch, Mail,
  Network, Database, KeyRound, GitBranch,
} from "lucide-react";
import { BackgroundOrbs } from "@/components/ui/BackgroundOrbs";
import { ShieldScene } from "@/components/three/ShieldScene";
import { useTilt } from "@/lib/tilt";

const features = [
  { icon: Globe, title: "URL scanning", description: "Checks links against VirusTotal and Google Safe Browsing in parallel, combined with pattern analysis of the URL itself.", detail: "70+ AV engines + Google's threat list" },
  { icon: Mail, title: "Email analysis", description: "Scans email content for phishing language, urgency tactics, fake login requests, and suspicious link patterns.", detail: "Keyword + heuristic scoring" },
  { icon: Brain, title: "Risk scoring", description: "Every scan gets a 0-100 risk score and a clear level, backed by the exact signals that produced it.", detail: "Transparent, not a black box" },
  { icon: FileSearch, title: "Scan history & reports", description: "Every scan is saved automatically. Generate a formal report from any scan and export it as PDF or CSV.", detail: "Full audit trail" },
  { icon: Network, title: "Team workspaces", description: "Group your team together by adding existing accounts by email. Each person's scan history stays private.", detail: "Privacy-first grouping" },
  { icon: Lock, title: "Account security", description: "JWT-based authentication with hashed passwords. Your scan history is never visible to anyone outside your account.", detail: "Industry-standard auth" },
];

const steps = [
  { number: "01", title: "Submit a URL, email, or text", description: "Paste what you want checked into the scanner. No installation, no browser extension." },
  { number: "02", title: "Real threat intelligence runs in parallel", description: "VirusTotal and Google Safe Browsing are queried simultaneously, combined with keyword heuristics." },
  { number: "03", title: "Get a transparent verdict", description: "A risk score, a level, and the specific signals behind it — saved to your history automatically." },
];

const techStack = [
  { icon: GitBranch, label: "FastAPI backend" },
  { icon: Database, label: "PostgreSQL / SQLite" },
  { icon: KeyRound, label: "JWT authentication" },
  { icon: Network, label: "VirusTotal API" },
  { icon: ShieldCheck, label: "Google Safe Browsing" },
  { icon: Zap, label: "Next.js frontend" },
];

const sampleUrl = "http://verify-login-bank-secure.xyz";

function HeroScanDemo() {
  const [phase, setPhase] = useState<"scanning" | "result">("scanning");
  const tilt = useTilt(4);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("result"), 1800);
    const interval = setInterval(() => {
      setPhase("scanning");
      setTimeout(() => setPhase("result"), 1800);
    }, 5000);
    return () => {
      clearTimeout(t1);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="relative glass glass-hover glass-tilt glass-signal-danger p-5 max-w-md mx-auto overflow-hidden"
    >
      {phase === "scanning" && <div className="scan-line" />}
      <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] mb-2 font-mono">Sample scan</p>
      <p className="font-data text-sm text-[var(--color-text-primary)] mb-4 break-all">{sampleUrl}</p>
      {phase === "scanning" ? (
        <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-cyan)] animate-pulse" />
          analyzing...
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="risk-badge risk-high"><span className="w-1.5 h-1.5 rounded-full bg-current" />Phishing</span>
          <span className="font-data text-sm text-[var(--color-risk-high)]">risk 90/100</span>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ feature }: { feature: typeof features[number] }) {
  const tilt = useTilt(4);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass glass-hover glass-tilt glass-signal p-6"
    >
      <div className="mb-4 inline-flex p-2.5 bg-[var(--color-accent-soft)] rounded-lg">
        <feature.icon className="w-4.5 h-4.5 text-[var(--color-accent-cyan)]" />
      </div>
      <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1.5">{feature.title}</h3>
      <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed mb-3">{feature.description}</p>
      <p className="text-[11px] font-mono text-[var(--color-accent-cyan)]">{feature.detail}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)] overflow-hidden">
      <BackgroundOrbs />

      <div className="relative z-10">
        <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <div className="text-[15px] font-semibold tracking-tight flex items-center gap-2 text-[var(--color-text-primary)]">
            <ShieldCheck className="w-5 h-5 text-[var(--color-accent-cyan)]" strokeWidth={2.25} />
            PhishGuard
          </div>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="hidden sm:inline text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              Terms
            </Link>
            <Link href="/login" className="px-4 py-2 glass-sm hover:bg-[var(--color-bg-card-hover)] transition-smooth text-[13px] font-medium text-[var(--color-text-primary)]">
              Sign in
            </Link>
          </div>
        </nav>

        <section className="relative px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-soft)] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-cyan)] animate-pulse" />
                <span className="text-[12px] font-mono text-[var(--color-accent-cyan)]">Live backend — not a mockup</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-[var(--color-text-primary)] mb-5">
                Check URLs and emails<br />
                <span className="gradient-text">before they reach you</span>
              </h1>

              <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-md mx-auto lg:mx-0 mb-8">
                Real threat-intelligence APIs combined with pattern-based analysis — a phishing
                detection platform built as a security internship project, with every feature
                wired to a working backend.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/register" className="px-6 py-3 gradient-button text-white font-medium rounded-lg flex items-center justify-center gap-2 text-[14px]">
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="px-6 py-3 glass-sm font-medium rounded-lg hover:bg-[var(--color-bg-card-hover)] transition-smooth text-[var(--color-text-primary)] text-[14px]">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="relative h-[420px] md:h-[480px]">
              <ShieldScene />
            </div>
          </div>

          <div className="mt-4">
            <HeroScanDemo />
          </div>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 py-8 border-t border-[var(--color-border-subtle)]">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-8">
            {techStack.map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <t.icon className="w-4 h-4" />
                <span className="text-[12px] font-mono">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-[12px] font-mono uppercase tracking-wide text-[var(--color-accent-cyan)] mb-3">How it works</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
              From submission to verdict in seconds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="glass glass-hover p-6">
                <p className="font-data text-3xl gradient-text mb-4">{step.number}</p>
                <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">{step.title}</h3>
                <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-[12px] font-mono uppercase tracking-wide text-[var(--color-accent-cyan)] mb-3">Features</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-3">
              Everything connects to a real backend
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm max-w-xl mx-auto">
              Nothing below is a mockup — every card here is a working feature you can use today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <section className="relative max-w-2xl mx-auto px-6 py-20">
          <div className="glass glass-hover p-10 md:p-12 text-center">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-2">
              Try it yourself
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mb-7 max-w-md mx-auto">
              Create an account and scan your first URL or email in under a minute. No credit card, no install.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 gradient-button text-white font-medium rounded-lg text-[14px]">
              Create account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-[var(--color-border-subtle)] mt-8 py-10 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <ShieldCheck className="w-4 h-4 text-[var(--color-accent-cyan)]" />
              <span className="text-[13px] font-medium">PhishGuard</span>
            </div>
            <div className="flex items-center gap-6 text-[12px] text-[var(--color-text-muted)]">
              <Link href="/terms" className="hover:text-[var(--color-text-primary)] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[var(--color-text-primary)] transition-colors">Privacy</Link>
              <span>AI Phishing Detection Platform</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}