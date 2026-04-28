import { apiRequest } from "@/services/api-client";
import type { Amenity, District } from "@/types";

export function getDistricts(signal?: AbortSignal) {
  return apiRequest<District[]>("districts", { signal });
}

export function getAmenities(signal?: AbortSignal) {
  return apiRequest<Amenity[]>("amenities", { signal });
}
