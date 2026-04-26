import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const images = [
  {
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop",
    filename: "special-offer.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&h=600&fit=crop",
    filename: "brand-story.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    filename: "newsletter.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    filename: "deal-1.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    filename: "deal-2.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    filename: "deal-3.jpg",
  },
];

async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = join(process.cwd(), "public", filename);
    await writeFile(filePath, buffer);
    console.log(`Downloaded: ${filename}`);
  } catch (error) {
    console.error(`Failed to download ${filename}:`, error);
  }
}

async function main() {
  console.log("Downloading images for new sections...");
  for (const image of images) {
    await downloadImage(image.url, image.filename);
  }
  console.log("All images downloaded!");
}

main();
