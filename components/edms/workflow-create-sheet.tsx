"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { createDocumentWorkflow } from "@/actions/workflows";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { toast } from "@/hooks/use-toast";
import {
  getFutureDate,
  getSuggestedWorkflowName,
} from "@/lib/edms/form-helpers";
import { cn } from "@/lib/utils";

const workflowCreateSchema = z.object({
  documentId: z.string().min(1, "Document selection is required."),
  workflowName: z.string().trim().min(2, "Workflow name is required."),
  reviewUserId: z.string().min(1, "Reviewer is required."),
  approveUserId: z.string().trim(),
  dueDate: z.string().trim(),
});

type WorkflowCreateValues = z.infer<typeof workflowCreateSchema>;

const baseDefaultValues: WorkflowCreateValues = {
  documentId: "",
  workflowName: "",
  reviewUserId: "",
  approveUserId: "",
  dueDate: getFutureDate(7),
};

interface WorkflowCreateSheetProps {
  documents: {
    id: string;
    projectId: string;
    documentNumber: string;
    title: string;
    projectName: string;
    status: string;
  }[];
  assignees: {
    id: string;
    projectIds: string[];
    name: string;
    email: string;
    role: string;
    organization: string | null;
  }[];
}

function getInitialValues(
  documents: WorkflowCreateSheetProps["documents"],
): WorkflowCreateValues {
  const defaultDocument = documents.length === 1 ? documents[0] : null;

  return {
    ...baseDefaultValues,
    documentId: defaultDocument?.id ?? "",
    workflowName: getSuggestedWorkflowName(
      defaultDocument?.documentNumber,
      defaultDocument?.title,
    ),
  };
}

export function WorkflowCreateSheet({
  documents,
  assignees,
}: WorkflowCreateSheetProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const lastAutoWorkflowNameRef = useRef("");

  const initialValues = useMemo(() => getInitialValues(documents), [documents]);

  const form = useForm<WorkflowCreateValues>({
    resolver: zodResolver(workflowCreateSchema),
    defaultValues: initialValues,
  });

  const selectedDocumentId = useWatch({
    control: form.control,
    name: "documentId",
  });

  const reviewUserId = useWatch({
    control: form.control,
    name: "reviewUserId",
  });

  const selectedDocument = useMemo(() => {
    return (
      documents.find((document) => document.id === selectedDocumentId) ?? null
    );
  }, [documents, selectedDocumentId]);

  const projectAssignees = useMemo(() => {
    if (!selectedDocument) {
      return [];
    }

    return assignees.filter((assignee) => {
      return assignee.projectIds.includes(selectedDocument.projectId);
    });
  }, [assignees, selectedDocument]);

  const eligibleAssignees = useMemo(() => {
    if (!selectedDocument) {
      return [];
    }

    return projectAssignees.length > 0 ? projectAssignees : assignees;
  }, [assignees, projectAssignees, selectedDocument]);

  const suggestedWorkflowName = useMemo(() => {
    return getSuggestedWorkflowName(
      selectedDocument?.documentNumber,
      selectedDocument?.title,
    );
  }, [selectedDocument?.documentNumber, selectedDocument?.title]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextInitialValues = getInitialValues(documents);
    form.reset(nextInitialValues);
    lastAutoWorkflowNameRef.current = nextInitialValues.workflowName;
  }, [documents, form, isOpen]);

  useEffect(() => {
    if (!isOpen || !suggestedWorkflowName) {
      return;
    }

    const currentWorkflowName = form.getValues("workflowName");

    if (
      !currentWorkflowName ||
      currentWorkflowName === lastAutoWorkflowNameRef.current
    ) {
      form.setValue("workflowName", suggestedWorkflowName, {
        shouldDirty: false,
      });
    }

    lastAutoWorkflowNameRef.current = suggestedWorkflowName;
  }, [form, isOpen, suggestedWorkflowName]);

  useEffect(() => {
    if (!selectedDocument) {
      return;
    }

    const hasSelectedReviewer = eligibleAssignees.some((assignee) => {
      return assignee.id === reviewUserId;
    });
    const nextReviewerId = hasSelectedReviewer
      ? reviewUserId
      : (eligibleAssignees[0]?.id ?? "");

    if (!hasSelectedReviewer) {
      form.setValue("reviewUserId", nextReviewerId, {
        shouldValidate: Boolean(nextReviewerId),
      });
    }

    const currentApproverId = form.getValues("approveUserId");
    const hasSelectedApprover = eligibleAssignees.some((assignee) => {
      return (
        assignee.id === currentApproverId && assignee.id !== nextReviewerId
      );
    });

    if (!hasSelectedApprover) {
      form.setValue("approveUserId", "");
    }
  }, [eligibleAssignees, form, reviewUserId, selectedDocument]);

  const onSubmit = (values: WorkflowCreateValues) => {
    const reviewAssignee = eligibleAssignees.find((assignee) => {
      return assignee.id === values.reviewUserId;
    });
    const finalApprover = eligibleAssignees.find((assignee) => {
      return assignee.id === values.approveUserId;
    });

    if (!reviewAssignee) {
      form.setError("reviewUserId", {
        type: "manual",
        message: "Reviewer selection is required.",
      });
      return;
    }

    startTransition(async () => {
      const result = await createDocumentWorkflow({
        documentId: values.documentId,
        workflowName: values.workflowName,
        reviewUserId: reviewAssignee.id,
        approveUserId: finalApprover?.id,
        dueDate: values.dueDate || undefined,
      });

      if (!result.success) {
        toast({
          title: "Workflow creation failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Workflow created",
        description:
          "The document is now in review and the first assignee can act immediately.",
      });

      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button disabled={documents.length === 0}>
          <CheckCheck className="size-4" />
          Create workflow
          {documents.length === 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              (No documents available)
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full px-6 sm:max-w-2xl">
        <SheetHeader className="space-y-1">
          <SheetTitle>Create workflow</SheetTitle>
          <SheetDescription>
            Route a controlled document into sequential review and approval
            without leaving the EDMS workspace.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          {documents.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">
                Create at least one document before starting a workflow route.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-8 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="documentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a document" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documents.map((document) => (
                            <SelectItem key={document.id} value={document.id}>
                              {document.documentNumber} - {document.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Documents are grouped by project so assignees stay
                        inside the same workspace.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workflowName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workflow name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Vendor review and client approval"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The route name is prepared from the selected document,
                        and you can refine it before saving.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="reviewUserId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reviewer</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(value === "__none__" ? "" : value)
                          }
                          disabled={eligibleAssignees.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reviewer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eligibleAssignees.map((assignee) => (
                              <SelectItem key={assignee.id} value={assignee.id}>
                                {assignee.name} - {assignee.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {projectAssignees.length > 0
                            ? "Project members are shown first for review routing."
                            : "No project members were found for this document yet, so the full user directory is available."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="approveUserId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Final approver</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(value === "__none__" ? "" : value)
                          }
                          disabled={eligibleAssignees.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Optional second step" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">
                              No final approver
                            </SelectItem>
                            {eligibleAssignees
                              .filter(
                                (assignee) => assignee.id !== reviewUserId,
                              )
                              .map((assignee) => (
                                <SelectItem
                                  key={assignee.id}
                                  value={assignee.id}
                                >
                                  {assignee.name} - {assignee.role}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Add a second step when the route needs formal client
                          or PMC sign-off.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(new Date(field.value), "PPP")
                                : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : "",
                              )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        New workflow routes default to one week from today.
                      </FormDescription>
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
                        Routing
                      </>
                    ) : (
                      <>
                        <CheckCheck className="size-4" />
                        Start workflow
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
