import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { AuthGate } from "./AuthGate";
import { BackgroundOrbs } from "@/components/ui/BackgroundOrbs";
import { ShieldScene } from "@/components/three/ShieldScene";

export const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGate>
      <div className="relative flex min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        <BackgroundOrbs />
        <div className="hidden xl:block fixed bottom-0 right-0 w-[280px] h-[280px] pointer-events-none opacity-40 z-0">
          <ShieldScene />
        </div>
        <Sidebar />
        <div className="relative z-10 flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
};
export default Shell;