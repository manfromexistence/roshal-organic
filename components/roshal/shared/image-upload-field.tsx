"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function ImageUploadField({
  label,
  helperText,
  name,
  value,
  onChange,
}: {
  label: string;
  helperText?: string;
  name?: string;
  value: string;
  onChange?: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputId = useId();

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
      formData.append("file", file);

      const response = await fetch("/api/upload/imgbb", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      updateValue(String(data.url || ""));
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={inputId}>{label}</Label>
        {helperText ? (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          id={inputId}
          name={name}
          value={currentValue}
          onChange={(event) => updateValue(event.target.value)}
          placeholder="https://..."
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById(`${inputId}-file`)?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <ImagePlus className="size-4" />
                Upload
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
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      <input
        id={`${inputId}-file`}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
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
