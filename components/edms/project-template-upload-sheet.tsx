"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { getSuggestedTemplateName } from "@/lib/edms/form-helpers";

const templateTypes = [
  "letter",
  "memo",
  "mom",
  "crs",
  "tq",
  "rfi",
  "transmittal",
  "other",
] as const;

const templateCategories = [
  "Correspondence",
  "Technical",
  "Commercial",
  "Legal",
  "Quality",
  "Safety",
  "Other",
] as const;

const uploadTemplateFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Template name must be at least 2 characters.")
    .max(255, "Template name is too long."),
  type: z.enum(templateTypes),
  category: z.enum(templateCategories),
  description: z.string().trim().max(500, "Description is too long."),
  file: z.any().refine((file) => file?.size > 0, "File is required."),
  isGlobal: z.boolean().default(true),
});

type UploadTemplateFormValues = z.infer<typeof uploadTemplateFormSchema>;

const defaultValues: UploadTemplateFormValues = {
  name: getSuggestedTemplateName("letter", "Correspondence"),
  type: "letter",
  category: "Correspondence",
  description: "",
  file: undefined,
  isGlobal: true,
};

export function ProjectTemplateUploadSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const lastAutoNameRef = useRef(defaultValues.name);

  const form = useForm<UploadTemplateFormValues>({
    resolver: zodResolver(uploadTemplateFormSchema) as any,
    defaultValues,
  });
  const templateType = form.watch("type");
  const templateCategory = form.watch("category");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    form.reset(defaultValues);
    lastAutoNameRef.current = defaultValues.name;
  }, [form, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const suggestedName = getSuggestedTemplateName(
      templateType,
      templateCategory,
    );
    const currentName = form.getValues("name");

    if (!currentName || currentName === lastAutoNameRef.current) {
      form.setValue("name", suggestedName, {
        shouldDirty: false,
      });
    }

    lastAutoNameRef.current = suggestedName;
  }, [form, isOpen, templateCategory, templateType]);

  const onSubmit = async (values: UploadTemplateFormValues) => {
    startTransition(async () => {
      try {
        // TODO: Implement project templates when schema is available
        toast({
          title: "Feature not implemented",
          description: "Project templates feature requires database schema",
          variant: "destructive",
        });
        return;
      } catch (error) {
        console.error("Failed to upload template:", error);
        toast({
          title: "Upload failed",
          description: "An error occurred while uploading the template",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Upload Template
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full px-6 sm:max-w-2xl">
        <SheetHeader className="space-y-1 px-6 pt-6">
          <SheetTitle>Upload Project Template</SheetTitle>
          <SheetDescription>
            Add a new template to the library for use across projects.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6">
          <Form {...(form as any)}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Standard Letter Template"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templateTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templateCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Standard letter format for official correspondence"
                        className="min-h-20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template file</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById("template-file-input")
                              ?.click()
                          }
                          className="w-full"
                        >
                          Choose file
                        </Button>
                        <input
                          id="template-file-input"
                          type="file"
                          accept=".doc,.docx,.xls,.xlsx,.pdf"
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                        {field.value && (
                          <span className="text-sm text-muted-foreground truncate max-w-32">
                            {field.value.name}
                          </span>
                        )}
                      </div>
                    </FormControl>
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
                      Uploading
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Upload Template
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
