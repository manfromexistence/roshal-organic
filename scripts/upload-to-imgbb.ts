import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import FormData from "form-data";

const IMGBB_API_KEY = process.env.IMGBB || "2c8180634cecec9ced202676d6f3c3f2";

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop", // Organization avatar
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop", // Project image 1
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop", // Project image 2
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop", // Document image 1
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop", // Document image 2
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop", // Transmittal image
];

async function downloadImage(url: string, _filepath: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToImgbb(
  imageBuffer: Buffer,
  _filename: string,
): Promise<string> {
  // Convert buffer to base64
  const base64Image = imageBuffer.toString("base64");

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        image: base64Image,
      }),
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("ImgBB error response:", responseText);
    throw new Error(`ImgBB upload failed: ${response.statusText}`);
  }

  const data = JSON.parse(responseText);
  if (!data.success) {
    throw new Error(
      `ImgBB upload failed: ${data.error?.message || "Unknown error"}`,
    );
  }

  // Return the full URL from the API response
  return data.data.url;
}

async function main() {
  console.log("=== UPLOADING IMAGES TO IMGBB ===\n");

  const tempDir = join(process.cwd(), "temp-images");
  if (!existsSync(tempDir)) {
    await mkdir(tempDir, { recursive: true });
  }

  const imageIds: string[] = [];

  for (let i = 0; i < UNSPLASH_IMAGES.length; i++) {
    const url = UNSPLASH_IMAGES[i];
    const filename = `image-${i}.jpg`;
    const filepath = join(tempDir, filename);

    console.log(`Downloading image ${i + 1}/${UNSPLASH_IMAGES.length}...`);
    const imageBuffer = await downloadImage(url, filepath);
    await writeFile(filepath, imageBuffer);

    console.log(`Uploading to imgbb...`);
    const imageId = await uploadToImgbb(imageBuffer, filename);
    imageIds.push(imageId);
    console.log(`✓ Image ID: ${imageId}\n`);
  }

  // Save image IDs to a file for use in insert-test-data.ts
  const idsFile = join(process.cwd(), "temp-images", "image-ids.json");
  await writeFile(idsFile, JSON.stringify(imageIds, null, 2));
  console.log(`✓ Image IDs saved to: ${idsFile}`);
  console.log("\n=== IMAGE UPLOAD COMPLETE ===");
  console.log("Image IDs:", imageIds);
}

main().catch(console.error);
