"use client";

import {
  BarChart3,
  ClipboardList,
  Clock,
  Download,
  FileBarChart,
  FilePieChart,
  FileText,
  Search,
  TrendingUp,
} from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useMemo, useState } from "react";
import { ReportModal } from "@/components/edms/report-modal";
import { formatEdmsLabel } from "@/components/edms/status-badge";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const REPORT_CATALOG = [
  {
    id: "mdr",
    icon: FileText,
    title: "Master Document Register (MDR)",
    description:
      "Complete list of controlled documents with revisions, disciplines, and current status.",
    tag: "STANDARD",
  },
  {
    id: "txlog",
    icon: FileBarChart,
    title: "Transmittal Log",
    description:
      "Chronological record of issued transmittals, recipients, and document counts.",
    tag: "STANDARD",
  },
  {
    id: "progress",
    icon: TrendingUp,
    title: "Engineering Progress Report",
    description:
      "Discipline-level completion view derived from the live document register.",
    tag: "PROGRESS",
  },
  {
    id: "overdue",
    icon: Clock,
    title: "Overdue & Pending Report",
    description:
      "Items that are still awaiting acknowledgement after the required date.",
    tag: "EXCEPTION",
  },
  {
    id: "submission",
    icon: FilePieChart,
    title: "Submission Status by Discipline",
    description:
      "Discipline-by-discipline summary of approved, pending, and total submissions.",
    tag: "SUMMARY",
  },
  {
    id: "comments",
    icon: ClipboardList,
    title: "Comment Response Sheet (CRS)",
    description:
      "Review comments, assigned responders, and due dates across live workflow steps.",
    tag: "COMPLIANCE",
  },
  {
    id: "hold",
    icon: Clock,
    title: "Documents on Hold",
    description:
      "Items waiting on review, clarification, or overdue workflow action.",
    tag: "EXCEPTION",
  },
  {
    id: "audit",
    icon: BarChart3,
    title: "Audit Trail Export",
    description:
      "Full operational activity stream covering document, workflow, and transmittal events.",
    tag: "COMPLIANCE",
  },
] as const;

interface ReportDocument {
  documentNumber: string;
  title: string;
  discipline: string | null;
  revision: string | null;
  status: string;
  author: string | null;
  uploadedLabel: string;
  projectName: string | null;
}

interface ReportTransmittal {
  transmittalNumber: string;
  subject: string;
  recipientName: string;
  projectName: string;
  documentCodes: string[];
  purpose: string | null;
  status: string;
  dueDate: string | null;
  documentCount: number;
  sentLabel: string;
  createdAt: Date | null;
}

interface ReportWorkflow {
  workflowName: string;
  stepName: string;
  title: string;
  documentNumber: string;
  projectName: string;
  status: string;
  assignedToName: string;
  assignedRole: string;
  dueLabel: string;
  dueDate: Date | null;
}

interface ReportSummaryMetric {
  label: string;
  value: string;
  tone?: "default" | "positive" | "warning" | "danger";
}

interface ReportSection {
  title: string;
  description?: string;
  columns: Array<{ key: string; label: string }>;
  data: Array<Record<string, string>>;
}

interface GeneratedReport {
  id: string;
  title: string;
  description: string;
  columns: Array<{ key: string; label: string }>;
  data: Array<Record<string, string>>;
  meta: {
    project: string;
    period: string;
    generatedAt: string;
  };
  summary?: ReportSummaryMetric[];
  sections?: ReportSection[];
  narrative?: string[];
}

interface ReportModalClientProps {
  documents: ReportDocument[];
  transmittals: ReportTransmittal[];
  workflows: ReportWorkflow[];
  error: string | null;
}

function summarizeProject(projectNames: string[]) {
  const uniqueNames = Array.from(
    new Set(projectNames.map((name) => name?.trim()).filter(Boolean)),
  );

  if (uniqueNames.length === 1) {
    return uniqueNames[0];
  }

  if (uniqueNames.length > 1) {
    return `${uniqueNames.length} projects`;
  }

  return "Current portfolio";
}

function extractDocumentType(documentNumber: string) {
  return documentNumber.split("-")[2] || "DOC";
}

export function ReportModalClient({
  documents,
  transmittals,
  workflows,
  error,
}: ReportModalClientProps) {
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);

  const projectLabel = useMemo(
    () =>
      summarizeProject([
        ...documents.map((document) => document.projectName || ""),
        ...transmittals.map((transmittal) => transmittal.projectName),
      ]),
    [documents, transmittals],
  );
  const generatedLabel = new Date().toLocaleDateString();

  const filteredReports = REPORT_CATALOG.filter((report) =>
    [report.title, report.description, report.tag].some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );
  const reportOverview = [
    {
      label: "Controlled docs",
      value: documents.length,
      hint: "Live register records available for reporting.",
    },
    {
      label: "Issued transmittals",
      value: transmittals.length,
      hint: "Outbound packages contributing to distribution analytics.",
    },
    {
      label: "Active workflows",
      value: workflows.filter((workflow) => workflow.status === "pending")
        .length,
      hint: "Review steps currently waiting on an assignee response.",
    },
    {
      label: "Overdue actions",
      value:
        workflows.filter((workflow) => {
          return (
            workflow.status === "pending" &&
            workflow.dueDate &&
            workflow.dueDate < new Date()
          );
        }).length +
        transmittals.filter((transmittal) => {
          if (!transmittal.dueDate) {
            return false;
          }

          const dueDate = new Date(transmittal.dueDate);
          return (
            !Number.isNaN(dueDate.getTime()) &&
            dueDate < new Date() &&
            transmittal.status !== "acknowledged" &&
            transmittal.status !== "approved"
          );
        }).length,
      hint: "Combined backlog from late transmittals and overdue review steps.",
    },
  ];
  const recentActivity = [
    ...documents.map((document) => ({
      id: `doc-${document.documentNumber}`,
      date: document.uploadedLabel,
      sortKey: Number(Date.parse(document.uploadedLabel)) || 0,
      stream: "Document",
      reference: document.documentNumber,
      detail: document.title,
      status: document.status,
    })),
    ...transmittals.map((transmittal) => ({
      id: `tm-${transmittal.transmittalNumber}`,
      date: transmittal.sentLabel,
      sortKey:
        transmittal.createdAt?.getTime() ||
        Number(Date.parse(transmittal.sentLabel)) ||
        0,
      stream: "Transmittal",
      reference: transmittal.transmittalNumber,
      detail: `${transmittal.subject} · ${transmittal.recipientName}`,
      status: transmittal.status,
    })),
    ...workflows.map((workflow) => ({
      id: `wf-${workflow.documentNumber}-${workflow.stepName}`,
      date: workflow.dueLabel,
      sortKey: workflow.dueDate?.getTime() || 0,
      stream: "Workflow",
      reference: workflow.documentNumber,
      detail: `${workflow.workflowName} · ${workflow.stepName} · ${workflow.assignedToName}`,
      status: workflow.status,
    })),
  ]
    .sort((left, right) => right.sortKey - left.sortKey)
    .slice(0, 10);

  const handleRunReport = (reportId: string) => {
    const baseMeta = {
      project: projectLabel,
      period: "Current reporting window",
      generatedAt: generatedLabel,
    };

    const normalizedDocuments = documents.map((document) => ({
      ...document,
      discipline: document.discipline || "General",
      revision: document.revision || "-",
      author: document.author || "Document Control",
      status: document.status || "draft",
    }));

    const normalizedTransmittals = transmittals.map((transmittal) => ({
      ...transmittal,
      recipientName: transmittal.recipientName || "Not assigned",
      purpose: transmittal.purpose || "General issue",
      status: transmittal.status || "draft",
      documentCount: transmittal.documentCount || 0,
    }));

    const normalizedWorkflows = workflows.map((workflow) => ({
      ...workflow,
      workflowName: workflow.workflowName || "Document review",
      stepName: workflow.stepName || "Review",
      title: workflow.title || workflow.documentNumber || "Untitled",
      documentNumber: workflow.documentNumber || "N/A",
      projectName: workflow.projectName || projectLabel,
      status: workflow.status || "pending",
      assignedToName: workflow.assignedToName || "Unassigned",
      assignedRole: workflow.assignedRole || "reviewer",
      dueLabel: workflow.dueLabel || "No due date",
    }));

    const now = new Date();
    const disciplineMap = new Map<
      string,
      {
        total: number;
        approved: number;
        pending: number;
        revisions: number;
        latestUpload: string;
      }
    >();
    const statusMap = new Map<string, number>();

    for (const document of normalizedDocuments) {
      const bucket = disciplineMap.get(document.discipline) || {
        total: 0,
        approved: 0,
        pending: 0,
        revisions: 0,
        latestUpload: document.uploadedLabel,
      };

      bucket.total += 1;
      bucket.revisions += document.revision !== "-" ? 1 : 0;
      bucket.approved += document.status === "approved" ? 1 : 0;
      bucket.pending += document.status !== "approved" ? 1 : 0;
      if (document.uploadedLabel > bucket.latestUpload) {
        bucket.latestUpload = document.uploadedLabel;
      }

      disciplineMap.set(document.discipline, bucket);
      statusMap.set(document.status, (statusMap.get(document.status) || 0) + 1);
    }

    const disciplineRows = Array.from(disciplineMap.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([discipline, bucket]) => ({
        discipline,
        total: String(bucket.total),
        approved: String(bucket.approved),
        pending: String(bucket.pending),
        revisions: String(bucket.revisions),
        latestUpload: bucket.latestUpload,
        completion:
          bucket.total > 0
            ? `${Math.round((bucket.approved / bucket.total) * 100)}%`
            : "0%",
        status:
          bucket.pending === 0
            ? "approved"
            : bucket.approved > 0
              ? "under_review"
              : "draft",
      }));

    const transmittedDocumentSet = new Set(
      normalizedTransmittals.flatMap(
        (transmittal) => transmittal.documentCodes,
      ),
    );

    const unissuedRows = normalizedDocuments
      .filter(
        (document) => !transmittedDocumentSet.has(document.documentNumber),
      )
      .map((document) => ({
        documentNumber: document.documentNumber,
        title: document.title,
        discipline: document.discipline,
        revision: document.revision,
        status: document.status,
      }))
      .slice(0, 20);

    const overdueRows = normalizedTransmittals
      .filter((transmittal) => {
        if (!transmittal.dueDate) {
          return false;
        }

        const dueDate = new Date(transmittal.dueDate);
        return (
          !Number.isNaN(dueDate.getTime()) &&
          dueDate < now &&
          transmittal.status !== "acknowledged" &&
          transmittal.status !== "approved"
        );
      })
      .map((transmittal) => ({
        transmittalNumber: transmittal.transmittalNumber,
        subject: transmittal.subject,
        recipient: transmittal.recipientName,
        dueDate: transmittal.dueDate || "",
        documents: String(transmittal.documentCount),
        purpose: transmittal.purpose || "-",
        status: transmittal.status,
      }));

    const pendingWorkflowRows = normalizedWorkflows
      .filter((workflow) => workflow.status === "pending")
      .map((workflow) => ({
        documentNumber: workflow.documentNumber,
        title: workflow.title,
        workflow: workflow.workflowName,
        step: workflow.stepName,
        responder: workflow.assignedToName,
        role: formatEdmsLabel(workflow.assignedRole),
        dueDate: workflow.dueLabel,
        status: workflow.status,
      }));

    const overdueWorkflowRows = normalizedWorkflows
      .filter((workflow) => {
        return (
          workflow.status === "pending" &&
          workflow.dueDate &&
          workflow.dueDate < now
        );
      })
      .map((workflow) => ({
        documentNumber: workflow.documentNumber,
        title: workflow.title,
        workflow: workflow.workflowName,
        step: workflow.stepName,
        responder: workflow.assignedToName,
        role: formatEdmsLabel(workflow.assignedRole),
        dueDate: workflow.dueLabel,
        status: workflow.status,
      }));

    const commentResponseRows = normalizedWorkflows.map((workflow) => ({
      documentNumber: workflow.documentNumber,
      title: workflow.title,
      workflow: workflow.workflowName,
      step: workflow.stepName,
      responder: workflow.assignedToName,
      role: formatEdmsLabel(workflow.assignedRole),
      dueDate: workflow.dueLabel,
      status: workflow.status,
    }));

    const holdRows = normalizedWorkflows
      .filter((workflow) => workflow.status === "pending")
      .filter((workflow) => {
        return overdueWorkflowRows.length > 0
          ? Boolean(workflow.dueDate && workflow.dueDate < now)
          : true;
      })
      .map((workflow) => ({
        documentNumber: workflow.documentNumber,
        title: workflow.title,
        owner: workflow.assignedToName,
        workflow: `${workflow.workflowName} · ${workflow.stepName}`,
        dueDate: workflow.dueLabel,
        reason:
          workflow.dueDate && workflow.dueDate < now
            ? "Overdue review action"
            : "Awaiting responder update",
        status: workflow.status,
      }));

    const reviewerLoadRows = Array.from(
      normalizedWorkflows.reduce(
        (map, workflow) => {
          const bucket = map.get(workflow.assignedToName) || {
            reviewer: workflow.assignedToName,
            role: formatEdmsLabel(workflow.assignedRole),
            total: 0,
            pending: 0,
            completed: 0,
            overdue: 0,
          };

          bucket.total += 1;
          bucket.pending += workflow.status === "pending" ? 1 : 0;
          bucket.completed += workflow.status === "completed" ? 1 : 0;
          bucket.overdue +=
            workflow.status === "pending" &&
            workflow.dueDate &&
            workflow.dueDate < now
              ? 1
              : 0;

          map.set(workflow.assignedToName, bucket);
          return map;
        },
        new Map<
          string,
          {
            reviewer: string;
            role: string;
            total: number;
            pending: number;
            completed: number;
            overdue: number;
          }
        >(),
      ),
    )
      .map(([, bucket]) => ({
        reviewer: bucket.reviewer,
        role: bucket.role,
        total: String(bucket.total),
        pending: String(bucket.pending),
        completed: String(bucket.completed),
        overdue: String(bucket.overdue),
      }))
      .sort((left, right) => Number(right.pending) - Number(left.pending));

    const recipientStatusRows = Array.from(
      normalizedTransmittals.reduce(
        (map, transmittal) => {
          const bucket = map.get(transmittal.recipientName) || {
            recipient: transmittal.recipientName,
            packages: 0,
            acknowledged: 0,
            open: 0,
            documents: 0,
          };

          bucket.packages += 1;
          bucket.documents += transmittal.documentCount;
          if (
            transmittal.status === "acknowledged" ||
            transmittal.status === "approved"
          ) {
            bucket.acknowledged += 1;
          } else {
            bucket.open += 1;
          }

          map.set(transmittal.recipientName, bucket);
          return map;
        },
        new Map<
          string,
          {
            recipient: string;
            packages: number;
            acknowledged: number;
            open: number;
            documents: number;
          }
        >(),
      ),
    )
      .map(([, bucket]) => ({
        recipient: bucket.recipient,
        packages: String(bucket.packages),
        acknowledged: String(bucket.acknowledged),
        open: String(bucket.open),
        documents: String(bucket.documents),
      }))
      .sort((left, right) => Number(right.packages) - Number(left.packages));

    const purposeRows = Array.from(
      normalizedTransmittals.reduce((map, transmittal) => {
        const key = transmittal.purpose || "General issue";
        map.set(key, (map.get(key) || 0) + 1);
        return map;
      }, new Map<string, number>()),
    )
      .map(([purpose, total]) => ({
        purpose,
        total: String(total),
      }))
      .sort((left, right) => Number(right.total) - Number(left.total));

    const activityRows = [
      ...normalizedDocuments.map((document) => ({
        date: document.uploadedLabel,
        sortKey: Number(Date.parse(document.uploadedLabel)) || 0,
        type: "Document",
        action: "Uploaded",
        reference: document.documentNumber,
        details: document.title,
      })),
      ...normalizedTransmittals.map((transmittal) => ({
        date: transmittal.sentLabel,
        sortKey:
          transmittal.createdAt?.getTime() ||
          Number(Date.parse(transmittal.sentLabel)) ||
          0,
        type: "Transmittal",
        action:
          transmittal.status === "acknowledged" ||
          transmittal.status === "approved"
            ? "Acknowledged"
            : "Issued",
        reference: transmittal.transmittalNumber,
        details: `${transmittal.subject} · ${transmittal.recipientName}`,
      })),
      ...normalizedWorkflows.map((workflow) => ({
        date: workflow.dueLabel,
        sortKey: workflow.dueDate?.getTime() || 0,
        type: "Workflow",
        action:
          workflow.status === "completed"
            ? "Review completed"
            : "Review pending",
        reference: workflow.documentNumber,
        details: `${workflow.workflowName} · ${workflow.stepName} · ${workflow.assignedToName}`,
      })),
    ]
      .sort((left, right) => right.sortKey - left.sortKey)
      .slice(0, 20)
      .map(({ sortKey: _sortKey, ...row }) => row);

    const statusRows = Array.from(statusMap.entries())
      .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
      .map(([status, count]) => ({
        status,
        count: String(count),
        share:
          normalizedDocuments.length > 0
            ? `${Math.round((count / normalizedDocuments.length) * 100)}%`
            : "0%",
      }));

    const documentTypeRows = Array.from(
      normalizedDocuments.reduce((map, document) => {
        const key = extractDocumentType(document.documentNumber);
        map.set(key, (map.get(key) || 0) + 1);
        return map;
      }, new Map<string, number>()),
    )
      .map(([type, total]) => ({
        type,
        total: String(total),
      }))
      .sort((left, right) => Number(right.total) - Number(left.total));

    const totalControlled = normalizedDocuments.length;
    const totalApproved = disciplineRows.reduce(
      (sum, row) => sum + Number(row.approved),
      0,
    );
    const totalPending = disciplineRows.reduce(
      (sum, row) => sum + Number(row.pending),
      0,
    );
    const overallCompletion =
      totalControlled > 0
        ? Math.round((totalApproved / totalControlled) * 100)
        : 0;
    const acknowledgedCount = normalizedTransmittals.filter(
      (transmittal) =>
        transmittal.status === "acknowledged" ||
        transmittal.status === "approved",
    ).length;
    const acknowledgementRate =
      normalizedTransmittals.length > 0
        ? Math.round((acknowledgedCount / normalizedTransmittals.length) * 100)
        : 0;
    const dominantStatus = statusRows[0]?.status || "draft";
    const dominantStatusCount = statusRows[0]?.count || "0";
    const workflowStatusRows = Array.from(
      normalizedWorkflows.reduce((map, workflow) => {
        map.set(workflow.status, (map.get(workflow.status) || 0) + 1);
        return map;
      }, new Map<string, number>()),
    ).map(([status, count]) => ({
      status,
      count: String(count),
      share:
        normalizedWorkflows.length > 0
          ? `${Math.round((count / normalizedWorkflows.length) * 100)}%`
          : "0%",
    }));

    const reportMap: Record<string, GeneratedReport> = {
      mdr: {
        id: "mdr",
        title: "Master Document Register",
        description:
          "Controlled documents with revision control, discipline ownership, and current status.",
        columns: [
          { key: "documentNumber", label: "Document Number" },
          { key: "title", label: "Title" },
          { key: "discipline", label: "Discipline" },
          { key: "revision", label: "Revision" },
          { key: "status", label: "Status" },
          { key: "author", label: "Author" },
          { key: "uploadedLabel", label: "Uploaded" },
        ],
        data: normalizedDocuments.map((document) => ({
          documentNumber: document.documentNumber,
          title: document.title,
          discipline: document.discipline,
          revision: document.revision,
          status: document.status,
          author: document.author,
          uploadedLabel: document.uploadedLabel,
        })),
        meta: baseMeta,
        summary: [
          { label: "Total documents", value: String(totalControlled) },
          { label: "Approved", value: String(totalApproved), tone: "positive" },
          { label: "Pending", value: String(totalPending), tone: "warning" },
          { label: "Disciplines", value: String(disciplineRows.length) },
        ],
        sections: [
          {
            title: "Status distribution",
            description: "Register split by current approval state.",
            columns: [
              { key: "status", label: "Status" },
              { key: "count", label: "Count" },
              { key: "share", label: "Share" },
            ],
            data: statusRows,
          },
          {
            title: "Discipline coverage",
            description: "Controlled-document volume and latest movement.",
            columns: [
              { key: "discipline", label: "Discipline" },
              { key: "total", label: "Total" },
              { key: "approved", label: "Approved" },
              { key: "pending", label: "Pending" },
              { key: "latestUpload", label: "Latest Upload" },
            ],
            data: disciplineRows,
          },
          {
            title: "Document type mix",
            description:
              "Distribution by code family extracted from document numbers.",
            columns: [
              { key: "type", label: "Type" },
              { key: "total", label: "Total" },
            ],
            data: documentTypeRows,
          },
          {
            title: "Transmission gaps",
            description:
              "Current register entries that have not yet been routed through an outbound transmittal.",
            columns: [
              { key: "documentNumber", label: "Document Number" },
              { key: "title", label: "Title" },
              { key: "discipline", label: "Discipline" },
              { key: "revision", label: "Revision" },
              { key: "status", label: "Status" },
            ],
            data: unissuedRows,
          },
        ],
        narrative: [
          `${formatEdmsLabel(dominantStatus)} is the largest register state with ${dominantStatusCount} controlled documents.`,
          `${disciplineRows.filter((row) => row.status === "approved").length} disciplines are fully closed in the current reporting window.`,
        ],
      },
      txlog: {
        id: "txlog",
        title: "Transmittal Log",
        description:
          "Issued packages, recipients, acknowledgement status, and document counts.",
        columns: [
          { key: "transmittalNumber", label: "Transmittal" },
          { key: "sentLabel", label: "Issued" },
          { key: "recipientName", label: "Recipient" },
          { key: "subject", label: "Subject" },
          { key: "documentCount", label: "Documents" },
          { key: "purpose", label: "Purpose" },
          { key: "status", label: "Status" },
        ],
        data: normalizedTransmittals.map((transmittal) => ({
          transmittalNumber: transmittal.transmittalNumber,
          sentLabel: transmittal.sentLabel,
          recipientName: transmittal.recipientName,
          subject: transmittal.subject,
          documentCount: String(transmittal.documentCount),
          purpose: transmittal.purpose || "-",
          status: transmittal.status,
        })),
        meta: baseMeta,
        summary: [
          {
            label: "Issued transmittals",
            value: String(normalizedTransmittals.length),
          },
          {
            label: "Acknowledged",
            value: String(acknowledgedCount),
            tone: "positive",
          },
          {
            label: "Open",
            value: String(normalizedTransmittals.length - acknowledgedCount),
            tone: overdueRows.length > 0 ? "warning" : "default",
          },
          {
            label: "Ack rate",
            value: `${acknowledgementRate}%`,
            tone: acknowledgementRate >= 80 ? "positive" : "warning",
          },
        ],
        sections: [
          {
            title: "Outstanding acknowledgements",
            description:
              "Packages that still require a client or PMC response.",
            columns: [
              { key: "transmittalNumber", label: "Transmittal" },
              { key: "recipient", label: "Recipient" },
              { key: "dueDate", label: "Due Date" },
              { key: "documents", label: "Documents" },
              { key: "status", label: "Status" },
            ],
            data: overdueRows,
          },
          {
            title: "Recipient action statuses",
            description:
              "Delivery and acknowledgement mix grouped by transmittal recipient.",
            columns: [
              { key: "recipient", label: "Recipient" },
              { key: "packages", label: "Packages" },
              { key: "acknowledged", label: "Acknowledged" },
              { key: "open", label: "Open" },
              { key: "documents", label: "Documents" },
            ],
            data: recipientStatusRows,
          },
          {
            title: "Issue purpose mix",
            description:
              "How the outbound register is split by transmittal purpose code.",
            columns: [
              { key: "purpose", label: "Purpose" },
              { key: "total", label: "Total" },
            ],
            data: purposeRows,
          },
        ],
        narrative: [
          `${acknowledgementRate}% of issued transmittals have been acknowledged within the current reporting window.`,
        ],
      },
      progress: {
        id: "progress",
        title: "Engineering Progress Report",
        description:
          "Discipline-level completion, revision activity, and register movement.",
        columns: [
          { key: "discipline", label: "Discipline" },
          { key: "total", label: "Total" },
          { key: "approved", label: "Approved" },
          { key: "pending", label: "Pending" },
          { key: "completion", label: "Completion" },
          { key: "status", label: "Status" },
        ],
        data: disciplineRows,
        meta: baseMeta,
        summary: [
          {
            label: "Overall progress",
            value: `${overallCompletion}%`,
            tone: overallCompletion >= 75 ? "positive" : "warning",
          },
          { label: "Approved docs", value: String(totalApproved) },
          {
            label: "Pending docs",
            value: String(totalPending),
            tone: totalPending > 0 ? "warning" : "positive",
          },
          { label: "Disciplines", value: String(disciplineRows.length) },
        ],
        sections: [
          {
            title: "Detailed discipline progress",
            description:
              "Completion, revision depth, and latest register movement by discipline.",
            columns: [
              { key: "discipline", label: "Discipline" },
              { key: "total", label: "Total" },
              { key: "approved", label: "Approved" },
              { key: "pending", label: "Pending" },
              { key: "revisions", label: "Revisions" },
              { key: "latestUpload", label: "Latest Upload" },
              { key: "completion", label: "Completion" },
            ],
            data: disciplineRows,
          },
          {
            title: "Approval status mix",
            description:
              "Current distribution of register entries by review state.",
            columns: [
              { key: "status", label: "Status" },
              { key: "count", label: "Count" },
              { key: "share", label: "Share" },
            ],
            data: statusRows,
          },
          {
            title: "Review workload",
            description:
              "Pending and overdue workflow assignments feeding engineering progress.",
            columns: [
              { key: "reviewer", label: "Reviewer" },
              { key: "role", label: "Role" },
              { key: "pending", label: "Pending" },
              { key: "overdue", label: "Overdue" },
              { key: "completed", label: "Completed" },
            ],
            data: reviewerLoadRows,
          },
        ],
        narrative: [
          `${overallCompletion}% of live register items are approved, with ${totalPending} items still requiring action.`,
          `${disciplineRows.filter((row) => Number(row.pending) > 0).length} disciplines still carry open review items.`,
        ],
      },
      overdue: {
        id: "overdue",
        title: "Overdue & Pending Report",
        description:
          "Transmittals that remain open after their due date and should be chased.",
        columns: [
          { key: "transmittalNumber", label: "Transmittal" },
          { key: "subject", label: "Subject" },
          { key: "recipient", label: "Recipient" },
          { key: "dueDate", label: "Due Date" },
          { key: "documents", label: "Documents" },
          { key: "purpose", label: "Purpose" },
          { key: "status", label: "Status" },
        ],
        data: overdueRows,
        meta: baseMeta,
        summary: [
          {
            label: "Overdue items",
            value: String(overdueRows.length),
            tone: overdueRows.length > 0 ? "danger" : "positive",
          },
          {
            label: "Open transmittals",
            value: String(normalizedTransmittals.length - acknowledgedCount),
          },
          {
            label: "Ack rate",
            value: `${acknowledgementRate}%`,
            tone: acknowledgementRate >= 80 ? "positive" : "warning",
          },
          {
            label: "Recipients impacted",
            value: String(
              new Set(overdueRows.map((row) => row.recipient)).size,
            ),
          },
        ],
        sections: [
          {
            title: "Escalation candidates",
            description:
              "Recipients and packages that should be chased in the current cycle.",
            columns: [
              { key: "transmittalNumber", label: "Transmittal" },
              { key: "recipient", label: "Recipient" },
              { key: "dueDate", label: "Due Date" },
              { key: "documents", label: "Documents" },
              { key: "status", label: "Status" },
            ],
            data: overdueRows,
          },
          {
            title: "Overdue review steps",
            description:
              "Workflow tasks that are now beyond their assigned response date.",
            columns: [
              { key: "documentNumber", label: "Document" },
              { key: "workflow", label: "Workflow" },
              { key: "step", label: "Step" },
              { key: "responder", label: "Responder" },
              { key: "dueDate", label: "Due Date" },
              { key: "status", label: "Status" },
            ],
            data: overdueWorkflowRows,
          },
        ],
        narrative: [
          overdueRows.length > 0
            ? `${overdueRows.length} transmittals are beyond their due date and require follow-up.`
            : "No overdue transmittals were found in the live register.",
        ],
      },
      submission: {
        id: "submission",
        title: "Submission Status by Discipline",
        description:
          "Submission totals and approval counts grouped by discipline.",
        columns: [
          { key: "discipline", label: "Discipline" },
          { key: "total", label: "Total" },
          { key: "approved", label: "Approved" },
          { key: "pending", label: "Pending" },
          { key: "completion", label: "Completion" },
        ],
        data: disciplineRows.map((row) => ({
          discipline: row.discipline,
          total: row.total,
          approved: row.approved,
          pending: row.pending,
          completion: row.completion,
        })),
        meta: baseMeta,
        summary: [
          { label: "Disciplines", value: String(disciplineRows.length) },
          {
            label: "Average completion",
            value: `${overallCompletion}%`,
            tone: overallCompletion >= 75 ? "positive" : "warning",
          },
          {
            label: "Fully approved",
            value: String(
              disciplineRows.filter((row) => row.status === "approved").length,
            ),
            tone: "positive",
          },
          {
            label: "Under review",
            value: String(
              disciplineRows.filter((row) => row.status === "under_review")
                .length,
            ),
          },
        ],
        sections: [
          {
            title: "Discipline submission detail",
            columns: [
              { key: "discipline", label: "Discipline" },
              { key: "total", label: "Total" },
              { key: "approved", label: "Approved" },
              { key: "pending", label: "Pending" },
              { key: "completion", label: "Completion" },
            ],
            data: disciplineRows,
          },
          {
            title: "Review assignment mix",
            description:
              "Current review load by assigned role and owner across the workflow queue.",
            columns: [
              { key: "reviewer", label: "Reviewer" },
              { key: "role", label: "Role" },
              { key: "total", label: "Total" },
              { key: "pending", label: "Pending" },
              { key: "completed", label: "Completed" },
            ],
            data: reviewerLoadRows,
          },
        ],
      },
      comments: {
        id: "comments",
        title: "Comment Response Sheet (CRS)",
        description:
          "Workflow comments, response owners, and due dates across active document reviews.",
        columns: [
          { key: "documentNumber", label: "Document" },
          { key: "workflow", label: "Workflow" },
          { key: "step", label: "Step" },
          { key: "responder", label: "Responder" },
          { key: "role", label: "Role" },
          { key: "dueDate", label: "Due Date" },
          { key: "status", label: "Status" },
        ],
        data: commentResponseRows,
        meta: baseMeta,
        summary: [
          {
            label: "Open responses",
            value: String(pendingWorkflowRows.length),
            tone: pendingWorkflowRows.length > 0 ? "warning" : "positive",
          },
          {
            label: "Closed responses",
            value: String(
              normalizedWorkflows.filter(
                (workflow) => workflow.status === "completed",
              ).length,
            ),
            tone: "positive",
          },
          {
            label: "Overdue responses",
            value: String(overdueWorkflowRows.length),
            tone: overdueWorkflowRows.length > 0 ? "danger" : "positive",
          },
          {
            label: "Reviewers",
            value: String(reviewerLoadRows.length),
          },
        ],
        sections: [
          {
            title: "Overdue comment actions",
            description:
              "Response owners who need to close out a late workflow step.",
            columns: [
              { key: "documentNumber", label: "Document" },
              { key: "workflow", label: "Workflow" },
              { key: "step", label: "Step" },
              { key: "responder", label: "Responder" },
              { key: "dueDate", label: "Due Date" },
              { key: "status", label: "Status" },
            ],
            data: overdueWorkflowRows,
          },
          {
            title: "Reviewer workload",
            description:
              "Assignment mix for the review team handling current document comments.",
            columns: [
              { key: "reviewer", label: "Reviewer" },
              { key: "role", label: "Role" },
              { key: "pending", label: "Pending" },
              { key: "overdue", label: "Overdue" },
              { key: "completed", label: "Completed" },
            ],
            data: reviewerLoadRows,
          },
        ],
        narrative: [
          `${pendingWorkflowRows.length} workflow responses are still open, with ${overdueWorkflowRows.length} already beyond their due date.`,
        ],
      },
      hold: {
        id: "hold",
        title: "Documents on Hold",
        description:
          "Documents waiting on reviewer action, clarification, or overdue workflow follow-up.",
        columns: [
          { key: "documentNumber", label: "Document" },
          { key: "title", label: "Title" },
          { key: "owner", label: "Owner" },
          { key: "workflow", label: "Workflow" },
          { key: "dueDate", label: "Due Date" },
          { key: "reason", label: "Reason" },
          { key: "status", label: "Status" },
        ],
        data: holdRows,
        meta: baseMeta,
        summary: [
          {
            label: "Held documents",
            value: String(holdRows.length),
            tone: holdRows.length > 0 ? "warning" : "positive",
          },
          {
            label: "Overdue holds",
            value: String(overdueWorkflowRows.length),
            tone: overdueWorkflowRows.length > 0 ? "danger" : "positive",
          },
          {
            label: "Owners",
            value: String(new Set(holdRows.map((row) => row.owner)).size),
          },
          {
            label: "Open review steps",
            value: String(pendingWorkflowRows.length),
          },
        ],
        sections: [
          {
            title: "Hold ownership",
            description: "Review owners carrying the current hold backlog.",
            columns: [
              { key: "reviewer", label: "Owner" },
              { key: "role", label: "Role" },
              { key: "pending", label: "Pending" },
              { key: "overdue", label: "Overdue" },
              { key: "completed", label: "Completed" },
            ],
            data: reviewerLoadRows,
          },
          {
            title: "Workflow status mix",
            description: "Overall state split across the live review queue.",
            columns: [
              { key: "status", label: "Status" },
              { key: "count", label: "Count" },
              { key: "share", label: "Share" },
            ],
            data: workflowStatusRows,
          },
        ],
        narrative: [
          holdRows.length > 0
            ? `${holdRows.length} documents are effectively on hold in the live review queue.`
            : "No held documents were found in the live workflow queue.",
        ],
      },
      audit: {
        id: "audit",
        title: "Audit Trail Export",
        description:
          "Recent document, workflow, and transmittal events from the live EDMS workspace.",
        columns: [
          { key: "date", label: "Date" },
          { key: "type", label: "Type" },
          { key: "action", label: "Action" },
          { key: "reference", label: "Reference" },
          { key: "details", label: "Details" },
        ],
        data: activityRows,
        meta: baseMeta,
        summary: [
          { label: "Recent events", value: String(activityRows.length) },
          {
            label: "Document uploads",
            value: String(normalizedDocuments.length),
          },
          {
            label: "Issued transmittals",
            value: String(normalizedTransmittals.length),
          },
          {
            label: "Workflow steps",
            value: String(normalizedWorkflows.length),
          },
        ],
        sections: [
          {
            title: "Latest operational events",
            description:
              "Combined activity from document control, workflow reviews, and transmittal issuance.",
            columns: [
              { key: "date", label: "Date" },
              { key: "type", label: "Type" },
              { key: "action", label: "Action" },
              { key: "reference", label: "Reference" },
              { key: "details", label: "Details" },
            ],
            data: activityRows,
          },
          {
            title: "Workflow workload",
            description:
              "Current review volume by assignee for audit and planning use.",
            columns: [
              { key: "reviewer", label: "Reviewer" },
              { key: "role", label: "Role" },
              { key: "total", label: "Total" },
              { key: "pending", label: "Pending" },
              { key: "overdue", label: "Overdue" },
            ],
            data: reviewerLoadRows,
          },
        ],
      },
    };

    setSelectedReport(reportMap[reportId] || null);
    setModalOpen(true);
  };

  return (
    <ScrollableContent>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden px-4 pt-6 sm:px-6 lg:px-8">
          {error ? (
            <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
              <p className="text-sm text-primary">{error}</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Reports
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Generate project reports for documents, transmittals, and live
                operational status.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto xl:justify-end">
              <Button
                variant="outline"
                onClick={() => setSchedulerOpen(true)}
                className="sm:w-auto"
              >
                Schedule reports
              </Button>
              <Button
                variant="outline"
                onClick={() => setBuilderOpen(true)}
                className="sm:w-auto"
              >
                Custom report
              </Button>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className="group min-w-0 transition-colors hover:border-primary/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-muted p-2">
                      <report.icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {report.tag}
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-base">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Ready as of {generatedLabel}
                  </div>
                  <Button
                    onClick={() => handleRunReport(report.id)}
                    className="w-full"
                    size="sm"
                  >
                    <Download className="mr-2 size-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid min-w-0 gap-4 xl:grid-cols-[0.8fr_1.2fr]">
            <Card className="min-w-0 border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Reporting signals</CardTitle>
                <CardDescription>
                  Quick counts used by the live report generator and PDF
                  previews.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {reportOverview.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md border border-border bg-muted/20 px-4 py-4"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight">
                      {item.value}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.hint}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="min-w-0 border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  Recent report activity
                </CardTitle>
                <CardDescription>
                  Latest register and transmittal events that feed the
                  operational reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80">
                  <div className="min-w-0 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead className="border-b bg-muted/30 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Stream</th>
                          <th className="px-4 py-3">Reference</th>
                          <th className="px-4 py-3">Detail</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivity.length ? (
                          recentActivity.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b last:border-b-0"
                            >
                              <td className="px-4 py-3 font-mono text-xs">
                                {item.date}
                              </td>
                              <td className="px-4 py-3">{item.stream}</td>
                              <td className="px-4 py-3 font-mono text-xs">
                                {item.reference}
                              </td>
                              <td className="px-4 py-3">{item.detail}</td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className="capitalize">
                                  {formatEdmsLabel(item.status)}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-8 text-center text-sm text-muted-foreground"
                            >
                              No register activity found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={schedulerOpen} onOpenChange={setSchedulerOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Schedule report packs</DialogTitle>
              <DialogDescription>
                Use these live presets to mirror the standard EDMS delivery
                cadence used for weekly progress, exception chasing, and monthly
                register submissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Daily exception pack",
                  description:
                    "Opens the overdue backlog with overdue workflow actions and transmittal follow-up.",
                  reportId: "overdue",
                },
                {
                  title: "Weekly progress pack",
                  description:
                    "Opens the engineering progress report with discipline completion and reviewer workload.",
                  reportId: "progress",
                },
                {
                  title: "Monthly register pack",
                  description:
                    "Opens the master document register with discipline and transmission coverage.",
                  reportId: "mdr",
                },
                {
                  title: "Weekly audit pack",
                  description:
                    "Opens the audit trail export with document, workflow, and transmittal events.",
                  reportId: "audit",
                },
              ].map((preset) => (
                <Card key={preset.title} className="min-w-0">
                  <CardHeader>
                    <CardTitle className="text-base">{preset.title}</CardTitle>
                    <CardDescription>{preset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setSchedulerOpen(false);
                        handleRunReport(preset.reportId);
                      }}
                    >
                      Open report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Custom report shortcuts</DialogTitle>
              <DialogDescription>
                Jump straight to the live report families most commonly
                requested by document control teams and clients.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Register and revisions",
                  description:
                    "Controlled-document issue status, revision control, and transmission gaps.",
                  reportId: "mdr",
                },
                {
                  title: "Client response backlog",
                  description:
                    "Open comment-response items, overdue review steps, and current reviewer load.",
                  reportId: "comments",
                },
                {
                  title: "Documents on hold",
                  description:
                    "Documents waiting on review or overdue clarification cycles.",
                  reportId: "hold",
                },
                {
                  title: "Transmittal distribution",
                  description:
                    "Issued packages, recipient action status, and purpose-code mix.",
                  reportId: "txlog",
                },
              ].map((template) => (
                <Card key={template.title} className="min-w-0">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {template.title}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setBuilderOpen(false);
                        handleRunReport(template.reportId);
                      }}
                    >
                      Open template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <ReportModal
          report={selectedReport}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </ErrorBoundary>
    </ScrollableContent>
  );
}
