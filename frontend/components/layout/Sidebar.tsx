"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShieldCheck, Mail,
  BarChart3, FileText, Users, Settings,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scanner", href: "/dashboard/scanner", icon: ShieldCheck },
  { name: "Email analysis", href: "/dashboard/email-analysis", icon: Mail },
  { name: "Threat intel", href: "/dashboard/threat-intel", icon: Brain },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="relative z-10 w-60 glass-sm flex flex-col h-screen sticky top-0 rounded-none border-y-0 border-l-0">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-[var(--color-border-subtle)]">
        <ShieldCheck className="w-5 h-5 text-[var(--color-accent-cyan)]" strokeWidth={2.25} />
        <span className="font-semibold text-[15px] tracking-tight gradient-text">PhishGuard</span>
      </div>

      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-smooth text-[13px] font-medium",
                isActive
                  ? "text-[var(--color-accent-strong)] bg-[var(--color-accent-soft)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.05]"
              )}
            >
              <item.icon className="w-[15px] h-[15px]" strokeWidth={2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-cyan)]" />
          OPERATIONAL
        </div>
      </div>
    </aside>
  );
};