#!/usr/bin/env bun
/**
 * Script to download natural food images and Bangladesh company logos
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");
const logoDevToken = "pk_K0PWGDbrQZa19gppNw0sNA";

// Bangladesh company domains for logo.dev
const bangladeshCompanies = [
  "bkash.com",
  "nagad.com.bd",
  "dutch-bangla-bank.com",
  "citybank.com.bd",
  "bracbank.com",
  "sonali-bank.com",
  "janatabank-bd.com",
  "agrani-bank.com",
  "rupali-bank.com",
  "basicbank-bd.com",
  "bdpost.gov.bd",
  "btrc.gov.bd",
  "roblox.com",
  "grameen.com",
  "beximco.com",
  "pran-rfl.com",
  "squaregroup.com.bd",
  "acigroup.com.bd",
  "bengalgroup.com.bd",
  "partexstar.com",
  "mohammadi-group.com",
  "bashundharagroup.com",
  "eastwestgroupbd.com",
  "navana.com",
  "ab-group.com",
  "confidencegroup.com.bd",
  "orchidpharma.com.bd",
  "incepta.com.bd",
  "renata.com.bd",
  "beximco-pharma.com",
  "squarepharma.com.bd",
  "opsonin.com.bd",
  "acme.com.bd",
  "healthcare.com.bd",
  "apexpharma.com.bd",
  "druginternational.com.bd",
  "pharmaceuticals.com.bd",
  "beacon.com.bd",
  "ibnsina.com.bd",
  "lifeline.com.bd",
  "medicare.com.bd",
  "popular.com.bd",
  "titasgas.com.bd",
  "desco.org.bd",
  "nesco.org.bd",
  "bpdb.gov.bd",
  "pdbc.gov.bd",
];

// Additional food images from Unsplash
const additionalFoodImages = [
  {
    name: "fresh-fruit-basket.jpg",
    url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=800&fit=crop",
  },
  {
    name: "organic-vegetables.jpg",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=800&fit=crop",
  },
  {
    name: "whole-grains.jpg",
    url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop",
  },
  {
    name: "green-tea.jpg",
    url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
  },
  {
    name: "coffee-beans.jpg",
    url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
  },
  {
    name: "fresh-herbs.jpg",
    url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=800&fit=crop",
  },
  {
    name: "olive-oil.jpg",
    url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop",
  },
  {
    name: "almonds.jpg",
    url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=800&fit=crop",
  },
  {
    name: "cashews.jpg",
    url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
  },
  {
    name: "walnuts.jpg",
    url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=800&fit=crop",
  },
  {
    name: "fresh-fish.jpg",
    url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=800&fit=crop",
  },
  {
    name: "chicken.jpg",
    url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=800&fit=crop",
  },
  {
    name: "beef.jpg",
    url: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=800&fit=crop",
  },
  {
    name: "eggs.jpg",
    url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&h=800&fit=crop",
  },
  {
    name: "milk.jpg",
    url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=800&fit=crop",
  },
  {
    name: "cheese.jpg",
    url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=800&fit=crop",
  },
  {
    name: "bread.jpg",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop",
  },
  {
    name: "pasta.jpg",
    url: "https://images.unsplash.com/photo-1551462147-ff906ba1ae7a?w=800&h=800&fit=crop",
  },
  {
    name: "rice-bowl.jpg",
    url: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=800&fit=crop",
  },
  {
    name: "curry.jpg",
    url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=800&fit=crop",
  },
  {
    name: "salad.jpg",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop",
  },
  {
    name: "soup.jpg",
    url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=800&fit=crop",
  },
  {
    name: "smoothie.jpg",
    url: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=800&h=800&fit=crop",
  },
  {
    name: "juice.jpg",
    url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&h=800&fit=crop",
  },
  {
    name: "water.jpg",
    url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&h=800&fit=crop",
  },
  {
    name: "avocado.jpg",
    url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=800&fit=crop",
  },
  {
    name: "tomatoes.jpg",
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=800&fit=crop",
  },
  {
    name: "carrots.jpg",
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=800&fit=crop",
  },
  {
    name: "broccoli.jpg",
    url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop",
  },
  {
    name: "spinach.jpg",
    url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=800&fit=crop",
  },
  {
    name: "berries.jpg",
    url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop",
  },
  {
    name: "apples.jpg",
    url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=800&fit=crop",
  },
  {
    name: "oranges.jpg",
    url: "https://images.unsplash.com/photo-1547514701-42782101795e?w=800&h=800&fit=crop",
  },
  {
    name: "bananas.jpg",
    url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=800&fit=crop",
  },
  {
    name: "grapes.jpg",
    url: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=800&fit=crop",
  },
  {
    name: "watermelon.jpg",
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
  },
  {
    name: "pineapple.jpg",
    url: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&h=800&fit=crop",
  },
  {
    name: "coconut.jpg",
    url: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&h=800&fit=crop",
  },
  {
    name: "pomegranate.jpg",
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=800&fit=crop",
  },
  {
    name: "papaya.jpg",
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=800&fit=crop",
  },
  {
    name: "guava.jpg",
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=800&fit=crop",
  },
  {
    name: "jackfruit.jpg",
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=800&fit=crop",
  },
  {
    name: "lychee.jpg",
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=800&fit=crop",
  },
  {
    name: "figs.jpg",
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=800&fit=crop",
  },
  {
    name: "pears.jpg",
    url: "https://images.unsplash.com/photo-1514756331096-242f8f0b3fcd?w=800&h=800&fit=crop",
  },
  {
    name: "peaches.jpg",
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=800&fit=crop",
  },
  {
    name: "cherries.jpg",
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
  },
  {
    name: "strawberries.jpg",
    url: "https://images.unsplash.com/photo-1464965911861-746a04b4b0ae?w=800&h=800&fit=crop",
  },
  {
    name: "blueberries.jpg",
    url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&h=800&fit=crop",
  },
  {
    name: "raspberries.jpg",
    url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop",
  },
];

// People images from Unsplash
const peopleImages = [
  {
    name: "person-1.jpg",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    name: "person-2.jpg",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    name: "person-3.jpg",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
  {
    name: "person-4.jpg",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  },
  {
    name: "person-5.jpg",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  },
  {
    name: "person-6.jpg",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
  },
  {
    name: "person-7.jpg",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
  },
  {
    name: "person-8.jpg",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
  },
  {
    name: "person-9.jpg",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
  },
  {
    name: "person-10.jpg",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
];

async function downloadImage(url: string, filepath: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
    console.log(`✓ Downloaded: ${path.basename(filepath)}`);
  } catch (error) {
    console.error(`✗ Failed to download ${url}:`, error);
  }
}

async function downloadLogo(domain: string, filepath: string): Promise<void> {
  try {
    const url = `https://img.logo.dev/${domain}?token=${logoDevToken}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to download logo for ${domain}: ${response.statusText}`,
      );
    }
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
    console.log(`✓ Downloaded logo: ${domain}`);
  } catch (error) {
    console.error(`✗ Failed to download logo for ${domain}:`, error);
  }
}

async function main() {
  console.log("Starting image download...\n");

  // Download Bangladesh company logos using logo.dev
  console.log(
    `Downloading ${bangladeshCompanies.length} Bangladesh company logos...`,
  );
  for (const domain of bangladeshCompanies) {
    const filename = `${domain.replace(/\./g, "-")}.png`;
    const filepath = path.join(publicDir, "logos", filename);

    // Create logos directory if it doesn't exist
    await fs.mkdir(path.join(publicDir, "logos"), { recursive: true });

    await downloadLogo(domain, filepath);
  }

  // Download additional food images
  console.log(
    `\nDownloading ${additionalFoodImages.length} additional food images...`,
  );
  for (const image of additionalFoodImages) {
    const filepath = path.join(publicDir, image.name);
    await downloadImage(image.url, filepath);
  }

  // Download people images
  console.log(`\nDownloading ${peopleImages.length} people images...`);
  for (const image of peopleImages) {
    const filepath = path.join(publicDir, image.name);
    await downloadImage(image.url, filepath);
  }

  console.log("\n✓ Download complete!");
}

main().catch(console.error);
