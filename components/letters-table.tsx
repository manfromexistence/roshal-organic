"use client";

import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Letter {
  id: string;
  letterNumber: string;
  date: string;
  direction: string;
  from: string;
  to: string;
  toType: string;
  subject: string;
  status: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface LettersTableProps {
  letters: Letter[];
}

export function LettersTable({ letters }: LettersTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Letter #</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Direction</th>
                <th className="px-4 py-3 text-left font-medium">From</th>
                <th className="px-4 py-3 text-left font-medium">To</th>
                <th className="px-4 py-3 text-left font-medium">Subject</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {letters.map((letter) => (
                <tr key={letter.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    <Link
                      href={`/letters/${letter.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {letter.letterNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {letter.date}
                  </td>
                  <td className="px-4 py-3">
                    {letter.direction === "outgoing" ? (
                      <ArrowUpFromLine className="size-4 text-green-600" />
                    ) : (
                      <ArrowDownToLine className="size-4 text-blue-600" />
                    )}
                  </td>
                  <td className="px-4 py-3">{letter.from}</td>
                  <td className="px-4 py-3">{letter.to}</td>
                  <td className="px-4 py-3">{letter.subject}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted">
                      {letter.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/letters/${letter.id}`}>Open</Link>
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
