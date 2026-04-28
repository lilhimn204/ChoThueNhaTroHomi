"use client";

import { useEffect } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function RoomsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Rooms error:", error);
  }, [error]);

  return (
    <div className="container-shell py-10">
      <Alert
        tone="warning"
        title="Không thể tải danh sách phòng"
        description={error.message || "Hệ thống gặp sự cố khi tải dữ liệu. Vui lòng thử lại."}
      />
      <Button className="mt-5" onClick={reset}>
        Thử lại
      </Button>
    </div>
  );
}
