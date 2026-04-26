"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/lib/text-utils";

const TESTIMONIAL_TITLES = [
  "Project Manager - Dubai",
  "Construction Director - Singapore",
  "Site Engineer - India",
  "PMC Consultant - Philippines",
] as const;

const testimonials = [
  {
    name: "Ahmed Hassan",
    title: "Project Manager â€¢ Dubai",
    content:
      "Quadra EDMS has streamlined our document control process. We're now saving 3-4 hours per week on transmittal management, and our team has complete visibility of all project documents.",
    highlighted:
      "We're now saving 3-4 hours per week on transmittal management",
    firstPart:
      "Quadra EDMS has streamlined our document control process. We're now saving 3-4 hours per week on transmittal management",
    secondPart:
      ", and our team has complete visibility of all project documents.",
  },
  {
    name: "Sarah Chen",
    title: "Construction Director â€¢ Singapore",
    content:
      "Without Quadra EDMS we would've lost critical project documents and faced major delays. I never had time to organize drawings and RFIs properly, so had no idea what was approved without calling the consultant.",
    highlighted:
      "Without Quadra EDMS we would've lost critical project documents and faced major delays",
    firstPart:
      "Without Quadra EDMS we would've lost critical project documents and faced major delays",
    secondPart:
      ". I never had time to organize drawings and RFIs properly, so had no idea what was approved without calling the consultant.",
  },
  {
    name: "Rajesh Kumar",
    title: "Site Engineer â€¢ India",
    content:
      "It has completely transformed how we manage construction documents. From tracking submittals to managing workflows and having all drawings centralized in one place, the change has been remarkable.",
    highlighted:
      "It has completely transformed how we manage construction documents",
    firstPart:
      "It has completely transformed how we manage construction documents",
    secondPart:
      ". From tracking submittals to managing workflows and having all drawings centralized in one place, the change has been remarkable.",
  },
  {
    name: "Michael Torres",
    title: "PMC Consultant â€¢ Philippines",
    content:
      "I prefer to have one tool for document management, similar to what Procore is for project management. Quadra EDMS helped us maintain ISO compliance: we're not using multiple clunky systems but an actually user-friendly tool that generates proper audit trails. That's a big win!",
    highlighted:
      "I prefer to have one tool for document management, similar to what Procore is for project management",
    firstPart:
      "I prefer to have one tool for document management, similar to what Procore is for project management",
    secondPart:
      ". Quadra EDMS helped us maintain ISO compliance: we're not using multiple clunky systems but an actually user-friendly tool that generates proper audit trails. That's a big win!",
  },
].map((testimonial, index) => ({
  ...testimonial,
  title: TESTIMONIAL_TITLES[index] ?? testimonial.title,
}));

function TestimonialCarousel() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setCurrentTestimonial(Math.floor(Math.random() * testimonials.length));

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTestimonial}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, filter: "blur(2px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative max-w-md mx-auto"
          >
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
              <svg
                width="220"
                height="220"
                viewBox="0 0 6 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[220px] h-[220px] object-contain"
              >
                <path
                  d="M4.54533 4.828C4.16133 4.828 3.84333 4.684 3.59133 4.396C3.35133 4.108 3.23133 3.712 3.23133 3.208C3.23133 2.644 3.41133 2.104 3.77133 1.588C4.13133 1.072 4.68933 0.615999 5.44533 0.219999L5.76933 0.669999C5.12133 1.054 4.68933 1.438 4.47333 1.822C4.25733 2.206 4.14933 2.626 4.14933 3.082L3.68133 3.82C3.68133 3.52 3.77133 3.28 3.95133 3.1C4.14333 2.908 4.38333 2.812 4.67133 2.812C4.94733 2.812 5.18133 2.902 5.37333 3.082C5.56533 3.262 5.66133 3.502 5.66133 3.802C5.66133 4.09 5.55933 4.336 5.35533 4.54C5.15133 4.732 4.88133 4.828 4.54533 4.828ZM1.50333 4.828C1.11933 4.828 0.801328 4.684 0.549328 4.396C0.309328 4.108 0.189328 3.712 0.189328 3.208C0.189328 2.644 0.369328 2.104 0.729328 1.588C1.08933 1.072 1.64733 0.615999 2.40333 0.219999L2.72733 0.669999C2.07933 1.054 1.64733 1.438 1.43133 1.822C1.21533 2.206 1.10733 2.626 1.10733 3.082L0.639328 3.82C0.639328 3.52 0.729328 3.28 0.909328 3.1C1.10133 2.908 1.34133 2.812 1.62933 2.812C1.90533 2.812 2.13933 2.902 2.33133 3.082C2.52333 3.262 2.61933 3.502 2.61933 3.802C2.61933 4.09 2.51733 4.336 2.31333 4.54C2.10933 4.732 1.83933 4.828 1.50333 4.828Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="font-sans text-xl text-muted-foreground/40 leading-relaxed pl-4">
              {(() => {
                const testimonial = testimonials[currentTestimonial];
                const secondPart = testimonial?.secondPart || "";
                const startsWithPunctuation =
                  secondPart.startsWith(".") || secondPart.startsWith(",");
                const punctuation = startsWithPunctuation ? secondPart[0] : ".";
                const secondPartWithoutPunctuation = startsWithPunctuation
                  ? secondPart.slice(1)
                  : secondPart;

                return currentTestimonial === 0 ? (
                  <>
                    {testimonial?.firstPart}
                    {punctuation}
                    <span className="text-foreground">
                      {secondPartWithoutPunctuation}"
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-foreground">
                      {testimonial?.firstPart}
                      {punctuation}
                    </span>
                    {secondPartWithoutPunctuation}"
                  </>
                );
              })()}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, filter: "blur(2px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="font-sans text-xs text-muted-foreground/40"
          >
            {testimonials[currentTestimonial]?.name},{" "}
            {testimonials[currentTestimonial]?.title}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = mounted && resolvedTheme === "light" ? "light" : "dark";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignIn) {
        const res = await fetch("/api/auth/sign-in/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password, callbackURL: "/" }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Sign in error:", errorData);
          throw new Error(errorData.message || "Sign in failed");
        }

        await res.json().catch(() => null);

        // Wait a moment for cookies to be set
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push("/");
        router.refresh();
      } else {
        const res = await fetch("/api/auth/sign-up/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
            name,
            role,
            callbackURL: "/",
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Sign up error:", errorData);
          throw new Error(errorData.message || "Sign up failed");
        }

        await res.json().catch(() => null);

        // Wait a moment for cookies to be set
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Video Background */}
      <div className="relative m-2 hidden overflow-hidden rounded-lg lg:flex lg:w-1/2">
        <video
          className="absolute inset-0 h-full w-full rounded-lg object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source
            src="https://cdn.midday.ai/videos/login-video.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-background/20 rounded-lg" />

        {/* Logo on top left - Quadra logo */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <Image
            src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
            alt="Quadra Logo"
            width={24}
            height={24}
            className="h-6 w-6"
            loading="eager"
          />
          <span className="text-foreground font-semibold">
            Quadra EDMS Demo
          </span>
        </div>

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-12 text-center">
          <div className="mt-12">
            <TestimonialCarousel />
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="relative m-2 hidden h-[calc(100vh-16px)] flex-col justify-between lg:flex lg:w-1/2">
        {/* Role selector and theme toggler on top right - absolute position */}
        <div className="absolute top-0 right-0 z-20 flex gap-2">
          <Button onClick={toggleTheme} variant="outline" size="icon">
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {!isSignIn && (
            <Select
              value={role}
              onValueChange={(value) => setRole(value || "user")}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select role">
                  {capitalizeFirstLetter(role)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="pmc">PMC</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="subcontractor">Subcontractor</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Center form */}
        <div className="flex flex-1 items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : isSignIn
                  ? "Sign in"
                  : "Create account"}
            </Button>

            <div className="pt-4 text-center text-sm">
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn ? "Create an account" : "Sign in to your account"}
              </Button>
            </div>
          </form>
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-xs leading-6 text-muted-foreground">
            By continuing, you agree to use QUADRA for your project management
            and document control.
          </p>
        </div>
      </div>

      {/* Mobile version */}
      <div className="flex flex-1 flex-col p-4 lg:hidden">
        {/* Header with logo and theme toggler */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="Quadra Logo"
              width={24}
              height={24}
              className="h-6 w-6"
              loading="eager"
            />
            <span className="font-semibold">Quadra EDMS Demo</span>
          </div>
          <Button onClick={toggleTheme} variant="outline" size="icon">
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Role selector at top (only for sign-up) */}
        {!isSignIn && (
          <div className="mb-4">
            <Label htmlFor="mobile-role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value || "user")}
            >
              <SelectTrigger id="mobile-role" className="w-full">
                <SelectValue placeholder="Select role">
                  {capitalizeFirstLetter(role)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="pmc">PMC</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="subcontractor">Subcontractor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Form */}
        <div className="flex flex-1 items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : isSignIn
                  ? "Sign in"
                  : "Create account"}
            </Button>

            <div className="pt-4 text-center text-sm">
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn ? "Create an account" : "Sign in to your account"}
              </Button>
            </div>
          </form>
        </div>

        {/* Bottom text */}
        <div className="mt-4 text-center">
          <p className="text-xs leading-6 text-muted-foreground">
            By continuing, you agree to use QUADRA for your project management
            and document control.
          </p>
        </div>
      </div>
    </div>
  );
}
