"use client";

import { useState } from "react";
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

  if (!user) {
    return null;
  }

  const handleToggle = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      const response = await toggleSaveRoom(roomId);
      setSaved(response.saved);
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
      className={`${sizeClasses} flex shrink-0 items-center justify-center rounded-full backdrop-blur transition-all duration-200 ${
        saved
          ? "bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600"
          : "bg-[var(--color-surface)]/90 text-[var(--color-text-muted)] shadow-md hover:bg-[var(--color-surface)] hover:text-red-500"
      } ${loading ? "animate-pulse" : ""}`}
    >
      <Heart
        className={`${iconClasses} transition-transform duration-200 ${saved ? "fill-current scale-110" : ""}`}
      />
    </button>
  );
}
