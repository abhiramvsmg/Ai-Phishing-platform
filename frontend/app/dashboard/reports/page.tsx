"use client";

import React, { useEffect, useState } from "react";
import { FileText, Download, Loader2, Plus, FolderOpen } from "lucide-react";
import { api } from "@/lib/api";
import { Report, ScanResult } from "@/lib/types";
import { EmptyState, ErrorBanner, SecondaryButton, PrimaryButton } from "@/components/ui/primitives";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[] | null>(null);
  const [generatingFor, setGeneratingFor] = useState<number | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReports = () =>
    api.reports.list().then(setReports).catch((err) => setError(err.message ?? "Failed to load reports"));

  useEffect(() => {
    loadReports();
    api.scans.list().then((scans) => setRecentScans(scans.slice(0, 10))).catch(() => setRecentScans([]));
  }, []);

  const handleGenerate = async (scanId: number) => {
    setGeneratingFor(scanId);
    setError(null);
    try {
      await api.reports.generate(scanId);
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate report");
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleExport = async (reportId: number, format: "pdf" | "csv") => {
    const key = `${reportId}-${format}`;
    setExportingId(key);
    setError(null);
    try {
      if (format === "pdf") await api.reports.exportPdf(reportId);
      else await api.reports.exportCsv(reportId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExportingId(null);
    }
  };

  const reportedScanIds = new Set(reports?.map((r) => r.scan_id));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Reports</h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">
            Generate a report from any scan, then export it as PDF or CSV
          </p>
        </div>
        <div className="panel-sm px-4 py-2 flex items-center gap-2.5">
          <FolderOpen className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <span className="text-[12px] font-mono text-[var(--color-text-secondary)]">
            {reports?.length ?? 0} report{reports?.length !== 1 ? "s" : ""} generated
          </span>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="panel p-6">
        <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">Your reports</h2>

        {reports === null ? (
          <p className="text-[13px] text-[var(--color-text-muted)]">Loading...</p>
        ) : reports.length === 0 ? (
          <EmptyState icon={FileText} title="No reports yet" description="Generate one from a recent scan below." />
        ) : (
          <div className="space-y-1">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 rounded hover:bg-white/[0.03] transition-smooth gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--color-text-primary)]">
                    Report <span className="font-data">#{report.id}</span> &middot; Scan <span className="font-data">#{report.scan_id}</span>
                  </p>
                  <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <SecondaryButton onClick={() => handleExport(report.id, "pdf")} disabled={exportingId === `${report.id}-pdf`} className="px-3 py-1.5">
                    {exportingId === `${report.id}-pdf` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    PDF
                  </SecondaryButton>
                  <SecondaryButton onClick={() => handleExport(report.id, "csv")} disabled={exportingId === `${report.id}-csv`} className="px-3 py-1.5">
                    {exportingId === `${report.id}-csv` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    CSV
                  </SecondaryButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel p-6">
        <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">Generate from a recent scan</h2>

        {recentScans === null ? (
          <p className="text-[13px] text-[var(--color-text-muted)]">Loading...</p>
        ) : recentScans.length === 0 ? (
          <EmptyState icon={FileText} title="No scans yet" description="Run a scan first, then come back here to generate a report." />
        ) : (
          <div className="space-y-1">
            {recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-3 rounded hover:bg-white/[0.03] transition-smooth gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">{scan.content}</p>
                  <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">{scan.scan_type} &middot; {scan.result}</p>
                </div>
                {reportedScanIds.has(scan.id) ? (
                  <span className="text-[12px] text-[var(--color-text-muted)] shrink-0 font-mono">exists</span>
                ) : (
                  <PrimaryButton onClick={() => handleGenerate(scan.id)} disabled={generatingFor === scan.id} className="px-3 py-1.5 shrink-0">
                    {generatingFor === scan.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Generate
                  </PrimaryButton>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
