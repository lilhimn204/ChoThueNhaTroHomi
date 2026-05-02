import { normalizeUploadImageSrc } from "@/lib/images";
import { ApiError, proxyRequest } from "@/services/api-client";

interface UploadResponse {
  fileName: string;
  url: string;
  contentType: string;
  size: number;
}

export function uploadRoomImage(file: File) {
  return uploadImage(file, "uploads/rooms");
}

export function uploadNewsImage(file: File) {
  return uploadImage(file, "uploads/news");
}

export async function uploadAvatarImage(file: File) {
  try {
    return await uploadImage(file, "uploads/avatars");
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status >= 500)) {
      return uploadImage(file, "uploads/rooms");
    }

    throw error;
  }
}

function uploadImage(file: File, path: string) {
  const formData = new FormData();
  formData.append("file", file);

  return proxyRequest<UploadResponse>(path, {
    method: "POST",
    body: formData,
  }).then((response) => ({
    ...response,
    url: normalizeUploadImageSrc(response.url),
  }));
}
