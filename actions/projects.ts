"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { canCreateProjects, canDeleteEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projectMembers, projects } from "@/lib/schema";

export async function createProject(input: {
  name: string;
  projectNumber?: string;
  location?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  images?: string[];
}): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();

    if (!canCreateProjects(sessionUser.role)) {
      return {
        success: false,
        error: { message: "Only admin users can create projects." },
      };
    }

    const projectId = crypto.randomUUID();

    await db.insert(projects).values({
      id: projectId,
      name: input.name,
      projectNumber: input.projectNumber,
      location: input.location,
      description: input.description,
      status: input.status || "active",
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      images: input.images ? JSON.stringify(input.images) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/projects");
    return { success: true, data: { id: projectId } };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      success: false,
      error: { message: "Failed to create project" },
    };
  }
}

export async function updateProject(input: {
  projectId: string;
  name?: string;
  description?: string;
  status?: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (!canCreateProjects(sessionUser.role)) {
    return {
      success: false,
      error: { message: "Only admin users can update projects." },
    };
  }

  // TODO: Implement project update
  console.log("Update project:", input);
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(input: {
  projectId: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (!canDeleteEdmsContent(sessionUser.role)) {
    return {
      success: false,
      error: { message: "Only admin users can delete projects." },
    };
  }

  // TODO: Implement project deletion
  console.log("Delete project:", input);
  revalidatePath("/projects");
  return { success: true };
}

export async function assignProjectMember(input: {
  projectId: string;
  userId: string;
  role: string;
}): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { created: boolean };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();

    if (!canCreateProjects(sessionUser.role)) {
      return {
        success: false,
        error: {
          message: "Only admin users can manage project member assignments.",
        },
      };
    }

    const [existingForUser] = await db
      .select({ id: projectMembers.id })
      .from(projectMembers)
      .where(eq(projectMembers.id, `${input.projectId}:${input.userId}`))
      .limit(1);

    if (existingForUser) {
      await db
        .update(projectMembers)
        .set({
          role: input.role,
        })
        .where(eq(projectMembers.id, existingForUser.id));

      revalidatePath("/projects");
      return { success: true, data: { created: false } };
    }

    await db.insert(projectMembers).values({
      id: `${input.projectId}:${input.userId}`,
      projectId: input.projectId,
      userId: input.userId,
      role: input.role,
      assignedAt: new Date(),
      assignedBy: sessionUser.id,
    });

    revalidatePath("/projects");
    return { success: true, data: { created: true } };
  } catch (error) {
    console.error("Failed to assign project member:", error);
    return {
      success: false,
      error: { message: "Failed to assign project member." },
    };
  }
}
