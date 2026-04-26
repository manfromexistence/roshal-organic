import type { Metadata } from "next";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getCommissioningChecklists } from "@/lib/edms/commissioning";
import { getEdmsDashboardData } from "@/lib/edms/dashboard";
import { getDocuments } from "@/lib/edms/documents";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { DatabookPageClient } from "./databook-page-client";

export const metadata: Metadata = {
  title: "Databook | Quadra EDMS",
};

type DatabookDoc = {
  code: string;
  href?: string;
  meta?: string;
  status: "collected" | "missing" | "pending";
  title: string;
};

type DatabookSection = {
  code: string;
  collected: number;
  docs: DatabookDoc[];
  required: number;
  rule: string;
  title: string;
};

type DatabookRule = {
  pattern: string;
  section: string;
  trigger: string;
};

function toDatabookStatus(status: string | null | undefined) {
  const normalized = (status || "").trim().toLowerCase();

  if (
    normalized === "approved" ||
    normalized === "completed" ||
    normalized === "acknowledged" ||
    normalized === "issued" ||
    normalized === "ifc" ||
    normalized === "ifa" ||
    normalized === "ifi" ||
    normalized === "a" ||
    normalized === "b" ||
    normalized === "c"
  ) {
    return "collected" as const;
  }

  if (
    normalized.includes("reject") ||
    normalized.includes("revise") ||
    normalized === "r"
  ) {
    return "missing" as const;
  }

  return "pending" as const;
}

function buildInitialSections(
  documents: Awaited<ReturnType<typeof getDocuments>>,
  checklists: Awaited<ReturnType<typeof getCommissioningChecklists>>,
) {
  const groupedDocuments = new Map<
    string,
    {
      docs: DatabookDoc[];
      rule: string;
      title: string;
    }
  >();

  for (const document of documents) {
    const groupKey =
      document.category?.trim() ||
      document.discipline?.trim() ||
      "General Documents";
    const title = document.category?.trim()
      ? `${groupKey} Documents`
      : document.discipline?.trim()
        ? `${groupKey} Discipline`
        : groupKey;
    const rule = document.category?.trim()
      ? `category=${groupKey}`
      : document.discipline?.trim()
        ? `discipline=${groupKey}`
        : "documents";

    const existingGroup = groupedDocuments.get(groupKey) || {
      docs: [],
      rule,
      title,
    };

    existingGroup.docs.push({
      code: document.documentNumber,
      href: `/documents/${document.id}`,
      meta: `Revision ${document.revision || "-"} | ${document.status}`,
      status: toDatabookStatus(document.status),
      title: document.title,
    });

    groupedDocuments.set(groupKey, existingGroup);
  }

  const sections: DatabookSection[] = Array.from(groupedDocuments.values())
    .sort((left, right) => left.title.localeCompare(right.title))
    .map((group, index) => {
      const collected = group.docs.filter(
        (document) => document.status === "collected",
      ).length;

      return {
        code: `SEC-${String(index + 1).padStart(2, "0")}`,
        collected,
        docs: group.docs.sort((left, right) =>
          left.code.localeCompare(right.code),
        ),
        required: group.docs.length,
        rule: group.rule,
        title: group.title,
      };
    });

  if (checklists.length > 0) {
    const commissioningDocs = checklists.map((checklist) => ({
      code: checklist.checklistNumber,
      meta: checklist.completedAt
        ? `Completed ${new Date(checklist.completedAt).toLocaleDateString()}`
        : checklist.status.replaceAll("_", " "),
      status: toDatabookStatus(checklist.status),
      title: `${checklist.system} | ${checklist.description}`,
    }));

    sections.push({
      code: `SEC-${String(sections.length + 1).padStart(2, "0")}`,
      collected: commissioningDocs.filter(
        (document) => document.status === "collected",
      ).length,
      docs: commissioningDocs,
      required: commissioningDocs.length,
      rule: "commissioning_checklists",
      title: "Commissioning Checklists",
    });
  }

  const rules: DatabookRule[] = sections.map((section) => ({
    pattern: section.rule,
    section: `${section.code} ${section.title}`,
    trigger:
      section.rule === "commissioning_checklists"
        ? "On completion"
        : "On upload",
  }));

  return { rules, sections };
}

export default async function DatabookPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);
  const dashboardData = await getEdmsDashboardData(sessionUser);

  if (!projectId) {
    return (
      <DatabookPageClient
        autoPopulateRules={[]}
        initialSections={[]}
        metadata={{
          compiler: sessionUser.name || sessionUser.email || "Quadra EDMS",
          revision: "Working",
          targetDate: "Not set",
          title: "Project Data Book",
        }}
      />
    );
  }

  const [documents, checklists] = await Promise.all([
    getDocuments(projectId),
    getCommissioningChecklists(projectId),
  ]);

  const project =
    dashboardData.projects.find((item) => item.id === projectId) || null;
  const { rules, sections } = buildInitialSections(documents, checklists);

  const title = project
    ? `${project.projectNumber ? `${project.projectNumber} - ` : ""}${project.name} Data Book`
    : "Project Data Book";

  return (
    <DatabookPageClient
      autoPopulateRules={rules}
      initialSections={sections}
      metadata={{
        compiler: sessionUser.name || sessionUser.email || "Quadra EDMS",
        revision: "Working",
        targetDate: project?.endDate
          ? new Date(project.endDate).toLocaleDateString()
          : "Not set",
        title,
      }}
    />
  );
}
