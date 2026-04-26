"use client";

import { BellRing, Clock3, FileCheck2, Workflow } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "quadra.notification-preferences";

const DEFAULT_PREFERENCES = {
  workflowUpdates: true,
  transmittalUpdates: true,
  approvals: true,
  dailyDigest: false,
};

const PREFERENCE_SECTIONS = [
  {
    key: "workflowUpdates",
    title: "Workflow updates",
    description: "Alerts when documents are assigned, reviewed, or returned.",
    icon: Workflow,
  },
  {
    key: "transmittalUpdates",
    title: "Transmittal activity",
    description: "Alerts when new packages are issued or acknowledged.",
    icon: BellRing,
  },
  {
    key: "approvals",
    title: "Approval decisions",
    description: "Alerts when drawings and workflows reach a final decision.",
    icon: FileCheck2,
  },
  {
    key: "dailyDigest",
    title: "Daily digest",
    description:
      "One summary notification for overdue and unread work each day.",
    icon: Clock3,
  },
] as const;

interface NotificationsPreferencesProps {
  unreadCount: number;
}

export function NotificationsPreferences({
  unreadCount,
}: NotificationsPreferencesProps) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return;
    }

    try {
      const parsedValue = JSON.parse(storedValue);
      setPreferences((current) => ({ ...current, ...parsedValue }));
    } catch (error) {
      console.error("Failed to read notification preferences:", error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Notification profile</CardTitle>
            <p className="text-sm text-muted-foreground">
              Preferences are saved automatically in this browser.
            </p>
          </div>
          <Badge variant="secondary">{unreadCount} unread in inbox</Badge>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {PREFERENCE_SECTIONS.map((section) => {
          const Icon = section.icon;

          return (
            <Card key={section.key} className="border-border bg-card shadow-sm">
              <CardContent className="flex items-start justify-between gap-4 p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-md border border-border bg-muted/40 p-2 text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor={section.key}
                      className="text-sm font-medium text-foreground"
                    >
                      {section.title}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={section.key}
                  checked={preferences[section.key]}
                  onCheckedChange={(checked) =>
                    setPreferences((current) => ({
                      ...current,
                      [section.key]: checked,
                    }))
                  }
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
