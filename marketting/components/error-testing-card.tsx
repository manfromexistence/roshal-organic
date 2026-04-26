"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ErrorTestingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Page Testing</CardTitle>
        <CardDescription>
          Test the error pages by clicking the buttons below
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3 flex-wrap">
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/test-404-page")}
        >
          Test 404 Page
        </Button>
        <Button
          variant="destructive"
          onClick={() => (window.location.href = "/test-error-page")}
        >
          Test Error Page
        </Button>
      </CardContent>
    </Card>
  );
}
