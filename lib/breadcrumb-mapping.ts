import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  changeOrders,
  documents,
  documentWorkflows,
  letters,
  memos,
  minutesOfMeeting,
  projects,
  rfis,
  roshalOrders,
  roshalPages,
  roshalProducts,
  siteTechQueries,
  submittals,
  technicalQueries,
  transmittals,
  users,
} from "@/lib/schema";

export interface BreadcrumbRouteConfig {
  // biome-ignore lint/suspicious/noExplicitAny: Drizzle ORM table types are complex
  table: any;
  field: string;
  fallbackField?: string;
}

export const BREADCRUMB_ROUTE_MAPPING: Record<string, BreadcrumbRouteConfig> = {
  projects: {
    table: projects,
    field: "projectNumber",
  },
  documents: {
    table: documents,
    field: "documentNumber",
  },
  workflows: {
    table: documentWorkflows,
    field: "id",
  },
  transmittals: {
    table: transmittals,
    field: "transmittalNumber",
  },
  meetings: {
    table: minutesOfMeeting,
    field: "momNumber",
  },
  letters: {
    table: letters,
    field: "letterNumber",
  },
  "technical-queries": {
    table: technicalQueries,
    field: "queryNumber",
  },
  submittals: {
    table: submittals,
    field: "submittalNumber",
  },
  "site-tech-queries": {
    table: siteTechQueries,
    field: "queryNumber",
  },
  rfis: {
    table: rfis,
    field: "rfiNumber",
  },
  memos: {
    table: memos,
    field: "memoNumber",
  },
  "change-orders": {
    table: changeOrders,
    field: "changeOrderNumber",
  },
  orders: {
    table: roshalOrders,
    field: "orderNumber",
  },
  pages: {
    table: roshalPages,
    field: "titleEn",
    fallbackField: "slug",
  },
  products: {
    table: roshalProducts,
    field: "nameEn",
    fallbackField: "sku",
  },
  users: {
    table: users,
    field: "name",
    fallbackField: "email",
  },
};

export async function getBreadcrumbTitle(
  route: string,
  id: string,
): Promise<string | null> {
  const config = BREADCRUMB_ROUTE_MAPPING[route];
  if (!config) return null;

  try {
    const selectShape: Record<string, unknown> = {
      [config.field]: config.table[config.field],
    };
    if (config.fallbackField) {
      selectShape[config.fallbackField] = config.table[config.fallbackField];
    }

    const result = await db
      // biome-ignore lint/suspicious/noExplicitAny: Dynamic select shape is intentional here.
      .select(selectShape as any)
      .from(config.table)
      .where(eq(config.table.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const value = result[0][config.field];
    if (value) {
      return String(value);
    }

    if (config.fallbackField) {
      const fallbackValue = result[0][config.fallbackField];
      return fallbackValue ? String(fallbackValue) : null;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching breadcrumb title for ${route}/${id}:`, error);
    return null;
  }
}
