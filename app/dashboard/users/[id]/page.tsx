import { notFound } from "next/navigation";
import { saveRoshalUserProfile, saveRoshalUserRole } from "@/actions/admin";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput2 } from "@/components/ui/phone-input-2";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalUsers } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function DashboardUserDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }, locale, users, sessionUser] = await Promise.all([
    params,
    searchParams,
    getRoshalLocale(),
    getRoshalUsers(),
    requireRoshalAdmin(),
  ]);
  const user = users.find((item) => item.id === id);

  if (!user) {
    notFound();
  }

  return (
    <div className="grid min-w-0 gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0 space-y-6 xl:col-span-2">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>
              {getUserRoleErrorMessage(locale, error)}
            </AlertDescription>
          </Alert>
        ) : null}

        {sessionUser.id === user.id ? (
          <Alert>
            <AlertDescription>
              {locale === "bn"
                ? "নিজের অ্যাডমিন অ্যাক্সেস সম্পাদনা করার সময় সতর্ক থাকুন। এই পেজ এখন নিজের অ্যাডমিন রোল বা সক্রিয় অবস্থা সরাতে দেবে না।"
                : "Be careful when editing your own admin access. This page will not allow you to remove your own active admin role or deactivate yourself."}
            </AlertDescription>
          </Alert>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "প্রোফাইল তথ্য" : "Profile details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveRoshalUserProfile} className="space-y-5">
            <input type="hidden" name="id" value={user.id} />
            <input
              type="hidden"
              name="redirectTo"
              value={`/dashboard/users/${user.id}`}
            />
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <PhoneInput2
                id="phone"
                name="phone"
                defaultValue={user.phone || ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <DashboardFormSelect
                name="preferredLanguage"
                defaultValue={user.preferredLanguage === "en" ? "en" : "bn"}
                options={[
                  { value: "bn", label: "বাংলা" },
                  { value: "en", label: "English" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultAddress">Default Address</Label>
              <Textarea
                id="defaultAddress"
                name="defaultAddress"
                defaultValue={user.defaultAddress || ""}
                rows={4}
              />
            </div>
            <Button type="submit">
              {locale === "bn" ? "প্রোফাইল সেভ করুন" : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "রোল ও অ্যাক্সেস" : "Role and access"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveRoshalUserRole} className="space-y-5">
            <input type="hidden" name="id" value={user.id} />
            <input
              type="hidden"
              name="redirectTo"
              value={`/dashboard/users/${user.id}`}
            />
            <div className="space-y-2">
              <Label>Role</Label>
              <DashboardFormSelect
                name="role"
                defaultValue={user.role}
                options={[
                  { value: "user", label: "user" },
                  { value: "admin", label: "admin" },
                ]}
              />
            </div>
            <DashboardFormCheckbox
              name="isActive"
              defaultChecked={user.isActive}
              label={locale === "bn" ? "অ্যাকটিভ" : "Active"}
            />
            <Button type="submit" className="w-full">
              {locale === "bn" ? "অ্যাক্সেস আপডেট" : "Update access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function getUserRoleErrorMessage(locale: "bn" | "en", code: string) {
  switch (code) {
    case "self-admin-lockout":
      return locale === "bn"
        ? "নিজের সক্রিয় অ্যাডমিন অ্যাক্সেস সরানো যাবে না। অন্য একজন অ্যাডমিনকে আগে দায়িত্ব দিন।"
        : "You cannot remove your own active admin access. Assign another admin first.";
    case "last-admin-required":
      return locale === "bn"
        ? "কমপক্ষে একজন সক্রিয় অ্যাডমিন রাখতে হবে। শেষ অ্যাডমিনকে ডিমোট বা নিষ্ক্রিয় করা যাবে না।"
        : "At least one active admin must remain. The last admin cannot be demoted or deactivated.";
    case "user-not-found":
      return locale === "bn"
        ? "নির্বাচিত ব্যবহারকারীকে পাওয়া যায়নি।"
        : "The selected user could not be found.";
    default:
      return locale === "bn"
        ? "ব্যবহারকারীর অ্যাক্সেস আপডেট করা যায়নি। আবার চেষ্টা করুন।"
        : "The user access update could not be completed. Please try again.";
  }
}
