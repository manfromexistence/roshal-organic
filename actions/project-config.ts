"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { ensureProjectConfigTables } from "@/lib/edms/project-config";
import { canConfigureEdmsProject, canDeleteEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import {
  documents,
  projectConfigs,
  projectDisciplines,
  projectDocumentTypes,
  projectStakeholders,
  projects,
  workflowStepTemplates,
} from "@/lib/schema";

const generalSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().trim().min(2),
  projectNumber: z.string().trim().min(2),
  location: z.string().trim(),
  description: z.string().trim(),
});

const numberingSchema = z.object({
  projectId: z.string().min(1),
  numberingPattern: z.string().trim().min(3),
  separator: z.string().trim().min(1),
  sequencePadding: z.coerce.number().int().min(1).max(12),
  revisionScheme: z.string().trim().min(2),
});

const disciplineSchema = z.object({
  projectId: z.string().min(1),
  code: z.string().trim().min(2).max(12),
  name: z.string().trim().min(2).max(60),
});

const documentTypeSchema = z.object({
  projectId: z.string().min(1),
  code: z.string().trim().min(2).max(12),
  name: z.string().trim().min(2).max(60),
});

const stakeholderSchema = z.object({
  projectId: z.string().min(1),
  stakeholderId: z.string().trim().min(2).max(16),
  name: z.string().trim().min(2).max(80),
  role: z.string().trim().min(2).max(40),
  contact: z.string().trim().max(120).optional().default(""),
});

const workflowTemplateSchema = z.object({
  projectId: z.string().min(1),
  stepName: z.string().trim().min(2).max(80),
  actor: z.string().trim().min(2).max(40),
  duration: z.string().trim().min(1).max(40),
});

function configPath(projectId: string) {
  return `/config?projectId=${projectId}`;
}

function ok() {
  return { success: true as const };
}

function fail(message: string) {
  return { success: false as const, error: { message } };
}

async function requireProjectConfigAccess() {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (!canConfigureEdmsProject(sessionUser.role)) {
    throw new Error("You are not allowed to change project setup.");
  }

  return sessionUser;
}

async function requireDeleteAccess() {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (!canDeleteEdmsContent(sessionUser.role)) {
    throw new Error("Only admin users can delete project setup entries.");
  }

  return sessionUser;
}

async function revalidateConfig(projectId: string) {
  revalidatePath("/config");
  revalidatePath(configPath(projectId));
}

export async function saveProjectGeneral(input: z.infer<typeof generalSchema>) {
  try {
    await requireProjectConfigAccess();
    const values = generalSchema.parse(input);

    await db
      .update(projects)
      .set({
        name: values.name,
        projectNumber: values.projectNumber,
        location: values.location || null,
        description: values.description || null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, values.projectId));

    await revalidateConfig(values.projectId);
    revalidatePath("/projects");

    return ok();
  } catch (error) {
    console.error("Failed to save project general config:", error);
    return fail("Failed to save general project settings.");
  }
}

export async function saveProjectNumbering(
  input: z.infer<typeof numberingSchema>,
) {
  try {
    await requireProjectConfigAccess();
    const values = numberingSchema.parse(input);
    await ensureProjectConfigTables();

    const [existing] = await db
      .select()
      .from(projectConfigs)
      .where(eq(projectConfigs.projectId, values.projectId))
      .limit(1);

    const timestamp = new Date();

    if (existing) {
      await db
        .update(projectConfigs)
        .set({
          numberingPattern: values.numberingPattern,
          separator: values.separator,
          sequencePadding: values.sequencePadding,
          revisionScheme: values.revisionScheme,
          updatedAt: timestamp,
        })
        .where(eq(projectConfigs.id, existing.id));
    } else {
      await db.insert(projectConfigs).values({
        id: crypto.randomUUID(),
        projectId: values.projectId,
        numberingPattern: values.numberingPattern,
        separator: values.separator,
        sequencePadding: values.sequencePadding,
        revisionScheme: values.revisionScheme,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await revalidateConfig(values.projectId);
    return ok();
  } catch (error) {
    console.error("Failed to save project numbering config:", error);
    return fail("Failed to save numbering settings.");
  }
}

export async function addProjectDiscipline(
  input: z.infer<typeof disciplineSchema>,
) {
  try {
    await requireProjectConfigAccess();
    const values = disciplineSchema.parse({
      ...input,
      code: input.code.toUpperCase(),
    });
    await ensureProjectConfigTables();

    const [existing] = await db
      .select()
      .from(projectDisciplines)
      .where(
        and(
          eq(projectDisciplines.projectId, values.projectId),
          eq(projectDisciplines.code, values.code),
        ),
      )
      .limit(1);

    if (existing) {
      return fail("That discipline code already exists for this project.");
    }

    const [{ value: currentCount }] = await db
      .select({ value: count() })
      .from(projectDisciplines)
      .where(eq(projectDisciplines.projectId, values.projectId));

    const timestamp = new Date();
    await db.insert(projectDisciplines).values({
      id: crypto.randomUUID(),
      projectId: values.projectId,
      code: values.code,
      name: values.name,
      color: "#6b7280",
      sortOrder: currentCount,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await revalidateConfig(values.projectId);
    return ok();
  } catch (error) {
    console.error("Failed to add project discipline:", error);
    return fail("Failed to add the discipline.");
  }
}

export async function deleteProjectDiscipline(input: {
  id: string;
  projectId: string;
}) {
  try {
    await requireDeleteAccess();
    await ensureProjectConfigTables();
    await db
      .delete(projectDisciplines)
      .where(eq(projectDisciplines.id, input.id));
    await revalidateConfig(input.projectId);
    return ok();
  } catch (error) {
    console.error("Failed to delete project discipline:", error);
    return fail("Failed to delete the discipline.");
  }
}

export async function addProjectDocumentType(
  input: z.infer<typeof documentTypeSchema>,
) {
  try {
    await requireProjectConfigAccess();
    const values = documentTypeSchema.parse({
      ...input,
      code: input.code.toUpperCase(),
    });
    await ensureProjectConfigTables();

    const [existing] = await db
      .select()
      .from(projectDocumentTypes)
      .where(
        and(
          eq(projectDocumentTypes.projectId, values.projectId),
          eq(projectDocumentTypes.code, values.code),
        ),
      )
      .limit(1);

    if (existing) {
      return fail("That document type code already exists for this project.");
    }

    const [{ value: currentCount }] = await db
      .select({ value: count() })
      .from(projectDocumentTypes)
      .where(eq(projectDocumentTypes.projectId, values.projectId));

    const timestamp = new Date();
    await db.insert(projectDocumentTypes).values({
      id: crypto.randomUUID(),
      projectId: values.projectId,
      code: values.code,
      name: values.name,
      sortOrder: currentCount,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await revalidateConfig(values.projectId);
    return ok();
  } catch (error) {
    console.error("Failed to add document type:", error);
    return fail("Failed to add the document type.");
  }
}

export async function deleteProjectDocumentType(input: {
  id: string;
  projectId: string;
}) {
  try {
    await requireDeleteAccess();
    await ensureProjectConfigTables();
    await db
      .delete(projectDocumentTypes)
      .where(eq(projectDocumentTypes.id, input.id));
    await revalidateConfig(input.projectId);
    return ok();
  } catch (error) {
    console.error("Failed to delete document type:", error);
    return fail("Failed to delete the document type.");
  }
}

export async function addProjectStakeholder(
  input: z.infer<typeof stakeholderSchema>,
) {
  try {
    await requireProjectConfigAccess();
    const values = stakeholderSchema.parse({
      ...input,
      stakeholderId: input.stakeholderId.toUpperCase(),
    });
    await ensureProjectConfigTables();

    const [{ value: currentCount }] = await db
      .select({ value: count() })
      .from(projectStakeholders)
      .where(eq(projectStakeholders.projectId, values.projectId));

    const timestamp = new Date();
    await db.insert(projectStakeholders).values({
      id: crypto.randomUUID(),
      projectId: values.projectId,
      stakeholderId: values.stakeholderId,
      name: values.name,
      role: values.role,
      contact: values.contact || null,
      sortOrder: currentCount,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await revalidateConfig(values.projectId);
    return ok();
  } catch (error) {
    console.error("Failed to add stakeholder:", error);
    return fail("Failed to add the stakeholder.");
  }
}

export async function deleteProjectStakeholder(input: {
  id: string;
  projectId: string;
}) {
  try {
    await requireDeleteAccess();
    await ensureProjectConfigTables();
    await db
      .delete(projectStakeholders)
      .where(eq(projectStakeholders.id, input.id));
    await revalidateConfig(input.projectId);
    return ok();
  } catch (error) {
    console.error("Failed to delete stakeholder:", error);
    return fail("Failed to delete the stakeholder.");
  }
}

export async function addWorkflowTemplate(
  input: z.infer<typeof workflowTemplateSchema>,
) {
  try {
    await requireProjectConfigAccess();
    const values = workflowTemplateSchema.parse(input);
    await ensureProjectConfigTables();

    const [{ value: currentCount }] = await db
      .select({ value: count() })
      .from(workflowStepTemplates)
      .where(eq(workflowStepTemplates.projectId, values.projectId));

    const timestamp = new Date();
    await db.insert(workflowStepTemplates).values({
      id: crypto.randomUUID(),
      projectId: values.projectId,
      stepName: values.stepName,
      actor: values.actor,
      duration: values.duration,
      sortOrder: currentCount,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await revalidateConfig(values.projectId);
    return ok();
  } catch (error) {
    console.error("Failed to add workflow template:", error);
    return fail("Failed to add the workflow step.");
  }
}

export async function deleteWorkflowTemplate(input: {
  id: string;
  projectId: string;
}) {
  try {
    await requireDeleteAccess();
    await ensureProjectConfigTables();
    await db
      .delete(workflowStepTemplates)
      .where(eq(workflowStepTemplates.id, input.id));
    await revalidateConfig(input.projectId);
    return ok();
  } catch (error) {
    console.error("Failed to delete workflow template:", error);
    return fail("Failed to delete the workflow step.");
  }
}

export async function getProjectDisciplineUsage(projectId: string) {
  const rows = await db
    .select({
      code: projectDisciplines.code,
      count: count(documents.id),
    })
    .from(projectDisciplines)
    .leftJoin(
      documents,
      and(
        eq(documents.projectId, projectDisciplines.projectId),
        eq(documents.discipline, projectDisciplines.code),
      ),
    )
    .where(eq(projectDisciplines.projectId, projectId))
    .groupBy(projectDisciplines.code);

  return new Map(rows.map((row) => [row.code, row.count]));
}

export async function getProjectDocumentTypeUsage(projectId: string) {
  const rows = await db
    .select({
      code: projectDocumentTypes.code,
      count: count(documents.id),
    })
    .from(projectDocumentTypes)
    .leftJoin(
      documents,
      and(
        eq(documents.projectId, projectDocumentTypes.projectId),
        eq(documents.documentType, projectDocumentTypes.code),
      ),
    )
    .where(eq(projectDocumentTypes.projectId, projectId))
    .groupBy(projectDocumentTypes.code);

  return new Map(rows.map((row) => [row.code, row.count]));
}
