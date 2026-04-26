"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Discipline {
  id: string;
  code: string;
  name: string;
  color: string;
  docCount: number;
}

interface DisciplinesTableProps {
  disciplines: Discipline[];
  onEdit: (discipline: Discipline) => void;
  onDelete: (id: string) => void;
}

export function DisciplinesTable({
  disciplines,
  onEdit,
  onDelete,
}: DisciplinesTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Usage</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disciplines.map((discipline) => (
                <tr key={discipline.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-sm"
                        style={{ backgroundColor: discipline.color }}
                      />
                      <span className="font-mono text-sm font-medium">
                        {discipline.code}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{discipline.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {discipline.docCount} docs
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(discipline)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(discipline.id)}
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
