"use client";

import React, { useEffect, useState } from "react";
import { Brain, Globe, Mail, FileText, ShieldAlert, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { ScanResult, ScanTypeApi } from "@/lib/types";
import { RiskBadge, EmptyState, ErrorBanner } from "@/components/ui/primitives";

const TYPE_ICON: Record<ScanTypeApi, React.ComponentType<{ className?: string }>> = {
  URL: Globe,
  EMAIL: Mail,
  TEXT: FileText,
};

export default function ThreatIntelPage() {
  const [flagged, setFlagged] = useState<ScanResult[] | null>(null);
  const [allScans, setAllScans] = useState<ScanResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.scans.flagged().then(setFlagged).catch((err) => setError(err.message ?? "Failed to load threat data"));
    api.scans.list().then(setAllScans).catch(() => setAllScans([]));
  }, []);

  const byType = flagged?.reduce<Record<string, number>>((acc, scan) => {
    acc[scan.scan_type] = (acc[scan.scan_type] ?? 0) + 1;
    return acc;
  }, {});

  const detectionRate =
    allScans && allScans.length > 0 && flagged
      ? Math.round((flagged.length / allScans.length) * 100)
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Threat intel</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">Every scan from your account flagged as phishing</p>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="panel-signal-danger p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 rounded bg-[var(--color-risk-high)]/10">
              <ShieldAlert className="w-4 h-4 text-[var(--color-risk-high)]" />
            </div>
          </div>
          <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-1.5">Total threats</p>
          <p className="text-2xl font-data font-medium text-[var(--color-text-primary)]">{flagged?.length ?? "—"}</p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 rounded bg-[var(--color-accent-soft)]">
              <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" />
            </div>
          </div>
          <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-1.5">Detection rate</p>
          <p className="text-2xl font-data font-medium text-[var(--color-text-primary)]">
            {detectionRate !== null ? `${detectionRate}%` : "—"}
          </p>
        </div>

        {byType && Object.entries(byType).map(([type, count]) => {
          const Icon = TYPE_ICON[type as ScanTypeApi] ?? ShieldAlert;
          return (
            <div key={type} className="panel p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-1.5 rounded bg-white/[0.03]">
                  <Icon className="w-4 h-4 text-[var(--color-text-muted)]" />
                </div>
              </div>
              <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-1.5">{type}</p>
              <p className="text-2xl font-data font-medium text-[var(--color-text-primary)]">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="panel p-6">
        <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">Flagged scans</h2>

        {flagged === null && !error ? (
          <p className="text-[13px] text-[var(--color-text-muted)]">Loading...</p>
        ) : flagged && flagged.length === 0 ? (
          <EmptyState icon={Brain} title="No threats detected yet" description="When a scan comes back as phishing, it will show up here." />
        ) : (
          <div className="space-y-1">
            {flagged?.map((scan) => {
              const Icon = TYPE_ICON[scan.scan_type] ?? ShieldAlert;
              return (
                <div key={scan.id} className="flex items-center gap-4 p-3 rounded hover:bg-white/[0.03] transition-smooth">
                  <div className="p-1.5 rounded bg-[var(--color-risk-high)]/10 shrink-0">
                    <Icon className="w-4 h-4 text-[var(--color-risk-high)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">{scan.content}</p>
                    <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">{new Date(scan.created_at).toLocaleString()}</p>
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
