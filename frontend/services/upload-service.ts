import { normalizeUploadImageSrc } from "@/lib/images";
import { prepareImageForUpload } from "@/lib/image-upload";
import { ApiError, proxyRequest } from "@/services/api-client";

interface UploadResponse {
  fileName: string;
  url: string;
  contentType: string;
  size: number;
}

const ROOM_UPLOAD_CONCURRENCY = 2;

export async function uploadRoomImage(file: File) {
  const preparedFile = await prepareImageForUpload(file);
  return uploadImage(preparedFile, "uploads/rooms");
}

export async function uploadRoomImages(files: File[]) {
  const results = new Array<Awaited<ReturnType<typeof uploadRoomImage>>>(files.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < files.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await uploadRoomImage(files[currentIndex]);
    }
  }

  const workerCount = Math.min(ROOM_UPLOAD_CONCURRENCY, files.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
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
