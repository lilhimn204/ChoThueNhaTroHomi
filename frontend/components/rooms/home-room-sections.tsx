"use client";

import { useEffect, useState } from "react";

import { FeaturedRoomsSection } from "@/components/rooms/featured-rooms-section";
import { HeroSearchSection } from "@/components/rooms/hero-search-section";
import { getErrorMessage } from "@/services/api-client";
import { getFeaturedRooms, getRoomStats } from "@/services/room-service";
import type { RoomStats, RoomSummary } from "@/types";

export function HomeRoomSections() {
  const [featuredRooms, setFeaturedRooms] = useState<RoomSummary[]>([]);
  const [stats, setStats] = useState<RoomStats | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const featuredRequest = getFeaturedRooms(controller.signal)
      .then((rooms) => {
        setFeaturedRooms(rooms.slice(0, 3));
        setFeaturedError("");
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setFeaturedError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setFeaturedLoading(false);
        }
      });

    const statsRequest = getRoomStats(controller.signal)
      .then(setStats)
      .catch(() => {
        if (!controller.signal.aborted) {
          setStats({ visibleRooms: 0, availableRooms: 0, availableRate: 0 });
        }
      });

    void Promise.allSettled([featuredRequest, statsRequest]);

    return () => controller.abort();
  }, []);

  return (
    <>
      <HeroSearchSection stats={stats} featuredRoom={featuredRooms.at(0) ?? null} />
      <FeaturedRoomsSection
        rooms={featuredRooms}
        loading={featuredLoading}
        errorMessage={featuredError}
      />
    </>
  );
}
