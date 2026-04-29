"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function ImageUploadField({
  clearLabel = "Clear",
  label,
  helperText,
  name,
  uploadLabel = "Upload",
  uploadingLabel = "Uploading",
  value,
  onChange,
}: {
  clearLabel?: string;
  label: string;
  helperText?: string;
  name?: string;
  uploadLabel?: string;
  uploadingLabel?: string;
  value: string;
  onChange?: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const updateValue = (nextValue: string) => {
    setCurrentValue(nextValue);
    onChange?.(nextValue);
  };

  const openFilePicker = () => {
    const input = fileInputRef.current;

    if (!input) {
      return;
    }

    try {
      input.click();
      return;
    } catch {}

    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {}
    }
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

      <div className="flex min-w-0 flex-col gap-3 md:flex-row">
        <Input
          id={inputId}
          name={name}
          value={currentValue}
          onChange={(event) => updateValue(event.target.value)}
          placeholder="https://..."
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={openFilePicker}
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
          </Button>
          {currentValue ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => updateValue("")}
            >
              <Trash2 className="size-4" />
              {clearLabel}
            </Button>
          ) : null}
        </div>
      </div>

      <input
        ref={fileInputRef}
        id={`${inputId}-file`}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {currentValue ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] w-full bg-muted">
              <Image
                src={currentValue}
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
