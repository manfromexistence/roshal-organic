"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ImageUploadField({
  clearLabel = "Clear",
  compact = false,
  label,
  helperText,
  name,
  showPreview = true,
  uploadLabel = "Upload",
  uploadingLabel = "Uploading",
  value,
  previewClassName,
  previewValue = "",
  onChange,
}: {
  clearLabel?: string;
  compact?: boolean;
  label: string;
  helperText?: string;
  name?: string;
  showPreview?: boolean;
  uploadLabel?: string;
  uploadingLabel?: string;
  value: string;
  previewClassName?: string;
  previewValue?: string;
  onChange?: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const displayPreviewValue = currentValue || previewValue;
  const inputId = useId();
  const fileInputId = `${inputId}-file`;

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const updateValue = (nextValue: string) => {
    setCurrentValue(nextValue);
    onChange?.(nextValue);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const response = await fetch("/api/upload/imgbb", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const data = (await response.json()) as {
        error?: string;
        url?: string;
      };

      if (!response.ok || typeof data.url !== "string" || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      updateValue(data.url);
      toast({
        title: "Image uploaded",
        description: "The image is now linked to this field.",
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not upload the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="min-w-0 space-y-3">
      <div className="space-y-2">
        <Label htmlFor={inputId}>{label}</Label>
        {helperText ? (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        ) : null}
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-col gap-3",
          !compact && "md:flex-row",
          compact && "gap-2",
        )}
      >
        <Input
          id={inputId}
          name={name}
          value={currentValue}
          onChange={(event) => updateValue(event.target.value)}
          placeholder="https://..."
          className={cn(compact && "h-9 rounded-sm")}
        />
        <div className="flex flex-wrap gap-2">
          <label
            htmlFor={fileInputId}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: compact ? "sm" : "default",
              }),
              "cursor-pointer rounded-sm",
              isUploading && "pointer-events-none opacity-50",
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {uploadingLabel}
              </>
            ) : (
              <>
                <ImagePlus className="size-4" />
                {uploadLabel}
              </>
            )}
          </label>
          {currentValue ? (
            <Button
              type="button"
              variant="ghost"
              size={compact ? "sm" : "default"}
              className="rounded-sm"
              onClick={() => updateValue("")}
            >
              <Trash2 className="size-4" />
              {clearLabel}
            </Button>
          ) : null}
        </div>
      </div>

      <input
        id={fileInputId}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {displayPreviewValue && showPreview ? (
        <Card
          className={cn(
            "overflow-hidden rounded-sm",
            compact && "shadow-xs",
            previewClassName,
          )}
        >
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] w-full bg-muted">
              <Image
                src={displayPreviewValue}
                alt={label}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
