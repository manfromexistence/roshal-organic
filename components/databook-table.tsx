"use client";

interface AutoPopulateRule {
  pattern: string;
  section: string;
  trigger: string;
}

interface DatabookTableProps {
  rules: AutoPopulateRule[];
}

export function DatabookTable({ rules }: DatabookTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">
                  When document matches
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Auto-file to Section
                </th>
                <th className="px-4 py-3 text-left font-medium">Trigger</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs">
                    {rule.pattern}
                  </td>
                  <td className="px-4 py-3">{rule.section}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {rule.trigger}
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
