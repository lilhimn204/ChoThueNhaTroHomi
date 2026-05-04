"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { Heart } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { toggleSaveRoom } from "@/services/saved-room-service";

export function SaveRoomButton({
  roomId,
  initialSaved = false,
  size = "md",
}: {
  roomId: number;
  initialSaved?: boolean;
  size?: "sm" | "md";
}) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  if (!user) {
    return null;
  }

  const handleToggle = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      const response = await toggleSaveRoom(roomId);
      setSaved(response.saved);
      setAnimate(true);
      window.setTimeout(() => setAnimate(false), 380);
    } catch {
      // Silently fail — user can try again
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = size === "sm" ? "size-9" : "size-11";
  const iconClasses = size === "sm" ? "size-4" : "size-5";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? "Bỏ lưu phòng" : "Lưu phòng"}
      className={`${sizeClasses} motion-pressable group flex shrink-0 items-center justify-center rounded-full backdrop-blur ${
        saved
          ? "bg-red-500 text-white shadow-lg shadow-red-500/30 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-red-500/40"
          : "bg-[var(--color-surface)]/90 text-[var(--color-text-muted)] shadow-md hover:-translate-y-0.5 hover:bg-[var(--color-surface)] hover:text-red-500 hover:shadow-[var(--shadow-card)]"
      } ${loading ? "opacity-70" : ""} disabled:cursor-not-allowed disabled:opacity-70`}
    >
      <Heart
        className={`${iconClasses} motion-soft ${saved ? "fill-current scale-110" : "group-hover:scale-105"} ${animate ? "animate-heart-pop" : ""}`}
      />
    </button>
  );
}
