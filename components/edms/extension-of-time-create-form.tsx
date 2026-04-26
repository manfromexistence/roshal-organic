"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { createExtensionOfTimeRequest } from "@/actions/extension-of-time";
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
import { generateExtensionOfTimeNumber } from "@/lib/edms/form-helpers";

const extensionOfTimeCreateSchema = z.object({
  eotNumber: z.string().trim().min(2, "Request number is required."),
  projectId: z.string().min(1, "Project is required."),
  reason: z.string().trim().min(5, "Reason is required."),
  requestedDays: z.coerce
    .number()
    .int()
    .positive("Requested days are required."),
});

type ExtensionOfTimeCreateInput = z.input<typeof extensionOfTimeCreateSchema>;
type ExtensionOfTimeCreateValues = z.infer<typeof extensionOfTimeCreateSchema>;

interface ExtensionOfTimeCreateFormProps {
  initialValues: ExtensionOfTimeCreateValues;
  projects: {
    id: string;
    name: string;
    projectNumber: string | null;
  }[];
}

export function ExtensionOfTimeCreateForm({
  initialValues,
  projects,
}: ExtensionOfTimeCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<
    ExtensionOfTimeCreateInput,
    undefined,
    ExtensionOfTimeCreateValues
  >({
    resolver: zodResolver(extensionOfTimeCreateSchema),
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
      "eotNumber",
      generateExtensionOfTimeNumber(selectedProject.projectNumber),
      { shouldDirty: true },
    );
  }, [form, projects, watchedProjectId]);

  const onSubmit = (values: ExtensionOfTimeCreateValues) => {
    startTransition(async () => {
      const result = await createExtensionOfTimeRequest(values);

      if (!result.success) {
        toast({
          title: "EOT creation failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Extension of time request created",
        description: `${values.eotNumber} has been added to the register.`,
      });
      router.push("/extension-of-time");
      router.refresh();
    });
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Request Details</CardTitle>
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
                name="eotNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EOT Number</FormLabel>
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

            <FormField
              control={form.control}
              name="requestedDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Days</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(event.target.value)}
                      ref={field.ref}
                      value={
                        typeof field.value === "number" ||
                        typeof field.value === "string"
                          ? field.value
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-36 resize-none"
                      placeholder="Describe the delay event, affected activities, and contractual basis for the extension."
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
                onClick={() => router.push("/extension-of-time")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || projects.length === 0}
              >
                {isPending ? "Creating..." : "Create EOT Request"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
