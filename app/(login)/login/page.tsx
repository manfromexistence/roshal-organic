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
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import {
  bangladeshDistrictOptions,
  getBangladeshDistrictByValue,
} from "@/lib/bangladesh-locations";
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

  const digits = stripPhoneDecorators(normalized).replace(/\D/g, "");
  return `customer+${digits}@roshalorganic.app`;
}

function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <User className="size-7" />
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p>
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

function OrDivider() {
  return (
    <div className="relative hidden items-center justify-center md:flex">
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border/70" />
      <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-background text-sm font-medium text-muted-foreground shadow-sm">
        OR
      </span>
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
  const [rememberMe, setRememberMe] = useState(true);
  const [quickMobile, setQuickMobile] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

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

  const signInPasswordRef = useRef<HTMLInputElement | null>(null);
  const signUpNameRef = useRef<HTMLInputElement | null>(null);

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

  const handleQuickMobileContinue = () => {
    const normalizedPhone = normalizeBangladeshPhoneInput(quickMobile);

    if (!isBangladeshPhoneComplete(normalizedPhone)) {
      setErrorMessage("Mobile number must be exactly 11 digits.");
      return;
    }

    setErrorMessage(null);

    if (isSignIn) {
      setSignInIdentifier(normalizedPhone);
      requestAnimationFrame(() => {
        signInPasswordRef.current?.focus();
      });
      return;
    }

    setMobile(normalizedPhone);
    requestAnimationFrame(() => {
      signUpNameRef.current?.focus();
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!isSignIn) {
      const phone = normalizeBangladeshPhoneInput(mobile || quickMobile);
      if (!isBangladeshPhoneComplete(phone)) {
        setErrorMessage("Mobile number must be exactly 11 digits.");
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
              email: toSyntheticEmail(email.trim() || mobile || quickMobile),
              password,
              phone: normalizeBangladeshPhoneInput(mobile || quickMobile),
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
    <div className="min-h-screen bg-muted/20 px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-border/60 bg-background shadow-xl shadow-black/5">
          <div className="px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
            <AuthHeader
              title={isSignIn ? "Signin" : "Create New Account"}
              subtitle={
                isSignIn
                  ? "Access your account securely"
                  : "Register to get started"
              }
            />

            <div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] md:gap-8">
              <Card className="rounded-3xl border-0 bg-muted/35 p-0 shadow-none">
                <CardContent className="space-y-5 px-7 py-7">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {isSignIn
                        ? "Login With Mobile Number"
                        : "Signup With Mobile Number"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isSignIn
                        ? "Use your mobile number to continue securely."
                        : "Start with your delivery mobile number first."}
                    </p>
                  </div>

                  <PhoneInput2
                    value={quickMobile}
                    onChange={(value) => {
                      setErrorMessage(null);
                      setQuickMobile(value);
                      if (!isSignIn) {
                        setMobile(value);
                      }
                    }}
                    placeholder="01805-767300"
                    className="[&_button]:h-14 [&_button]:border-border/70 [&_button]:bg-background [&_input]:h-14 [&_input]:rounded-s-none [&_input]:border-border/70 [&_input]:bg-background [&_input]:text-base"
                  />

                  <Button
                    type="button"
                    className="h-14 w-full rounded-xl text-base font-semibold"
                    onClick={handleQuickMobileContinue}
                  >
                    Send OTP
                  </Button>
                </CardContent>
              </Card>

              <OrDivider />

              <Card className="rounded-3xl border-0 bg-muted/35 p-0 shadow-none">
                <CardContent className="space-y-5 px-7 py-7">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {isSignIn
                        ? "Login With Credentials"
                        : "Register a new account"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isSignIn
                        ? "Use your email or phone number and password."
                        : "Complete the form below to create your account."}
                    </p>
                  </div>

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
                              setSignInIdentifier(event.target.value);
                            }}
                            placeholder="Email or phone number"
                            className="h-14 rounded-xl border-border/70 bg-background pl-12 text-base"
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
                              setPassword(event.target.value);
                            }}
                            placeholder="Password"
                            className="h-14 rounded-xl border-border/70 bg-background pr-12 pl-12 text-base"
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
                            ref={signUpNameRef}
                            id="signup-name"
                            value={name}
                            autoComplete="name"
                            onChange={(event) => {
                              setErrorMessage(null);
                              setName(event.target.value);
                            }}
                            placeholder="Full Name"
                            className="h-14 rounded-xl border-border/70 bg-background pl-12 text-base"
                            required
                          />
                        </FieldShell>

                        <FieldShell icon={<Mail className="size-4" />}>
                          <Input
                            id="signup-email"
                            value={email}
                            onChange={(event) => {
                              setErrorMessage(null);
                              setEmail(event.target.value);
                            }}
                            autoComplete="email"
                            type="email"
                            placeholder="Email (Optional)"
                            className="h-14 rounded-xl border-border/70 bg-background pl-12 text-base"
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
                              setPassword(event.target.value);
                            }}
                            placeholder="Password"
                            className="h-14 rounded-xl border-border/70 bg-background pr-12 pl-12 text-base"
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
                              setAddress(event.target.value);
                            }}
                            placeholder="Address"
                            className="h-14 rounded-xl border-border/70 bg-background pl-12 text-base"
                            required
                          />
                        </FieldShell>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="min-w-0 space-y-2">
                            <Label className="px-1 text-sm text-muted-foreground">
                              District
                            </Label>
                            <Select
                              value={district}
                              onValueChange={(value) => {
                                setErrorMessage(null);
                                setDistrict(value);
                              }}
                            >
                              <SelectTrigger className="h-14 min-w-0 rounded-xl border-border/70 bg-background text-sm">
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
                                setThana(value);
                              }}
                            >
                              <SelectTrigger className="h-14 min-w-0 rounded-xl border-border/70 bg-background text-sm">
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
                        </div>

                        <div className="space-y-2">
                          <Label className="px-1 text-sm text-muted-foreground">
                            Mobile number
                          </Label>
                          <PhoneInput2
                            id="signup-mobile"
                            value={mobile || quickMobile}
                            autoComplete="tel"
                            onChange={(value) => {
                              setErrorMessage(null);
                              setMobile(value);
                              setQuickMobile(value);
                            }}
                            placeholder="01805-767300"
                            className="[&_button]:h-14 [&_button]:border-border/70 [&_button]:bg-background [&_input]:h-14 [&_input]:rounded-s-none [&_input]:border-border/70 [&_input]:bg-background [&_input]:text-base"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="h-14 w-full rounded-xl text-base font-semibold"
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

            <div className="mt-10 space-y-4 text-center">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="h-px flex-1 bg-border/70" />
                <span>{isSignIn ? "or signin with" : "or signup with"}</span>
                <div className="h-px flex-1 bg-border/70" />
              </div>

              <p className="text-sm text-muted-foreground md:text-base">
                {isSignIn
                  ? "Don't have any account?"
                  : "Already have an account?"}{" "}
                <Link
                  href={isSignIn ? "/login?mode=signup" : "/login"}
                  className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                >
                  {isSignIn ? "Register account" : "Sign in"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
