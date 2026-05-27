"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { normalizeUploadImageSrc } from "@/lib/images";
import { getErrorMessage } from "@/services/api-client";
import { uploadRoomImage } from "@/services/upload-service";
import type { RoomImageInput } from "@/services/room-service";

const MAX_IMAGES = 8;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function normalizeImages(images: RoomImageInput[]) {
  const thumbnailIndex = Math.max(
    0,
    images.findIndex((image) => image.isThumbnail),
  );

  return images
    .filter((image) => image.imageUrl.trim())
    .slice(0, MAX_IMAGES)
    .map((image, index) => ({
      imageUrl: image.imageUrl.trim(),
      altText: image.altText,
      sortOrder: index + 1,
      isThumbnail: index === thumbnailIndex,
    }));
}

export function RoomImageManager({
  images,
  roomTitle,
  onChange,
}: {
  images: RoomImageInput[];
  roomTitle: string;
  onChange: (images: RoomImageInput[]) => void;
}) {
  const [manualUrl, setManualUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const commitImages = (nextImages: RoomImageInput[]) => {
    onChange(normalizeImages(nextImages));
    setErrorMessage("");
  };

  const addImages = (nextImages: RoomImageInput[]) => {
    if (images.length + nextImages.length > MAX_IMAGES) {
      setErrorMessage(`Chỉ được tối đa ${MAX_IMAGES} ảnh cho một bài đăng.`);
      return;
    }

    commitImages([...images, ...nextImages]);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!files.length) {
      return;
    }

    if (images.length + files.length > MAX_IMAGES) {
      setErrorMessage(`Chỉ được tối đa ${MAX_IMAGES} ảnh cho một bài đăng.`);
      return;
    }

    const invalidFile = files.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type));
    if (invalidFile) {
      setErrorMessage("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
      return;
    }

    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFile) {
      setErrorMessage("Mỗi ảnh không được vượt quá 5MB.");
      return;
    }

    setUploading(true);
    setErrorMessage("");

    try {
      const uploadedImages = await Promise.all(files.map((file) => uploadRoomImage(file)));
      addImages(
        uploadedImages.map((image, index) => ({
          imageUrl: image.url,
          altText: roomTitle.trim() || `Ảnh phòng ${images.length + index + 1}`,
          sortOrder: images.length + index + 1,
          isThumbnail: images.length === 0 && index === 0,
        })),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const addManualUrl = () => {
    const imageUrl = manualUrl.trim();

    if (!imageUrl) {
      setErrorMessage("Nhập URL ảnh trước khi thêm.");
      return;
    }

    addImages([
      {
        imageUrl,
        altText: roomTitle.trim() || `Ảnh phòng ${images.length + 1}`,
        sortOrder: images.length + 1,
        isThumbnail: images.length === 0,
      },
    ]);
    setManualUrl("");
  };

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <Alert tone="warning" title="Không thể cập nhật ảnh" description={errorMessage} />
      ) : null}

      <div className="motion-panel rounded-[22px] border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] p-3 hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] hover:shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-4">
        {images.length ? (
          <div className="motion-stagger grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={`${image.imageUrl}-${index}`}
                className="motion-panel group overflow-hidden rounded-[22px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] sm:rounded-3xl"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={normalizeUploadImageSrc(image.imageUrl)}
                    alt={image.altText || roomTitle || "Ảnh phòng trọ"}
                    fill
                    className="motion-soft object-cover group-hover:scale-[1.04] group-hover:saturate-[1.08]"
                    sizes="(min-width: 1280px) 260px, 50vw"
                  />
                </div>
                <div className="space-y-3 p-3">
                  <Input
                    label="Mô tả ảnh"
                    value={image.altText}
                    onChange={(event) =>
                      commitImages(
                        images.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, altText: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                  <div className="grid gap-2 sm:flex sm:flex-wrap">
                    <Button
                      type="button"
                      size="sm"
                      variant={image.isThumbnail ? "primary" : "outline"}
                      className="w-full sm:w-auto"
                      leadingIcon={<Star className="size-4" />}
                      onClick={() =>
                        commitImages(
                          images.map((item, itemIndex) => ({
                            ...item,
                            isThumbnail: itemIndex === index,
                          })),
                        )
                      }
                    >
                      {image.isThumbnail ? "Ảnh đại diện" : "Chọn đại diện"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="w-full sm:w-auto"
                      leadingIcon={<Trash2 className="size-4" />}
                      onClick={() =>
                        commitImages(images.filter((_, itemIndex) => itemIndex !== index))
                      }
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="motion-panel group flex aspect-[16/8] flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] text-center hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] hover:shadow-sm">
            <ImagePlus className="motion-soft size-8 text-[var(--color-brand-700)] group-hover:scale-110" />
            <p className="mt-3 text-sm font-semibold text-[var(--color-text-strong)]">
              Chưa có ảnh phòng
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Ảnh thật, rõ nét giúp người thuê tin tưởng bài đăng hơn.
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <label
            htmlFor="room-gallery-upload"
            className={cn(
              "motion-pressable inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-800)] px-5 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-[var(--color-brand-700)] hover:shadow-[var(--shadow-button-hover)] active:scale-[0.98]",
              (uploading || images.length >= MAX_IMAGES) && "pointer-events-none opacity-60",
            )}
          >
            <ImagePlus className="size-4" />
            {uploading ? "Đang tải ảnh..." : "Chọn ảnh từ máy"}
            <input
              id="room-gallery-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              disabled={uploading || images.length >= MAX_IMAGES}
              onChange={handleUpload}
            />
          </label>

          <div className="motion-stagger grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input
              label="Thêm ảnh bằng URL"
              placeholder="https://images.unsplash.com/..."
              value={manualUrl}
              onChange={(event) => setManualUrl(event.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full self-end sm:w-auto"
              disabled={images.length >= MAX_IMAGES}
              onClick={addManualUrl}
            >
              Thêm URL
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-muted)]">
        Tối đa {MAX_IMAGES} ảnh, mỗi ảnh tối đa 5MB. Ảnh được chọn làm đại diện sẽ hiển thị trên thẻ phòng.
      </p>
    </div>
  );
}
