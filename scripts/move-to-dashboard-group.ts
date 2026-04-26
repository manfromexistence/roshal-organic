import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";

const appDir = join(process.cwd(), "app");
const dashboardDir = join(appDir, "(dashboard)");
const loginDir = join(appDir, "(login)");

// Folders to move to (dashboard) group
const dashboardFolders = [
  "projects",
  "documents",
  "workflows",
  "bulk-upload",
  "schedule",
  "databook",
  "matrix",
  "audit",
  "config",
  "settings",
  "letters",
  "meetings",
  "memos",
  "rfis",
  "site-tech-queries",
  "transmittals",
  "submittals",
  "technical-queries",
  "reports",
  "warranty",
  "safety-observations",
  "extension-of-time",
  "change-orders",
  "commissioning",
  "daily-reports",
  "inspections",
  "notifications",
  "theme",
];

// Files to keep in root (not move)
const rootFiles = [
  "layout.tsx",
  "page.tsx",
  "loading.tsx",
  "error.tsx",
  "not-found.tsx",
  "global-error.tsx",
  "globals.css",
  "favicon.ico",
  "manifest.ts",
  "robots.ts",
  "sitemap.ts",
  "opengraph-image.tsx",
];

// Folders to keep in root (not move)
const rootFolders = ["api", "admin", "about", "privacy", "terms", "login"];

function copyDirSync(src: string, dest: string) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  console.log("Starting folder reorganization...\n");

  // Create (dashboard) directory if it doesn't exist
  if (!existsSync(dashboardDir)) {
    mkdirSync(dashboardDir, { recursive: true });
    console.log("Created (dashboard) directory");
  }

  // Create (login) directory if it doesn't exist
  if (!existsSync(loginDir)) {
    mkdirSync(loginDir, { recursive: true });
    console.log("Created (login) directory");
  }

  // Move dashboard folders
  let movedCount = 0;
  let skippedCount = 0;
  for (const folder of dashboardFolders) {
    const sourcePath = join(appDir, folder);
    const targetPath = join(dashboardDir, folder);

    if (existsSync(sourcePath)) {
      try {
        renameSync(sourcePath, targetPath);
        console.log(`Moved: ${folder} -> (dashboard)/${folder}`);
        movedCount++;
      } catch (error) {
        // If rename fails, try copy-delete approach
        try {
          copyDirSync(sourcePath, targetPath);
          rmSync(sourcePath, { recursive: true, force: true });
          console.log(
            `Moved (copy-delete): ${folder} -> (dashboard)/${folder}`,
          );
          movedCount++;
        } catch (error2) {
          console.log(
            `Skipped (error): ${folder} - ${(error2 as Error).message}`,
          );
          skippedCount++;
        }
      }
    } else {
      console.log(`Skipped (not found): ${folder}`);
      skippedCount++;
    }
  }

  console.log(`\nMoved ${movedCount} folders to (dashboard) group`);
  console.log(`Skipped ${skippedCount} folders`);

  // Move login folder
  const loginSource = join(appDir, "login");
  const loginTarget = join(loginDir, "login");
  if (existsSync(loginSource)) {
    try {
      renameSync(loginSource, loginTarget);
      console.log(`Moved: login -> (login)/login`);
    } catch (error) {
      try {
        copyDirSync(loginSource, loginTarget);
        rmSync(loginSource, { recursive: true, force: true });
        console.log(`Moved (copy-delete): login -> (login)/login`);
      } catch (error2) {
        console.log(`Skipped login: ${(error2 as Error).message}`);
      }
    }
  }

  console.log("\nReorganization complete!");
}

main();
