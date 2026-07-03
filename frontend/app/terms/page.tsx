import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <ShieldCheck className="w-6 h-6 text-[var(--color-accent)]" strokeWidth={2.25} />
          <span className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">PhishGuard</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-2">
          Terms of Service
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mb-8">Last updated June 2026</p>

        <div className="panel p-7 space-y-6 text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">1. What this platform is</h2>
            <p>
              PhishGuard is a phishing detection tool that scans URLs, emails, and text you submit and
              returns a risk assessment. It combines results from VirusTotal, Google Safe Browsing, and
              pattern-based analysis. It is provided as a security project and educational tool, not as a
              guaranteed or certified security product.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">2. Your account</h2>
            <p>
              You're responsible for keeping your password secure and for any activity under your account.
              You must provide a real, working email address to register.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">3. Acceptable use</h2>
            <p>
              Don't submit content you don't have the right to analyze, don't use the platform to build a
              competing detection service, and don't attempt to overload or abuse the scanning endpoints.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">4. No guarantee of accuracy</h2>
            <p>
              Risk scores are produced by combining third-party threat intelligence with pattern matching.
              A "safe" result is not a guarantee that a URL or email is actually safe, and a "phishing"
              result is not a guarantee of malicious intent. Use your own judgment alongside these results.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">5. Teams</h2>
            <p>
              If you create or join a team, your name and email become visible to the team owner and other
              members. Scan history itself stays private to your account regardless of team membership.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">6. Changes</h2>
            <p>
              These terms may be updated as the platform evolves. Continued use after a change means you
              accept the updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
