const MANAGE_CONTENT_ROLES = new Set([
  "admin",
  "pmc",
  "vendor",
  "subcontractor",
]);

const PROJECT_CONFIGURATION_ROLES = new Set(["admin", "pmc"]);

function normalizeRole(role: string | null | undefined) {
  return role?.trim().toLowerCase() || "user";
}

export function canManageEdmsContent(role: string | null | undefined): boolean {
  return MANAGE_CONTENT_ROLES.has(normalizeRole(role));
}

export function canConfigureEdmsProject(
  role: string | null | undefined,
): boolean {
  return PROJECT_CONFIGURATION_ROLES.has(normalizeRole(role));
}

export function canDeleteEdmsContent(role: string | null | undefined): boolean {
  return normalizeRole(role) === "admin";
}

export function canCreateProjects(role: string | null | undefined): boolean {
  return normalizeRole(role) === "admin";
}

export function canActOnWorkflowStep(
  role: string | null | undefined,
  assignedToUserId: string | null | undefined,
  currentUserId: string | null | undefined,
): boolean {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return true;
  }

  return Boolean(
    assignedToUserId && currentUserId && assignedToUserId === currentUserId,
  );
}
