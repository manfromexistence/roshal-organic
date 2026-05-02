"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/password-reset/request", {
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          redirectTo: "/reset-password",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          payload?.message ||
            "Could not send the reset link. Please try again.",
        );
      }

      const payload = await response.json().catch(() => null);
      setMessage(
        payload?.message || "Password reset link has been sent to your email.",
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not send the reset link. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your account email and we will send a reset link.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message ? (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setError(null);
                setMessage(null);
                setEmail(event.target.value);
              }}
              placeholder="you@example.com"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">Back to login</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
