import { RequireAuth } from "@/components/auth/require-auth";
import { HostSidebar } from "@/components/host/host-sidebar";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="container-shell grid gap-6 py-8 lg:grid-cols-[300px_1fr]">
        <HostSidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </RequireAuth>
  );
}
