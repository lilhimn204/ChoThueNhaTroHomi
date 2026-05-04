import { Suspense } from "react";

import { AdminSupportTicketsClient } from "@/components/admin/admin-support-tickets-client";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function AdminSupportTicketsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton className="h-[36rem] rounded-[32px]" />}>
      <AdminSupportTicketsClient />
    </Suspense>
  );
}
