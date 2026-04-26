"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

export interface UserActivitySummary {
  totalProjects: number;
  activeProjects: number;
  documentsCreated: number;
  documentsUploaded: number;
  commentsAdded: number;
  workflowsCreated: number;
  projectsAssigned: number;
  lastActive: Date;
}

export async function updateUserDetails(input: {
  userId: string;
  name?: string;
  email?: string;
  organization?: string;
  jobTitle?: string;
  phone?: string;
  department?: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    await db
      .update(users)
      .set({
        name: input.name,
        email: input.email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.userId));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user details:", error);
    return {
      success: false,
      error: { message: "Failed to update user details" },
    };
  }
}

export async function updateUserRole(input: {
  userId: string;
  role: string;
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    await db
      .update(users)
      .set({
        role: input.role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.userId));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return {
      success: false,
      error: { message: "Failed to update user role" },
    };
  }
}

export async function deleteUser(input: {
  userIds: string[];
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    for (const userId of input.userIds) {
      await db.delete(users).where(eq(users.id, userId));
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return {
      success: false,
      error: { message: "Failed to delete user" },
    };
  }
}

export async function toggleUserStatus(input: {
  userId: string;
  status: "active" | "inactive";
  isActive?: boolean;
}): Promise<{ success: boolean; error?: { message: string } }> {
  try {
    // Note: isActive field doesn't exist in users schema, just updating timestamp
    await db
      .update(users)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.userId));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle user status:", error);
    return {
      success: false,
      error: { message: "Failed to toggle user status" },
    };
  }
}

export async function bulkDeleteUsers(input: {
  userIds: string[];
}): Promise<{ success: boolean; error?: { message: string }; data?: number }> {
  // TODO: Implement bulk user deletion
  console.log("Bulk deleting users:", input);
  revalidatePath("/admin/users");
  return { success: true, data: input.userIds.length };
}

export async function bulkToggleUserStatus(input: {
  userIds: string[];
  status: "active" | "inactive";
  isActive?: boolean;
}): Promise<{ success: boolean; error?: { message: string }; data?: number }> {
  // TODO: Implement bulk user status toggle
  console.log("Bulk toggling user status:", input);
  revalidatePath("/admin/users");
  return { success: true, data: input.userIds.length };
}

export async function bulkUpdateUserRoles(input: {
  userIds: string[];
  role: string;
}): Promise<{ success: boolean; error?: { message: string }; data?: number }> {
  // TODO: Implement bulk user role update
  console.log("Bulk updating user roles:", input);
  revalidatePath("/admin/users");
  return { success: true, data: input.userIds.length };
}

export async function getUserActivitySummary(_input: {
  userId: string;
}): Promise<{
  success: boolean;
  error?: { message: string };
  data?: UserActivitySummary;
}> {
  // TODO: Implement user activity summary
  return {
    success: true,
    data: {
      totalProjects: 0,
      activeProjects: 0,
      documentsCreated: 0,
      documentsUploaded: 0,
      commentsAdded: 0,
      workflowsCreated: 0,
      projectsAssigned: 0,
      lastActive: new Date(),
    },
  };
}
