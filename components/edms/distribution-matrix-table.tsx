import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Stakeholder {
  id: string;
  name: string;
  short: string;
  role: string;
}

interface MatrixRow {
  key: string;
  discipline: string;
  docType: string;
  purpose: string;
  distribution: Record<string, "A" | "R" | "I" | "">;
}

interface DistributionMatrixTableProps {
  stakeholders: Stakeholder[];
  rows: MatrixRow[];
}

const ROLE_COLORS = {
  A: "text-rose-600 dark:text-rose-400",
  R: "text-blue-600 dark:text-blue-400",
  I: "text-muted-foreground",
  "": "text-muted-foreground/30",
};

const ROLE_LABELS = {
  A: "Approve",
  R: "Review",
  I: "Information",
  "": "No routing",
};

export function DistributionMatrixTable({
  stakeholders,
  rows,
}: DistributionMatrixTableProps) {
  return (
    <div className="max-w-full space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-muted/30 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Legend:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
            A
          </span>
          <span className="text-xs text-muted-foreground">Approve</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
            R
          </span>
          <span className="text-xs text-muted-foreground">Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-sm font-bold text-muted-foreground">
            I
          </span>
          <span className="text-xs text-muted-foreground">Information</span>
        </div>
      </div>

      <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border border-border">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[160px]">Category</TableHead>
              <TableHead className="min-w-[88px]">Purpose</TableHead>
              {stakeholders.map((stakeholder) => (
                <TableHead
                  key={stakeholder.id}
                  className="min-w-[72px] text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-xs font-semibold">
                      {stakeholder.short}
                    </span>
                    <span className="text-[10px] font-normal capitalize text-muted-foreground">
                      {stakeholder.role}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key} className="hover:bg-accent/50">
                <TableCell className="font-medium whitespace-normal">
                  <div className="space-y-0.5">
                    <p className="text-sm">{row.discipline}</p>
                    <p className="break-words text-xs text-muted-foreground">
                      {row.docType}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.purpose === "IFR"
                        ? "destructive"
                        : row.purpose === "IFA"
                          ? "default"
                          : row.purpose === "IFC"
                            ? "secondary"
                            : "outline"
                    }
                    className="font-mono text-[10px]"
                  >
                    {row.purpose}
                  </Badge>
                </TableCell>
                {stakeholders.map((stakeholder) => {
                  const role = row.distribution[stakeholder.id] || "";
                  return (
                    <TableCell key={stakeholder.id} className="text-center">
                      <span
                        className={`inline-flex size-8 items-center justify-center rounded-sm border border-border bg-background font-mono text-sm font-bold ${ROLE_COLORS[role]}`}
                        title={ROLE_LABELS[role]}
                      >
                        {role || "-"}
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
