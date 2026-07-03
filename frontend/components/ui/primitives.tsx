"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTilt } from "@/lib/tilt";
import type { RiskLevelApi } from "@/lib/types";

export const Card = ({
  children,
  className,
  signal = false,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  signal?: boolean;
  hover?: boolean;
}) => (
  <div className={cn("glass", hover && "glass-hover", signal && "glass-signal", "p-6", className)}>
    {children}
  </div>
);

export const CardHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between mb-5">
    <div>
      <h3 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
      {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const riskClassMap: Record<RiskLevelApi, string> = {
  LOW: "risk-low",
  MEDIUM: "risk-medium",
  HIGH: "risk-high",
  CRITICAL: "risk-critical",
};

export const RiskBadge = ({ level }: { level: RiskLevelApi }) => (
  <span className={cn("risk-badge", riskClassMap[level])}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
    {level}
  </span>
);

export const ResultBadge = ({ result }: { result: "SAFE" | "PHISHING" }) => (
  <span className={cn("risk-badge", result === "PHISHING" ? "risk-high" : "risk-low")}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
    {result === "PHISHING" ? "Phishing" : "Safe"}
  </span>
);

export const StatCard = ({
  label,
  value,
  icon: Icon,
  loading = false,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}) => {
  const tilt = useTilt(5);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass glass-hover glass-tilt p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-[var(--color-accent-soft)]">
          <Icon className="w-4 h-4 text-[var(--color-accent-cyan)]" />
        </div>
      </div>
      <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-1.5">{label}</p>
      <p className="text-2xl font-data font-medium text-[var(--color-text-primary)]">
        {loading ? <span className="inline-block h-7 w-16 rounded bg-white/10 animate-pulse" /> : value}
      </p>
    </div>
  );
};

export const EmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-3 rounded-full bg-white/5 mb-4">
      <Icon className="w-5 h-5 text-[var(--color-text-muted)]" />
    </div>
    <p className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</p>
    <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-xs">{description}</p>
  </div>
);

export const ErrorBanner = ({ message }: { message: string }) => (
  <div className="glass-sm glass-signal-danger px-4 py-3 text-sm text-[var(--color-risk-high)] flex items-start gap-2">
    <span className="font-mono text-xs mt-0.5 shrink-0">ERR</span>
    {message}
  </div>
);

export const PrimaryButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "px-4 py-2.5 rounded-lg font-medium text-sm text-white",
      "gradient-button disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
      "flex items-center justify-center gap-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "px-4 py-2.5 rounded-lg font-medium text-sm transition-smooth",
      "glass-sm hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-primary)]",
      "disabled:opacity-40 disabled:cursor-not-allowed",
      "flex items-center justify-center gap-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const ComingSoon = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <div className="glass p-12 flex flex-col items-center text-center">
    <div className="p-4 rounded-full bg-[var(--color-accent-soft)] mb-4">
      <Icon className="w-6 h-6 text-[var(--color-accent-cyan)]" />
    </div>
    <h2 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)] mb-2">{title}</h2>
    <p className="text-sm text-[var(--color-text-muted)] max-w-md">{description}</p>
  </div>
);