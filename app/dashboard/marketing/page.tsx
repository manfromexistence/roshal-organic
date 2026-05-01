import {
  ArrowUpRight,
  Eye,
  FilePenLine,
  Home,
  LayoutTemplate,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { HomepageControlCenter } from "@/components/dashboard/homepage-control-center";
import { RoshalPagesTable } from "@/components/dashboard/pages-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalPages, getRoshalSectionsForPage } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";

function storefrontPathFromSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export default async function DashboardMarketingPage() {
  const [locale, pages] = await Promise.all([
    getRoshalLocale(),
    getRoshalPages(),
    requireRoshalAdmin(),
  ]);
  const sectionsByPage = await Promise.all(
    pages.map(async (page) => ({
      page,
      sections: await getRoshalSectionsForPage(page.id),
    })),
  );
  const publishedCount = pages.filter(
    (page) => page.status === "published",
  ).length;
  const navigationCount = pages.filter((page) => page.showInNavigation).length;
  const enabledSectionCount = sectionsByPage.reduce(
    (total, entry) =>
      total + entry.sections.filter((section) => section.isEnabled).length,
    0,
  );
  const totalSectionCount = sectionsByPage.reduce(
    (total, entry) => total + entry.sections.length,
    0,
  );
  const homepage = pages.find((page) => page.slug === "home");

  return (
    <div className="mx-auto min-w-0 max-w-5xl space-y-6 p-6">
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Marketing workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Storefront content center
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Manage the public homepage, content sections, navigation pages, and
            storefront copy through real CMS controls.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/" target="_blank" rel="noreferrer">
              <Eye className="size-4" />
              Open storefront
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/pages#create-marketing-page">
              <Plus className="size-4" />
              New page
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          title="Marketing pages"
          value={pages.length}
          hint={`${publishedCount} published pages`}
        />
        <DashboardMetricCard
          title="Navigation pages"
          value={navigationCount}
          hint={`${pages.length - navigationCount} hidden from navigation`}
        />
        <DashboardMetricCard
          title="Live sections"
          value={`${enabledSectionCount}/${totalSectionCount}`}
          hint="Enabled CMS sections across pages"
        />
        <DashboardMetricCard
          title="Homepage"
          value={homepage ? "Ready" : "Missing"}
          hint={homepage ? "Home page is CMS-managed" : "Create a home page"}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-none bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="size-5 text-primary" />
              Homepage controls
            </CardTitle>
            <CardDescription>
              Jump directly into the real homepage editor or inspect the live
              page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {homepage ? (
              <>
                <Button asChild className="w-full justify-between">
                  <Link href={`/dashboard/pages/${homepage.id}`}>
                    <span className="inline-flex items-center gap-2">
                      <FilePenLine className="size-4" />
                      Edit homepage
                    </span>
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/" target="_blank" rel="noreferrer">
                    <span className="inline-flex items-center gap-2">
                      <Eye className="size-4" />
                      Preview live home
                    </span>
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link href="/dashboard/pages#create-marketing-page">
                  Create homepage
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutTemplate className="size-5 text-primary" />
              Page shortcuts
            </CardTitle>
            <CardDescription>
              Fast access to the most important public marketing pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {pages.slice(0, 6).map((page) => (
              <div
                key={page.id}
                className="rounded-md border bg-background/70 p-3 transition hover:bg-accent/50"
              >
                <p className="truncate text-sm font-semibold">
                  {getLocalizedValue(locale, page.title)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {storefrontPathFromSlug(page.slug)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <Link href={`/dashboard/pages/${page.id}`}>Edit</Link>
                  </Button>
                  {page.status === "published" ? (
                    <Button asChild variant="ghost" size="sm" className="h-8">
                      <Link
                        href={storefrontPathFromSlug(page.slug)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <HomepageControlCenter locale={locale} />

      <RoshalPagesTable pages={pages} locale={locale} />
    </div>
  );
}
