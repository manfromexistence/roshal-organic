import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Calendar,
  ClipboardList,
  Cog,
  FileText,
  FolderKanban,
  Grid3X3,
  HelpCircle,
  Mail,
  Palette,
  Send,
  Upload,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";

export interface DashboardNavChildItem {
  title: string;
  url: string;
  keywords?: string[];
}

export interface DashboardNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: DashboardNavChildItem[];
  keywords?: string[];
}

export interface DashboardSearchPage {
  id: string;
  title: string;
  href: string;
  subtitle: string;
  icon?: LucideIcon;
  keywords: string[];
}

export const dashboardPrimaryNavigation: DashboardNavItem[] = [
  {
    title: "Projects",
    url: "/projects",
    icon: FolderKanban,
    keywords: ["project register", "project setup"],
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
    keywords: ["document register", "files", "upload"],
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: Workflow,
    keywords: ["review", "approval"],
  },
  {
    title: "Bulk Upload",
    url: "/bulk-upload",
    icon: Upload,
    keywords: ["excel import", "mass upload"],
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
    keywords: ["programme", "activities"],
  },
  {
    title: "Data Book",
    url: "/databook",
    icon: BookOpen,
    keywords: ["databook", "closeout book"],
  },
  {
    title: "Matrix",
    url: "/matrix",
    icon: Grid3X3,
    keywords: ["distribution matrix", "document matrix"],
  },
  {
    title: "Audit",
    url: "/audit",
    icon: ClipboardList,
    keywords: ["activity log", "audit trail"],
  },
  {
    title: "Queries",
    url: "/technical-queries",
    icon: HelpCircle,
    keywords: ["questions", "technical queries"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: Activity,
    keywords: ["pdf", "register reports"],
  },
  {
    title: "Theme",
    url: "/theme",
    icon: Palette,
    keywords: ["appearance", "colors"],
  },
  {
    title: "Project Configuration",
    url: "/config",
    icon: Cog,
    keywords: ["project setup", "disciplines", "workflow templates"],
  },
];

export const dashboardSectionNavigation: DashboardNavItem[] = [
  {
    title: "Transmittals",
    icon: Send,
    url: "/transmittals",
    keywords: ["outgoing", "incoming", "issue package"],
    items: [
      {
        title: "Outgoing",
        url: "/transmittals",
        keywords: ["sent transmittals"],
      },
      {
        title: "Incoming",
        url: "/transmittals/incoming",
        keywords: ["received transmittals"],
      },
      {
        title: "New Transmittal",
        url: "/transmittals/new",
        keywords: ["create transmittal", "issue documents"],
      },
    ],
  },
  {
    title: "Queries & RFIs",
    icon: HelpCircle,
    url: "/technical-queries",
    keywords: ["rfi", "query register"],
    items: [
      {
        title: "Technical Queries",
        url: "/technical-queries",
      },
      {
        title: "Site Tech Queries",
        url: "/site-tech-queries",
        keywords: ["site queries", "field queries"],
      },
      {
        title: "RFIs",
        url: "/rfis",
      },
    ],
  },
  {
    title: "Correspondence",
    icon: Mail,
    url: "/letters",
    keywords: ["letters", "memos"],
    items: [
      {
        title: "Letters Register",
        url: "/letters",
      },
      {
        title: "New Letter",
        url: "/letters/new",
      },
      {
        title: "Memos",
        url: "/memos",
      },
    ],
  },
  {
    title: "Meetings",
    icon: Users,
    url: "/meetings",
    keywords: ["mom", "minutes of meeting"],
    items: [
      {
        title: "Minutes of Meeting",
        url: "/meetings",
      },
      {
        title: "New MoM",
        url: "/meetings/new",
        keywords: ["new meeting minutes"],
      },
    ],
  },
  {
    title: "Management",
    icon: Wrench,
    url: "/config",
    keywords: ["submittals", "change orders", "inspections"],
    items: [
      {
        title: "Submittals",
        url: "/submittals",
      },
      {
        title: "Change Orders",
        url: "/change-orders",
      },
      {
        title: "Inspections",
        url: "/inspections",
      },
      {
        title: "Extension of Time",
        url: "/extension-of-time",
      },
      {
        title: "Daily Reports",
        url: "/daily-reports",
      },
      {
        title: "Safety Observations",
        url: "/safety-observations",
      },
      {
        title: "Commissioning",
        url: "/commissioning",
      },
      {
        title: "Warranty",
        url: "/warranty",
      },
      {
        title: "Notifications",
        url: "/notifications",
        keywords: ["activity", "alerts"],
      },
    ],
  },
];

export const dashboardSecondaryNavigation: DashboardNavItem[] = [];

export function getDashboardSearchPages(): DashboardSearchPage[] {
  const pages: DashboardSearchPage[] = [
    {
      id: "/",
      title: "Dashboard",
      href: "/",
      subtitle: "Workspace overview",
      keywords: ["home", "summary", "overview"],
    },
  ];
  const seen = new Set<string>(["/"]);

  const pushPage = (
    item: {
      title: string;
      url: string;
      icon?: LucideIcon;
      keywords?: string[];
    },
    sectionTitle?: string,
  ) => {
    if (seen.has(item.url)) {
      return;
    }

    seen.add(item.url);
    pages.push({
      id: item.url,
      title: item.title,
      href: item.url,
      subtitle: sectionTitle
        ? `${sectionTitle} workspace`
        : "Primary workspace page",
      icon: item.icon,
      keywords: [
        item.title,
        sectionTitle || "",
        ...(item.keywords || []),
      ].filter(Boolean),
    });
  };

  for (const item of dashboardPrimaryNavigation) {
    pushPage(item);
  }

  for (const item of dashboardSectionNavigation) {
    pushPage(item);

    for (const child of item.items || []) {
      pushPage(
        {
          ...child,
          icon: item.icon,
          keywords: [item.title, ...(child.keywords || [])],
        },
        item.title,
      );
    }
  }

  for (const item of dashboardSecondaryNavigation) {
    pushPage(item);
  }

  return pages;
}
