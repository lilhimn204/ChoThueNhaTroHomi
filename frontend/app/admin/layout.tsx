"use client";

import type { ReactNode } from "react";

import { RequireAuth } from "@/components/auth/require-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <div
        className="mx-auto py-6 lg:py-8"
        style={{ width: "min(1600px, calc(100% - 2rem))" }}
      >
        <div className="grid min-w-0 gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
          <AdminSidebar />
          <div className="animate-content-rise min-w-0">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
