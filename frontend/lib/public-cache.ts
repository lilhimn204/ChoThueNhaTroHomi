export const PUBLIC_ROOMS_CACHE_TAG = "public-rooms";

export function isPublicRoomPath(path: string) {
  return path === "rooms" || path.startsWith("rooms/");
}

export function isRoomMutation(method: string, path: string) {
  return (
    ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase()) &&
    /^(?:host|admin)\/rooms(?:\/|$)/.test(path)
  );
}
