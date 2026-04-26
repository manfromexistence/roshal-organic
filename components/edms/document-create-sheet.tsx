"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createDocument } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  generateDocumentNumber,
  getDocumentTitleFromFileName,
  STATUS_OPTIONS,
} from "@/lib/edms/form-helpers";
import { DocumentFileUpload } from "./document-file-upload";
import { ImageCardUpload } from "./image-card-upload";

const documentStatuses = STATUS_OPTIONS.document;

const documentCreateSchema = z.object({
  projectId: z.string().min(1, "Project is required."),
  documentNumber: z.string().trim(),
  title: z.string().trim().min(2, "Document title is required."),
  description: z.string().trim(),
  discipline: z.string().trim(),
  category: z.string().trim(),
  version: z.string().trim().min(1, "Version is required."),
  revision: z.string().trim(),
  status: z.enum(documentStatuses),
  fileName: z.string().trim().optional(),
  fileSize: z.number().nonnegative().optional(),
  fileType: z.string().trim().optional(),
  fileUrl: z.string().trim().min(1, "File upload is required."),
  tags: z.string().trim(),
  images: z.array(z.string().url()).optional(),
});

type DocumentCreateValues = z.infer<typeof documentCreateSchema>;

interface DocumentCreateSheetProps {
  projects: { id: string; name: string; projectNumber: string | null }[];
  defaultOpen?: boolean;
  hideTrigger?: boolean;
  triggerLabel?: string;
}

const baseDefaultValues: DocumentCreateValues = {
  projectId: "",
  documentNumber: "",
  title: "",
  description: "",
  discipline: "",
  category: "",
  version: "1.0",
  revision: "A",
  status: "draft",
  fileName: "",
  fileSize: undefined,
  fileType: "",
  fileUrl: "",
  tags: "",
  images: [],
};

function getInitialValues(
  projects: DocumentCreateSheetProps["projects"],
): DocumentCreateValues {
  const defaultProject = projects.length >= 1 ? projects[0] : null;

  return {
    ...baseDefaultValues,
    projectId: defaultProject?.id ?? "",
    documentNumber: generateDocumentNumber(defaultProject?.projectNumber),
  };
}

export function DocumentCreateSheet({
  projects,
  defaultOpen = false,
  hideTrigger = false,
  triggerLabel = "Upload document",
}: DocumentCreateSheetProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isPending, startTransition] = useTransition();
  const lastAutoDocumentNumberRef = useRef("");
  const lastAutoTitleRef = useRef("");

  const initialValues = useMemo(() => getInitialValues(projects), [projects]);

  const form = useForm<DocumentCreateValues>({
    resolver: zodResolver(documentCreateSchema),
    defaultValues: initialValues,
  });
  const selectedProjectId = form.watch("projectId");

  const selectedProject = useMemo(() => {
    return projects.find((project) => project.id === selectedProjectId) ?? null;
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextInitialValues = getInitialValues(projects);
    form.reset(nextInitialValues);
    lastAutoDocumentNumberRef.current = nextInitialValues.documentNumber;
    lastAutoTitleRef.current = "";
  }, [form, isOpen, projects]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextDocumentNumber = generateDocumentNumber(
      selectedProject?.projectNumber,
    );
    const currentDocumentNumber = form.getValues("documentNumber");

    if (
      !currentDocumentNumber ||
      currentDocumentNumber === lastAutoDocumentNumberRef.current
    ) {
      form.setValue("documentNumber", nextDocumentNumber, {
        shouldDirty: false,
      });
    }

    lastAutoDocumentNumberRef.current = nextDocumentNumber;
  }, [form, isOpen, selectedProject?.projectNumber]);

  const onSubmit = (values: DocumentCreateValues) => {
    startTransition(async () => {
      const result = await createDocument(values);

      if (!result.success) {
        toast({
          title: "Document creation failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Document added",
        description:
          "The document record is now available in control with its initial version.",
      });

      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {!hideTrigger ? (
        <SheetTrigger asChild>
          <Button disabled={projects.length === 0}>
            <FilePlus2 className="size-4" />
            {triggerLabel}
          </Button>
        </SheetTrigger>
      ) : null}
      <SheetContent className="w-full overflow-y-auto px-4 sm:max-w-4xl sm:px-6">
        <SheetHeader className="space-y-1">
          <div className="px-2 pt-6">
            <SheetTitle>Register document</SheetTitle>
            <SheetDescription>
              Capture the first controlled revision now with direct upload
              support and an auto-prepared register entry.
            </SheetDescription>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6 px-2 pb-6 sm:px-6"
          >
            <div className="grid gap-4 xl:grid-cols-2">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Project</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full min-w-0">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.projectNumber
                              ? `${project.projectNumber} - ${project.name}`
                              : project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {projects.length === 1
                        ? "The only available project was pre-selected."
                        : "Pick the project first so the register number can be prepared automatically."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Document number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Auto-generated from project"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The EDMS prepares a number when the project is selected,
                      but you can still override it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Podium slab reinforcement details"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Uploading a file can also prepare a readable title from the
                    file name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-24 resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-4">
              <FormField
                control={form.control}
                name="discipline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discipline</FormLabel>
                    <FormControl>
                      <Input placeholder="Structural" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Drawing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="1.0" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      Starts at `1.0` by default.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="revision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revision</FormLabel>
                    <FormControl>
                      <Input placeholder="A" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      New document entries default to revision `A`.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full min-w-0">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DocumentFileUpload
              projectId={selectedProjectId}
              folder="documents"
              multiple={false}
              helperText="Upload the controlled file directly to EDMS storage. This field is required."
              onProjectRequired={() => {
                toast({
                  title: "Project required",
                  description:
                    "Please select a project from the dropdown above before uploading a file.",
                  variant: "destructive",
                });
              }}
              onUploaded={(file) => {
                form.setValue("fileName", file.fileName, {
                  shouldValidate: true,
                });
                form.setValue("fileType", file.fileType, {
                  shouldValidate: true,
                });
                form.setValue("fileUrl", file.fileUrl, {
                  shouldValidate: true,
                });
                form.setValue("fileSize", file.fileSize, {
                  shouldValidate: true,
                });

                const currentTitle = form.getValues("title");
                const suggestedTitle = getDocumentTitleFromFileName(
                  file.fileName,
                );

                if (
                  suggestedTitle &&
                  (!currentTitle || currentTitle === lastAutoTitleRef.current)
                ) {
                  form.setValue("title", suggestedTitle, {
                    shouldValidate: true,
                  });
                  lastAutoTitleRef.current = suggestedTitle;
                }
              }}
            />

            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="podium, structural, issue-for-review"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated tags for quick retrieval.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <ImageCardUpload
                    value={field.value}
                    onChange={field.onChange}
                    label="Document images"
                    helperText="Add preview images, diagrams, or visual references (up to 5 images)"
                    maxImages={5}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <FilePlus2 className="size-4" />
                    Create document
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
