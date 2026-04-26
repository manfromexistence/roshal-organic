"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { createRfi } from "@/actions/rfis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { generateRfiNumber } from "@/lib/edms/form-helpers";

const rfiCreateSchema = z.object({
  assignedTo: z.string().trim().min(1, "Assignee is required."),
  category: z.string().trim().min(2, "Category is required."),
  date: z.string().trim().min(1, "Date is required."),
  description: z.string().trim().min(5, "Description is required."),
  dueDate: z.string().trim().optional(),
  from: z.string().trim().min(2, "Originator is required."),
  priority: z.enum(["High", "Medium", "Low"]),
  projectId: z.string().min(1, "Project is required."),
  raisedBy: z.string().trim().min(2, "Raised by is required."),
  rfiNumber: z.string().trim().min(2, "RFI number is required."),
  subject: z.string().trim().min(2, "Subject is required."),
});

type RfiCreateValues = z.infer<typeof rfiCreateSchema>;

interface RfiCreateFormProps {
  assignees: {
    id: string;
    name: string;
    role: string;
  }[];
  initialValues: RfiCreateValues;
  projects: {
    id: string;
    name: string;
    projectNumber: string | null;
  }[];
}

export function RfiCreateForm({
  assignees,
  initialValues,
  projects,
}: RfiCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<RfiCreateValues>({
    resolver: zodResolver(rfiCreateSchema),
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
      "rfiNumber",
      generateRfiNumber(selectedProject.projectNumber),
      {
        shouldDirty: true,
      },
    );
  }, [form, projects, watchedProjectId]);

  const onSubmit = (values: RfiCreateValues) => {
    startTransition(async () => {
      const result = await createRfi(values);

      if (!result.success) {
        toast({
          title: "RFI creation failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "RFI created",
        description: `${values.rfiNumber} has been added to the register.`,
      });
      router.push("/rfis");
      router.refresh();
    });
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>RFI Details</CardTitle>
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
                name="rfiNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RFI Number</FormLabel>
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
                name="raisedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raised By</FormLabel>
                    <FormControl>
                      <Input placeholder="Main contractor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input placeholder="Construction Team" {...field} />
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
                      placeholder="Clarification on anchor bolt embedment depth"
                      {...field}
                    />
                  </FormControl>
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
                    <Textarea
                      className="min-h-32 resize-none"
                      placeholder="Describe the missing information or coordination issue that requires response."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 xl:grid-cols-4">
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
                        <SelectItem value="Materials">Materials</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="QA/QC">QA/QC</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee.id} value={assignee.id}>
                          {assignee.name} - {assignee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/rfis")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || projects.length === 0}
              >
                {isPending ? "Creating..." : "Create RFI"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
