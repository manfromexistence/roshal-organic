export async function getBulkUploadManagementData(_sessionUser: any) {
  return {
    uploads: [],
    metrics: [
      {
        label: "Total Uploads",
        value: "0",
        description: "No data available",
        tone: "blue" as const,
        icon: "documents" as const,
      },
      {
        label: "Completed",
        value: "0",
        description: "No data available",
        tone: "emerald" as const,
        icon: "reviews" as const,
      },
      {
        label: "Failed",
        value: "0",
        description: "No data available",
        tone: "amber" as const,
        icon: "transmittals" as const,
      },
      {
        label: "Processing",
        value: "0",
        description: "No data available",
        tone: "rose" as const,
        icon: "notifications" as const,
      },
    ],
    isUsingFallbackData: true,
    statusMessage: "Bulk upload data not available - database not configured",
  };
}

export async function getBulkUploadPageData(sessionUser: any) {
  return getBulkUploadManagementData(sessionUser);
}
