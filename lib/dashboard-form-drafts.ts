export type DashboardFormDraftScope =
  | "category"
  | "cms-section"
  | "cms-page"
  | "product"
  | "subcategory";

export type DashboardFormDraftValues = Record<string, string>;

type DashboardCookieReader = {
  get: (name: string) => { value: string } | undefined;
};

type DashboardCookieWriter = DashboardCookieReader & {
  set: (
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      maxAge?: number;
      path?: string;
      sameSite?: "lax" | "strict" | "none";
      secure?: boolean;
    },
  ) => void;
};

const dashboardFormDraftMaxAgeSeconds = 10 * 60;
const dashboardFormDraftMaxChunks = 8;
const dashboardFormDraftChunkSize = 3000;

function draftCookieBaseName(scope: DashboardFormDraftScope) {
  return `roshal-dashboard-${scope}-draft`;
}

function draftCookieChunkName(scope: DashboardFormDraftScope, index: number) {
  return `${draftCookieBaseName(scope)}.${index}`;
}

function encodeDraft(values: DashboardFormDraftValues) {
  return Buffer.from(
    JSON.stringify({
      createdAt: Date.now(),
      values,
      version: 1,
    }),
    "utf8",
  ).toString("base64url");
}

function decodeDraft(payload: string): DashboardFormDraftValues {
  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as {
      createdAt?: unknown;
      values?: unknown;
    };
    const createdAt = Number(parsed.createdAt);

    if (
      !Number.isFinite(createdAt) ||
      Date.now() - createdAt > dashboardFormDraftMaxAgeSeconds * 1000 ||
      !parsed.values ||
      typeof parsed.values !== "object" ||
      Array.isArray(parsed.values)
    ) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed.values as Record<string, unknown>)
        .filter(([, value]) => typeof value === "string")
        .map(([key, value]) => [key, value as string]),
    );
  } catch {
    return {};
  }
}

export function pickDashboardFormDraftValues(
  formData: FormData,
  keys: string[],
) {
  const values: DashboardFormDraftValues = {};

  for (const key of keys) {
    const value = formData.get(key);

    if (typeof value === "string") {
      values[key] = value;
    }
  }

  return values;
}

export function readDashboardFormDraft(
  cookieStore: DashboardCookieReader,
  scope: DashboardFormDraftScope,
) {
  const chunkCount = Number.parseInt(
    cookieStore.get(draftCookieBaseName(scope))?.value || "0",
    10,
  );

  if (
    !Number.isInteger(chunkCount) ||
    chunkCount < 1 ||
    chunkCount > dashboardFormDraftMaxChunks
  ) {
    return {};
  }

  const payload = Array.from({ length: chunkCount }, (_, index) => {
    return cookieStore.get(draftCookieChunkName(scope, index))?.value || "";
  }).join("");

  return payload ? decodeDraft(payload) : {};
}

export function dashboardDraftValue(
  values: DashboardFormDraftValues,
  key: string,
  fallback = "",
) {
  return values[key] ?? fallback;
}

export function dashboardDraftBoolean(
  values: DashboardFormDraftValues,
  key: string,
  fallback: boolean,
) {
  if (values[key] === "true") {
    return true;
  }

  if (values[key] === "false") {
    return false;
  }

  return fallback;
}

export function dashboardDraftStringArray(
  values: DashboardFormDraftValues,
  key: string,
  fallback: string[] = [],
) {
  const parsed = dashboardDraftJson<unknown>(values, key, fallback);

  return Array.isArray(parsed)
    ? parsed.filter((item): item is string => typeof item === "string")
    : fallback;
}

export function dashboardDraftJson<T>(
  values: DashboardFormDraftValues,
  key: string,
  fallback: T,
) {
  try {
    return values[key] ? (JSON.parse(values[key]) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeDashboardFormDraft(
  cookieStore: DashboardCookieWriter,
  scope: DashboardFormDraftScope,
  values: DashboardFormDraftValues,
) {
  const cookieOptions = {
    httpOnly: true,
    maxAge: dashboardFormDraftMaxAgeSeconds,
    path: "/",
    sameSite: "lax" as const,
  };
  const expiredCookieOptions = {
    ...cookieOptions,
    maxAge: 0,
  };

  cookieStore.set(draftCookieBaseName(scope), "", expiredCookieOptions);

  for (let index = 0; index < dashboardFormDraftMaxChunks; index += 1) {
    cookieStore.set(
      draftCookieChunkName(scope, index),
      "",
      expiredCookieOptions,
    );
  }

  const payload = encodeDraft(values);
  const chunks = payload.match(
    new RegExp(`.{1,${dashboardFormDraftChunkSize}}`, "g"),
  );

  if (!chunks || chunks.length > dashboardFormDraftMaxChunks) {
    return;
  }

  cookieStore.set(draftCookieBaseName(scope), String(chunks.length), {
    ...cookieOptions,
    maxAge: dashboardFormDraftMaxAgeSeconds,
  });

  chunks.forEach((chunk, index) => {
    cookieStore.set(draftCookieChunkName(scope, index), chunk, cookieOptions);
  });
}
