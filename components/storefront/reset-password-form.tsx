"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    token ? null : "This password reset link is missing or expired.",
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("This password reset link is missing or expired.");
      return;
    }

    if (password.length < 6) {
      setError("Password (Minimum any 6 digit)");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        body: JSON.stringify({
          newPassword: password,
          token,
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
            "Could not reset the password. Please request a new link.",
        );
      }

      router.push("/login?reset=success");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not reset the password. Please request a new link.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Password (Minimum any 6 digit)
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setError(null);
                setPassword(event.target.value);
              }}
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setError(null);
                setConfirmPassword(event.target.value);
              }}
              minLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !token}
          >
            {isSubmitting ? "Resetting password..." : "Reset password"}
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
