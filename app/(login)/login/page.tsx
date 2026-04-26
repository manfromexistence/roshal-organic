"use client";

import { Leaf, Moon, ShieldCheck, ShoppingBag, Sun } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const callbackURL = getSafeCallbackUrl(searchParams.get("callbackURL"));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const endpoint = isSignIn
        ? "/api/auth/sign-in/email"
        : "/api/auth/sign-up/email";
      const payload = isSignIn
        ? {
            email,
            password,
            callbackURL,
          }
        : {
            name,
            email,
            password,
            callbackURL,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof responseBody?.message === "string"
            ? responseBody.message
            : isSignIn
              ? "Could not sign in. Please check your credentials."
              : "Could not create the account. Please try again.",
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push(callbackURL);
      router.refresh();
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
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1.05fr,0.95fr]">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-br from-primary/12 via-primary/0 to-transparent" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-background">
                  <Image
                    src="/logo.png"
                    alt="Roshal Organic"
                    width={30}
                    height={30}
                    className="h-8 w-auto"
                    priority
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold">Roshal Organic</p>
                  <p className="text-sm text-muted-foreground">
                    Storefront CMS and ecommerce dashboard
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </Button>
            </div>

            <div className="space-y-5">
              <Badge variant="secondary">Bangla + English storefront</Badge>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
                  Control Roshal Organic&apos;s shop, content, and customer
                  orders from one dashboard.
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                  Manage products, marketing pages, payment guides, order
                  verification, and bilingual content without touching code.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard
                icon={Leaf}
                title="Pure food brand"
                description="Showcase honey, ghee, jaggery, mangoes, oils, and dairy products with a storefront-first experience."
              />
              <FeatureCard
                icon={ShoppingBag}
                title="Commerce workflow"
                description="Track carts, checkouts, manual wallet payments, and order delivery states from the same admin area."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Simple roles"
                description="Roshal now uses only two roles: admin and user. Public sign-up creates user accounts only."
              />
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <Card className="w-full max-w-xl border-border/70 shadow-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl">
                {isSignIn ? "Sign in" : "Create account"}
              </CardTitle>
              <CardDescription>
                {isSignIn
                  ? "Access the Roshal storefront and dashboard."
                  : "Create a customer account. Admin access is assigned from the dashboard."}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      onChange={(event) => {
                        setErrorMessage(null);
                        setName(event.target.value);
                      }}
                      placeholder="Roshal Customer"
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
                      ? "Sign in"
                      : "Create account"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  {isSignIn ? "Need an account?" : "Already have an account?"}{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => {
                      setErrorMessage(null);
                      setIsSignIn((current) => !current);
                    }}
                  >
                    {isSignIn ? "Create one" : "Sign in"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function getSafeCallbackUrl(value: string | null) {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/";
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Leaf;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-5">
      <Icon className="size-5 text-primary" />
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
