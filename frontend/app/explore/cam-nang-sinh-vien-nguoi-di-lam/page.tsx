import type { Metadata } from "next";
import {
  BriefcaseBusiness,
  Bus,
  GraduationCap,
  HandCoins,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import {
  ExploreArticle,
  ExploreInfoGrid,
  ExploreSection,
} from "@/components/explore/explore-article";

export const metadata: Metadata = {
  title: "Cẩm nang thuê phòng cho sinh viên và người đi làm | Homi",
  description:
    "Cẩm nang thuê phòng cho sinh viên và người đi làm: chọn vị trí, ngân sách, an ninh, ở ghép, tiện ích và hợp đồng.",
};

export default function StudentWorkerGuidePage() {
  return (
    <ExploreArticle
      eyebrow="Cẩm nang"
      title="Sinh viên và người đi làm cần ưu tiên khác nhau khi thuê phòng."
      description="Cùng là thuê phòng nhưng mục tiêu sử dụng, lịch sinh hoạt và khả năng chi trả khác nhau. Hãy chọn phòng theo nhịp sống thực tế của bạn."
    >
      <ExploreSection title="Dành cho sinh viên">
        <ExploreInfoGrid
          items={[
            {
              title: "Gần trường hoặc tuyến xe buýt",
              description:
                "Ưu tiên giảm thời gian đi học, đặc biệt với lịch học rải trong ngày hoặc hay về muộn.",
              icon: <GraduationCap className="size-5" />,
            },
            {
              title: "Giá hợp lý sau phí",
              description:
                "So sánh tổng chi phí gồm điện nước, wifi, gửi xe và sinh hoạt, không chỉ tiền phòng.",
              icon: <HandCoins className="size-5" />,
              tone: "success",
            },
            {
              title: "An ninh và giờ giấc",
              description:
                "Kiểm tra khóa cổng, camera, chỗ để xe và quy định giờ đóng cửa để tránh bất tiện.",
              icon: <ShieldCheck className="size-5" />,
            },
            {
              title: "Ở ghép cần rõ quy tắc",
              description:
                "Thống nhất chia tiền, dọn vệ sinh, khách đến chơi và xử lý khi một người chuyển đi.",
              icon: <UsersRound className="size-5" />,
              tone: "muted",
            },
          ]}
        />
      </ExploreSection>

      <ExploreSection title="Dành cho người đi làm">
        <ExploreInfoGrid
          items={[
            {
              title: "Gần nơi làm hoặc trục giao thông",
              description:
                "Ưu tiên tuyến đường ổn định vào giờ cao điểm, có phương án đi lại khi mưa hoặc tắc đường.",
              icon: <BriefcaseBusiness className="size-5" />,
            },
            {
              title: "Yên tĩnh để nghỉ ngơi",
              description:
                "Kiểm tra tiếng ồn vào buổi tối, khu vực sinh hoạt chung và mật độ người trong nhà.",
              icon: <ShieldCheck className="size-5" />,
              tone: "success",
            },
            {
              title: "Tiện ích đủ dùng",
              description:
                "Máy lạnh, máy giặt, bếp, thang máy hoặc chỗ phơi đồ có thể đáng tiền nếu giúp tiết kiệm thời gian.",
              icon: <Bus className="size-5" />,
              tone: "muted",
            },
            {
              title: "Hợp đồng rõ ràng",
              description:
                "Người đi làm thường thuê dài hơn, nên cần đọc kỹ điều kiện tăng giá, báo trước và hoàn cọc.",
              icon: <HandCoins className="size-5" />,
              tone: "warning",
            },
          ]}
        />
      </ExploreSection>

      <ExploreSection title="Điểm chung nên giữ">
        <p>Đừng thuê phòng chỉ vì một yếu tố duy nhất như giá rẻ hoặc ảnh đẹp. Hãy cân bằng chi phí, thời gian di chuyển, an ninh và sự minh bạch của hợp đồng.</p>
        <p>Khi phân vân giữa hai phòng, hãy chọn nơi bạn có thể duy trì ổn định trong ít nhất vài tháng mà không bị áp lực chi phí hoặc lịch sinh hoạt.</p>
      </ExploreSection>
    </ExploreArticle>
  );
}
