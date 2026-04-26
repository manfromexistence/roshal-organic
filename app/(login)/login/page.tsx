"use client";

import {
  CreditCard,
  Languages,
  Leaf,
  MapPin,
  Moon,
  ShieldCheck,
  Sun,
  Truck,
} from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const isSignIn = authMode === "signin";
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
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1.08fr,0.92fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="absolute inset-x-0 top-0 h-52 bg-linear-to-br from-primary/15 via-primary/0 to-transparent" />
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-linear-to-l from-primary/5 via-transparent to-transparent lg:block" />

          <div className="relative flex h-full flex-col gap-8">
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
                    Pure food storefront and customer accounts
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

            <div className="space-y-4">
              <Badge variant="secondary">
                Bangla + English customer account
              </Badge>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                  Sign in to continue checkout, track orders, and manage your
                  Roshal Organic account.
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                  Customer accounts keep delivery details, order history,
                  bilingual shopping preferences, and payment follow-up in one
                  place. Admin access is still assigned only from the dashboard.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <QuickStat
                icon={Truck}
                title="Order tracking"
                description="Follow payment review, packing, and delivery progress from your account."
              />
              <QuickStat
                icon={MapPin}
                title="Saved checkout"
                description="Reuse your contact details and delivery address for faster repeat orders."
              />
              <QuickStat
                icon={Languages}
                title="Bilingual account"
                description="Switch between Bangla and English without leaving the storefront flow."
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
              <Card className="border-border/70 bg-background/80 shadow-none">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-xl">
                    What your customer account includes
                  </CardTitle>
                  <CardDescription>
                    Built for a storefront-first purchase journey, not just a
                    dashboard login.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <BenefitRow
                    icon={Leaf}
                    title="Faster reorders"
                    description="Return to honey, ghee, jaggery, oil, and seasonal items without rebuilding the whole checkout."
                  />
                  <BenefitRow
                    icon={ShieldCheck}
                    title="Manual payment clarity"
                    description="Wallet payments and screenshot verification stay attached to the same order record for easy follow-up."
                  />
                  <BenefitRow
                    icon={CreditCard}
                    title="Payment flexibility"
                    description="aamarPay card flow, bKash, Nagad, Rocket, and Upay can all route through the same account history."
                  />
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-background/80 shadow-none">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-xl">
                    Checkout-ready access
                  </CardTitle>
                  <CardDescription>
                    Use the same account for products, cart, checkout, profile,
                    and order history.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {["aamarPay", "bKash", "Nagad", "Rocket", "Upay"].map(
                      (payment) => (
                        <Badge key={payment} variant="outline">
                          {payment}
                        </Badge>
                      ),
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <MiniPanel
                      title="For customers"
                      description="Sign up directly and manage your storefront orders yourself."
                    />
                    <MiniPanel
                      title="For admins"
                      description="Admin access is invited from the dashboard, never from public sign-up."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <Card className="w-full max-w-xl border-border/70 shadow-sm">
            <CardHeader className="space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary">
                  {isSignIn ? "Customer sign in" : "Create customer account"}
                </Badge>
                <CardTitle className="text-3xl">
                  {isSignIn
                    ? "Continue your Roshal account"
                    : "Create your Roshal account"}
                </CardTitle>
                <CardDescription className="text-sm leading-6">
                  {isSignIn
                    ? "Access your cart, checkout, profile, and order history."
                    : "Create a customer account for faster checkout and order tracking. Admin access is assigned from the dashboard only."}
                </CardDescription>
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
              <Alert>
                <AlertDescription>
                  Customers can register here. Admin privileges are still
                  controlled from the Roshal dashboard by an existing admin.
                </AlertDescription>
              </Alert>

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
                      ? "Sign in to Roshal Organic"
                      : "Create customer account"}
                </Button>
              </form>

              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                After sign in, customers land back on the requested storefront
                page, checkout, or order detail screen automatically.
              </div>
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

function QuickStat({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Leaf;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border/70 bg-background/80 shadow-none">
      <CardContent className="space-y-3 p-5">
        <Icon className="size-5 text-primary" />
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function BenefitRow({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Leaf;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-background">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function MiniPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
