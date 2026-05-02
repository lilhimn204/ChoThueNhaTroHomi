"use client";

import { Newspaper } from "lucide-react";

import { normalizeUploadImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";

function toSafeBackgroundImage(src?: string | null) {
  const imageSrc = src ? normalizeUploadImageSrc(src) : "";

  if (!imageSrc) {
    return undefined;
  }

  return `url("${imageSrc.replaceAll('"', "%22")}")`;
}

export function NewsImage({
  src,
  title,
  className,
}: {
  src?: string | null;
  title: string;
  className?: string;
}) {
  const backgroundImage = toSafeBackgroundImage(src);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[24px] bg-[var(--color-surface-soft)]",
        className,
      )}
      role="img"
      aria-label={title}
    >
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 ease-out group-hover:scale-105 group-hover:saturate-[1.08]"
          style={{ backgroundImage }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_35%_25%,var(--badge-brand-bg),transparent_32%),linear-gradient(135deg,var(--color-surface-soft),var(--color-surface))]">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-brand-700)] shadow-[var(--shadow-card)]">
            <Newspaper className="size-7" />
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 opacity-80" />
    </div>
  );
}
