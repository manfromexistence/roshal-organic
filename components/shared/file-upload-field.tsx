"use client";

import { File, Loader2, UploadCloud, X } from "lucide-react";
import {
  type ChangeEvent,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export interface UploadedFileAsset {
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
}

interface FileUploadFieldProps {
  folder?: string;
  onUploaded: (file: UploadedFileAsset) => void;
  helperText: string;
  multiple?: boolean;
  label?: string;
}

export function FileUploadField({
  folder,
  onUploaded,
  helperText,
  multiple = false,
  label = "File upload",
}: FileUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, startTransition] = useTransition();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileAsset[]>([]);

  const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const selectedFiles = Array.from(files);
    event.target.value = "";

    startTransition(async () => {
      let successCount = 0;
      let failCount = 0;

      for (const selectedFile of selectedFiles) {
        const formData = new FormData();
        formData.set("file", selectedFile);
        if (folder) {
          formData.set("folder", folder);
        }

        try {
          const response = await fetch("/api/upload/files", {
            method: "POST",
            body: formData,
          });

          const payload = (await response.json()) as UploadedFileAsset & {
            error?: string;
          };

          if (!response.ok) {
            failCount += 1;
            toast({
              title: "Upload failed",
              description:
                payload.error ?? `Unable to upload ${selectedFile.name}.`,
              variant: "destructive",
            });
            continue;
          }

          onUploaded(payload);
          setUploadedFiles((previous) =>
            multiple ? [...previous, payload] : [payload],
          );
          successCount += 1;
        } catch (_error) {
          failCount += 1;
          toast({
            title: "Upload failed",
            description: `Network error uploading ${selectedFile.name}.`,
            variant: "destructive",
          });
        }
      }

      if (successCount > 0) {
        toast({
          title: "Files uploaded",
          description: `Successfully uploaded ${successCount} file(s)${failCount > 0 ? `, ${failCount} failed` : ""}.`,
        });
      }
    });
  };

  const removeUploadedFile = () => {
    setUploadedFiles([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onUploaded({
      fileName: "",
      fileType: "",
      fileUrl: "",
      fileSize: 0,
    });
  };

  const uploadedFile = uploadedFiles[0] ?? null;

  return (
    <div className="border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm leading-6 text-muted-foreground">
            {helperText}
          </p>
          {!multiple && uploadedFile ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
              <File className="h-8 w-8 text-primary" />
              <div className="min-w-0 flex-1">
                <a
                  href={uploadedFile.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-medium transition-colors hover:text-primary"
                >
                  {uploadedFile.fileName}
                </a>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.fileSize / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeUploadedFile}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
        <div>
          <input
            id={inputId}
            ref={inputRef}
            type="file"
            className="hidden"
            accept="*/*"
            multiple={multiple}
            onChange={handleFileSelection}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="size-4" />
                {multiple ? "Upload files" : "Upload file"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
