"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const requestedMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [authMode, setAuthMode] = useState<AuthMode>(requestedMode);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAuthMode(requestedMode);
  }, [requestedMode]);

  const isSignIn = authMode === "signin";
  const rawCallbackURL = searchParams.get("callbackURL");
  const hasCallbackURL = isSafeCallbackUrl(rawCallbackURL);
  const callbackURL = getSafeCallbackUrl(rawCallbackURL);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = isSignIn
        ? await authClient.signIn.email(
            {
              email,
              password,
              rememberMe: true,
              callbackURL,
            },
            {
              body: {
                disableRedirect: true,
              },
            },
          )
        : await authClient.signUp.email(
            {
              name,
              email,
              password,
              callbackURL,
            },
            {
              body: {
                disableRedirect: true,
              },
            },
          );

      if (response.error) {
        throw new Error(
          response.error.message ||
            (isSignIn
              ? "Could not sign in. Please check your credentials."
              : "Could not create the account. Please try again."),
        );
      }

      // Force a fresh request so the new session cookie is reflected across
      // the auth proxy and server components immediately after auth. When no
      // explicit callback is provided, route back through /login so the proxy
      // can choose the correct role-aware landing page.
      window.location.replace(hasCallbackURL ? callbackURL : "/login");
      return;
    } catch (error) {
      console.error("Authentication error:", error);
      const nextErrorMessage =
        error instanceof Error
          ? error.message
          : isSignIn
            ? "Could not sign in. Please check your credentials."
            : "Could not create the account. Please try again.";

      setErrorMessage(nextErrorMessage);
      toast({
        title: isSignIn ? "Sign in failed" : "Account creation failed",
        description: nextErrorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="flex items-center justify-center">
          <Card className="w-full max-w-xl border-border/70 shadow-sm">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex flex-col items-center gap-2 pb-2 text-center">
                <a
                  href="/"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-16 items-center justify-center rounded-xl bg-primary/5 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.png"
                      alt="Roshal Organic"
                      className="size-12 object-contain"
                    />
                  </div>
                  <span className="sr-only">Roshal Organic</span>
                </a>
                <h1 className="text-2xl font-bold">
                  Welcome to Roshal Organic
                </h1>
              </div>

              <Tabs
                value={authMode}
                onValueChange={(value) => {
                  setErrorMessage(null);
                  setAuthMode(value === "signup" ? "signup" : "signin");
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage ? (
                  <Alert variant="destructive">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                ) : null}

                {!isSignIn ? (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={name}
                      autoComplete="name"
                      onChange={(event) => {
                        setErrorMessage(null);
                        setName(event.target.value);
                      }}
                      placeholder="Roshal Organic Customer"
                      required
                    />
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={(event) => {
                      setErrorMessage(null);
                      setEmail(event.target.value);
                    }}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    autoComplete={
                      isSignIn ? "current-password" : "new-password"
                    }
                    onChange={(event) => {
                      setErrorMessage(null);
                      setPassword(event.target.value);
                    }}
                    placeholder="********"
                    minLength={8}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? isSignIn
                      ? "Signing in..."
                      : "Creating account..."
                    : isSignIn
                      ? "Sign in to Roshal Organic"
                      : "Create customer account"}
                </Button>
              </form>

              <p className="pt-4 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <a
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function getSafeCallbackUrl(value: string | null) {
  if (isSafeCallbackUrl(value)) {
    return value;
  }

  return "/";
}

function isSafeCallbackUrl(value: string | null): value is string {
  return Boolean(value?.startsWith("/") && !value.startsWith("//"));
}
