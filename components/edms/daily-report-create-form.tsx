"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createDailyReport } from "@/actions/daily-reports";
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

const dailyReportCreateSchema = z.object({
  activitiesCompleted: z.string().trim().optional(),
  issues: z.string().trim().optional(),
  projectId: z.string().min(1, "Project is required."),
  reportDate: z.string().trim().min(1, "Report date is required."),
  weather: z.string().trim().optional(),
});

type DailyReportCreateValues = z.infer<typeof dailyReportCreateSchema>;

interface DailyReportCreateFormProps {
  initialValues: DailyReportCreateValues;
  projects: {
    id: string;
    name: string;
    projectNumber: string | null;
  }[];
}

const weatherOptions = [
  "Clear",
  "Partly Cloudy",
  "Overcast",
  "Rain",
  "Storm",
  "Windy",
] as const;

export function DailyReportCreateForm({
  initialValues,
  projects,
}: DailyReportCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<DailyReportCreateValues>({
    resolver: zodResolver(dailyReportCreateSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const onSubmit = (values: DailyReportCreateValues) => {
    startTransition(async () => {
      const result = await createDailyReport(values);

      if (!result.success) {
        toast({
          title: "Daily report creation failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Daily report created",
        description: "The daily reports register has been updated.",
      });
      router.push("/daily-reports");
      router.refresh();
    });
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Report Details</CardTitle>
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
                name="reportDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Date</FormLabel>
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
              name="weather"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weather</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select weather condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {weatherOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
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
              name="activitiesCompleted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activities Completed</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32 resize-none"
                      placeholder="Summarize work fronts, manpower deployment, and completed activities."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issues / Constraints</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-28 resize-none"
                      placeholder="Log safety incidents, delays, access issues, or material constraints."
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
                onClick={() => router.push("/daily-reports")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || projects.length === 0}
              >
                {isPending ? "Creating..." : "Create Daily Report"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
