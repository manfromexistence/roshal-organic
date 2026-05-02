import Link from "next/link";
import { saveRoshalUserProfile } from "@/actions/admin";
import { LogoutButton } from "@/components/storefront/logout-button";
import { ProfileSettingsForm } from "@/components/storefront/profile-settings-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRoshalUser } from "@/lib/store-auth";
import { getRoshalOrdersForUser } from "@/lib/store-content";
import { formatBdt, formatOrderDate } from "@/lib/store-format";
import { getRoshalLocale } from "@/lib/store-i18n";
import {
  getRoshalOrderStatusBadgeVariant,
  getRoshalOrderStatusLabel,
} from "@/lib/store-orders";

const profileErrorMessages: Record<string, string> = {
  "duplicate-email": "Another user already uses this email address.",
  "invalid-email": "Please enter a valid email address.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, sessionUser] = await Promise.all([
    getRoshalLocale(),
    requireRoshalUser(),
  ]);
  const orders = await getRoshalOrdersForUser(sessionUser.id);
  const openOrders = orders.filter((order) =>
    [
      "pending",
      "payment-review",
      "confirmed",
      "processing",
      "shipped",
    ].includes(order.status),
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;
  const totalSpent = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "প্রোফাইল" : "Profile"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {locale === "bn" ? "আমার তথ্য" : "My information"}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title={locale === "bn" ? "মোট অর্ডার" : "Orders"}
          value={String(orders.length)}
        />
        <MetricCard
          title={locale === "bn" ? "চলমান অর্ডার" : "Open orders"}
          value={String(openOrders)}
        />
        <MetricCard
          title={locale === "bn" ? "পরিশোধিত মোট" : "Paid total"}
          value={formatBdt(totalSpent, locale)}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>
              {locale === "bn" ? "অ্যাকাউন্ট ও অর্ডার" : "Account and orders"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === "bn"
                ? `ডেলিভার হয়েছে ${deliveredOrders}টি অর্ডার।`
                : `${deliveredOrders} orders have been delivered.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/orders">
                {locale === "bn" ? "অর্ডার ইতিহাস" : "Order history"}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cart">{locale === "bn" ? "কার্ট" : "Cart"}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/favorites">
                {locale === "bn" ? "পছন্দের তালিকা" : "Favorites"}
              </Link>
            </Button>
            {sessionUser.role === "admin" ? (
              <Button asChild>
                <Link href="/dashboard">
                  {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                </Link>
              </Button>
            ) : null}
            <LogoutButton locale={locale} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
              {locale === "bn"
                ? "এখনও কোনো অর্ডার করা হয়নি।"
                : "No orders have been placed yet."}
            </div>
          ) : (
            orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatOrderDate(order.createdAt, locale)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={getRoshalOrderStatusBadgeVariant(order.status)}
                  >
                    {locale === "bn"
                      ? getRoshalOrderStatusLabel(order.status).bn
                      : getRoshalOrderStatusLabel(order.status).en}
                  </Badge>
                  <p className="min-w-28 text-sm font-medium sm:text-right">
                    {formatBdt(order.total, locale)}
                  </p>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/orders/${order.id}`}>
                      {locale === "bn" ? "ট্র্যাক" : "Track"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ProfileSettingsForm
        action={saveRoshalUserProfile}
        error={
          resolvedSearchParams.error
            ? profileErrorMessages[resolvedSearchParams.error] ||
              "Could not save profile. Please try again."
            : undefined
        }
        locale={locale}
        saved={resolvedSearchParams.saved === "1"}
        user={{
          defaultAddress: sessionUser.defaultAddress || "",
          email: sessionUser.email,
          id: sessionUser.id,
          name: sessionUser.name,
          phone: sessionUser.phone || "",
          preferredLanguage: sessionUser.preferredLanguage || "bn",
        }}
      />
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
