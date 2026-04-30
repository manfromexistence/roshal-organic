"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import {
  bangladeshDistrictOptions,
  getBangladeshDistrictByValue,
} from "@/lib/bangladesh-locations";

type AuthMode = "signin" | "signup";

function isSafeCallbackUrl(value: string | null): value is string {
  return Boolean(value?.startsWith("/") && !value.startsWith("//"));
}

function getSafeCallbackUrl(value: string | null) {
  if (isSafeCallbackUrl(value)) {
    return value;
  }

  return "/";
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function toSyntheticEmail(phoneOrEmail: string) {
  const normalized = phoneOrEmail.trim().toLowerCase();

  if (normalized.includes("@")) {
    return normalized;
  }

  const digits = normalized.replace(/\D/g, "");
  return `customer+${digits}@roshalorganic.app`;
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const requestedMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [authMode, setAuthMode] = useState<AuthMode>(requestedMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState(bangladeshDistrictOptions[0].value);
  const [thana, setThana] = useState(
    bangladeshDistrictOptions[0].thanas[0] || "",
  );

  useEffect(() => {
    setAuthMode(requestedMode);
  }, [requestedMode]);

  const districtOption = useMemo(
    () => getBangladeshDistrictByValue(district),
    [district],
  );

  useEffect(() => {
    if (!districtOption.thanas.includes(thana)) {
      setThana(districtOption.thanas[0] || "");
    }
  }, [districtOption, thana]);

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
              email: toSyntheticEmail(signInIdentifier),
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
              email: toSyntheticEmail(email.trim() || mobile),
              password,
              phone: normalizePhone(mobile),
              preferredLanguage: "en",
              defaultAddress: [address, thana, districtOption.label]
                .map((value) => value.trim())
                .filter(Boolean)
                .join(", "),
              callbackURL,
            } as never,
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
    <div className="min-h-screen bg-background pt-8 lg:pt-32">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_minmax(0,32rem)] lg:items-center">
        <section className="hidden rounded-md border border-border/60 bg-card/70 p-8 shadow-sm lg:flex lg:min-h-[42rem] lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-md border border-border/70 bg-background shadow-sm">
                <Image
                  src="/apple-touch-icon.png"
                  alt="Roshal Organic"
                  width={48}
                  height={48}
                  className="h-11 w-11 object-contain"
                />
              </div>
              <div>
                <p className="font-wordmark text-2xl text-foreground">
                  Roshal Organic
                </p>
                <p className="text-sm text-muted-foreground">
                  Pure food, trusted delivery, and simple account access.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                {isSignIn ? "Welcome back" : "Create your customer account"}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                {isSignIn
                  ? "Sign in with your email or mobile number to manage orders, wishlist, and checkout faster."
                  : "Create a Roshal Organic account with your delivery details so checkout, order tracking, and support stay simple."}
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-md border border-border/60 bg-background/80 p-5 text-sm text-muted-foreground">
            <p>Track orders without friction</p>
            <p>Save delivery details for faster checkout</p>
            <p>Use the same account for storefront and order history</p>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <Card className="w-full max-w-2xl rounded-md border-border/70 shadow-sm">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <Link href="/" className="inline-flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border/70 bg-background shadow-sm">
                    <Image
                      src="/logo.png"
                      alt="Roshal Organic"
                      width={40}
                      height={40}
                      className="h-9 w-auto object-contain dark:hidden"
                    />
                    <Image
                      src="/logo-light.png"
                      alt="Roshal Organic"
                      width={40}
                      height={40}
                      className="hidden h-9 w-auto object-contain dark:block"
                    />
                  </div>
                  <span className="font-wordmark text-2xl text-foreground">
                    Roshal Organic
                  </span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Sign in or create your customer account
                </p>
              </div>

              <Tabs
                value={authMode}
                onValueChange={(value) => {
                  setErrorMessage(null);
                  setAuthMode(value === "signup" ? "signup" : "signin");
                }}
              >
                <TabsList className="grid w-full grid-cols-2 rounded-sm">
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

                {isSignIn ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signin-identifier">Email or mobile</Label>
                      <Input
                        id="signin-identifier"
                        value={signInIdentifier}
                        autoComplete="username"
                        onChange={(event) => {
                          setErrorMessage(null);
                          setSignInIdentifier(event.target.value);
                        }}
                        placeholder="admin@gmail.com or 01805-767300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        autoComplete="current-password"
                        onChange={(event) => {
                          setErrorMessage(null);
                          setPassword(event.target.value);
                        }}
                        placeholder="********"
                        minLength={6}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full name</Label>
                      <Input
                        id="signup-name"
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

                    <div className="space-y-2">
                      <Label htmlFor="signup-mobile">Mobile</Label>
                      <Input
                        id="signup-mobile"
                        value={mobile}
                        autoComplete="tel"
                        inputMode="tel"
                        onChange={(event) => {
                          setErrorMessage(null);
                          setMobile(event.target.value);
                        }}
                        placeholder="01805-767300"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="signup-email">Email (optional)</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        autoComplete="email"
                        onChange={(event) => {
                          setErrorMessage(null);
                          setEmail(event.target.value);
                        }}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="signup-address">Address</Label>
                      <Textarea
                        id="signup-address"
                        value={address}
                        autoComplete="street-address"
                        onChange={(event) => {
                          setErrorMessage(null);
                          setAddress(event.target.value);
                        }}
                        placeholder="House, road, area"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>District</Label>
                      <Select
                        value={district}
                        onValueChange={(value) => {
                          setErrorMessage(null);
                          setDistrict(value);
                        }}
                      >
                        <SelectTrigger className="rounded-sm">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {bangladeshDistrictOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Thana</Label>
                      <Select
                        value={thana}
                        onValueChange={(value) => {
                          setErrorMessage(null);
                          setThana(value);
                        }}
                      >
                        <SelectTrigger className="rounded-sm">
                          <SelectValue placeholder="Select thana" />
                        </SelectTrigger>
                        <SelectContent>
                          {districtOption.thanas.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="signup-password">
                        Password (minimum 6 digits)
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        autoComplete="new-password"
                        onChange={(event) => {
                          setErrorMessage(null);
                          setPassword(event.target.value);
                        }}
                        placeholder="********"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-sm"
                  disabled={isLoading}
                >
                  {isLoading
                    ? isSignIn
                      ? "Signing in..."
                      : "Creating account..."
                    : isSignIn
                      ? "Sign in to Roshal Organic"
                      : "Create customer account"}
                </Button>
              </form>

              <p className="pt-2 text-center text-sm text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms-and-conditions"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
