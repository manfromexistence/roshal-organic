"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Eye,
  FilePenLine,
  LoaderCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMarketingDashboardStore } from "@/store/marketing-dashboard-store";

interface HomepageControlCenterProps {
  locale: "bn" | "en";
}

interface HomeControlGuide {
  sectionKey: string;
  label: string;
  summary: string;
  contentHint: string;
  stylesHint: string;
  recommendedTypes: string[];
  styleKeys: string[];
}

interface HomeControlSection {
  id: string;
  sectionKey: string;
  type: string;
  sortOrder: number;
  layout: string;
  variant: string;
  isEnabled: boolean;
  title: string;
  body: string;
  itemCount: number;
  styleKeys: string[];
  styleValues: Record<string, string>;
  editorHref: string;
  guide: HomeControlGuide | null;
}

interface HomeControlData {
  generatedAt: string;
  overview: {
    totalPages: number;
    publishedPages: number;
    totalProducts: number;
    publishedProducts: number;
    featuredProducts: number;
    totalSections: number;
    enabledSections: number;
  };
  homePage: {
    id: string;
    title: string;
    description: string;
    status: string;
    editorHref: string;
    liveHref: string;
  };
  siteSettings: {
    brandName: string;
    primaryCtaHref: string;
    primaryCtaLabel: string;
    heroLayout: string;
    cardStyle: string;
    sectionSpacing: string;
  };
  guides: HomeControlGuide[];
  sections: HomeControlSection[];
}

async function fetchHomeControlCenter() {
  const response = await fetch("/api/cms/home", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not load the homepage control center.");
  }

  return (await response.json()) as HomeControlData;
}

async function updateSectionState(input: { id: string; isEnabled: boolean }) {
  const response = await fetch(`/api/cms/sections/${input.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      isEnabled: input.isEnabled,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not update section visibility.");
  }

  return response.json() as Promise<{
    section: {
      id: string;
      isEnabled: boolean;
    };
  }>;
}

export function HomepageControlCenter({ locale }: HomepageControlCenterProps) {
  const queryKey = ["roshal-home-control-center", locale] as const;
  const copy = locale === "bn" ? banglaCopy : englishCopy;
  const queryClient = useQueryClient();
  const activeTab = useMarketingDashboardStore((state) => state.activeTab);
  const search = useMarketingDashboardStore((state) => state.search);
  const showDisabled = useMarketingDashboardStore(
    (state) => state.showDisabled,
  );
  const selectedSectionKey = useMarketingDashboardStore(
    (state) => state.selectedSectionKey,
  );
  const setActiveTab = useMarketingDashboardStore(
    (state) => state.setActiveTab,
  );
  const setSearch = useMarketingDashboardStore((state) => state.setSearch);
  const setShowDisabled = useMarketingDashboardStore(
    (state) => state.setShowDisabled,
  );
  const setSelectedSectionKey = useMarketingDashboardStore(
    (state) => state.setSelectedSectionKey,
  );
  const [toggleError, setToggleError] = useState<string | null>(null);
  const { data, error, isFetching, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: fetchHomeControlCenter,
  });

  const toggleMutation = useMutation({
    mutationFn: updateSectionState,
    onMutate: async (input) => {
      setToggleError(null);
      await queryClient.cancelQueries({
        queryKey,
      });

      const previous = queryClient.getQueryData<HomeControlData>(queryKey);

      queryClient.setQueryData<HomeControlData>(queryKey, (current) =>
        current
          ? {
              ...current,
              overview: {
                ...current.overview,
                enabledSections: current.sections.reduce((count, section) => {
                  if (section.id === input.id) {
                    return count + (input.isEnabled ? 1 : 0);
                  }

                  return count + (section.isEnabled ? 1 : 0);
                }, 0),
              },
              sections: current.sections.map((section) =>
                section.id === input.id
                  ? {
                      ...section,
                      isEnabled: input.isEnabled,
                    }
                  : section,
              ),
            }
          : current,
      );

      return { previous };
    },
    onError: (mutationError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      setToggleError(
        mutationError instanceof Error
          ? mutationError.message
          : "Could not update section visibility.",
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const sections =
    data?.sections.filter((section) => {
      const matchesState = showDisabled || section.isEnabled;

      if (!matchesState) {
        return false;
      }

      if (!search.trim()) {
        return true;
      }

      const candidate =
        `${section.sectionKey} ${section.title} ${section.type} ${section.layout} ${section.variant}`
          .toLowerCase()
          .trim();

      return candidate.includes(search.toLowerCase().trim());
    }) || [];
  const selectedSection =
    sections.find((section) => section.sectionKey === selectedSectionKey) ||
    data?.sections.find(
      (section) => section.sectionKey === selectedSectionKey,
    ) ||
    sections[0] ||
    data?.sections[0] ||
    null;

  useEffect(() => {
    if (!selectedSectionKey && data?.sections[0]) {
      setSelectedSectionKey(data.sections[0].sectionKey);
    }
  }, [data?.sections, selectedSectionKey, setSelectedSectionKey]);

  useEffect(() => {
    if (
      selectedSectionKey &&
      data?.sections.some(
        (section) => section.sectionKey === selectedSectionKey,
      )
    ) {
      return;
    }

    if (data?.sections[0]) {
      setSelectedSectionKey(data.sections[0].sectionKey);
    }
  }, [data?.sections, selectedSectionKey, setSelectedSectionKey]);

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="gap-4 p-4 sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <CardTitle className="break-words text-xl sm:text-2xl">
              {copy.title}
            </CardTitle>
            <CardDescription className="max-w-3xl break-words text-sm leading-6">
              {copy.description}
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={data?.homePage.liveHref || "/"}>
                <Eye className="size-4" />
                {copy.openLive}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={data?.homePage.editorHref || "/dashboard/pages"}>
                <FilePenLine className="size-4" />
                {copy.openEditor}
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              {copy.refresh}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 space-y-5 p-4 sm:space-y-6 sm:p-6">
        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
            {error instanceof Error ? error.message : copy.error}
          </div>
        ) : null}
        {toggleError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
            {toggleError}
          </div>
        ) : null}

        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy.metrics.sections}
            value={
              isLoading
                ? "..."
                : `${data?.overview.enabledSections || 0}/${data?.overview.totalSections || 0}`
            }
            hint={copy.metrics.sectionsHint}
          />
          <MetricCard
            label={copy.metrics.pages}
            value={
              isLoading ? "..." : String(data?.overview.publishedPages || 0)
            }
            hint={copy.metrics.pagesHint}
          />
          <MetricCard
            label={copy.metrics.products}
            value={
              isLoading
                ? "..."
                : `${data?.overview.publishedProducts || 0}/${data?.overview.totalProducts || 0}`
            }
            hint={copy.metrics.productsHint}
          />
          <MetricCard
            label={copy.metrics.featured}
            value={
              isLoading ? "..." : String(data?.overview.featuredProducts || 0)
            }
            hint={copy.metrics.featuredHint}
          />
        </div>

        <div className="grid min-w-0 gap-4 rounded-2xl border border-border/70 bg-muted/20 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-medium">{copy.liveModelTitle}</p>
            <p className="break-words text-sm text-muted-foreground">
              {data
                ? copy.liveModelBody
                    .replace("{heroLayout}", data.siteSettings.heroLayout)
                    .replace("{cardStyle}", data.siteSettings.cardStyle)
                    .replace(
                      "{sectionSpacing}",
                      data.siteSettings.sectionSpacing,
                    )
                : copy.loadingModel}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-self-start sm:w-auto md:justify-self-end"
          >
            <Link href="/dashboard/theme">
              {copy.openTheme}
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value === "guides" ? "guides" : "sections")
          }
          className="min-w-0 space-y-4"
        >
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
              <TabsTrigger value="sections">{copy.tabs.sections}</TabsTrigger>
              <TabsTrigger value="guides">{copy.tabs.guides}</TabsTrigger>
            </TabsList>

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="pl-9"
                />
              </div>
              <div className="flex min-w-0 items-center gap-3">
                <Switch
                  id="show-disabled-sections"
                  checked={showDisabled}
                  onCheckedChange={setShowDisabled}
                />
                <Label htmlFor="show-disabled-sections">
                  {copy.showDisabled}
                </Label>
              </div>
            </div>
          </div>

          <TabsContent value="sections" className="space-y-4">
            <div className="grid min-w-0 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="min-w-0 space-y-3">
                {sections.length ? (
                  sections.map((section) => {
                    const isSelected =
                      selectedSection?.sectionKey === section.sectionKey;

                    return (
                      <Card
                        key={section.id}
                        className={cn(
                          "min-w-0 overflow-hidden border-border/70 transition-colors",
                          isSelected && "border-primary/50 bg-primary/5",
                        )}
                      >
                        <CardContent className="min-w-0 space-y-4 p-4">
                          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="break-words font-medium">
                                  {section.title}
                                </p>
                                <Badge
                                  variant="secondary"
                                  className="max-w-full truncate"
                                >
                                  {section.sectionKey}
                                </Badge>
                                <Badge
                                  variant={
                                    section.isEnabled ? "default" : "outline"
                                  }
                                >
                                  {section.isEnabled
                                    ? copy.enabled
                                    : copy.disabled}
                                </Badge>
                              </div>
                              <p className="break-words text-sm text-muted-foreground">
                                {section.guide?.summary ||
                                  section.body ||
                                  copy.noGuide}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <div className="text-right text-xs text-muted-foreground">
                                <p>
                                  {copy.items}: {section.itemCount}
                                </p>
                                <p>
                                  {copy.sortOrder}: {section.sortOrder}
                                </p>
                              </div>
                              <Switch
                                checked={section.isEnabled}
                                disabled={toggleMutation.isPending}
                                onCheckedChange={(checked) =>
                                  toggleMutation.mutate({
                                    id: section.id,
                                    isEnabled: checked,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="flex min-w-0 flex-wrap gap-2">
                            <Badge variant="outline">{section.type}</Badge>
                            <Badge variant="outline">{section.layout}</Badge>
                            <Badge variant="outline">{section.variant}</Badge>
                            {section.styleKeys.map((styleKey) => (
                              <Badge
                                key={styleKey}
                                variant="outline"
                                className="max-w-full truncate"
                              >
                                {styleKey}: {section.styleValues[styleKey]}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setSelectedSectionKey(section.sectionKey)
                              }
                            >
                              {copy.inspect}
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={section.editorHref}>
                                {copy.editSection}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card>
                    <CardContent className="p-6 text-sm text-muted-foreground">
                      {copy.emptyState}
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                  <CardTitle className="break-words">
                    {selectedSection?.title || copy.sectionDetails}
                  </CardTitle>
                  <CardDescription className="break-words">
                    {selectedSection?.guide?.summary || copy.sectionDetailsHint}
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-w-0 space-y-5">
                  {selectedSection ? (
                    <>
                      <div className="flex min-w-0 flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className="max-w-full truncate"
                        >
                          {selectedSection.sectionKey}
                        </Badge>
                        <Badge variant="outline">{selectedSection.type}</Badge>
                        <Badge variant="outline">
                          {selectedSection.layout}
                        </Badge>
                        <Badge variant="outline">
                          {selectedSection.variant}
                        </Badge>
                      </div>

                      <DetailBlock
                        label={copy.contentRules}
                        value={
                          selectedSection.guide?.contentHint ||
                          copy.noGuideAvailable
                        }
                      />
                      <DetailBlock
                        label={copy.styleRules}
                        value={
                          selectedSection.guide?.stylesHint ||
                          copy.noGuideAvailable
                        }
                      />
                      <DetailBlock
                        label={copy.currentBody}
                        value={selectedSection.body || copy.bodyFallback}
                      />

                      <div className="space-y-2">
                        <p className="text-sm font-medium">{copy.styleKeys}</p>
                        <div className="flex min-w-0 flex-wrap gap-2">
                          {selectedSection.guide?.styleKeys.length ? (
                            selectedSection.guide.styleKeys.map((styleKey) => (
                              <Badge key={styleKey} variant="outline">
                                {styleKey}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">{copy.none}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          {copy.currentStyles}
                        </p>
                        <div className="flex min-w-0 flex-wrap gap-2">
                          {selectedSection.styleKeys.length ? (
                            selectedSection.styleKeys.map((styleKey) => (
                              <Badge
                                key={styleKey}
                                variant="secondary"
                                className="max-w-full truncate"
                              >
                                {styleKey}:{" "}
                                {selectedSection.styleValues[styleKey]}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">{copy.none}</Badge>
                          )}
                        </div>
                      </div>

                      <Button asChild className="w-full">
                        <Link href={selectedSection.editorHref}>
                          {copy.openSectionEditor}
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {copy.selectSection}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            <div className="grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {(data?.guides || []).map((guide) => (
                <Card key={guide.sectionKey} className="min-w-0">
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="break-words text-lg">
                        {guide.label}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="max-w-full truncate"
                      >
                        {guide.sectionKey}
                      </Badge>
                    </div>
                    <CardDescription className="break-words">
                      {guide.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <DetailBlock
                      label={copy.contentRules}
                      value={guide.contentHint}
                    />
                    <DetailBlock
                      label={copy.styleRules}
                      value={guide.stylesHint}
                    />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {copy.recommendedTypes}
                      </p>
                      <div className="flex min-w-0 flex-wrap gap-2">
                        {guide.recommendedTypes.map((type) => (
                          <Badge key={type} variant="outline">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{copy.styleKeys}</p>
                      <div className="flex min-w-0 flex-wrap gap-2">
                        {guide.styleKeys.length ? (
                          guide.styleKeys.map((styleKey) => (
                            <Badge
                              key={styleKey}
                              variant="outline"
                              className="max-w-full truncate"
                            >
                              {styleKey}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">{copy.none}</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="min-w-0 border-border/70">
      <CardContent className="min-w-0 space-y-2 p-4">
        <p className="break-words text-sm text-muted-foreground">{label}</p>
        <p className="break-words text-2xl font-semibold tracking-tight">
          {value}
        </p>
        <p className="break-words text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="break-words text-sm font-medium">{label}</p>
      <p className="break-words text-sm leading-6 text-muted-foreground">
        {value}
      </p>
    </div>
  );
}

const englishCopy = {
  title: "Homepage control center",
  description:
    "This keeps the current marketing landing page intact while giving admins a cleaner control layer over the homepage data model, section visibility, and editing flow.",
  openLive: "Open live home",
  openEditor: "Open full editor",
  refresh: "Refresh",
  error: "Could not load the homepage control center.",
  metrics: {
    sections: "Active sections",
    sectionsHint: "Homepage blocks currently enabled on the storefront.",
    pages: "Published pages",
    pagesHint: "Storefront pages currently visible to customers.",
    products: "Published products",
    productsHint: "Catalog coverage available to homepage product sections.",
    featured: "Featured products",
    featuredHint:
      "Products currently available for featured-driven home rails.",
  },
  liveModelTitle: "Live rendering model",
  liveModelBody:
    "The homepage currently renders with hero layout {heroLayout}, card style {cardStyle}, and section spacing {sectionSpacing}. Changing storefront theme settings affects the same live composition system.",
  loadingModel: "Loading the current live rendering model.",
  openTheme: "Open storefront theme",
  tabs: {
    sections: "Live sections",
    guides: "Section guides",
  },
  searchPlaceholder: "Search section key, title, layout, or type",
  showDisabled: "Show disabled sections",
  enabled: "Enabled",
  disabled: "Disabled",
  items: "Items",
  sortOrder: "Sort",
  inspect: "Inspect",
  editSection: "Edit section",
  emptyState:
    "No homepage sections matched the current filters. Try clearing the search or showing disabled sections.",
  sectionDetails: "Section details",
  sectionDetailsHint:
    "Select a section to review how it maps to the live homepage.",
  contentRules: "Content rules",
  styleRules: "stylesJson rules",
  currentBody: "Current body copy",
  styleKeys: "Supported style keys",
  currentStyles: "Current style values",
  recommendedTypes: "Recommended section types",
  noGuide: "No guide summary is available for this section yet.",
  noGuideAvailable: "No detailed guide is available for this section yet.",
  bodyFallback:
    "This section currently relies more on its items or product source than on body copy.",
  none: "None",
  openSectionEditor: "Open section editor",
  selectSection: "Select a section from the left to inspect it here.",
};

const banglaCopy = {
  title: "Homepage control center",
  description:
    "বর্তমান মার্কেটিং ল্যান্ডিং UI অপরিবর্তিত রেখেই এই কন্ট্রোল লেয়ার হোমপেজের ডাটা মডেল, সেকশন ভিজিবিলিটি এবং এডিটিং ফ্লোকে ড্যাশবোর্ড থেকে সহজ করে।",
  openLive: "লাইভ হোম দেখুন",
  openEditor: "ফুল এডিটর খুলুন",
  refresh: "রিফ্রেশ",
  error: "হোমপেজ কন্ট্রোল সেন্টার লোড করা যায়নি।",
  metrics: {
    sections: "চালু সেকশন",
    sectionsHint: "স্টোরফ্রন্টে বর্তমানে চালু থাকা হোমপেজ ব্লক।",
    pages: "পাবলিশড পেজ",
    pagesHint: "গ্রাহকদের কাছে দৃশ্যমান স্টোরফ্রন্ট পেজ।",
    products: "পাবলিশড প্রোডাক্ট",
    productsHint: "হোমপেজের প্রোডাক্ট সেকশনের জন্য উপলব্ধ ক্যাটালগ।",
    featured: "ফিচারড প্রোডাক্ট",
    featuredHint: "ফিচারড-ভিত্তিক হোম সেকশনের জন্য প্রস্তুত প্রোডাক্ট।",
  },
  liveModelTitle: "লাইভ রেন্ডারিং মডেল",
  liveModelBody:
    "হোমপেজ এখন hero layout {heroLayout}, card style {cardStyle}, এবং section spacing {sectionSpacing} ব্যবহার করছে। স্টোরফ্রন্ট theme settings পরিবর্তন করলে একই লাইভ কম্পোজিশন সিস্টেম আপডেট হয়।",
  loadingModel: "লাইভ রেন্ডারিং মডেল লোড হচ্ছে।",
  openTheme: "স্টোরফ্রন্ট থিম খুলুন",
  tabs: {
    sections: "লাইভ সেকশন",
    guides: "সেকশন গাইড",
  },
  searchPlaceholder: "section key, title, layout বা type খুঁজুন",
  showDisabled: "বন্ধ সেকশনও দেখান",
  enabled: "চালু",
  disabled: "বন্ধ",
  items: "আইটেম",
  sortOrder: "সোর্ট",
  inspect: "খুলে দেখুন",
  editSection: "সেকশন এডিট করুন",
  emptyState:
    "বর্তমান ফিল্টারে কোনো হোমপেজ সেকশন পাওয়া যায়নি। সার্চ ক্লিয়ার করুন বা বন্ধ সেকশন দেখান।",
  sectionDetails: "সেকশন ডিটেইলস",
  sectionDetailsHint:
    "লাইভ হোমপেজে সেকশনটি কীভাবে ম্যাপ হয় তা দেখতে একটি সেকশন সিলেক্ট করুন।",
  contentRules: "কনটেন্ট রুল",
  styleRules: "stylesJson রুল",
  currentBody: "বর্তমান বডি কপি",
  styleKeys: "সমর্থিত style key",
  currentStyles: "বর্তমান style value",
  recommendedTypes: "প্রস্তাবিত section type",
  noGuide: "এই সেকশনের জন্য এখনো কোনো গাইড সারাংশ নেই।",
  noGuideAvailable: "এই সেকশনের জন্য এখনো বিস্তারিত গাইড নেই।",
  bodyFallback:
    "এই সেকশনটি বডি কপির চেয়ে items বা product source-এর উপর বেশি নির্ভর করছে।",
  none: "নেই",
  openSectionEditor: "সেকশন এডিটর খুলুন",
  selectSection: "বাম দিক থেকে একটি সেকশন বেছে নিন।",
};
