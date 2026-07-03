"use client";

import React, { useEffect, useState } from "react";
import { Search, Loader2, AlertTriangle, Globe, Check, Mail, FileText, History } from "lucide-react";
import { api } from "@/lib/api";
import { ScanResult } from "@/lib/types";
import { ResultBadge, RiskBadge, ErrorBanner, PrimaryButton, EmptyState } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type ScanMode = "url" | "email" | "text";

const modes: { id: ScanMode; label: string; icon: React.ComponentType<{ className?: string }>; placeholder: string }[] = [
  { id: "url", label: "URL", icon: Globe, placeholder: "https://example.com" },
  { id: "email", label: "Email", icon: Mail, placeholder: "Paste the full email content here..." },
  { id: "text", label: "Text", icon: FileText, placeholder: "Paste any suspicious text here..." },
];

const sampleUrls = [
  "https://google.com",
  "http://verify-login-bank-secure.xyz",
];

export default function ScannerPage() {
  const [mode, setMode] = useState<ScanMode>("url");
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanResult[] | null>(null);

  const activeMode = modes.find((m) => m.id === mode)!;

  const loadHistory = () => api.scans.list().then((scans) => setHistory(scans.slice(0, 6))).catch(() => setHistory([]));

  useEffect(() => {
    loadHistory();
  }, []);

  const startScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setScanning(true);
    setError(null);
    setResult(null);

    try {
      let scan: ScanResult;
      if (mode === "url") scan = await api.scans.scanUrl({ url: input });
      else if (mode === "email") scan = await api.scans.scanEmail({ email_text: input });
      else scan = await api.scans.scanText({ text: input });

      setResult(scan);
      setHistory((prev) => (prev ? [scan, ...prev].slice(0, 6) : [scan]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed. Are you logged in?");
    } finally {
      setScanning(false);
    }
  };

  const switchMode = (next: ScanMode) => {
    setMode(next);
    setResult(null);
    setError(null);
    setInput("");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Scanner</h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">
            Check a URL, email, or block of text for phishing indicators
          </p>
        </div>

        <div className="flex gap-1.5">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded text-[13px] font-medium transition-smooth",
                mode === m.id
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.03]"
              )}
            >
              <m.icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={startScan} className="panel p-6 space-y-4">
          {mode === "url" ? (
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
              <input
                type="url"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeMode.placeholder}
                disabled={scanning}
                className="w-full pl-10 pr-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px] font-data"
              />
            </div>
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeMode.placeholder}
              disabled={scanning}
              rows={6}
              className="w-full p-4 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px] font-data resize-none"
            />
          )}

          {mode === "url" && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-[var(--color-text-muted)]">try:</span>
              {sampleUrls.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setInput(url)}
                  className="text-[11px] font-data px-2 py-1 rounded panel-sm hover:bg-[var(--color-bg-card-hover)] transition-smooth text-[var(--color-text-secondary)]"
                >
                  {url}
                </button>
              ))}
            </div>
          )}

          <PrimaryButton type="submit" disabled={scanning || !input.trim()} className="w-full">
            {scanning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" /> Scan {activeMode.label.toLowerCase()}
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
                analyzing target...
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
                      {result.result === "PHISHING" ? "Phishing detected" : "No threats found"}
                    </p>
                    <ResultBadge result={result.result} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[var(--color-text-secondary)]">Risk score</span>
                    <span className="font-data text-[var(--color-text-primary)]">{result.risk_score}/100</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", result.result === "PHISHING" ? "bg-[var(--color-risk-high)]" : "bg-[var(--color-risk-low)]")}
                      style={{ width: `${result.risk_score}%` }}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>

      <div className="panel p-5 h-fit">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <h2 className="text-[13px] font-semibold tracking-tight text-[var(--color-text-primary)]">Recent scans</h2>
        </div>

        {history === null ? (
          <p className="text-[12px] text-[var(--color-text-muted)]">Loading...</p>
        ) : history.length === 0 ? (
          <EmptyState icon={History} title="No scans yet" description="Your scan history will show up here." />
        ) : (
          <div className="space-y-1">
            {history.map((scan) => (
              <div key={scan.id} className="p-2.5 rounded hover:bg-white/[0.03] transition-smooth">
                <p className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">{scan.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                    {new Date(scan.created_at).toLocaleDateString()}
                  </span>
                  <RiskBadge level={scan.risk_level} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
