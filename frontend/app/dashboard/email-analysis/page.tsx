"use client";

import React, { useEffect, useState } from "react";
import { Mail, Loader2, AlertTriangle, Check, Search, History, ShieldAlert } from "lucide-react";
import { api } from "@/lib/api";
import { ScanResult } from "@/lib/types";
import { ResultBadge, ErrorBanner, PrimaryButton, EmptyState, RiskBadge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const indicatorChecks = [
  "Urgency language (\"act now\", \"account suspended\")",
  "Requests for passwords or account details",
  "Mismatched or suspicious sender domains",
  "Generic greetings instead of your real name",
  "Unexpected attachments or links",
];

export default function EmailAnalysisPage() {
  const [emailText, setEmailText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanResult[] | null>(null);

  useEffect(() => {
    api.scans.list().then((scans) => setHistory(scans.filter((s) => s.scan_type === "EMAIL"))).catch(() => setHistory([]));
  }, []);

  const runAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) return;

    setScanning(true);
    setError(null);
    setResult(null);

    try {
      const scan = await api.scans.scanEmail({ email_text: emailText });
      setResult(scan);
      setHistory((prev) => (prev ? [scan, ...prev] : [scan]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Are you logged in?");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Email analysis</h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">
            Paste an email's content to check for phishing language and suspicious patterns
          </p>
        </div>

        <form onSubmit={runAnalysis} className="panel p-6 space-y-4">
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste the email subject and body here..."
            disabled={scanning}
            rows={8}
            className="w-full p-4 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px] font-data resize-none"
          />
          <PrimaryButton type="submit" disabled={scanning || !emailText.trim()} className="w-full">
            {scanning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" /> Analyze email
              </>
            )}
          </PrimaryButton>
        </form>

        {error && <ErrorBanner message={error} />}

        {(scanning || result) && (
          <div className={cn("relative overflow-hidden", result?.result === "PHISHING" ? "panel-signal-danger" : "panel-signal", "p-6")}>
            {scanning && <div className="scan-line" />}
            {scanning ? (
              <div className="flex items-center gap-2.5 text-[13px] font-mono text-[var(--color-text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                analyzing content...
              </div>
            ) : result ? (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className={cn("p-2 rounded", result.result === "PHISHING" ? "bg-[var(--color-risk-high)]/10" : "bg-[var(--color-risk-low)]/10")}>
                    {result.result === "PHISHING" ? (
                      <AlertTriangle className="w-5 h-5 text-[var(--color-risk-high)]" />
                    ) : (
                      <Check className="w-5 h-5 text-[var(--color-risk-low)]" />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                      {result.result === "PHISHING" ? "Phishing indicators found" : "No phishing indicators found"}
                    </p>
                    <ResultBadge result={result.result} />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[var(--color-text-secondary)]">Risk score</span>
                  <span className="font-data text-[var(--color-text-primary)]">{result.risk_score}/100</span>
                </div>
              </>
            ) : null}
          </div>
        )}

        <div className="panel p-6">
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">Analysis history</h2>
          {history === null ? (
            <p className="text-[13px] text-[var(--color-text-muted)]">Loading...</p>
          ) : history.length === 0 ? (
            <EmptyState icon={Mail} title="No emails analyzed yet" description="Paste an email above to see it appear here." />
          ) : (
            <div className="space-y-1">
              {history.slice(0, 10).map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 rounded hover:bg-white/[0.03] transition-smooth">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">{scan.content}</p>
                    <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
                      {new Date(scan.created_at).toLocaleString()}
                    </p>
                  </div>
                  <RiskBadge level={scan.risk_level} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <h2 className="text-[13px] font-semibold tracking-tight text-[var(--color-text-primary)]">What we check for</h2>
          </div>
          <ul className="space-y-2.5">
            {indicatorChecks.map((check) => (
              <li key={check} className="text-[12px] text-[var(--color-text-secondary)] flex items-start gap-2 leading-relaxed">
                <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
                {check}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <h2 className="text-[13px] font-semibold tracking-tight text-[var(--color-text-primary)]">Stats</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-[var(--color-text-muted)]">Total analyzed</span>
              <span className="font-data text-[var(--color-text-primary)]">{history?.length ?? "—"}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[var(--color-text-muted)]">Flagged</span>
              <span className="font-data text-[var(--color-risk-high)]">
                {history?.filter((s) => s.result === "PHISHING").length ?? "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
