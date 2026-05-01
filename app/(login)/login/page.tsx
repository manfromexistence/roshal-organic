"use client";

import { Eye, EyeOff, Lock, Mail, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput2 } from "@/components/ui/phone-input-2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { bangladeshDistrictOptions } from "@/lib/bangladesh-locations";
import {
  isBangladeshPhoneComplete,
  normalizeBangladeshPhoneInput,
  stripPhoneDecorators,
} from "@/lib/store-phone";
import { cn } from "@/lib/utils";

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

function toSyntheticEmail(phoneOrEmail: string) {
  const normalized = phoneOrEmail.trim().toLowerCase();

  if (normalized.includes("@")) {
    return normalized;
  }

  const digits = stripPhoneDecorators(
    normalizeBangladeshPhoneInput(normalized),
  ).replace(/\D/g, "");
  return `customer+${digits}@roshalorganic.app`;
}

function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <svg
          className="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1.2A4.8 4.8 0 1 0 16.8 6 4.805 4.805 0 0 0 12 1.2zm0 8.6A3.8 3.8 0 1 1 15.8 6 3.804 3.804 0 0 1 12 9.8zM9 22H4l.01-4.5A5.498 5.498 0 0 1 9.5 12h4.312a5.968 5.968 0 0 0-.462 1H9.5A4.505 4.505 0 0 0 5 17.5V21h4zm10-10.9a3.9 3.9 0 0 0-3.9 3.9 3.86 3.86 0 0 0 .225 1.255L11 20.727V23h2.993l.023-.01L15 22v-1h1.005L17 20v-1h1.004l.186-.187A3.9 3.9 0 1 0 19 11.1zm0 6.9a2.973 2.973 0 0 1-1.223-.267l-.272.267H16v2h-2v1.674l-.408.326H12v-.906l4.419-4.591A2.965 2.965 0 0 1 16 15a3 3 0 1 1 3 3zm.5-5a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5zm0 2a.5.5 0 1 1 .5-.5.501.501 0 0 1-.5.5z" />
        </svg>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function FieldShell({
  children,
  className,
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      {icon ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-primary">
          {icon}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const requestedMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [authMode, setAuthMode] = useState<AuthMode>(requestedMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");

  const signInPasswordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setAuthMode(requestedMode);
  }, [requestedMode]);

  const districtOption = useMemo(
    () =>
      bangladeshDistrictOptions.find((option) => option.value === district) ||
      null,
    [district],
  );

  useEffect(() => {
    if (!districtOption) {
      setThana("");
      return;
    }

    if (thana && !districtOption.thanas.includes(thana)) {
      setThana("");
    }
  }, [districtOption, thana]);

  const isSignIn = authMode === "signin";
  const rawCallbackURL = searchParams.get("callbackURL");
  const hasCallbackURL = isSafeCallbackUrl(rawCallbackURL);
  const callbackURL = getSafeCallbackUrl(rawCallbackURL);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setMobileError(null);

    if (!isSignIn) {
      const phone = normalizeBangladeshPhoneInput(mobile);
      if (!isBangladeshPhoneComplete(phone)) {
        setMobileError("Mobile number must be 11 digits and start with 01.");
        return;
      }

      if (!districtOption || !district || !thana) {
        setErrorMessage("Please select district and thana.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = isSignIn
        ? await authClient.signIn.email(
            {
              email: toSyntheticEmail(signInIdentifier),
              password,
              rememberMe,
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
              phone: normalizeBangladeshPhoneInput(mobile),
              preferredLanguage: "en",
              defaultAddress: [address, thana, districtOption?.label || ""]
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

      if (hasCallbackURL) {
        window.location.replace(callbackURL);
        return;
      }

      const session = await authClient.getSession();
      const role = (
        session.data?.user as { role?: "admin" | "user" } | undefined
      )?.role;

      window.location.replace(role === "admin" ? "/dashboard" : "/profile");
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
    <div className="min-h-screen bg-muted/20 px-4 py-6 sm:px-6 md:py-10 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="rounded-xl border border-border/60 bg-background shadow-xl shadow-black/5 md:rounded-2xl">
          <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">
            <AuthHeader
              title={isSignIn ? "Signin" : "Create New Account"}
              subtitle={
                isSignIn
                  ? "Access your account securely"
                  : "Register to get started"
              }
            />

            <div className="mt-6 md:mt-7">
              <Card className="rounded-2xl border-0 bg-muted/35 p-0 shadow-none">
                <CardContent className="space-y-4 px-4 py-4 sm:px-5 sm:py-5 md:px-6">
                  <Tabs
                    value={authMode}
                    onValueChange={(value) => {
                      setAuthMode(value === "signup" ? "signup" : "signin");
                      setErrorMessage(null);
                      setMobileError(null);
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage ? (
                      <Alert variant="destructive">
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    ) : null}

                    {isSignIn ? (
                      <>
                        <FieldShell icon={<User className="size-4" />}>
                          <Input
                            id="signin-identifier"
                            value={signInIdentifier}
                            autoComplete="username"
                            onChange={(event) => {
                              setErrorMessage(null);
                              setMobileError(null);
                              setSignInIdentifier(event.target.value);
                            }}
                            placeholder="Email or 017XXXXXXXX"
                            className="h-12 rounded-lg border-border/70 bg-background pl-12 text-base"
                            required
                          />
                        </FieldShell>

                        <FieldShell
                          icon={<Lock className="size-4" />}
                          className="relative"
                        >
                          <Input
                            ref={signInPasswordRef}
                            id="signin-password"
                            type={showSignInPassword ? "text" : "password"}
                            value={password}
                            autoComplete="current-password"
                            onChange={(event) => {
                              setErrorMessage(null);
                              setMobileError(null);
                              setPassword(event.target.value);
                            }}
                            placeholder="Password"
                            className="h-12 rounded-lg border-border/70 bg-background pr-12 pl-12 text-base"
                            minLength={6}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-2 h-10 w-10 -translate-y-1/2 rounded-full text-muted-foreground"
                            onClick={() =>
                              setShowSignInPassword((current) => !current)
                            }
                            aria-label={
                              showSignInPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showSignInPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </Button>
                        </FieldShell>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Checkbox
                              id="remember-me"
                              checked={rememberMe}
                              onCheckedChange={(checked) =>
                                setRememberMe(checked === true)
                              }
                            />
                            <Label
                              htmlFor="remember-me"
                              className="cursor-pointer text-sm font-normal text-muted-foreground"
                            >
                              Remember me
                            </Label>
                          </div>

                          <Link
                            href="/contact"
                            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                          >
                            Forgotten password?
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <FieldShell icon={<User className="size-4" />}>
                          <Input
                            id="signup-name"
                            value={name}
                            autoComplete="name"
                            onChange={(event) => {
                              setErrorMessage(null);
                              setMobileError(null);
                              setName(event.target.value);
                            }}
                            placeholder="Full Name"
                            className="h-12 rounded-lg border-border/70 bg-background pl-12 text-base"
                            required
                          />
                        </FieldShell>

                        <FieldShell icon={<Mail className="size-4" />}>
                          <Input
                            id="signup-email"
                            value={email}
                            onChange={(event) => {
                              setErrorMessage(null);
                              setMobileError(null);
                              setEmail(event.target.value);
                            }}
                            autoComplete="email"
                            type="email"
                            placeholder="Email (Optional)"
                            className="h-12 rounded-lg border-border/70 bg-background pl-12 text-base"
                          />
                        </FieldShell>

                        <FieldShell
                          className="relative"
                          icon={<Lock className="size-4" />}
                        >
                          <Input
                            id="signup-password"
                            type={showSignUpPassword ? "text" : "password"}
                            value={password}
                            autoComplete="new-password"
                            onChange={(event) => {
                              setErrorMessage(null);
                              setMobileError(null);
                              setPassword(event.target.value);
                            }}
                            placeholder="Password"
                            className="h-12 rounded-lg border-border/70 bg-background pr-12 pl-12 text-base"
                            minLength={6}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-2 h-10 w-10 -translate-y-1/2 rounded-full text-muted-foreground"
                            onClick={() =>
                              setShowSignUpPassword((current) => !current)
                            }
                            aria-label={
                              showSignUpPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showSignUpPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </Button>
                        </FieldShell>

                        <FieldShell icon={<MapPin className="size-4" />}>
                          <Input
                            id="signup-address"
                            value={address}
                            autoComplete="street-address"
                            onChange={(event) => {
                              setErrorMessage(null);
                              setMobileError(null);
                              setAddress(event.target.value);
                            }}
                            placeholder="Address"
                            className="h-12 rounded-lg border-border/70 bg-background pl-12 text-base"
                            required
                          />
                        </FieldShell>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="min-w-0 space-y-2">
                            <Label className="px-1 text-sm text-muted-foreground">
                              District
                            </Label>
                            <Select
                              value={district}
                              onValueChange={(value) => {
                                setErrorMessage(null);
                                setMobileError(null);
                                setDistrict(value);
                                setThana("");
                              }}
                            >
                              <SelectTrigger className="h-12 min-w-0 rounded-lg border-border/70 bg-background text-sm">
                                <SelectValue placeholder="Select district" />
                              </SelectTrigger>
                              <SelectContent>
                                {bangladeshDistrictOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="min-w-0 space-y-2">
                            <Label className="px-1 text-sm text-muted-foreground">
                              Thana
                            </Label>
                            <Select
                              value={thana}
                              onValueChange={(value) => {
                                setErrorMessage(null);
                                setMobileError(null);
                                setThana(value);
                              }}
                              disabled={!districtOption}
                            >
                              <SelectTrigger className="h-12 min-w-0 rounded-lg border-border/70 bg-background text-sm">
                                <SelectValue placeholder="Select thana" />
                              </SelectTrigger>
                              <SelectContent>
                                {(districtOption?.thanas || []).map(
                                  (option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="px-1 text-sm text-muted-foreground">
                            Mobile number
                          </Label>
                          <PhoneInput2
                            id="signup-mobile"
                            value={mobile}
                            autoComplete="tel"
                            onChange={(value) => {
                              setErrorMessage(null);
                              setMobileError(null);
                              setMobile(value);
                            }}
                            placeholder="017XXXXXXXX"
                            className="h-12 rounded-lg border-border/70 bg-background text-base"
                            required
                          />
                          {mobileError ? (
                            <p className="px-1 text-xs font-medium text-destructive">
                              {mobileError}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-lg text-base font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? isSignIn
                          ? "Signing in..."
                          : "Creating account..."
                        : isSignIn
                          ? "Login"
                          : "Register account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
