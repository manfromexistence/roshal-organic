"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { bangladeshDistrictOptions } from "@/lib/bangladesh-locations";
import {
  buildRoshalDefaultAddress,
  getDisplayRoshalEmail,
  parseRoshalDefaultAddress,
} from "@/lib/store-address";
import type { RoshalLocale } from "@/lib/store-types";

type ProfileAction = (formData: FormData) => void | Promise<void>;

interface ProfileSettingsFormProps {
  action: ProfileAction;
  error?: string;
  locale: RoshalLocale;
  saved?: boolean;
  user: {
    defaultAddress: string;
    email: string;
    id: string;
    name: string;
    phone: string;
    preferredLanguage: string;
  };
}

export function ProfileSettingsForm({
  action,
  error,
  locale,
  saved,
  user,
}: ProfileSettingsFormProps) {
  const parsedAddress = useMemo(
    () => parseRoshalDefaultAddress(user.defaultAddress || ""),
    [user.defaultAddress],
  );
  const [district, setDistrict] = useState(parsedAddress.district);
  const [thana, setThana] = useState(parsedAddress.thana);
  const [addressLine1, setAddressLine1] = useState(parsedAddress.addressLine1);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const districtOption =
    bangladeshDistrictOptions.find((option) => option.value === district) ||
    null;
  const defaultAddress = buildRoshalDefaultAddress({
    addressLine1,
    districtLabel: districtOption?.label || "",
    thana,
  });

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordError("Password (Minimum any 6 digit)");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        body: JSON.stringify({
          currentPassword,
          newPassword,
          revokeOtherSessions: false,
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
            "Could not change password. Please check your current password.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage("Password changed successfully.");
    } catch (changeError) {
      setPasswordError(
        changeError instanceof Error
          ? changeError.message
          : "Could not change password. Please check your current password.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "প্রোফাইল আপডেট" : "Update profile"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {locale === "bn"
              ? "সাইন আপ ফিল্ডের মতো আপনার নাম, মোবাইল, ঠিকানা, জেলা এবং থানা আপডেট করুন।"
              : "Update your name, mobile, address, district, and thana like the sign-up form."}
          </p>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-5">
            <input type="hidden" name="id" value={user.id} />
            <input type="hidden" name="redirectTo" value="/profile?saved=1" />
            <input type="hidden" name="defaultAddress" value={defaultAddress} />

            {saved ? (
              <Alert>
                <AlertDescription>
                  {locale === "bn"
                    ? "প্রোফাইল সেভ হয়েছে।"
                    : "Profile saved successfully."}
                </AlertDescription>
              </Alert>
            ) : null}
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name">
                  {locale === "bn" ? "Full Name" : "Full Name"}
                </Label>
                <Input
                  id="profile-name"
                  name="name"
                  defaultValue={user.name}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-mobile">Mobile</Label>
                <PhoneInput2
                  id="profile-mobile"
                  name="phone"
                  defaultValue={user.phone || ""}
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile-email">Email (Optional)</Label>
                <Input
                  id="profile-email"
                  name="email"
                  type="email"
                  defaultValue={getDisplayRoshalEmail(user.email)}
                  autoComplete="email"
                  placeholder="Email (Optional)"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile-address">Address</Label>
                <Input
                  id="profile-address"
                  value={addressLine1}
                  onChange={(event) => setAddressLine1(event.target.value)}
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2 md:col-span-2 sm:gap-3">
                <div className="min-w-0 space-y-2">
                  <Label className="truncate text-xs text-muted-foreground sm:text-sm">
                    District
                  </Label>
                  <Select
                    value={district}
                    onValueChange={(value) => {
                      setDistrict(value);
                      setThana("");
                    }}
                  >
                    <SelectTrigger className="h-11 min-w-0 px-2 text-xs sm:px-3 sm:text-sm">
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

                <div className="min-w-0 space-y-2">
                  <Label className="truncate text-xs text-muted-foreground sm:text-sm">
                    Thana
                  </Label>
                  <Select
                    value={thana}
                    onValueChange={setThana}
                    disabled={!districtOption}
                  >
                    <SelectTrigger className="h-11 min-w-0 px-2 text-xs sm:px-3 sm:text-sm">
                      <SelectValue placeholder="Select thana" />
                    </SelectTrigger>
                    <SelectContent>
                      {(districtOption?.thanas || []).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>
                  {locale === "bn" ? "Default language" : "Default language"}
                </Label>
                <Select
                  name="preferredLanguage"
                  defaultValue={user.preferredLanguage === "en" ? "en" : "bn"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bn">বাংলা</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit">
              {locale === "bn" ? "সেভ করুন" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "পাসওয়ার্ড পরিবর্তন" : "Change password"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Password (Minimum any 6 digit)
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordMessage ? (
              <Alert>
                <AlertDescription>{passwordMessage}</AlertDescription>
              </Alert>
            ) : null}
            {passwordError ? (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => {
                    setPasswordError(null);
                    setPasswordMessage(null);
                    setCurrentPassword(event.target.value);
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-profile-password">New password</Label>
                <Input
                  id="new-profile-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => {
                    setPasswordError(null);
                    setPasswordMessage(null);
                    setNewPassword(event.target.value);
                  }}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? "Changing password..." : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
