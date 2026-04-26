"use client";

import Link from "next/link";
import { EdmsStatusBadge } from "@/components/edms/status-badge";
import { Button } from "@/components/ui/button";

interface Transmittal {
  id: string;
  transmittalNumber: string;
  subject: string;
  sentLabel: string;
  documentCodes: string[] | null;
  recipientName: string;
  purpose: string | null;
  dueDate: string | null;
  status: string;
}

interface TransmittalsTableProps {
  transmittals: Transmittal[];
}

export function TransmittalsTable({ transmittals }: TransmittalsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">
                  Transmittal ID
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Subject & Documents
                </th>
                <th className="px-4 py-3 text-left font-medium">Recipient</th>
                <th className="px-4 py-3 text-left font-medium">Purpose</th>
                <th className="px-4 py-3 text-left font-medium">Due Date</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transmittals.map((tr) => (
                <tr key={tr.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="font-mono text-xs font-medium">
                        {tr.transmittalNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tr.sentLabel}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <p className="font-medium">{tr.subject}</p>
                      <div className="flex flex-wrap gap-1">
                        {tr.documentCodes?.map((code) => (
                          <span
                            key={code}
                            className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px]"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{tr.recipientName}</td>
                  <td className="px-4 py-3">
                    <EdmsStatusBadge status={tr.purpose || "IFR"} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {tr.dueDate || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {tr.status}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/transmittals/${tr.id}`}>View</Link>
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
