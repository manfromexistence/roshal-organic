export async function getReportsManagementData(_sessionUser: any) {
  return {
    isUsingFallbackData: false,
    metrics: [
      {
        description: "Generate reports from live project registers",
        icon: "documents" as const,
        label: "Total Reports",
        tone: "blue" as const,
        value: "0",
      },
      {
        description: "No saved reports generated yet",
        icon: "reviews" as const,
        label: "Generated",
        tone: "emerald" as const,
        value: "0",
      },
      {
        description: "No pending report jobs",
        icon: "transmittals" as const,
        label: "Pending",
        tone: "amber" as const,
        value: "0",
      },
      {
        description: "No scheduled report jobs",
        icon: "notifications" as const,
        label: "Scheduled",
        tone: "rose" as const,
        value: "0",
      },
    ],
    reports: [],
    statusMessage: null,
  };
}

export async function getReportsPageData(sessionUser: any) {
  return getReportsManagementData(sessionUser);
}
