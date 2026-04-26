"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stakeholder {
  id: string;
  stakeholderId: string;
  name: string;
  role: string;
  contact: string | null;
}

interface StakeholdersTableProps {
  stakeholders: Stakeholder[];
  onEdit: (stakeholder: Stakeholder) => void;
  onDelete: (id: string) => void;
}

export function StakeholdersTable({
  stakeholders,
  onEdit,
  onDelete,
}: StakeholdersTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">
                  Organization
                </th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stakeholders.map((stakeholder) => (
                <tr key={stakeholder.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-sm">
                    {stakeholder.stakeholderId}
                  </td>
                  <td className="px-4 py-3">{stakeholder.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium border border-border bg-muted">
                      {stakeholder.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {stakeholder.contact || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(stakeholder)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(stakeholder.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
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
