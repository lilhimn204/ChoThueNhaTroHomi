const PASSTHROUGH_MAX_BYTES = 1.5 * 1024 * 1024;
const SAFE_UPLOAD_MAX_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1920;
const MAX_IMAGE_HEIGHT = 1440;
const JPEG_QUALITIES = [0.82, 0.72, 0.62, 0.52];

function loadImage(file: File) {
  return new Promise<{ image: HTMLImageElement; objectUrl: string }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => resolve({ image, objectUrl });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Không thể đọc ảnh đã chọn."));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Không thể nén ảnh đã chọn."));
      },
      "image/jpeg",
      quality,
    );
  });
}

function buildJpegFile(blob: Blob, original: File) {
  const baseName = original.name.replace(/\.[^.]+$/, "") || "room-image";
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: original.lastModified,
  });
}

export async function prepareImageForUpload(file: File) {
  if (file.size <= PASSTHROUGH_MAX_BYTES) {
    return file;
  }

  const { image, objectUrl } = await loadImage(file);

  try {
    const scale = Math.min(
      1,
      MAX_IMAGE_WIDTH / image.naturalWidth,
      MAX_IMAGE_HEIGHT / image.naturalHeight,
    );
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Trình duyệt không hỗ trợ nén ảnh.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    for (const quality of JPEG_QUALITIES) {
      const blob = await canvasToBlob(canvas, quality);
      if (blob.size <= SAFE_UPLOAD_MAX_BYTES) {
        if (blob.size >= file.size && file.size <= SAFE_UPLOAD_MAX_BYTES) {
          return file;
        }

        return buildJpegFile(blob, file);
      }
    }

    throw new Error("Ảnh vẫn quá lớn sau khi nén. Vui lòng chọn ảnh khác.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
