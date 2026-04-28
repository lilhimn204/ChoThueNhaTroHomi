import type { Metadata } from "next";

import { RoomDetailClient } from "@/components/rooms/room-detail-client";
import type { Room } from "@/types";

function getServerApiBaseUrl() {
  const backendUrl = process.env.BACKEND_URL;

  if (backendUrl) {
    const normalizedBackendUrl = backendUrl.replace(/\/$/, "");
    return normalizedBackendUrl.endsWith("/api/v1")
      ? normalizedBackendUrl
      : `${normalizedBackendUrl}/api/v1`;
  }

  return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1").replace(/\/$/, "");
}

async function fetchRoom(slug: string): Promise<Room | null> {
  try {
    const response = await fetch(`${getServerApiBaseUrl()}/rooms/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as Room;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = await fetchRoom(slug);

  if (!room) {
    return {
      title: "Phòng không tồn tại | Homi",
      description: "Phòng trọ này không tồn tại hoặc đã bị gỡ khỏi hệ thống.",
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const priceText = new Intl.NumberFormat("vi-VN").format(room.price);
  const title = `${room.title} | Homi`;
  const description = `${room.title} tại ${room.address}, ${room.districtName}. Giá ${priceText}đ/tháng, diện tích ${room.area}m². ${room.description.slice(0, 120)}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/rooms/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}/rooms/${slug}`,
      images: room.thumbnail
        ? [{ url: room.thumbnail, width: 800, height: 600, alt: room.title }]
        : undefined,
    },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = await fetchRoom(slug);

  return (
    <>
      <RoomDetailClient slug={slug} />
      {room ? <RoomJsonLd room={room} slug={slug} /> : null}
    </>
  );
}

/**
 * JSON-LD structured data for rental listing (schema.org).
 * Helps search engines understand the room listing content.
 */
function RoomJsonLd({ room, slug }: { room: Room; slug: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: room.title,
    description: room.description,
    url: `${siteUrl}/rooms/${slug}`,
    image: room.thumbnail || undefined,
    offers: {
      "@type": "Offer",
      price: room.price,
      priceCurrency: "VND",
      availability: room.status === "AVAILABLE"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: room.address,
      addressLocality: room.districtName,
      addressRegion: room.cityName || "Hà Nội",
      addressCountry: "VN",
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: room.area,
      unitCode: "MTK",
      unitText: "m²",
    },
    identifier: room.listingCode,
    datePosted: room.postedAt,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
