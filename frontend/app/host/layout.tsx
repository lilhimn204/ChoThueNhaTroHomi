import { RequireAuth } from "@/components/auth/require-auth";
import { HostSidebar } from "@/components/host/host-sidebar";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="container-shell grid min-w-0 gap-5 py-5 sm:py-8 lg:grid-cols-[300px_1fr] lg:gap-6">
        <HostSidebar />
        <main className="animate-content-rise min-w-0">{children}</main>
      </div>
    </RequireAuth>
  );
}
