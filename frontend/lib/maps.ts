interface MapSearchInput {
  address: string;
  districtName?: string;
  cityName?: string;
}

export function buildMapSearchUrl({
  address,
  districtName,
  cityName,
}: MapSearchInput) {
  const query = [address, districtName, cityName ?? "Hà Nội", "Việt Nam"]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
