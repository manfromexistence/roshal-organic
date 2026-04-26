"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DailyReport {
  id: string;
  reportDate: Date;
  weather: string | null;
  activitiesCompleted: string | null;
  issues: string | null;
  projectId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DailyReportsTableProps {
  reports: DailyReport[];
}

export function DailyReportsTable({ reports }: DailyReportsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Report Date</th>
                <th className="px-4 py-3 text-left font-medium">Weather</th>
                <th className="px-4 py-3 text-left font-medium">Activities</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">
                    {report.reportDate instanceof Date
                      ? report.reportDate.toLocaleDateString()
                      : new Date(report.reportDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{report.weather || "—"}</td>
                  <td className="px-4 py-3">
                    <p className="line-clamp-2">
                      {report.activitiesCompleted || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/daily-reports/${report.id}`}>Open</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
