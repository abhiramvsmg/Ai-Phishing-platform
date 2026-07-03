"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { api } from "@/lib/api";
import { RiskDistribution, MonthlyScanPoint } from "@/lib/types";
import { ErrorBanner, EmptyState } from "@/components/ui/primitives";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const RISK_COLORS: Record<keyof RiskDistribution, string> = {
  LOW: "#00E5A0",
  MEDIUM: "#F5B544",
  HIGH: "#FF8A65",
  CRITICAL: "#FF5C5C",
};

export default function AnalyticsPage() {
  const [riskDist, setRiskDist] = useState<RiskDistribution | null>(null);
  const [monthly, setMonthly] = useState<MonthlyScanPoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.dashboard.riskDistribution().then(setRiskDist).catch((err) => setError(err.message));
    api.dashboard.monthlyScans().then(setMonthly).catch((err) => setError(err.message));
  }, []);

  const totalScans = riskDist ? riskDist.LOW + riskDist.MEDIUM + riskDist.HIGH + riskDist.CRITICAL : 0;

  const pieData = riskDist
    ? (Object.keys(riskDist) as (keyof RiskDistribution)[]).map((key) => ({ name: key, value: riskDist[key] })).filter((d) => d.value > 0)
    : [];

  const barData = monthly?.map((m) => ({ month: MONTH_LABELS[m.month - 1], scans: m.count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Analytics</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">Risk breakdown and scan volume over time</p>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-6">
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">Risk distribution</h2>

          {riskDist === null && !error ? (
            <p className="text-[13px] text-[var(--color-text-muted)]">Loading...</p>
          ) : totalScans === 0 ? (
            <EmptyState icon={BarChart3} title="No scans yet" description="Run some scans to see your risk distribution here." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend formatter={(value) => <span style={{ color: "var(--color-text-secondary)", fontSize: 12, fontFamily: "var(--font-mono)" }}>{value}</span>} />
                <Tooltip contentStyle={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-default)", borderRadius: 6, fontSize: 12, fontFamily: "var(--font-mono)" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="panel p-6">
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)] mb-4">Scans by month</h2>

          {monthly === null && !error ? (
            <p className="text-[13px] text-[var(--color-text-muted)]">Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={11} fontFamily="var(--font-mono)" />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} fontFamily="var(--font-mono)" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-default)", borderRadius: 6, fontSize: 12, fontFamily: "var(--font-mono)" }} />
                <Bar dataKey="scans" fill="var(--color-accent)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
