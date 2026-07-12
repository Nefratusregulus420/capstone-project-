import type { RecentUpload } from "../App";
import { authenticatedBlob } from "./api";
import type { VaultFile } from "./services";

const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export async function toRecentUpload(file: VaultFile): Promise<RecentUpload> {
  const isPhoto = file.category === "PHOTO";
  let url: string | undefined;

  if (isPhoto) {
    const blob = await authenticatedBlob(file.contentUrl);
    url = URL.createObjectURL(blob);
  }

  return {
    id: String(file.id),
    name: file.originalName,
    meta: `${isPhoto ? "Image" : "File"} · ${formatFileSize(file.size)}`,
    type: isPhoto ? "Photos" : "Files",
    url,
  };
}

export function revokeRecentUploadUrls(items: RecentUpload[]) {
  items.forEach((item) => {
    if (item.url) URL.revokeObjectURL(item.url);
  });
}
