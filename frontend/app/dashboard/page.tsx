"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield, AlertTriangle, ScanLine, ArrowRight, Mail, FileText, Brain, Globe,
} from "lucide-react";
import { api } from "@/lib/api";
import { ScanResult } from "@/lib/types";
import { fetchProfile, AuthUser } from "@/lib/auth-client";
import { StatCard, RiskBadge, EmptyState, ErrorBanner } from "@/components/ui/primitives";

const quickActions = [
  { href: "/dashboard/scanner", icon: Globe, label: "Scan a URL" },
  { href: "/dashboard/email-analysis", icon: Mail, label: "Analyze email" },
  { href: "/dashboard/threat-intel", icon: Brain, label: "View threats" },
  { href: "/dashboard/reports", icon: FileText, label: "Generate report" },
];

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  URL: Globe,
  EMAIL: Mail,
  TEXT: FileText,
};

export default function Dashboard() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<{ total: number; safe: number; phishing: number; highRisk: number } | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile().then(setProfile);

    api.dashboard
      .stats()
      .then((s) =>
        setStats({
          total: s.total_scans,
          safe: s.safe_scans,
          phishing: s.phishing_scans,
          highRisk: s.high_risk_scans,
        })
      )
      .catch((err) => setError(err.message ?? "Failed to load stats"));

    api.dashboard.recentScans().then(setRecentScans).catch((err) => setError(err.message ?? "Failed to load recent scans"));
  }, []);

  const firstName = profile?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            {firstName ? `Welcome back, ${firstName}` : "Dashboard"}
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">Your scan activity at a glance</p>
        </div>
        <Link
          href="/dashboard/scanner"
          className="flex items-center gap-2 px-4 py-2 rounded text-[13px] font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-strong)] text-[#06140F] transition-smooth"
        >
          New scan <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {error && <ErrorBanner message={`${error} — log in first, or check the backend is running.`} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard label="Total scans" value={stats?.total ?? 0} icon={ScanLine} loading={!stats && !error} />
        <StatCard label="Marked safe" value={stats?.safe ?? 0} icon={Shield} loading={!stats && !error} />
        <StatCard label="Phishing detected" value={stats?.phishing ?? 0} icon={AlertTriangle} loading={!stats && !error} />
        <StatCard label="High risk" value={stats?.highRisk ?? 0} icon={AlertTriangle} loading={!stats && !error} />
      </div>

      <div>
        <h2 className="text-[12px] uppercase tracking-wide font-mono text-[var(--color-text-muted)] mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="panel p-4 flex flex-col items-center gap-2 text-center hover:bg-[var(--color-bg-card-hover)] transition-smooth"
            >
              <action.icon className="w-4.5 h-4.5 text-[var(--color-accent)]" />
              <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">Recent scans</h2>
          <Link href="/dashboard/scanner" className="text-[12px] font-mono text-[var(--color-accent)] hover:underline">
            view all
          </Link>
        </div>

        {recentScans === null && !error ? (
          <p className="text-[13px] text-[var(--color-text-muted)]">Loading...</p>
        ) : recentScans && recentScans.length === 0 ? (
          <EmptyState icon={ScanLine} title="No scans yet" description="Run a scan to see your activity show up here." />
        ) : (
          <div className="space-y-1">
            {recentScans?.slice(0, 8).map((scan) => {
              const Icon = TYPE_ICON[scan.scan_type] ?? ScanLine;
              return (
                <div key={scan.id} className="flex items-center gap-3 p-3 rounded hover:bg-white/[0.03] transition-smooth">
                  <div className="p-1.5 rounded bg-white/[0.03] shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">{scan.content}</p>
                    <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
                      {new Date(scan.created_at).toLocaleString()}
                    </p>
                  </div>
                  <RiskBadge level={scan.risk_level} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
