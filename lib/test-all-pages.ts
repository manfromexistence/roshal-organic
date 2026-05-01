import { existsSync } from "node:fs";
import { join } from "node:path";

const pages = [
  "/",
  "/about",
  "/account",
  "/cart",
  "/checkout",
  "/collections",
  "/contact",
  "/favorites",
  "/login",
  "/orders",
  "/payment-return",
  "/products",
  "/profile",
  "/track-order",
  "/dashboard",
  "/dashboard/categories",
  "/dashboard/categories/new",
  "/dashboard/categories/sub/new",
  "/dashboard/marketing",
  "/dashboard/orders",
  "/dashboard/pages",
  "/dashboard/payments",
  "/dashboard/products",
  "/dashboard/products/new",
  "/dashboard/settings",
  "/dashboard/theme",
  "/dashboard/users",
];

function getPagePath(url: string): string {
  if (url === "/") {
    return join(process.cwd(), "app", "(marketing)", "page.tsx");
  }

  const routePath = url.replace(/^\//, "");
  const candidates = [
    join(process.cwd(), "app", routePath, "page.tsx"),
    join(process.cwd(), "app", "(marketing)", routePath, "page.tsx"),
    join(process.cwd(), "app", "(login)", routePath, "page.tsx"),
  ];

  return candidates.find((candidate) => existsSync(candidate)) || candidates[0];
}

function testPageExists(url: string): { exists: boolean; path: string } {
  const path = getPagePath(url);
  const exists = existsSync(path);
  return { exists, path };
}

async function testAllPages() {
  console.log("=== Testing All Dashboard Pages ===\n");

  const results: { url: string; exists: boolean; path: string }[] = [];

  for (const url of pages) {
    const result = testPageExists(url);
    results.push({ url, ...result });

    if (result.exists) {
      console.log(`[OK] ${url} - EXISTS`);
    } else {
      console.log(`[MISSING] ${url} - MISSING`);
    }
  }

  const existing = results.filter((r) => r.exists);
  const missing = results.filter((r) => !r.exists);

  console.log(`\n=== Summary ===`);
  console.log(`Total pages: ${results.length}`);
  console.log(`Existing: ${existing.length}`);
  console.log(`Missing: ${missing.length}`);

  if (missing.length > 0) {
    console.log(`\n=== Missing Pages ===`);
    missing.forEach((m) => {
      console.log(`  ${m.url} - ${m.path}`);
    });
  }

  return {
    total: results.length,
    existing: existing.length,
    missing: missing.length,
  };
}

// Run tests if executed directly
if (require.main === module) {
  testAllPages()
    .then((result) => {
      if (result.missing === 0) {
        console.log("\n[OK] All pages exist");
        process.exit(0);
      } else {
        console.log(`\n[MISSING] ${result.missing} pages are missing`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Error running tests:", error);
      process.exit(1);
    });
}

export { testAllPages };
