"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { createLetter } from "@/actions/letters";
import { DocumentFileUpload } from "@/components/edms/document-file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { toast } from "@/hooks/use-toast";
import { generateLetterNumber, getCurrentDate } from "@/lib/edms/form-helpers";

const letterCreateSchema = z.object({
  projectId: z.string().min(1, "Project is required."),
  letterNumber: z.string().trim().min(2, "Letter number is required."),
  date: z.string().trim().min(1, "Date is required."),
  direction: z.enum(["outgoing", "incoming"]),
  from: z.string().trim().min(2, "Sender is required."),
  to: z.string().trim().min(2, "Recipient is required."),
  toType: z.string().trim().min(2, "Recipient type is required."),
  subject: z.string().trim().min(2, "Subject is required."),
  category: z.string().trim().min(2, "Category is required."),
  ref: z.string().trim(),
  urgent: z.boolean(),
  forInfo: z.boolean(),
  actionRequired: z.boolean(),
  responseRequired: z.enum(["Y", "N"]),
  fileName: z.string().trim().optional(),
  fileSize: z.number().nonnegative().optional(),
  fileType: z.string().trim().optional(),
  fileUrl: z.string().trim().optional(),
});

type LetterCreateValues = z.infer<typeof letterCreateSchema>;

const recipientTypes = [
  "Client",
  "Vendor",
  "Subcontractor",
  "Consultant",
  "Third Party",
] as const;

const categories = [
  "Progress Report",
  "Procurement",
  "Approval",
  "Variation",
  "Safety",
  "General",
] as const;

interface LetterCreateFormProps {
  projects: {
    id: string;
    name: string;
    projectNumber: string | null;
  }[];
  currentUserName: string;
}

function getInitialValues(
  projects: LetterCreateFormProps["projects"],
  currentUserName: string,
): LetterCreateValues {
  return {
    projectId: projects[0]?.id || "",
    letterNumber: generateLetterNumber(projects[0]?.projectNumber),
    date: getCurrentDate(),
    direction: "outgoing",
    from: currentUserName,
    to: "",
    toType: "Client",
    subject: "",
    category: "General",
    ref: "",
    urgent: false,
    forInfo: false,
    actionRequired: false,
    responseRequired: "N",
    fileName: "",
    fileSize: undefined,
    fileType: "",
    fileUrl: "",
  };
}

export function LetterCreateForm({
  projects,
  currentUserName,
}: LetterCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialValues = useMemo(
    () => getInitialValues(projects, currentUserName),
    [currentUserName, projects],
  );

  const form = useForm<LetterCreateValues>({
    resolver: zodResolver(letterCreateSchema),
    defaultValues: initialValues,
  });

  const watchedProjectId = useWatch({
    control: form.control,
    name: "projectId",
  });
  const watchedActionRequired = useWatch({
    control: form.control,
    name: "actionRequired",
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  useEffect(() => {
    const selectedProject = projects.find(
      (project) => project.id === watchedProjectId,
    );

    if (!selectedProject) {
      return;
    }

    form.setValue(
      "letterNumber",
      generateLetterNumber(selectedProject.projectNumber),
      {
        shouldDirty: true,
      },
    );
  }, [form, projects, watchedProjectId]);

  useEffect(() => {
    form.setValue("responseRequired", watchedActionRequired ? "Y" : "N", {
      shouldDirty: true,
    });
  }, [form, watchedActionRequired]);

  const onSubmit = (values: LetterCreateValues) => {
    startTransition(async () => {
      const result = await createLetter(values);

      if (!result.success) {
        toast({
          title: "Letter creation failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Letter created",
        description: "The correspondence register has been updated.",
      });
      router.push("/letters");
      router.refresh();
    });
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Letter Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="letterNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Letter Number</FormLabel>
                    <FormControl>
                      <Input className="font-mono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="outgoing">Outgoing</SelectItem>
                        <SelectItem value="incoming">Incoming</SelectItem>
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
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

            <div className="grid gap-4 xl:grid-cols-2">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Recipient name or organization"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <FormField
                control={form.control}
                name="toType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {recipientTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="External reference (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Subject line for the correspondence"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DocumentFileUpload
              projectId={watchedProjectId}
              folder="documents"
              multiple={false}
              helperText="Optional: upload the signed PDF or scanned incoming letter."
              onProjectRequired={() => {
                toast({
                  title: "Project required",
                  description:
                    "Please select a project before uploading the letter PDF.",
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
              }}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="urgent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-medium">Urgent</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-medium">For Info</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actionRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-medium">
                        Action Required
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Response required: {form.watch("responseRequired")}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/letters")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || projects.length === 0}
                >
                  {isPending ? "Creating..." : "Create Letter"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
