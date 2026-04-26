import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  projectConfigs,
  projectDisciplines,
  projectDocumentTypes,
  projectStakeholders,
  projects,
  workflowStepTemplates,
} from "@/lib/schema";

export async function ensureProjectConfigTables() {
  await db.run(`CREATE TABLE IF NOT EXISTS project_config (
    id TEXT PRIMARY KEY NOT NULL,
    project_id TEXT NOT NULL UNIQUE,
    numbering_pattern TEXT NOT NULL DEFAULT 'PRJ-DISC-TYPE-SEQ',
    sequence_padding INTEGER NOT NULL DEFAULT 4,
    separator TEXT NOT NULL DEFAULT '-',
    revision_scheme TEXT NOT NULL DEFAULT 'alpha-numeric',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS disciplines (
    id TEXT PRIMARY KEY NOT NULL,
    project_id TEXT NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#6b7280',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS document_types (
    id TEXT PRIMARY KEY NOT NULL,
    project_id TEXT NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS stakeholders (
    id TEXT PRIMARY KEY NOT NULL,
    project_id TEXT NOT NULL,
    stakeholder_id TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    contact TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS workflow_step_templates (
    id TEXT PRIMARY KEY NOT NULL,
    project_id TEXT NOT NULL,
    step_name TEXT NOT NULL,
    actor TEXT NOT NULL,
    duration TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`);
}

export async function getProjectConfigData(
  _sessionUser: unknown,
  projectId?: string,
) {
  await ensureProjectConfigTables();

  let projectData: typeof projects.$inferSelect | null = null;

  if (projectId) {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);
    projectData = result[0] ?? null;
  }

  const [configRow] = projectId
    ? await db
        .select()
        .from(projectConfigs)
        .where(eq(projectConfigs.projectId, projectId))
        .limit(1)
    : [];

  const disciplines = projectId
    ? await db
        .select()
        .from(projectDisciplines)
        .where(eq(projectDisciplines.projectId, projectId))
        .orderBy(
          asc(projectDisciplines.sortOrder),
          asc(projectDisciplines.code),
        )
    : [];

  const documentTypes = projectId
    ? await db
        .select()
        .from(projectDocumentTypes)
        .where(eq(projectDocumentTypes.projectId, projectId))
        .orderBy(
          asc(projectDocumentTypes.sortOrder),
          asc(projectDocumentTypes.code),
        )
    : [];

  const stakeholders = projectId
    ? await db
        .select()
        .from(projectStakeholders)
        .where(eq(projectStakeholders.projectId, projectId))
        .orderBy(
          asc(projectStakeholders.sortOrder),
          asc(projectStakeholders.stakeholderId),
        )
    : [];

  const workflowSteps = projectId
    ? await db
        .select()
        .from(workflowStepTemplates)
        .where(eq(workflowStepTemplates.projectId, projectId))
        .orderBy(
          asc(workflowStepTemplates.sortOrder),
          asc(workflowStepTemplates.stepName),
        )
    : [];

  return {
    project: projectData,
    disciplines,
    documentTypes,
    config: configRow ?? null,
    numbering: configRow ?? null,
    stakeholders,
    workflow: workflowSteps,
    workflowSteps,
  };
}
