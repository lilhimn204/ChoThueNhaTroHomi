export function normalizeUploadImageSrc(src: string) {
  const imageSrc = src.trim();

  if (!imageSrc) {
    return imageSrc;
  }

  if (imageSrc.startsWith("/uploads/")) {
    return imageSrc;
  }

  try {
    const url = new URL(imageSrc);

    if (url.pathname.startsWith("/uploads/")) {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    return imageSrc;
  }

  return imageSrc;
}
