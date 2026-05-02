"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function safeParseStringArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function normalizeItems(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

export function DashboardImageGalleryField({
  defaultValue,
  hint,
  label,
  name,
}: {
  defaultValue: string;
  hint?: string;
  label: string;
  name: string;
}) {
  const [items, setItems] = useState<string[]>(() =>
    safeParseStringArray(defaultValue),
  );
  const serializedValue = useMemo(
    () => JSON.stringify(normalizeItems(items), null, 2),
    [items],
  );

  const updateItem = (index: number, value: string) => {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  };

  const removeItem = (index: number) => {
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>{label}</Label>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>

      <input type="hidden" name={name} value={serializedValue} />

      <div className="space-y-3 rounded-xl border border-border/70 bg-muted/10 p-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No gallery images yet. Add an image and upload or paste its URL.
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={`${name}-${index}`}
              className="grid gap-3 rounded-lg border border-border/60 bg-background/70 p-3 md:grid-cols-[minmax(0,1fr)_auto]"
            >
              <ImageUploadField
                compact
                clearLabel="Clear"
                label={`Image ${index + 1}`}
                uploadLabel="Upload image"
                uploadingLabel="Uploading"
                value={item}
                onChange={(value) => updateItem(index, value)}
                previewClassName="max-w-40"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 self-end text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          ))
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setItems((current) => [...current, ""])}
        >
          <Plus className="size-4" />
          Add image
        </Button>
      </div>
    </div>
  );
}
