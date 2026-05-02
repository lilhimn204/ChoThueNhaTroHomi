import type { Metadata } from "next";

import {
  ExploreArticle,
  ExploreSection,
  PopularAreaCard,
} from "@/components/explore/explore-article";

export const metadata: Metadata = {
  title: "Khu vực thuê phòng phổ biến tại Hà Nội | Homi",
  description:
    "Gợi ý các khu vực thuê phòng phổ biến tại Hà Nội: Cầu Giấy, Đống Đa, Hai Bà Trưng, Thanh Xuân và Nam Từ Liêm.",
};

const popularAreas = [
  {
    name: "Cầu Giấy",
    description:
      "Khu vực nhiều trường đại học, văn phòng, dịch vụ ăn uống và tuyến đường kết nối nhanh sang Mỹ Đình, Ba Đình.",
    strengths: ["Nhiều lựa chọn phòng", "Gần trường và văn phòng", "Tiện ích dày đặc"],
    audience: "sinh viên, người mới đi làm, nhân sự văn phòng.",
    href: "/rooms?districtId=1",
  },
  {
    name: "Đống Đa",
    description:
      "Khu trung tâm cũ, thuận tiện di chuyển tới nhiều trường, bệnh viện và khu văn phòng trong nội thành.",
    strengths: ["Vị trí trung tâm", "Dễ đi nhiều quận", "Phù hợp thuê dài hạn"],
    audience: "sinh viên các trường nội thành và người đi làm cần di chuyển linh hoạt.",
    href: "/rooms?districtId=2",
  },
  {
    name: "Hai Bà Trưng",
    description:
      "Phù hợp người học hoặc làm quanh Bách Khoa, Kinh tế Quốc dân, Minh Khai, Times City và các tuyến phố lớn.",
    strengths: ["Nhiều khu dân cư", "Gần trường đại học", "Đa dạng mức giá"],
    audience: "sinh viên, nhóm bạn thuê chung và người đi làm khu phía Nam trung tâm.",
    href: "/rooms?districtId=3",
  },
  {
    name: "Thanh Xuân",
    description:
      "Nổi bật với trục Nguyễn Trãi, nhiều trường đại học, tuyến metro và các khu phòng trọ giá dễ tiếp cận.",
    strengths: ["Giá mềm hơn trung tâm", "Giao thông thuận tiện", "Nhiều phòng mini"],
    audience: "sinh viên, cặp đôi trẻ và người đi làm cần cân bằng chi phí.",
    href: "/rooms?districtId=4",
  },
  {
    name: "Nam Từ Liêm",
    description:
      "Khu vực phát triển nhanh quanh Mỹ Đình, Hàm Nghi, Mễ Trì, phù hợp người làm văn phòng và cần phòng rộng hơn.",
    strengths: ["Nhiều studio mới", "Gần khu văn phòng", "Không gian thoáng hơn"],
    audience: "người đi làm, chuyên viên văn phòng và nhóm thuê cần diện tích rộng.",
    href: "/rooms?districtId=5",
  },
];

export default function PopularAreasPage() {
  return (
    <ExploreArticle
      eyebrow="Khu vực"
      title="Chọn khu vực thuê phòng theo lối sống, chi phí và đường đi hằng ngày."
      description="Mỗi khu vực ở Hà Nội có lợi thế riêng. Homi gợi ý các quận phổ biến để bạn bắt đầu lọc phòng nhanh hơn."
    >
      <ExploreSection
        title="Khu vực phổ biến"
        description="Các nút xem phòng bên dưới dùng bộ lọc khu vực hiện có của Homi để mở thẳng danh sách phòng tương ứng."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {popularAreas.map((area) => (
            <PopularAreaCard key={area.name} {...area} />
          ))}
        </div>
      </ExploreSection>
    </ExploreArticle>
  );
}
