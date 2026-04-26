"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Languages, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const testimonials = [
  {
    name: "ফাতেমা আক্তার",
    title: "গৃহিণী • ঢাকা",
    content:
      "Roshal Organic এর মধু এবং গুড় সত্যিই অসাধারণ! আমার পরিবারের সবাই এখন শুধু খাঁটি পণ্য খায়। স্বাদে আসল, বিশ্বাসে অটুট।",
    highlighted: "Roshal Organic এর মধু এবং গুড় সত্যিই অসাধারণ",
    firstPart: "Roshal Organic এর মধু এবং গুড় সত্যিই অসাধারণ",
    secondPart: "! আমার পরিবারের সবাই এখন শুধু খাঁটি পণ্য খায়। স্বাদে আসল, বিশ্বাসে অটুট।",
  },
  {
    name: "রহিম উদ্দিন",
    title: "ব্যবসায়ী • চট্টগ্রাম",
    content:
      "বাজারে ভেজালের ভিড়ে আসল জিনিস খুঁজে পাওয়া কঠিন ছিল। Roshal Organic এর দেশি ঘি এবং আম সত্যিই ১০০% প্রাকৃতিক। এখন আমি নিশ্চিন্তে অর্ডার করি।",
    highlighted: "বাজারে ভেজালের ভিড়ে আসল জিনিস খুঁজে পাওয়া কঠিন ছিল",
    firstPart: "বাজারে ভেজালের ভিড়ে আসল জিনিস খুঁজে পাওয়া কঠিন ছিল",
    secondPart:
      ". Roshal Organic এর দেশি ঘি এবং আম সত্যিই ১০০% প্রাকৃতিক। এখন আমি নিশ্চিন্তে অর্ডার করি।",
  },
  {
    name: "সুমাইয়া খান",
    title: "ডাক্তার • সিলেট",
    content:
      "স্বাস্থ্যের জন্য আমি সবসময় অর্গানিক খাবার খুঁজি। Roshal Organic এর ফ্রেশ দই এবং মৌসুমী ফল সত্যিই স্বাস্থ্যকর। কোনো কেমিক্যাল নেই, সম্পূর্ণ প্রাকৃতিক।",
    highlighted: "স্বাস্থ্যের জন্য আমি সবসময় অর্গানিক খাবার খুঁজি",
    firstPart: "স্বাস্থ্যের জন্য আমি সবসময় অর্গানিক খাবার খুঁজি",
    secondPart:
      ". Roshal Organic এর ফ্রেশ দই এবং মৌসুমী ফল সত্যিই স্বাস্থ্যকর। কোনো কেমিক্যাল নেই, সম্পূর্ণ প্রাকৃতিক।",
  },
  {
    name: "করিম সাহেব",
    title: "কৃষক • রাজশাহী",
    content:
      "আমরা গ্রাম থেকে সরাসরি সংগ্রহ করা পণ্য সরবরাহ করি। Roshal Organic আমাদের কৃষকদের সঠিক মূল্য দেয় এবং গ্রাহকদের কাছে খাঁটি পণ্য পৌঁছে দেয়। এটি সত্যিই একটি মহৎ উদ্যোগ।",
    highlighted: "আমরা গ্রাম থেকে সরাসরি সংগ্রহ করা পণ্য সরবরাহ করি",
    firstPart: "আমরা গ্রাম থেকে সরাসরি সংগ্রহ করা পণ্য সরবরাহ করি",
    secondPart:
      ". Roshal Organic আমাদের কৃষকদের সঠিক মূল্য দেয় এবং গ্রাহকদের কাছে খাঁটি পণ্য পৌঁছে দেয়। এটি সত্যিই একটি মহৎ উদ্যোগ।",
  },
];

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
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  useEffect(() => {
    // Set initial theme to dark
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignIn) {
        const res = await fetch("/api/auth/sign-in/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, callbackURL: "/" }),
        });

        if (!res.ok) throw new Error("Sign in failed");
        router.push("/");
      } else {
        const res = await fetch("/api/auth/sign-up/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name,
            role,
            callbackURL: "/",
          }),
        });

        if (!res.ok) throw new Error("Sign up failed");
        router.push("/");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Video Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden m-2 rounded-lg">
        <video
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
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

        {/* Logo on top left - Roshal Organic logo */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Roshal Organic Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-foreground font-semibold text-lg">
            Roshal Organic
          </span>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center h-full w-full">
          <div className="mt-12">
            <TestimonialCarousel />
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between m-2 h-[calc(100vh-16px)]">
        {/* Language switcher and theme toggler on top right - absolute position */}
        <div className="absolute top-0 right-0 z-20 flex gap-2">
          <Button
            onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
            variant="outline"
            size="icon"
            title={language === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
          >
            <Languages className="h-5 w-5" />
          </Button>
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
                <SelectValue
                  placeholder={
                    language === "bn" ? "ভূমিকা নির্বাচন করুন" : "Select role"
                  }
                >
                  {language === "bn"
                    ? role === "user"
                      ? "ব্যবহারকারী"
                      : role === "admin"
                        ? "অ্যাডমিন"
                        : capitalizeFirstLetter(role)
                    : capitalizeFirstLetter(role)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  {language === "bn" ? "ব্যবহারকারী" : "User"}
                </SelectItem>
                <SelectItem value="admin">
                  {language === "bn" ? "অ্যাডমিন" : "Admin"}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Center form */}
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === "bn" ? "পূর্ণ নাম" : "Full name"}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={language === "bn" ? "আপনার নাম" : "John Doe"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                {language === "bn" ? "ইমেইল" : "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={
                  language === "bn" ? "আপনার ইমেইল" : "you@example.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {language === "bn" ? "পাসওয়ার্ড" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={language === "bn" ? "••••••••" : "********"}
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
                ? language === "bn"
                  ? "লোড হচ্ছে..."
                  : "Loading..."
                : isSignIn
                  ? language === "bn"
                    ? "সাইন ইন করুন"
                    : "Sign in"
                  : language === "bn"
                    ? "অ্যাকাউন্ট তৈরি করুন"
                    : "Create account"}
            </Button>

            <div className="pt-4 text-center text-sm">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn
                  ? language === "bn"
                    ? "অ্যাকাউন্ট তৈরি করুন"
                    : "Create an account"
                  : language === "bn"
                    ? "আপনার অ্যাকাউন্টে সাইন ইন করুন"
                    : "Sign in to your account"}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-xs leading-6 text-muted-foreground">
            {language === "bn"
              ? "চালিয়ে যাওয়ার মাধ্যমে, আপনি Roshal Organic এর শর্তাবলীতে সম্মত হচ্ছেন। ১০০% প্রাকৃতিক ও অর্গানিক খাদ্য ব্র্যান্ড।"
              : "By continuing, you agree to Roshal Organic's terms. 100% natural and organic food brand."}
          </p>
        </div>
      </div>

      {/* Mobile version */}
      <div className="lg:hidden flex-1 flex flex-col p-4">
        {/* Header with logo and theme toggler */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Roshal Organic Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-semibold text-lg">Roshal Organic</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
              variant="outline"
              size="icon"
              title={
                language === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"
              }
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Button onClick={toggleTheme} variant="outline" size="icon">
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Role selector at top (only for sign-up) */}
        {!isSignIn && (
          <div className="mb-4">
            <Label htmlFor="mobile-role">
              {language === "bn" ? "ভূমিকা" : "Role"}
            </Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value || "user")}
            >
              <SelectTrigger id="mobile-role" className="w-full">
                <SelectValue
                  placeholder={
                    language === "bn" ? "ভূমিকা নির্বাচন করুন" : "Select role"
                  }
                >
                  {language === "bn"
                    ? role === "user"
                      ? "ব্যবহারকারী"
                      : role === "admin"
                        ? "অ্যাডমিন"
                        : capitalizeFirstLetter(role)
                    : capitalizeFirstLetter(role)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  {language === "bn" ? "ব্যবহারকারী" : "User"}
                </SelectItem>
                <SelectItem value="admin">
                  {language === "bn" ? "অ্যাডমিন" : "Admin"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Form */}
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === "bn" ? "পূর্ণ নাম" : "Full name"}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={language === "bn" ? "আপনার নাম" : "John Doe"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                {language === "bn" ? "ইমেইল" : "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={
                  language === "bn" ? "আপনার ইমেইল" : "you@example.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {language === "bn" ? "পাসওয়ার্ড" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={language === "bn" ? "••••••••" : "********"}
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
                ? language === "bn"
                  ? "লোড হচ্ছে..."
                  : "Loading..."
                : isSignIn
                  ? language === "bn"
                    ? "সাইন ইন করুন"
                    : "Sign in"
                  : language === "bn"
                    ? "অ্যাকাউন্ট তৈরি করুন"
                    : "Create account"}
            </Button>

            <div className="pt-4 text-center text-sm">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn
                  ? language === "bn"
                    ? "অ্যাকাউন্ট তৈরি করুন"
                    : "Create an account"
                  : language === "bn"
                    ? "আপনার অ্যাকাউন্টে সাইন ইন করুন"
                    : "Sign in to your account"}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-4">
          <p className="text-xs leading-6 text-muted-foreground">
            {language === "bn"
              ? "চালিয়ে যাওয়ার মাধ্যমে, আপনি Roshal Organic এর শর্তাবলীতে সম্মত হচ্ছেন। ১০০% প্রাকৃতিক ও অর্গানিক খাদ্য ব্র্যান্ড।"
              : "By continuing, you agree to Roshal Organic's terms. 100% natural and organic food brand."}
          </p>
        </div>
      </div>
    </div>
  );
}
