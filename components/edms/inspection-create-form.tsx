"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { createInspectionRequest } from "@/actions/inspections";
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
import { generateInspectionNumber } from "@/lib/edms/form-helpers";

const inspectionCreateSchema = z.object({
  deficiencies: z.string().trim().optional(),
  inspectionNumber: z.string().trim().min(2, "Inspection number is required."),
  inspector: z.string().trim().optional(),
  location: z.string().trim().min(2, "Location is required."),
  projectId: z.string().min(1, "Project is required."),
  results: z.enum(["pending", "pass", "fail", "conditional"]),
  scheduledDate: z.string().trim().min(1, "Inspection date is required."),
  type: z.string().trim().min(2, "Inspection type is required."),
});

type InspectionCreateValues = z.infer<typeof inspectionCreateSchema>;

interface InspectionCreateFormProps {
  initialValues: InspectionCreateValues;
  projects: {
    id: string;
    name: string;
    projectNumber: string | null;
  }[];
}

export function InspectionCreateForm({
  initialValues,
  projects,
}: InspectionCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<InspectionCreateValues>({
    resolver: zodResolver(inspectionCreateSchema),
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
      "inspectionNumber",
      generateInspectionNumber(selectedProject.projectNumber),
      { shouldDirty: true },
    );
  }, [form, projects, watchedProjectId]);

  const onSubmit = (values: InspectionCreateValues) => {
    startTransition(async () => {
      const result = await createInspectionRequest(values);

      if (!result.success) {
        toast({
          title: "Inspection creation failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Inspection created",
        description: `${values.inspectionNumber} has been added to the register.`,
      });
      router.push("/inspections");
      router.refresh();
    });
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Inspection Details</CardTitle>
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
                name="inspectionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspection Number</FormLabel>
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspection Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Concrete pour inspection"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Zone B / Level 04" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspection Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inspector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspector</FormLabel>
                    <FormControl>
                      <Input placeholder="QA/QC Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="results"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Result</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="fail">Fail</SelectItem>
                        <SelectItem value="conditional">Conditional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deficiencies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deficiencies / Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32 resize-none"
                      placeholder="Capture punch points, rejected work, and closeout remarks."
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
                onClick={() => router.push("/inspections")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || projects.length === 0}
              >
                {isPending ? "Creating..." : "Create Inspection"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
