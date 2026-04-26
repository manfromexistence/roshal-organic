import { promises as fs } from "node:fs";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

const sectionImages = [
  // Health Benefits section images
  {
    url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    filename: "healthy-food.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    filename: "organic-benefits.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    filename: "nutrition.jpg",
  },

  // Our Process section images
  {
    url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
    filename: "farming.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
    filename: "harvest.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    filename: "packaging.jpg",
  },

  // Testimonials section images
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    filename: "customer-1.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    filename: "customer-2.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    filename: "customer-3.jpg",
  },
];

async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${filename}: ${response.statusText}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const filepath = path.join(publicDir, filename);
    await fs.writeFile(filepath, buffer);
    console.log(`✓ Downloaded: ${filename}`);
  } catch (error) {
    console.error(`✗ Failed to download ${filename}:`, error);
  }
}

async function main() {
  console.log("Downloading section images...");

  for (const image of sectionImages) {
    await downloadImage(image.url, image.filename);
  }

  console.log("\nDownload complete!");
}

main().catch(console.error);
