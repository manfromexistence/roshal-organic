export function expandImageArray(
  images: string | string[] | null | undefined,
): string[] {
  if (!images) return [];
  if (typeof images === "string") {
    // Try to parse as JSON array
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [images];
    } catch {
      // Not valid JSON, return as single element
      return [images];
    }
  }
  return images;
}

export function getImgbbUrl(imageId: string): string {
  // Convert imgbb ID to full URL
  // ImgBB URL format: https://i.ibb.co/{ID}/{filename}
  return `https://i.ibb.co/${imageId}/`;
}

export function resolveImageUrl(image: string): string {
  // If it's already a full URL, return it as-is
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  // If it's a local path, return it
  if (image.startsWith("/")) {
    return image;
  }
  // Otherwise, assume it's an imgbb ID and construct the URL
  return `https://i.ibb.co/${image}/`;
}

export function resolveImageUrls(
  images: string | string[] | null | undefined,
): string[] {
  const expanded = expandImageArray(images);
  return expanded.map(resolveImageUrl);
}
