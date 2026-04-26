export async function getDatabookManagementData(_sessionUser: any) {
  return {
    databookItems: [],
    isUsingFallbackData: false,
    metrics: [
      {
        description: "No databook sections stored yet",
        icon: "documents" as const,
        label: "Total Items",
        tone: "blue" as const,
        value: "0",
      },
      {
        description: "No sections updated recently",
        icon: "reviews" as const,
        label: "Updated",
        tone: "emerald" as const,
        value: "0",
      },
      {
        description: "No pending databook sections",
        icon: "transmittals" as const,
        label: "Pending",
        tone: "amber" as const,
        value: "0",
      },
      {
        description: "No overdue databook sections",
        icon: "notifications" as const,
        label: "Overdue",
        tone: "rose" as const,
        value: "0",
      },
    ],
    statusMessage: null,
  };
}

export async function getDatabookPageData(sessionUser: any) {
  return getDatabookManagementData(sessionUser);
}

export async function getDatabookItems() {
  return [];
}
