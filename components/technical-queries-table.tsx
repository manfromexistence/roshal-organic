"use client";

import Link from "next/link";

interface TechnicalQuery {
  id: string;
  queryNumber: string;
  subject: string;
  discipline: string;
  raisedBy: string;
  status: string;
  priority: string;
  dueDate: Date | null;
}

interface TechnicalQueriesTableProps {
  technicalQueries: TechnicalQuery[];
}

export function TechnicalQueriesTable({
  technicalQueries,
}: TechnicalQueriesTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">TQ ID</th>
                <th className="px-4 py-3 text-left font-medium">Subject</th>
                <th className="px-4 py-3 text-left font-medium">Discipline</th>
                <th className="px-4 py-3 text-left font-medium">Raised By</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Priority</th>
                <th className="px-4 py-3 text-left font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {technicalQueries.map((tq) => (
                <tr key={tq.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/technical-queries/${tq.id}`}
                      className="font-mono text-xs font-medium hover:text-primary transition-colors"
                    >
                      {tq.queryNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 max-w-md font-medium">
                    {tq.subject}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
                      {tq.discipline}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{tq.raisedBy}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium ${
                        tq.status === "Open"
                          ? "text-amber-600"
                          : tq.status === "Responded"
                            ? "text-blue-600"
                            : "text-green-600"
                      }`}
                    >
                      {tq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium ${
                        tq.priority === "High"
                          ? "text-destructive"
                          : tq.priority === "Medium"
                            ? "text-amber-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {tq.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {tq.dueDate
                      ? new Date(tq.dueDate).toLocaleDateString()
                      : "—"}
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
