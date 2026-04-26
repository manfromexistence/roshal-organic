/**
 * Route slug to display name mapping
 * Converts ugly slugs to human-readable names for breadcrumbs
 */

export const ROUTE_NAMES: Record<string, string> = {
  "": "Dashboard",
  about: "About",
  audit: "Audit Log",
  "bulk-upload": "Bulk Upload",
  commissioning: "Commissioning",
  config: "Project Configuration",
  "daily-reports": "Daily Reports",
  databook: "Project Databook",
  "extension-of-time": "Extension of Time",
  inspections: "Inspections",
  letters: "Letters",
  "letters/new": "New Letter",
  matrix: "Document Matrix",
  meetings: "Meetings",
  "meetings/new": "New Meeting",
  memos: "Memos",
  "memos/new": "New Memo",
  notifications: "Notifications",
  privacy: "Privacy Policy",
  projects: "Projects",
  "projects/new": "New Project",
  reports: "Reports",
  rfis: "Requests for Information",
  "rfis/new": "New RFI",
  "safety-observations": "Safety Observations",
  schedule: "Project Schedule",
  settings: "Settings",
  "settings/accounts": "Account Settings",
  "settings/developer": "Developer Settings",
  "settings/edms-page": "EDMS Settings",
  "settings/members": "Team Members",
  "settings/notifications": "Notification Settings",
  "settings/theme": "Theme Settings",
  "site-tech-queries": "Site Technical Queries",
  "site-tech-queries/new": "New Site Technical Query",
  submittals: "Submittals",
  "technical-queries": "Technical Queries",
  "technical-queries/new": "New Technical Query",
  warranty: "Warranty",
  workflows: "Workflows",
  documents: "Documents",
  "documents/new": "New Document",
  transmittals: "Transmittals",
  "transmittals/incoming": "Incoming Transmittals",
  "transmittals/new": "New Transmittal",
  "change-orders": "Change Orders",
  admin: "Administration",
  "admin/organizations": "Organization Management",
  "admin/users": "User Management",
};

const DETAIL_ROUTE_NAMES: Record<string, string> = {
  "change-orders": "Change Order",
  documents: "Document",
  letters: "Letter",
  meetings: "Meeting",
  memos: "Memo",
  projects: "Project",
  rfis: "RFI",
  "site-tech-queries": "Site Query",
  submittals: "Submittal",
  "technical-queries": "Technical Query",
  transmittals: "Transmittal",
  workflows: "Workflow",
};

function humanizeSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * Get display name for a route path
 * @param path - The route path (e.g., "projects/new")
 * @returns Human-readable name
 */
export function getRouteName(path: string): string {
  const cleanPath = path.replace(/^\/|\/$/g, "");

  if (ROUTE_NAMES[cleanPath]) {
    return ROUTE_NAMES[cleanPath];
  }

  const parts = cleanPath.split("/").filter(Boolean);
  if (parts.length > 1) {
    const parentPath = parts.slice(0, -1).join("/");
    const lastPart = parts.at(-1) || "";

    // Handle dynamic routes (e.g., /documents/[id])
    if (lastPart.startsWith("[") && lastPart.endsWith("]")) {
      if (DETAIL_ROUTE_NAMES[parentPath]) {
        return DETAIL_ROUTE_NAMES[parentPath];
      }
      // Fallback to parent name
      if (ROUTE_NAMES[parentPath]) {
        return ROUTE_NAMES[parentPath];
      }
    }

    if (DETAIL_ROUTE_NAMES[parentPath]) {
      return DETAIL_ROUTE_NAMES[parentPath];
    }

    if (ROUTE_NAMES[parentPath]) {
      return humanizeSegment(lastPart);
    }
  }

  return parts.length > 0 ? humanizeSegment(parts.at(-1) || "") : "Dashboard";
}
