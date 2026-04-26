import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the index.html file
const htmlPath = path.join(__dirname, "..", "index.html");
const htmlContent = fs.readFileSync(htmlPath, "utf-8");

// Extract all Unsplash photo URLs (excluding profile images)
const urlPattern = /https:\/\/images\.unsplash\.com\/photo-[^"'\s&]+/g;
const urls = htmlContent.match(urlPattern) || [];

// Extract unique photo IDs (the part after photo- and before any query params)
const photoIds = urls
  .map((url) => {
    const match = url.match(/photo-([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  })
  .filter((id) => id !== null);

// Get unique photo IDs
const uniquePhotoIds = [...new Set(photoIds)];

// Reconstruct URLs from unique photo IDs
const uniqueUrls = uniquePhotoIds.map(
  (id) => `https://images.unsplash.com/photo-${id}`,
);

console.log(`Found ${uniqueUrls.length} unique Unsplash image URLs`);

// Download each image
const outputDir = path.join(__dirname, "..", "public", "vegetables");

async function downloadImage(url: string, index: number) {
  try {
    // Clean the URL - remove any trailing parameters
    const cleanUrl = url.split("&")[0];

    // Add parameters for high quality download
    const downloadUrl = `${cleanUrl}?fm=jpg&q=80&w=1200&auto=format&fit=crop`;

    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const fileName = `vegetable-${index + 1}.jpg`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`Downloaded: ${fileName}`);
  } catch (error) {
    console.error(`Failed to download ${url}:`, error);
  }
}

// Download all images with concurrency limit
async function downloadAllImages() {
  const concurrency = 5;
  for (let i = 0; i < uniqueUrls.length; i += concurrency) {
    const batch = uniqueUrls.slice(i, i + concurrency);
    await Promise.all(batch.map((url, idx) => downloadImage(url, i + idx)));
  }
  console.log("All downloads completed!");
}

downloadAllImages();
