import type { Metadata } from "next";
import {
  FileText,
  HandCoins,
  Home,
  MapPinned,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import {
  ExploreArticle,
  ExploreInfoGrid,
  ExploreSection,
  ExploreStepList,
} from "@/components/explore/explore-article";

export const metadata: Metadata = {
  title: "Kinh nghiệm thuê phòng | Homi",
  description:
    "Kinh nghiệm thuê phòng trọ: xác định ngân sách, chọn khu vực, kiểm tra phòng, hỏi chi phí, đọc hợp đồng và đặt cọc an toàn.",
};

const experienceSteps = [
  {
    title: "Xác định ngân sách thực tế",
    description:
      "Tính tiền thuê, điện nước, internet, gửi xe, vệ sinh, chi phí đi lại và một khoản dự phòng. Mức thuê hợp lý thường không nên vượt quá phần ngân sách bạn có thể duy trì đều mỗi tháng.",
  },
  {
    title: "Chọn khu vực theo lịch sinh hoạt",
    description:
      "Ưu tiên khu vực giúp rút ngắn thời gian đi học, đi làm và có tuyến xe buýt hoặc đường chính thuận tiện. Đừng chỉ nhìn giá thuê nếu chi phí di chuyển tăng quá nhiều.",
  },
  {
    title: "Kiểm tra phòng trực tiếp",
    description:
      "Quan sát tường, trần, sàn, cửa, nhà vệ sinh, ổ điện, áp lực nước, ánh sáng tự nhiên và độ thoáng. Nên đi xem vào thời điểm bạn thường ở nhà để cảm nhận tiếng ồn và an ninh.",
  },
  {
    title: "Hỏi rõ mọi khoản phí",
    description:
      "Hỏi bằng con số cụ thể: điện, nước, wifi, rác, vệ sinh, gửi xe, phí dịch vụ, phí ở thêm người, giờ giấc và chi phí phát sinh khi chuyển đi.",
  },
  {
    title: "Đọc kỹ hợp đồng",
    description:
      "Kiểm tra thời hạn thuê, tiền cọc, ngày đóng tiền, điều kiện tăng giá, trách nhiệm sửa chữa, quy định báo trước và cách hoàn cọc.",
  },
  {
    title: "Đặt cọc có chứng từ",
    description:
      "Chỉ đặt cọc khi đã xác minh phòng và người cho thuê. Nội dung chuyển khoản hoặc giấy nhận cọc cần ghi rõ phòng, số tiền, thời hạn giữ phòng và điều kiện hoàn cọc.",
  },
];

export default function RentalExperiencePage() {
  return (
    <ExploreArticle
      eyebrow="Kinh nghiệm"
      title="Thuê phòng tốt bắt đầu từ việc kiểm tra đúng thứ cần kiểm tra."
      description="Một phòng phù hợp không chỉ có giá vừa túi tiền. Bạn cần xem xét khu vực, chất lượng phòng, chi phí hàng tháng, hợp đồng và mức độ minh bạch của người cho thuê."
    >
      <ExploreSection title="Quy trình thuê phòng nên làm theo">
        <ExploreStepList items={experienceSteps} />
      </ExploreSection>

      <ExploreSection
        title="Các điểm cần ưu tiên"
        description="Nếu phải chọn nhanh giữa nhiều phòng tương tự nhau, hãy ưu tiên các yếu tố ảnh hưởng trực tiếp đến chi phí và sự ổn định trong quá trình ở."
      >
        <ExploreInfoGrid
          items={[
            {
              title: "Ngân sách sau phí",
              description:
                "So sánh tổng chi phí hàng tháng thay vì chỉ nhìn tiền thuê niêm yết.",
              icon: <WalletCards className="size-5" />,
            },
            {
              title: "Vị trí đi lại",
              description:
                "Một phòng xa hơn nhưng giao thông thuận tiện có thể tốt hơn phòng gần nhưng kẹt xe thường xuyên.",
              icon: <MapPinned className="size-5" />,
              tone: "success",
            },
            {
              title: "Tình trạng phòng",
              description:
                "Kiểm tra chống thấm, thông gió, điện nước và mức độ riêng tư trước khi chốt.",
              icon: <Home className="size-5" />,
              tone: "muted",
            },
            {
              title: "Hợp đồng rõ ràng",
              description:
                "Hợp đồng càng cụ thể, rủi ro tranh chấp tiền cọc và phí phát sinh càng thấp.",
              icon: <FileText className="size-5" />,
            },
          ]}
        />
      </ExploreSection>

      <ExploreSection title="Lưu ý khi đặt cọc">
        <ExploreInfoGrid
          items={[
            {
              title: "Không cọc khi chưa xem phòng",
              description:
                "Nếu người đăng yêu cầu chuyển tiền trước khi cho xem phòng, hãy dừng lại và xác minh thêm.",
              icon: <ShieldCheck className="size-5" />,
              tone: "warning",
            },
            {
              title: "Ghi rõ điều kiện hoàn cọc",
              description:
                "Nội dung cọc cần nêu rõ thời hạn giữ phòng, ngày nhận phòng và trường hợp nào được hoàn tiền.",
              icon: <HandCoins className="size-5" />,
              tone: "success",
            },
          ]}
        />
      </ExploreSection>
    </ExploreArticle>
  );
}
