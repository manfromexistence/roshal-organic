"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { createMemo } from "@/actions/memos";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { generateMemoNumber } from "@/lib/edms/form-helpers";

const memoCreateSchema = z.object({
  category: z.string().trim().min(2, "Category is required."),
  content: z.string().trim().min(5, "Content is required."),
  date: z.string().trim().min(1, "Date is required."),
  from: z.string().trim().min(2, "Sender is required."),
  memoNumber: z.string().trim().min(2, "Memo number is required."),
  projectId: z.string().min(1, "Project is required."),
  status: z.enum(["Draft", "Distributed", "Archived"]),
  subject: z.string().trim().min(2, "Subject is required."),
  to: z.string().trim().min(2, "Recipient is required."),
  urgent: z.boolean(),
});

type MemoCreateValues = z.infer<typeof memoCreateSchema>;

interface MemoCreateFormProps {
  initialValues: MemoCreateValues;
  projects: {
    id: string;
    name: string;
    projectNumber: string | null;
  }[];
}

export function MemoCreateForm({
  initialValues,
  projects,
}: MemoCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<MemoCreateValues>({
    resolver: zodResolver(memoCreateSchema),
    defaultValues: initialValues,
  });
  const watchedProjectId = useWatch({
    control: form.control,
    name: "projectId",
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
      "memoNumber",
      generateMemoNumber(selectedProject.projectNumber),
      {
        shouldDirty: true,
      },
    );
  }, [form, projects, watchedProjectId]);

  const onSubmit = (values: MemoCreateValues) => {
    startTransition(async () => {
      const result = await createMemo(values);

      if (!result.success) {
        toast({
          title: "Memo creation failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Memo created",
        description: `${values.memoNumber} has been added to the register.`,
      });
      router.push("/memos");
      router.refresh();
    });
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Memo Details</CardTitle>
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
                name="memoNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memo Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-muted font-mono"
                        readOnly
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Revised shutdown permit sequence"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input placeholder="Document Control Lead" {...field} />
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
                      <Input placeholder="Site QA/QC Team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Internal">Internal</SelectItem>
                        <SelectItem value="Administrative">
                          Administrative
                        </SelectItem>
                        <SelectItem value="Quality">Quality</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Distributed">Distributed</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgent"
                render={({ field }) => (
                  <FormItem className="flex min-h-9 flex-row items-center gap-3 rounded-md border border-border px-3 py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <FormLabel className="font-medium">Urgent</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-36 resize-none"
                      placeholder="Summarize the internal instruction, coordination note, or administrative memo."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/memos")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || projects.length === 0}
              >
                {isPending ? "Creating..." : "Create Memo"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
