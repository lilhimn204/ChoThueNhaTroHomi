"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      setErrorMessage(`Chi duoc toi da ${MAX_IMAGES} anh cho mot bai dang.`);
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
      setErrorMessage(`Chi duoc toi da ${MAX_IMAGES} anh cho mot bai dang.`);
      return;
    }

    const invalidFile = files.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type));
    if (invalidFile) {
      setErrorMessage("Chi ho tro anh JPG, PNG hoac WEBP.");
      return;
    }

    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFile) {
      setErrorMessage("Moi anh khong duoc vuot qua 5MB.");
      return;
    }

    setUploading(true);
    setErrorMessage("");

    try {
      const uploadedImages = await Promise.all(files.map((file) => uploadRoomImage(file)));
      addImages(
        uploadedImages.map((image, index) => ({
          imageUrl: image.url,
          altText: roomTitle.trim() || `Anh phong ${images.length + index + 1}`,
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
      setErrorMessage("Nhap URL anh truoc khi them.");
      return;
    }

    addImages([
      {
        imageUrl,
        altText: roomTitle.trim() || `Anh phong ${images.length + 1}`,
        sortOrder: images.length + 1,
        isThumbnail: images.length === 0,
      },
    ]);
    setManualUrl("");
  };

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <Alert tone="warning" title="Khong the cap nhat anh" description={errorMessage} />
      ) : null}

      <div className="rounded-[28px] border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] p-4">
        {images.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={`${image.imageUrl}-${index}`}
                className="overflow-hidden rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-surface)]"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={normalizeUploadImageSrc(image.imageUrl)}
                    alt={image.altText || roomTitle || "Anh phong tro"}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 260px, 50vw"
                  />
                </div>
                <div className="space-y-3 p-3">
                  <Input
                    label="Mo ta anh"
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
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={image.isThumbnail ? "primary" : "outline"}
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
                      {image.isThumbnail ? "Anh dai dien" : "Chon dai dien"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      leadingIcon={<Trash2 className="size-4" />}
                      onClick={() =>
                        commitImages(images.filter((_, itemIndex) => itemIndex !== index))
                      }
                    >
                      Xoa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex aspect-[16/8] flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] text-center">
            <ImagePlus className="size-8 text-[var(--color-brand-700)]" />
            <p className="mt-3 text-sm font-semibold text-[var(--color-text-strong)]">
              Chua co anh phong
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Anh that, ro sang giup nguoi thue tin tuong bai dang hon.
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <label
            htmlFor="room-gallery-upload"
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-800)] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-brand-700)]"
          >
            <ImagePlus className="size-4" />
            {uploading ? "Dang tai anh..." : "Chon anh tu may"}
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

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input
              label="Them anh bang URL"
              placeholder="https://images.unsplash.com/..."
              value={manualUrl}
              onChange={(event) => setManualUrl(event.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              className="self-end"
              disabled={images.length >= MAX_IMAGES}
              onClick={addManualUrl}
            >
              Them URL
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-muted)]">
        Toi da {MAX_IMAGES} anh, moi anh toi da 5MB. Anh duoc chon lam dai dien se hien tren card phong.
      </p>
    </div>
  );
}
