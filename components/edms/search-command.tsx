"use client";

import {
  BellRing,
  FileStack,
  FolderKanban,
  LayoutGrid,
  Loader2,
  Send,
  Workflow,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDashboardSearchPages } from "@/lib/dashboard-navigation";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category:
    | "page"
    | "project"
    | "document"
    | "workflow"
    | "transmittal"
    | "notification";
  href: string;
  meta: string;
}

const CATEGORY_ICONS = {
  page: LayoutGrid,
  project: FolderKanban,
  document: FileStack,
  workflow: Workflow,
  transmittal: Send,
  notification: BellRing,
} as const;

const CATEGORY_LABELS = {
  page: "Pages",
  project: "Projects",
  document: "Documents",
  workflow: "Workflows",
  transmittal: "Transmittals",
  notification: "Notifications",
} as const;

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const searchPages = useMemo(() => getDashboardSearchPages(), []);
  const [query, setQuery] = useState("");
  const [entityResults, setEntityResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setEntityResults([]);
    }
  }, [open]);

  const pageResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [] as SearchResult[];
    }

    return searchPages
      .filter((page) => {
        const haystack = [
          page.title,
          page.subtitle,
          page.href,
          ...page.keywords,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .slice(0, 8)
      .map((page) => ({
        id: page.id,
        title: page.title,
        subtitle: page.subtitle,
        category: "page" as const,
        href: page.href,
        meta: page.href,
      }));
  }, [query, searchPages]);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setEntityResults([]);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(normalizedQuery)}`,
          {
            signal: abortController.signal,
          },
        );

        if (response.ok) {
          const data = await response.json();
          setEntityResults(data.results || []);
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Search error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      abortController.abort();
      clearTimeout(searchTimeout);
    };
  }, [query]);

  const results = useMemo(() => {
    const mergedResults = [...pageResults];
    const seen = new Set(pageResults.map((result) => result.href));

    for (const result of entityResults) {
      if (seen.has(result.href)) {
        continue;
      }

      seen.add(result.href);
      mergedResults.push(result);
    }

    return mergedResults;
  }, [entityResults, pageResults]);

  const groupedResults = useMemo(() => {
    return results.reduce(
      (accumulator, result) => {
        const bucket = accumulator[result.category] || [];
        bucket.push(result);
        accumulator[result.category] = bucket;
        return accumulator;
      },
      {} as Partial<Record<SearchResult["category"], SearchResult[]>>,
    );
  }, [results]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Quadra EDMS"
      description="Search pages, registers, and live project records."
      className="sm:max-w-2xl"
    >
      <CommandInput
        placeholder="Search pages, documents, workflows, transmittals..."
        value={query}
        onValueChange={setQuery}
      />
      <ScrollArea
        className="max-h-[min(28rem,70vh)]"
        viewportClassName="min-w-0"
      >
        <CommandList className="max-h-none overflow-visible">
          {query.trim().length === 0 ? (
            <CommandEmpty>
              Start typing to search across pages and live EDMS records.
            </CommandEmpty>
          ) : isLoading && results.length === 0 ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          ) : (
            Object.entries(groupedResults).map(([category, items], index) => {
              if (!items || items.length === 0) {
                return null;
              }

              const Icon =
                CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
              const label =
                CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS];

              return (
                <div key={category}>
                  {index > 0 && <CommandSeparator />}
                  <CommandGroup heading={label}>
                    {items.map((result) => (
                      <CommandItem
                        key={`${result.category}-${result.id}`}
                        value={`${result.title} ${result.subtitle} ${result.meta}`}
                        onSelect={() => {
                          router.push(result.href);
                          onOpenChange(false);
                        }}
                        className="flex items-start gap-3 py-3"
                      >
                        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium leading-none">
                              {result.title}
                            </p>
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {result.subtitle}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.meta}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              );
            })
          )}
        </CommandList>
      </ScrollArea>
    </CommandDialog>
  );
}
