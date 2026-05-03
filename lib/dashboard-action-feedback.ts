export const dashboardActionFeedbackParams = [
  "actionId",
  "created",
  "deleted",
  "error",
  "key",
  "saved",
  "sectionId",
  "sectionKey",
  "sku",
  "slug",
  "subcategory",
] as const;

export function stripDashboardActionFeedback(path: string) {
  const url = new URL(path || "/", "https://roshal.local");

  for (const param of dashboardActionFeedbackParams) {
    url.searchParams.delete(param);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function clearDashboardActionFeedbackFromLocation() {
  if (typeof window === "undefined") {
    return;
  }

  const cleanPath = stripDashboardActionFeedback(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
  );

  window.history.replaceState(window.history.state, "", cleanPath);
}

export function submitDashboardDeleteAndReload() {
  clearDashboardActionFeedbackFromLocation();
}
