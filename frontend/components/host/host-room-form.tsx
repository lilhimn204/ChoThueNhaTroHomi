"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { RoomImageManager } from "@/components/forms/room-image-manager";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { roomTypeOptions } from "@/constants/site";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { getAmenities, getDistricts } from "@/services/lookup-service";
import { createHostRoom, getHostRoom, updateHostRoom } from "@/services/host-service";
import type { RoomImageInput, RoomUpsertPayload } from "@/services/room-service";
import type { Amenity, District, RoomImage, RoomStatus, RoomType } from "@/types";

const statusOptions = [
  { label: "Còn phòng", value: "AVAILABLE" },
  { label: "Hết phòng", value: "FULL" },
  { label: "Tạm ẩn", value: "HIDDEN" },
];

const defaultForm = {
  title: "",
  description: "",
  address: "",
  districtId: "",
  price: "",
  area: "",
  roomType: "boarding-room" as RoomType,
  contactName: "",
  contactPhone: "",
  status: "AVAILABLE" as RoomStatus,
};

function toRoomImageInputs(
  images: RoomImage[],
  thumbnail: string | null | undefined,
  title: string,
): RoomImageInput[] {
  const sourceImages = images.length
    ? images
    : thumbnail
      ? [
          {
            id: 0,
            imageUrl: thumbnail,
            altText: title,
            sortOrder: 1,
            isThumbnail: true,
          },
        ]
      : [];
  const thumbnailUrl = thumbnail?.trim();
  const hasExplicitThumbnail = sourceImages.some((image) => image.isThumbnail);

  return sourceImages.map((image, index) => ({
    imageUrl: image.imageUrl,
    altText: image.altText || title || `Ảnh phòng ${index + 1}`,
    sortOrder: index + 1,
    isThumbnail: hasExplicitThumbnail
      ? image.isThumbnail
      : Boolean(thumbnailUrl && image.imageUrl === thumbnailUrl) || index === 0,
  }));
}

function normalizePayloadImages(images: RoomImageInput[], title: string) {
  const hasThumbnail = images.some((image) => image.isThumbnail);

  return images
    .filter((image) => image.imageUrl.trim())
    .map((image, index) => ({
      imageUrl: image.imageUrl.trim(),
      altText: image.altText.trim() || title.trim() || `Ảnh phòng ${index + 1}`,
      sortOrder: index + 1,
      isThumbnail: hasThumbnail ? image.isThumbnail : index === 0,
    }));
}

export function HostRoomForm({
  mode,
  roomId,
}: {
  mode: "create" | "edit";
  roomId?: number;
}) {
  const router = useRouter();

  const [form, setForm] = useState(defaultForm);
  const [galleryImages, setGalleryImages] = useState<RoomImageInput[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();

    void Promise.all([
      getDistricts(controller.signal).then(setDistricts),
      getAmenities(controller.signal).then(setAmenities),
    ]).catch((error) => {
      if (!controller.signal.aborted) {
        setErrorMessage(getErrorMessage(error));
      }
    });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (mode === "create" || !roomId) {
      return;
    }

    const controller = new AbortController();

    void getHostRoom(roomId, controller.signal)
      .then((room) => {
        setForm({
          title: room.title,
          description: room.description,
          address: room.address,
          districtId: String(room.districtId),
          price: String(room.price),
          area: String(room.area),
          roomType: room.roomType ?? "boarding-room",
          contactName: room.contactName,
          contactPhone: room.contactPhone,
          status: room.status,
        });
        setGalleryImages(toRoomImageInputs(room.images, room.thumbnail, room.title));
        setSelectedAmenityIds(room.amenities.map((amenity) => String(amenity.id)));
        setErrorMessage("");
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [mode, roomId]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setSuccessMessage("");
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenityIds((current) =>
      current.includes(amenityId)
        ? current.filter((item) => item !== amenityId)
        : [...current, amenityId],
    );
  };

  const buildPayload = (): RoomUpsertPayload => {
    const images = normalizePayloadImages(galleryImages, form.title);
    const thumbnail = images.find((image) => image.isThumbnail)?.imageUrl ?? images[0]?.imageUrl ?? "";

    return {
      title: form.title.trim(),
      description: form.description.trim(),
      address: form.address.trim(),
      districtId: Number(form.districtId),
      price: Number(form.price),
      area: Number(form.area),
      roomType: form.roomType,
      contactName: form.contactName.trim(),
      contactPhone: form.contactPhone.trim(),
      status: form.status,
      thumbnail,
      amenityIds: selectedAmenityIds.map(Number),
      images,
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (uploadingImages) {
      setErrorMessage("Vui lòng chờ ảnh tải xong trước khi lưu bài đăng.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    setFieldErrors({});

    try {
      if (mode === "create") {
        await createHostRoom(buildPayload());
        setSuccessMessage("Đã tạo bài đăng mới. Đang chuyển về danh sách...");
        router.push("/host/posts");
        return;
      }

      if (!roomId) {
        throw new Error("Thiếu mã bài đăng cần chỉnh sửa.");
      }

      await updateHostRoom(roomId, buildPayload());
      setSuccessMessage("Đã cập nhật bài đăng thành công.");
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(
          Object.fromEntries(
            error.fieldErrors.map((fieldError) => [fieldError.field, fieldError.message]),
          ),
        );
      }

      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <LoadingSkeleton className="h-40 rounded-[24px] sm:h-44 sm:rounded-[32px]" />
        <LoadingSkeleton className="h-[30rem] rounded-[24px] sm:h-[34rem] sm:rounded-[32px]" />
      </div>
    );
  }

  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
      <section className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              href="/host/posts"
              className="motion-soft inline-flex items-center gap-2 rounded-xl text-sm font-medium text-[var(--color-text-muted)] hover:-translate-x-0.5 hover:text-[var(--color-text-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
            >
              <ArrowLeft className="size-4" />
              Quay lại danh sách bài đăng
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
              {mode === "create" ? "Thêm bài đăng mới" : "Chỉnh sửa bài đăng"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Cập nhật thông tin phòng, tiện ích và thư viện ảnh để người thuê đánh giá nhanh hơn.
            </p>
          </div>
          <Button className="w-full lg:w-auto" type="submit" disabled={submitting || uploadingImages} trailingIcon={<Save className="size-4" />}>
            {uploadingImages
              ? "Đang tải ảnh..."
              : mode === "create"
                ? "Lưu bài đăng"
                : "Cập nhật bài đăng"}
          </Button>
        </div>

        {successMessage ? (
          <div className="mt-6">
            <Alert tone="success" title="Thao tác thành công" description={successMessage} />
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6">
            <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
          </div>
        ) : null}
      </section>

      <section className="grid min-w-0 gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5 sm:space-y-6">
          <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">
              Thông tin cơ bản
            </h2>
            <div className="motion-stagger mt-5 grid gap-5">
              <Input
                label="Tiêu đề bài đăng"
                placeholder="Ví dụ: Studio gần Đại học Quốc gia Hà Nội"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                error={fieldErrors.title}
                required
              />
              <Textarea
                label="Mô tả phòng"
                placeholder="Mô tả ngắn gọn về phòng, giờ giấc, tiện ích và khu vực xung quanh."
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                error={fieldErrors.description}
                required
              />
              <Input
                label="Địa chỉ"
                placeholder="Số nhà, tên đường, phường"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                error={fieldErrors.address}
                required
              />
              <Select
                label="Quận / khu vực"
                options={[
                  { label: "Chọn khu vực", value: "" },
                  ...districts.map((district) => ({
                    label: district.name,
                    value: String(district.id),
                  })),
                ]}
                value={form.districtId}
                onChange={(event) => updateField("districtId", event.target.value)}
              />
              <Select
                label="Loại phòng"
                options={roomTypeOptions}
                value={form.roomType}
                onChange={(event) => updateField("roomType", event.target.value as RoomType)}
              />
            </div>
          </div>

          <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">
              Giá và trạng thái
            </h2>
            <div className="motion-stagger mt-5 grid gap-5 md:grid-cols-2">
              <Input
                label="Giá thuê mỗi tháng"
                type="number"
                min={0}
                placeholder="4300000"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                error={fieldErrors.price}
                required
              />
              <Input
                label="Diện tích"
                type="number"
                min={0}
                placeholder="22"
                value={form.area}
                onChange={(event) => updateField("area", event.target.value)}
                error={fieldErrors.area}
                required
              />
              <Select
                label="Trạng thái phòng"
                options={statusOptions}
                value={form.status}
                onChange={(event) => updateField("status", event.target.value as RoomStatus)}
              />
            </div>
          </div>

          <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">
              Thư viện ảnh
            </h2>
            <div className="mt-5">
              <RoomImageManager
                images={galleryImages}
                roomTitle={form.title}
                onChange={setGalleryImages}
                onUploadingChange={setUploadingImages}
              />
            </div>
          </div>
        </div>

        <aside className="min-w-0 space-y-5 sm:space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">
              Liên hệ
            </h2>
            <div className="motion-stagger mt-5 space-y-5">
              <Input
                label="Tên người liên hệ"
                value={form.contactName}
                onChange={(event) => updateField("contactName", event.target.value)}
                error={fieldErrors.contactName}
                required
              />
              <Input
                label="Số điện thoại liên hệ"
                value={form.contactPhone}
                onChange={(event) => updateField("contactPhone", event.target.value)}
                error={fieldErrors.contactPhone}
                required
              />
            </div>
          </div>

          <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">
              Tiện ích nổi bật
            </h2>
            <div className="motion-stagger mt-5 grid gap-3">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="motion-panel flex items-center gap-3 rounded-2xl border border-[var(--color-border-soft)] px-4 py-3 text-sm font-medium text-[var(--color-text-strong)] hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)] hover:shadow-sm has-[input:checked]:border-[var(--color-brand-500)] has-[input:checked]:bg-[var(--badge-brand-bg)]"
                >
                  <input
                    type="checkbox"
                    className="motion-soft size-4 accent-[var(--color-brand-700)]"
                    checked={selectedAmenityIds.includes(String(amenity.id))}
                    onChange={() => toggleAmenity(String(amenity.id))}
                  />
                  {amenity.name}
                </label>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </form>
  );
}
