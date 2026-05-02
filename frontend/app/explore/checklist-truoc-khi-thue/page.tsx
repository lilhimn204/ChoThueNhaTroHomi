import type { Metadata } from "next";
import { ClipboardCheck, FileText, ShieldCheck, WalletCards } from "lucide-react";

import {
  ExploreArticle,
  ExploreChecklist,
  ExploreInfoGrid,
  ExploreSection,
} from "@/components/explore/explore-article";

export const metadata: Metadata = {
  title: "Checklist trước khi thuê phòng | Homi",
  description:
    "Checklist trước khi thuê phòng: kiểm tra phòng, điện nước, wifi, vệ sinh, an ninh, gửi xe, tiền cọc, hợp đồng và quy định trả phòng.",
};

const checklistItems = [
  {
    title: "Kiểm tra phòng",
    description: "Tường, trần, sàn, cửa, khóa, cửa sổ, ánh sáng, thông gió và dấu hiệu ẩm mốc.",
  },
  {
    title: "Điện nước",
    description: "Hỏi đơn giá, cách ghi số, lịch thanh toán, áp lực nước và khả năng mất điện/mất nước.",
  },
  {
    title: "Wifi",
    description: "Kiểm tra tốc độ, độ ổn định, số người dùng chung và phí hàng tháng.",
  },
  {
    title: "Vệ sinh",
    description: "Khu vệ sinh, khu rác, lối đi chung, lịch dọn dẹp và trách nhiệm của người thuê.",
  },
  {
    title: "An ninh",
    description: "Khóa cổng, camera, bảo vệ, người lạ ra vào và độ an toàn của khu vực ban đêm.",
  },
  {
    title: "Giờ giấc",
    description: "Quy định đóng/mở cổng, khách đến chơi, về muộn và sinh hoạt chung.",
  },
  {
    title: "Gửi xe",
    description: "Số lượng xe được gửi, phí gửi xe, vị trí để xe và trách nhiệm khi mất/hỏng xe.",
  },
  {
    title: "Tiền cọc",
    description: "Số tiền cọc, điều kiện giữ phòng, hoàn cọc, trừ cọc và thời gian báo trước.",
  },
  {
    title: "Hợp đồng",
    description: "Tên người ký, thời hạn thuê, ngày đóng tiền, phí phát sinh và trách nhiệm sửa chữa.",
  },
  {
    title: "Quy định trả phòng",
    description: "Thời gian báo trước, hiện trạng bàn giao, chốt công nợ và thời điểm hoàn cọc.",
  },
];

export default function RentalChecklistPage() {
  return (
    <ExploreArticle
      eyebrow="Checklist"
      title="Danh sách kiểm tra trước khi đặt cọc hoặc ký hợp đồng."
      description="Dùng checklist này khi đi xem phòng để tránh bỏ sót các điểm dễ phát sinh chi phí hoặc tranh chấp sau khi chuyển vào."
    >
      <ExploreSection title="Checklist đi xem phòng">
        <ExploreChecklist items={checklistItems} />
      </ExploreSection>

      <ExploreSection title="Ba nhóm thông tin nên chốt bằng văn bản">
        <ExploreInfoGrid
          items={[
            {
              title: "Chi phí hàng tháng",
              description:
                "Tiền phòng, điện nước, wifi, gửi xe, vệ sinh và các khoản phụ thu cần được ghi rõ.",
              icon: <WalletCards className="size-5" />,
            },
            {
              title: "Quy định sinh hoạt",
              description:
                "Giờ giấc, khách đến chơi, nấu ăn, nuôi thú cưng, dùng khu chung và xử lý tiếng ồn.",
              icon: <ShieldCheck className="size-5" />,
              tone: "success",
            },
            {
              title: "Cọc và trả phòng",
              description:
                "Điều kiện hoàn cọc, thời gian báo trước và trạng thái phòng khi bàn giao lại.",
              icon: <FileText className="size-5" />,
              tone: "warning",
            },
            {
              title: "Biên nhận rõ ràng",
              description:
                "Mỗi lần đặt cọc hoặc thanh toán nên có biên nhận, tin nhắn xác nhận hoặc nội dung chuyển khoản cụ thể.",
              icon: <ClipboardCheck className="size-5" />,
              tone: "muted",
            },
          ]}
        />
      </ExploreSection>
    </ExploreArticle>
  );
}
