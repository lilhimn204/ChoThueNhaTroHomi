"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function HostError({ reset }: { reset: () => void }) {
  return (
    <div className="container-shell animate-content-rise py-10">
      <Alert
        tone="warning"
        title="Không thể tải khu đăng tin"
        description="Vui lòng thử lại. Nếu lỗi vẫn xảy ra, kiểm tra backend và token đăng nhập."
      />
      <Button className="mt-5" onClick={reset}>
        Thử lại
      </Button>
    </div>
  );
}
