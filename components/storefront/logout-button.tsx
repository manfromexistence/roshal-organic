"use client";

import { LogOut } from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { RoshalLocale } from "@/lib/store-types";

type LogoutButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onClick"
> & {
  locale: RoshalLocale;
  redirectTo?: string;
  onLoggedOut?: () => void;
};

export function LogoutButton({
  locale,
  redirectTo = "/login",
  onLoggedOut,
  disabled,
  variant = "outline",
  size = "sm",
  ...props
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            onLoggedOut?.();
            window.location.replace(redirectTo);
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Logout failed:", error);
      onLoggedOut?.();
      window.location.replace(redirectTo);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={disabled || isLoggingOut}
      {...props}
    >
      <LogOut className="size-4" />
      {isLoggingOut
        ? locale === "bn"
          ? "লগআউট হচ্ছে..."
          : "Logging out..."
        : locale === "bn"
          ? "লগআউট"
          : "Logout"}
    </Button>
  );
}
