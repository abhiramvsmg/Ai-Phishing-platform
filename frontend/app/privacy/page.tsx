import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mb-8">Last updated June 2026</p>

        <div className="panel p-7 space-y-6 text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">1. What we store</h2>
            <p>
              Your name, email, and a hashed (never plain-text) password. Every URL, email, or text you
              submit for scanning is stored as a scan record, along with the risk score and result, so
              your scan history is available to you later.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">2. What gets sent to third parties</h2>
            <p>
              When you scan a URL, that URL is sent to VirusTotal and Google Safe Browsing to check it
              against their threat databases. Email and text content is analyzed locally and is not sent
              to any third party.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">3. Who can see your data</h2>
            <p>
              Only you can see your scan history, even if you're part of a team. If you join a team, your
              name and email are visible to the team owner and other members — your scans are not.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">4. Data retention</h2>
            <p>
              Scan history and reports are kept until you ask for them to be deleted, or until you delete
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">5. Contact</h2>
            <p>
              This is a student security project. For questions about your data, reach out to the project
              maintainer directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
