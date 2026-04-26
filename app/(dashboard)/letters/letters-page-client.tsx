"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LettersPageClient({ letters }: { letters: any[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Letters
            </h1>
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              Incoming and outgoing correspondence register with tracking and
              management capabilities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/memos">Memos</Link>
          </Button>
          <Button asChild>
            <Link href="/letters/new">+ New Letter</Link>
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Letter Register</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {letters.length === 0 ? (
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              No letters found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {letters.map((letter: any) => (
                <div
                  key={letter.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-accent/50"
                >
                  <div>
                    <p className="font-medium">{letter.letterNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {letter.subject}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{letter.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {letter.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
