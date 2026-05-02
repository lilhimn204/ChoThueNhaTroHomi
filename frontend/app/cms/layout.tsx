"use client";

import type { ReactNode } from "react";

import { CmsShell } from "@/components/cms/cms-shell";
import { RequireAuth } from "@/components/auth/require-auth";

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <CmsShell>{children}</CmsShell>
    </RequireAuth>
  );
}
