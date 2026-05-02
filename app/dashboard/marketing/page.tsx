import {
  ArrowUpRight,
  Eye,
  FilePenLine,
  Home,
  LayoutTemplate,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { CmsSaveToast } from "@/components/dashboard/cms-save-toast";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { HomepageControlCenter } from "@/components/dashboard/homepage-control-center";
import { RoshalPagesTable } from "@/components/dashboard/pages-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isDashboardHandoffMarketingSlug } from "@/lib/dashboard-navigation";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalPages, getRoshalSectionsForPage } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";

function storefrontPathFromSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export default async function DashboardMarketingPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, pages] = await Promise.all([
    getRoshalLocale(),
    getRoshalPages(),
    requireRoshalAdmin(),
  ]);
  // Keep the dashboard Marketing page list aligned with the simplified sidebar for client handoff.
  const visibleDashboardPages = pages.filter((page) =>
    isDashboardHandoffMarketingSlug(page.slug),
  );
  const sectionsByPage = await Promise.all(
    visibleDashboardPages.map(async (page) => ({
      page,
      sections: await getRoshalSectionsForPage(page.id),
    })),
  );
  const publishedCount = visibleDashboardPages.filter(
    (page) => page.status === "published",
  ).length;
  const navigationCount = visibleDashboardPages.filter(
    (page) => page.showInNavigation,
  ).length;
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
    <div className="min-w-0 max-w-full space-y-5 overflow-x-clip px-4 pt-4 pb-4 sm:px-6 md:space-y-6 md:pt-6 md:pb-4">
      <CmsSaveToast status={resolvedSearchParams.saved} />
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Marketing workspace
          </p>
          <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
            Storefront content center
          </h1>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted-foreground">
            Manage the public homepage, content sections, navigation pages, and
            storefront copy through real CMS controls.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/" target="_blank" rel="noreferrer">
              <Eye className="size-4" />
              Open storefront
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/pages#create-marketing-page">
              <Plus className="size-4" />
              New page
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardMetricCard
          title="Marketing pages"
          value={visibleDashboardPages.length}
          hint={`${publishedCount} published pages`}
        />
        <DashboardMetricCard
          title="Navigation pages"
          value={navigationCount}
          hint={`${visibleDashboardPages.length - navigationCount} hidden from navigation`}
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

      <div className="grid min-w-0 gap-4">
        <Card className="min-w-0 overflow-hidden border-none bg-card shadow-sm">
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
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem
          className="rounded-lg border-none bg-card px-4 shadow-sm"
          value="page-shortcuts"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="min-w-0 text-left">
              <span className="flex items-center gap-2 text-base font-semibold">
                <LayoutTemplate className="size-5 text-primary" />
                Page shortcuts
              </span>
              <span className="block text-sm font-normal text-muted-foreground">
                Open only when jumping into another public marketing page.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid min-w-0 grid-cols-2 gap-3">
              {visibleDashboardPages.map((page) => (
                <div
                  key={page.id}
                  className="min-w-0 rounded-md border bg-background/70 p-3 transition hover:bg-accent/50"
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
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          className="rounded-lg border-none bg-card px-4 shadow-sm"
          value="homepage-controls"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="min-w-0 text-left">
              <span className="block text-base font-semibold">
                Advanced homepage controls
              </span>
              <span className="block text-sm font-normal text-muted-foreground">
                Open only when changing CMS section visibility or section-level
                homepage settings.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <HomepageControlCenter locale={locale} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <RoshalPagesTable pages={visibleDashboardPages} locale={locale} />
    </div>
  );
}
