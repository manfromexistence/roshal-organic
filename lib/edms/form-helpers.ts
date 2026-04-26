/**
 * Reusable helper functions for EDMS form patterns
 * These functions provide common UI enhancements like auto-generated IDs,
 * default dates, and location detection
 */

import { addDays, format } from "date-fns";

function getRandomFourDigitCode(): string {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

function sanitizeCodeSegment(value?: string | null): string {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a random project number in format PRJ-YYYY-XXXX
 */
export function generateProjectNumber(): string {
  const year = new Date().getFullYear();
  return `PRJ-${year}-${getRandomFourDigitCode()}`;
}

/**
 * Generate a random document number in format DOC-YYYY-XXXX
 */
export function generateDocumentNumber(projectNumber?: string | null): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-DOC-${getRandomFourDigitCode()}`;
  }

  return `DOC-${year}-${getRandomFourDigitCode()}`;
}

export function buildDocumentImportNumber(
  projectNumber: string | null | undefined,
  discipline: string,
  type: string,
  sequence: string,
): string {
  const projectSegment = sanitizeCodeSegment(projectNumber);
  const disciplineSegment = sanitizeCodeSegment(discipline);
  const typeSegment = sanitizeCodeSegment(type);
  const sequenceSegment = sequence.trim();

  if (projectSegment && disciplineSegment && typeSegment && sequenceSegment) {
    return `${projectSegment}-${disciplineSegment}-${typeSegment}-${sequenceSegment}`;
  }

  return generateDocumentNumber(projectNumber);
}

export function mapImportedDocumentStatus(status: string): string {
  switch (status.trim().toUpperCase()) {
    case "IFC":
      return "approved";
    case "IFA":
      return "submitted";
    case "IFR":
      return "under_review";
    default:
      return "draft";
  }
}

/**
 * Generate a random transmittal number in format TRM-YYYY-XXXX
 */
export function generateTransmittalNumber(): string {
  const year = new Date().getFullYear();
  return `TRM-${year}-${getRandomFourDigitCode()}`;
}

export function generateProjectScopedTransmittalNumber(
  projectNumber?: string | null,
): string {
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-TRM-${getRandomFourDigitCode()}`;
  }

  return generateTransmittalNumber();
}

const TRANSMITTAL_SUBJECT_PREFIXES: Record<string, string> = {
  IFR: "Issue for Review",
  IFA: "Issue for Approval",
  IFC: "Issue for Construction",
  IFI: "Issue for Information",
  IFT: "Issue for Tender",
};

export function getSuggestedTransmittalSubject(
  purposeCode: string,
  options?: {
    projectName?: string | null;
    documentTitle?: string | null;
    documentCount?: number;
  },
): string {
  const prefix = TRANSMITTAL_SUBJECT_PREFIXES[purposeCode] || "Document Issue";
  const projectName = options?.projectName?.trim();
  const documentTitle = options?.documentTitle?.trim();
  const documentCount = options?.documentCount ?? 0;

  if (documentCount === 1 && documentTitle) {
    return `${prefix} - ${documentTitle}`;
  }

  if (documentCount > 1) {
    return `${prefix} - ${documentCount}-document package`;
  }

  if (projectName) {
    return `${prefix} - ${projectName} package`;
  }

  return `${prefix} - Document package`;
}

export function generateLetterNumber(projectNumber?: string | null): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-LTR-${getRandomFourDigitCode()}`;
  }

  return `LTR-${year}-${getRandomFourDigitCode()}`;
}

export function generateMinutesOfMeetingNumber(
  projectNumber?: string | null,
): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-MOM-${getRandomFourDigitCode()}`;
  }

  return `MOM-${year}-${getRandomFourDigitCode()}`;
}

export function generateMemoNumber(projectNumber?: string | null): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-MEM-${getRandomFourDigitCode()}`;
  }

  return `MEM-${year}-${getRandomFourDigitCode()}`;
}

export function generateTechnicalQueryNumber(
  projectNumber?: string | null,
): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-TQ-${getRandomFourDigitCode()}`;
  }

  return `TQ-${year}-${getRandomFourDigitCode()}`;
}

export function generateSiteTechnicalQueryNumber(
  projectNumber?: string | null,
): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-STQ-${getRandomFourDigitCode()}`;
  }

  return `STQ-${year}-${getRandomFourDigitCode()}`;
}

export function generateRfiNumber(projectNumber?: string | null): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-RFI-${getRandomFourDigitCode()}`;
  }

  return `RFI-${year}-${getRandomFourDigitCode()}`;
}

export function generateExtensionOfTimeNumber(
  projectNumber?: string | null,
): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-EOT-${getRandomFourDigitCode()}`;
  }

  return `EOT-${year}-${getRandomFourDigitCode()}`;
}

export function generateInspectionNumber(
  projectNumber?: string | null,
): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-INSP-${getRandomFourDigitCode()}`;
  }

  return `INSP-${year}-${getRandomFourDigitCode()}`;
}

export function generateSafetyObservationNumber(
  projectNumber?: string | null,
): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-SAF-${getRandomFourDigitCode()}`;
  }

  return `SAF-${year}-${getRandomFourDigitCode()}`;
}

export function generateWarrantyNumber(projectNumber?: string | null): string {
  const year = new Date().getFullYear();
  const projectSegment = sanitizeCodeSegment(projectNumber);

  if (projectSegment) {
    return `${projectSegment}-WAR-${getRandomFourDigitCode()}`;
  }

  return `WAR-${year}-${getRandomFourDigitCode()}`;
}

/**
 * Get current date formatted as YYYY-MM-DD for form inputs
 */
export function getCurrentDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function getFutureDate(days = 7): string {
  return format(addDays(new Date(), days), "yyyy-MM-dd");
}

export function getNextRevision(currentRevision?: string | null): string {
  const normalized = currentRevision?.trim().toUpperCase();

  if (!normalized) {
    return "A";
  }

  if (/^\d+$/.test(normalized)) {
    return String(Number(normalized) + 1);
  }

  if (/^[A-Z]+$/.test(normalized)) {
    const letters = normalized.split("");

    for (let index = letters.length - 1; index >= 0; index -= 1) {
      if (letters[index] !== "Z") {
        letters[index] = String.fromCharCode(letters[index].charCodeAt(0) + 1);
        return letters.join("");
      }

      letters[index] = "A";
    }

    return `A${letters.join("")}`;
  }

  return `${normalized}-1`;
}

export function getDocumentTitleFromFileName(fileName?: string | null): string {
  const stem = fileName?.replace(/\.[^.]+$/, "").trim();

  if (!stem) {
    return "";
  }

  return stem
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((segment) => {
      if (segment === segment.toUpperCase()) {
        return segment;
      }

      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join(" ");
}

export function getSuggestedWorkflowName(
  documentNumber?: string | null,
  title?: string | null,
): string {
  const identifier = documentNumber?.trim() || title?.trim() || "Document";
  return `${identifier} review`;
}

export function getSuggestedTemplateName(
  type: string,
  category: string,
): string {
  const readableType = type
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return `${readableType} ${category} Template`;
}

/**
 * Get user's location using browser geolocation and reverse geocoding
 * Falls back to timezone if geolocation fails
 * @returns Promise that resolves to location string
 */
export async function getUserLocation(): Promise<string> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    // Fallback to timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone || "Unknown Location";
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use OpenStreetMap Nominatim API for reverse geocoding (free, no API key needed)
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();

          if (data?.address) {
            // Try to get city, town, or village from the address
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.county ||
              data.address.state ||
              "Unknown Location";
            resolve(city);
          } else {
            resolve("Unknown Location");
          }
        } catch (error) {
          console.log("Reverse geocoding failed:", error);
          // Fallback to timezone-based location
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          resolve(timezone || "Unknown Location");
        }
      },
      (error) => {
        console.log("Geolocation failed:", error);
        // Fallback to timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        resolve(timezone || "");
      },
    );
  });
}

/**
 * Common default status values for different entity types
 */
export const DEFAULT_STATUSES = {
  project: "active",
  document: "draft",
  workflow: "pending",
  transmittal: "draft",
} as const;

/**
 * Common status options for different entity types
 */
export const STATUS_OPTIONS = {
  project: ["active", "on_hold", "completed", "cancelled"] as const,
  document: [
    "draft",
    "submitted",
    "under_review",
    "approved",
    "rejected",
    "superseded",
  ] as const,
  workflow: [
    "pending",
    "in_review",
    "approved",
    "rejected",
    "completed",
  ] as const,
} as const;
