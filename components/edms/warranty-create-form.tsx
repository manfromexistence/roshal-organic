"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { createWarrantyRecord } from "@/actions/warranty";
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
import { generateWarrantyNumber } from "@/lib/edms/form-helpers";

const warrantyCreateSchema = z.object({
  description: z.string().trim().min(5, "Description is required."),
  endDate: z.string().trim().min(1, "Expiry date is required."),
  item: z.string().trim().min(2, "Item is required."),
  projectId: z.string().min(1, "Project is required."),
  startDate: z.string().trim().min(1, "Start date is required."),
  status: z.enum(["active", "expired", "claimed"]),
  warrantyNumber: z.string().trim().min(2, "Warranty number is required."),
  warrantyType: z.enum(["manufacturer", "contractor", "system"]),
});

type WarrantyCreateValues = z.infer<typeof warrantyCreateSchema>;

interface WarrantyCreateFormProps {
  initialValues: WarrantyCreateValues;
  projects: {
    id: string;
    name: string;
    projectNumber: string | null;
  }[];
}

export function WarrantyCreateForm({
  initialValues,
  projects,
}: WarrantyCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<WarrantyCreateValues>({
    resolver: zodResolver(warrantyCreateSchema),
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
      "warrantyNumber",
      generateWarrantyNumber(selectedProject.projectNumber),
      { shouldDirty: true },
    );
  }, [form, projects, watchedProjectId]);

  const onSubmit = (values: WarrantyCreateValues) => {
    startTransition(async () => {
      const result = await createWarrantyRecord(values);

      if (!result.success) {
        toast({
          title: "Warranty creation failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Warranty record created",
        description: `${values.warrantyNumber} has been added to the register.`,
      });
      router.push("/warranty");
      router.refresh();
    });
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Warranty Details</CardTitle>
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
                name="warrantyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Number</FormLabel>
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
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item / System</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Fire alarm control panel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manufacturer">
                          Manufacturer
                        </SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="system">System</SelectItem>
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
                      className="min-h-32 resize-none"
                      placeholder="Describe the covered item, package scope, and warranty obligations."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="claimed">Claimed</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/warranty")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || projects.length === 0}
              >
                {isPending ? "Creating..." : "Create Warranty Record"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
