"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  generateProjectScopedTransmittalNumber,
  getSuggestedTransmittalSubject,
} from "@/lib/edms/form-helpers";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  projectId: string;
  documentNumber: string;
  title: string;
  revision: string | null;
  status: string | null;
}

interface Project {
  id: string;
  name: string;
  projectNumber: string | null;
}

interface Member {
  id: string;
  projectId: string;
  name: string;
  email: string;
  role: string;
}

export interface TransmittalFormData {
  transmittalNumber: string;
  date: string;
  projectId: string;
  recipientId: string;
  purpose: string;
  subject: string;
  dueDate: string;
  remarks: string;
  selectedDocuments: string[];
}

interface Props {
  projects: Project[];
  members: Member[];
  documents: Document[];
  initialFormData: TransmittalFormData;
  onSubmit: (data: TransmittalFormData) => Promise<{
    success: boolean;
    error?: { message: string };
    data?: { id: string };
  }>;
}

export function TransmittalFormWithPreview({
  projects,
  members,
  documents,
  initialFormData,
  onSubmit,
}: Props) {
  const router = useRouter();
  const [formData, setFormData] =
    useState<TransmittalFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubjectCustomized, setIsSubjectCustomized] = useState(
    Boolean(initialFormData.subject.trim()),
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFormData(initialFormData);
    setIsSubjectCustomized(Boolean(initialFormData.subject.trim()));
  }, [initialFormData]);

  const selectedProject =
    projects.find((project) => project.id === formData.projectId) ?? null;
  const projectMembers = members.filter(
    (member) => member.projectId === formData.projectId,
  );
  const projectDocuments = documents.filter(
    (document) => document.projectId === formData.projectId,
  );
  const selectedRecipient =
    projectMembers.find((member) => member.id === formData.recipientId) ?? null;
  const selectedDocs = projectDocuments.filter((document) =>
    formData.selectedDocuments.includes(document.id),
  );
  const issuerName =
    selectedProject?.name?.trim() || "Quadra EDMS Document Control";
  const issuerRole = "Document Controller";
  const suggestedSubject = getSuggestedTransmittalSubject(formData.purpose, {
    projectName: selectedProject?.name,
    documentTitle:
      selectedDocs.length === 1 ? selectedDocs[0]?.title : undefined,
    documentCount: selectedDocs.length,
  });

  useEffect(() => {
    if (isSubjectCustomized && formData.subject.trim().length > 0) {
      return;
    }

    setFormData((previous) => {
      if (previous.subject === suggestedSubject) {
        return previous;
      }

      return {
        ...previous,
        subject: suggestedSubject,
      };
    });
  }, [formData.subject, isSubjectCustomized, suggestedSubject]);

  const filteredDocuments = projectDocuments.filter((document) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      document.documentNumber.toLowerCase().includes(query) ||
      document.title.toLowerCase().includes(query) ||
      document.revision?.toLowerCase().includes(query) ||
      document.status?.toLowerCase().includes(query)
    );
  });

  const canSubmit =
    formData.subject.trim().length > 0 &&
    formData.recipientId.length > 0 &&
    formData.selectedDocuments.length > 0;

  const handleDocumentToggle = (documentId: string) => {
    setFormData((previous) => ({
      ...previous,
      selectedDocuments: previous.selectedDocuments.includes(documentId)
        ? previous.selectedDocuments.filter((id) => id !== documentId)
        : [...previous.selectedDocuments, documentId],
    }));
  };

  const handleProjectChange = (projectId: string) => {
    const nextProject = projects.find((project) => project.id === projectId);
    const nextMembers = members.filter(
      (member) => member.projectId === projectId,
    );
    const nextSuggestedSubject = getSuggestedTransmittalSubject(
      formData.purpose,
      {
        projectName: nextProject?.name,
      },
    );

    setIsSubjectCustomized(false);
    setFormData((previous) => ({
      ...previous,
      projectId,
      recipientId: nextMembers[0]?.id || "",
      selectedDocuments: [],
      subject: nextSuggestedSubject,
      transmittalNumber: generateProjectScopedTransmittalNumber(
        nextProject?.projectNumber,
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onSubmit(formData);

      if (!result.success) {
        toast({
          title: "Transmittal could not be issued",
          description:
            result.error?.message || "The transmittal was not saved.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Transmittal issued",
        description: `${formData.transmittalNumber} is now available in the register.`,
      });
      router.push("/transmittals");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 print:grid-cols-1 lg:grid-cols-2">
      <div className="space-y-6 print:hidden">
        <Card>
          <CardHeader>
            <CardTitle>1. Transmittal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="transmittal-number">Transmittal ID</Label>
                <Input
                  id="transmittal-number"
                  value={formData.transmittalNumber}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      transmittalNumber: event.target.value,
                    }))
                  }
                  className="bg-muted font-mono"
                  readOnly
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated from the selected project.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue-date">Issue Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="issue-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date
                        ? format(new Date(formData.date), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.date ? new Date(formData.date) : undefined
                      }
                      onSelect={(date) =>
                        setFormData((previous) => ({
                          ...previous,
                          date: date ? format(date, "yyyy-MM-dd") : "",
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={formData.projectId}
                onValueChange={handleProjectChange}
              >
                <SelectTrigger id="project" className="w-full">
                  <SelectValue />
                </SelectTrigger>
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Select
                  value={formData.recipientId}
                  onValueChange={(recipientId) =>
                    setFormData((previous) => ({ ...previous, recipientId }))
                  }
                  disabled={projectMembers.length === 0}
                >
                  <SelectTrigger id="recipient" className="w-full">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {projectMembers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No recipients were found for this project.
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(purpose) =>
                    setFormData((previous) => ({ ...previous, purpose }))
                  }
                >
                  <SelectTrigger id="purpose" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IFR">IFR - For Review</SelectItem>
                    <SelectItem value="IFA">IFA - For Approval</SelectItem>
                    <SelectItem value="IFC">IFC - For Construction</SelectItem>
                    <SelectItem value="IFI">IFI - For Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(event) => {
                  setIsSubjectCustomized(true);
                  setFormData((previous) => ({
                    ...previous,
                    subject: event.target.value,
                  }));
                }}
                placeholder="Brief description of the transmittal purpose"
              />
              <p className="text-xs text-muted-foreground">
                Auto-filled from the selected purpose and documents. Edit it if
                needed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="due-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate
                      ? format(new Date(formData.dueDate), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.dueDate ? new Date(formData.dueDate) : undefined
                    }
                    onSelect={(date) =>
                      setFormData((previous) => ({
                        ...previous,
                        dueDate: date ? format(date, "yyyy-MM-dd") : "",
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    remarks: event.target.value,
                  }))
                }
                placeholder="Additional notes or instructions"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                2. Select Documents
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  {formData.selectedDocuments.length} SELECTED
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input
                placeholder="Search by number, title, revision, or status"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                disabled={projectDocuments.length === 0}
              />
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-2">
                  {projectDocuments.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                      No project documents found.
                    </div>
                  ) : null}
                  {projectDocuments.length > 0 &&
                  filteredDocuments.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                      No documents match your search.
                    </div>
                  ) : null}
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                    >
                      <Checkbox
                        id={`doc-${document.id}`}
                        checked={formData.selectedDocuments.includes(
                          document.id,
                        )}
                        onCheckedChange={() =>
                          handleDocumentToggle(document.id)
                        }
                      />
                      <Label
                        htmlFor={`doc-${document.id}`}
                        className="flex-1 cursor-pointer space-y-1"
                      >
                        <p className="font-mono text-sm font-medium">
                          {document.documentNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {document.title}
                        </p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>Rev {document.revision || "-"}</span>
                          <span>|</span>
                          <span>{document.status || "-"}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="print:top-auto print:h-auto lg:sticky lg:top-6 lg:h-fit">
        <Card>
          <CardHeader className="border-b border-border print:hidden">
            <div className="flex items-center justify-between">
              <CardTitle>
                Live Preview
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  FORMAL ISSUE
                </span>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.print()}
                >
                  Print
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? "Issuing..." : "Issue Transmittal"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-muted p-6 print:bg-transparent print:p-0">
            <div className="mx-auto max-w-[860px] border border-gray-300 bg-white p-8 text-black shadow-sm print:max-w-none print:border-0 print:p-0 print:shadow-none [&_*]:!rounded-none [&_*]:!text-black">
              <div className="mb-5 flex items-start justify-between border-b-2 border-gray-900 pb-3">
                <div>
                  <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-[2px] text-gray-600">
                    Quadra EDMS
                  </div>
                  <h2 className="font-serif text-2xl font-normal">
                    Document Transmittal
                  </h2>
                  <div className="mt-0.5 text-[10px] text-gray-600">
                    {selectedProject?.projectNumber || "PRJ"} -{" "}
                    {selectedProject?.name || "Select project"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1 text-[9px] uppercase tracking-wider text-gray-600">
                    Transmittal No.
                  </div>
                  <div className="font-mono text-sm font-medium">
                    {formData.transmittalNumber}
                  </div>
                  <div className="mt-1.5 text-[10px] text-gray-600">
                    {formData.date
                      ? format(new Date(formData.date), "yyyy-MM-dd")
                      : ""}
                  </div>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                    From
                  </div>
                  <div className="font-medium">
                    {selectedProject?.name || "-"}
                  </div>
                  <div className="text-[10.5px] text-gray-600">
                    Document Controller
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                    To
                  </div>
                  <div className="font-medium">
                    {selectedRecipient?.name || "-"}
                  </div>
                  <div className="text-[10.5px] text-gray-600">
                    {selectedRecipient?.email || ""}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                    Purpose
                  </div>
                  <Badge className="border-gray-300 bg-gray-100 text-[10px] font-mono text-gray-800">
                    {formData.purpose}
                  </Badge>
                </div>
                <div>
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                    Response Due
                  </div>
                  <div className="font-mono text-xs">
                    {formData.dueDate || "-"}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                    Subject
                  </div>
                  <div className="font-medium">
                    {formData.subject || "Enter subject..."}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                  Documents Transmitted
                </div>
                {selectedDocs.length === 0 ? (
                  <div className="py-12 text-center text-gray-600">
                    <div className="mb-1 font-serif text-lg">
                      No documents selected
                    </div>
                    <div className="text-xs">
                      Choose documents on the left to include in this
                      transmittal.
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-md border border-gray-300">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-300 bg-gray-100">
                          <TableHead className="border-r border-gray-300 p-2 text-[9px] font-semibold uppercase tracking-wider text-gray-900">
                            #
                          </TableHead>
                          <TableHead className="border-r border-gray-300 p-2 text-[9px] font-semibold uppercase tracking-wider text-gray-900">
                            Document Code
                          </TableHead>
                          <TableHead className="border-r border-gray-300 p-2 text-[9px] font-semibold uppercase tracking-wider text-gray-900">
                            Title
                          </TableHead>
                          <TableHead className="border-r border-gray-300 p-2 text-[9px] font-semibold uppercase tracking-wider text-gray-900">
                            Rev
                          </TableHead>
                          <TableHead className="border-r border-gray-300 p-2 text-[9px] font-semibold uppercase tracking-wider text-gray-900">
                            Status
                          </TableHead>
                          <TableHead className="p-2 text-[9px] font-semibold uppercase tracking-wider text-gray-900">
                            Format
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDocs.map((document, index) => (
                          <TableRow
                            key={document.id}
                            className="border-b border-gray-300 last:border-b-0"
                          >
                            <TableCell className="border-r border-gray-300 p-2">
                              {index + 1}
                            </TableCell>
                            <TableCell className="border-r border-gray-300 p-2 font-mono text-[11px]">
                              {document.documentNumber}
                            </TableCell>
                            <TableCell className="border-r border-gray-300 p-2">
                              {document.title}
                            </TableCell>
                            <TableCell className="border-r border-gray-300 p-2 font-mono text-[11px]">
                              {document.revision || "-"}
                            </TableCell>
                            <TableCell className="border-r border-gray-300 p-2 font-mono text-[11px]">
                              {document.status || "-"}
                            </TableCell>
                            <TableCell className="p-2 font-mono text-[11px]">
                              PDF
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {formData.remarks ? (
                <div className="mb-5">
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                    Remarks
                  </div>
                  <div className="border border-gray-300 p-3">
                    <div className="whitespace-pre-wrap text-[11px] leading-relaxed text-gray-700">
                      {formData.remarks}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-7 border-t border-gray-300 pt-4">
                <div className="grid grid-cols-2 gap-8 text-[10px] text-gray-700">
                  <div>
                    <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                      Issued By
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-1.5">
                      <div className="font-medium">{issuerName}</div>
                      <div className="text-[10px] text-gray-600">
                        {issuerRole}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                      Received By
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-1.5">
                      <div className="font-medium">
                        {selectedRecipient?.name || "Recipient acknowledgement"}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        Date: __________________
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-[10px] text-gray-600">
                  <div>
                    Generated through the Quadra Electronic Document Management
                    System.
                  </div>
                  <div>{selectedDocs.length} doc(s) attached</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
