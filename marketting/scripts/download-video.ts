import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const videos = [
  {
    url: "https://cdn.magicui.design/ocean-small.webm",
    filename: "ocean.webm",
  },
];

async function downloadVideo(url: string, filename: string) {
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
  console.log("Downloading video for Video Text component...");
  for (const video of videos) {
    await downloadVideo(video.url, video.filename);
  }
  console.log("Video downloaded!");
}

main();
