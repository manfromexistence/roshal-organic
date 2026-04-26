"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ENTITY_TYPE_OPTIONS = [
  { value: "all", label: "All event types" },
  { value: "project", label: "Projects" },
  { value: "document", label: "Documents" },
  { value: "workflow", label: "Workflows" },
  { value: "transmittal", label: "Transmittals" },
  { value: "letter", label: "Letters" },
  { value: "notification", label: "Notifications" },
] as const;

interface AuditFiltersProps {
  initialEntityType?: string;
  initialQuery?: string;
}

export function AuditFilters({
  initialEntityType = "",
  initialQuery = "",
}: AuditFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const [entityType, setEntityType] = useState(initialEntityType || "all");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      const nextParams = new URLSearchParams(searchParams.toString());
      const trimmedQuery = query.trim();

      if (trimmedQuery) {
        nextParams.set("query", trimmedQuery);
      } else {
        nextParams.delete("query");
      }

      if (entityType && entityType !== "all") {
        nextParams.set("entityType", entityType);
      } else {
        nextParams.delete("entityType");
      }

      const nextUrl = nextParams.toString()
        ? `${pathname}?${nextParams.toString()}`
        : pathname;

      router.push(nextUrl);
    });
  };

  return (
    <form className="flex flex-wrap gap-3" onSubmit={handleSubmit}>
      <div className="relative min-w-48 flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search actor, action, document code..."
          className="pl-9"
        />
      </div>

      <Select value={entityType || "all"} onValueChange={setEntityType}>
        <SelectTrigger className="min-w-44">
          <SelectValue placeholder="All event types" />
        </SelectTrigger>
        <SelectContent>
          {ENTITY_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Filtering..." : "Filter"}
      </Button>
    </form>
  );
}
