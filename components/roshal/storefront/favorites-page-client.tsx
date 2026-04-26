"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { RoshalProductCard } from "@/components/roshal/storefront/product-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import type { RoshalLocale, RoshalProduct } from "@/lib/roshal/types";
import { EMPTY_WISHLIST_IDS, useWishlistStore } from "@/store/wishlist-store";

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function FavoritesPageClient({
  locale,
  products,
}: {
  locale: RoshalLocale;
  products: RoshalProduct[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedQuery = normalizeSearchValue(deferredSearchQuery);
  const { data: session } = authClient.useSession();
  const ownerKey = session?.user?.id || "guest";
  const syncOwner = useWishlistStore((state) => state.syncOwner);
  const clearFavorites = useWishlistStore((state) => state.clearFavorites);
  const favoriteIds = useWishlistStore(
    (state) => state.favoritesByOwner[ownerKey],
  );
  const safeFavoriteIds = isHydrated
    ? (favoriteIds ?? EMPTY_WISHLIST_IDS)
    : EMPTY_WISHLIST_IDS;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      syncOwner(session.user.id);
    }
  }, [session?.user?.id, syncOwner]);

  const favoriteProducts = useMemo(() => {
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    return safeFavoriteIds
      .map((productId) => productMap.get(productId))
      .filter((product): product is RoshalProduct => Boolean(product));
  }, [products, safeFavoriteIds]);

  const filteredProducts = favoriteProducts.filter((product) => {
    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      product.name.bn,
      product.name.en,
      product.summary.bn,
      product.summary.en,
      product.categoryLabel.bn,
      product.categoryLabel.en,
    ]
      .join(" ")
      .toLocaleLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return (
    <div className="container mx-auto space-y-8 px-4 py-10">
      <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-background via-background to-muted/50">
        <CardContent className="space-y-5 p-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-primary">
              {locale === "bn" ? "পছন্দের তালিকা" : "Favorites"}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              {locale === "bn" ? "আমার পছন্দের পণ্য" : "Saved products"}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {locale === "bn"
                ? "পরে কেনার জন্য যেসব পণ্য আলাদা করে রেখেছেন সেগুলো এখানে এক জায়গায় দেখুন।"
                : "Keep products you want to revisit or buy later in one place."}
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr,auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={
                  locale === "bn" ? "পণ্য বা ক্যাটাগরি খুঁজুন" : "Search saved products"
                }
                className="pl-9"
              />
            </div>
            {favoriteProducts.length ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => clearFavorites(ownerKey)}
              >
                {locale === "bn" ? "সব মুছুন" : "Clear all"}
              </Button>
            ) : null}
          </div>

          {!session?.user ? (
            <Alert>
              <AlertDescription>
                {locale === "bn"
                  ? "লগইন না করলেও এই ব্রাউজারে পছন্দের তালিকা সংরক্ষিত থাকবে। লগইন করলে তা আপনার অ্যাকাউন্টে মিশে যাবে।"
                  : "Favorites stay saved in this browser even before sign in, and they will merge into your account after login."}
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      {filteredProducts.length === 0 ? (
        <Card className="border-dashed border-border/70">
          <CardContent className="space-y-4 p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              {favoriteProducts.length === 0
                ? locale === "bn"
                  ? "এখনও কোনো পণ্য সংরক্ষণ করা হয়নি"
                  : "No products saved yet"
                : locale === "bn"
                  ? "মিলে এমন কোনো পণ্য পাওয়া যায়নি"
                  : "No matching saved products found"}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {favoriteProducts.length === 0
                ? locale === "bn"
                  ? "হোম, ক্যাটালগ বা পণ্যের বিস্তারিত পেজ থেকে হার্ট আইকনে চাপ দিয়ে পণ্য সংরক্ষণ করুন।"
                  : "Use the heart button from the home page, catalog, or product details page to save products here."
                : locale === "bn"
                  ? "অন্য কিওয়ার্ড দিয়ে খুঁজুন বা সার্চ পরিষ্কার করুন।"
                  : "Try another keyword or clear the search."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {favoriteProducts.length ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  {locale === "bn" ? "সার্চ রিসেট" : "Reset search"}
                </Button>
              ) : null}
              <Button asChild>
                <Link href="/products">
                  {locale === "bn" ? "পণ্য দেখুন" : "Browse products"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {locale === "bn"
              ? `${filteredProducts.length}টি সংরক্ষিত পণ্য পাওয়া গেছে`
              : `${filteredProducts.length} saved products found`}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <RoshalProductCard
                key={product.id}
                product={product}
                locale={locale}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
