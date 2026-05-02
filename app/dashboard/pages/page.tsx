import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { saveRoshalPage } from "@/actions/admin";
import { CmsSaveToast } from "@/components/dashboard/cms-save-toast";
import { DashboardFormStatusToast } from "@/components/dashboard/dashboard-form-status-toast";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { RoshalPagesTable } from "@/components/dashboard/pages-table";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDashboardActionErrorMessage } from "@/lib/dashboard-action-errors";
import {
  dashboardDraftBoolean,
  dashboardDraftValue,
  readDashboardFormDraft,
} from "@/lib/dashboard-form-drafts";
import { isDashboardHandoffMarketingSlug } from "@/lib/dashboard-navigation";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalPages } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

const pageStatusOptions = [
  { value: "published", label: "published" },
  { value: "draft", label: "draft" },
];

export default async function DashboardPagesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    deleted?: string;
    error?: string;
    saved?: string;
    slug?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, pages] = await Promise.all([
    getRoshalLocale(),
    getRoshalPages(),
    requireRoshalAdmin(),
  ]);
  const errorMessage = getPageListErrorMessage(
    locale,
    resolvedSearchParams.error,
    resolvedSearchParams.slug,
  );
  const draftValues = resolvedSearchParams.error
    ? readDashboardFormDraft(await cookies(), "cms-page")
    : {};
  // Keep All Pages aligned with the simplified sidebar handoff pages.
  const visibleDashboardPages = pages.filter((page) =>
    isDashboardHandoffMarketingSlug(page.slug),
  );
  const publishedCount = visibleDashboardPages.filter(
    (page) => page.status === "published",
  ).length;
  const navigationCount = visibleDashboardPages.filter(
    (page) => page.showInNavigation,
  ).length;
  return (
    <div className="min-w-0 space-y-6 px-6 pt-6 pb-4">
      <DashboardFormStatusToast
        errorMessage={errorMessage || undefined}
        successMessage={
          resolvedSearchParams.deleted
            ? "Marketing page deleted successfully."
            : undefined
        }
      />
      <CmsSaveToast status={resolvedSearchParams.saved} />
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "মার্কেটিং পেজ" : "Marketing pages"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "কনটেন্ট ও লেআউট" : "Content and layout"}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <Button asChild className="shadow-sm">
          <Link href="#create-marketing-page">
            <Plus className="size-4" />
            {locale === "bn" ? "নতুন পেজ" : "New Page"}
          </Link>
        </Button>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {resolvedSearchParams.deleted ? (
        <Alert>
          <AlertDescription>
            Marketing page deleted successfully.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <DashboardMetricCard
          title={locale === "bn" ? "মোট পেজ" : "Total pages"}
          value={visibleDashboardPages.length}
          hint={`${publishedCount} published pages`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "প্রকাশিত" : "Published"}
          value={publishedCount}
          hint={`${visibleDashboardPages.length - publishedCount} draft pages`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "নেভিগেশনে" : "In navigation"}
          value={navigationCount}
          hint={`${visibleDashboardPages.length - navigationCount} hidden from navigation`}
        />
      </div>

      {/* Page status, navigation visibility, and homepage control center panels are intentionally hidden per client request. */}

      <Card id="create-marketing-page">
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "নতুন মার্কেটিং পেজ" : "Create marketing page"}
          </CardTitle>
        </CardHeader>
        <CardContent className="min-w-0">
          <Accordion type="single" collapsible>
            <AccordionItem value="create-page-form">
              <AccordionTrigger>
                {locale === "bn" ? "নতুন পেজ ফর্ম খুলুন" : "Open new page form"}
              </AccordionTrigger>
              <AccordionContent>
                <form
                  action={saveRoshalPage}
                  className="grid min-w-0 gap-5 md:grid-cols-2"
                >
                  <Field
                    name="slug"
                    label="Slug"
                    defaultValue={dashboardDraftValue(draftValues, "slug")}
                    placeholder="faq, wholesale, delivery-policy"
                    required
                  />
                  <Field
                    name="navigationLabelBn"
                    label="Navigation Label (BN)"
                    defaultValue={dashboardDraftValue(
                      draftValues,
                      "navigationLabelBn",
                    )}
                  />
                  <Field
                    name="navigationLabelEn"
                    label="Navigation Label (EN)"
                    defaultValue={dashboardDraftValue(
                      draftValues,
                      "navigationLabelEn",
                    )}
                  />
                  <Field
                    name="titleBn"
                    label="Title (BN)"
                    defaultValue={dashboardDraftValue(draftValues, "titleBn")}
                  />
                  <Field
                    name="titleEn"
                    label="Title (EN)"
                    defaultValue={dashboardDraftValue(draftValues, "titleEn")}
                  />
                  <div className="md:col-span-2">
                    <ImageUploadField
                      name="heroImage"
                      label={
                        locale === "bn"
                          ? "হিরো বা কভার ইমেজ"
                          : "Hero or cover image"
                      }
                      helperText={
                        locale === "bn"
                          ? "নতুন পেজের প্রধান image."
                          : "Main cover image for the new page."
                      }
                      value={dashboardDraftValue(draftValues, "heroImage")}
                      compact
                      previewClassName="w-full max-w-72"
                    />
                  </div>
                  <Accordion
                    type="multiple"
                    className="space-y-3 md:col-span-2"
                  >
                    <AccordionItem
                      value="new-page-advanced"
                      className="rounded-lg border border-border/70 px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <span className="min-w-0 text-left">
                          <span className="block font-semibold">
                            {locale === "bn"
                              ? "অ্যাডভান্সড পেজ সেটিংস"
                              : "Advanced page settings"}
                          </span>
                          <span className="block text-sm font-normal text-muted-foreground">
                            Status, long descriptions, navigation, and
                            reserved-slug guidance.
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent forceMount>
                        <div className="grid min-w-0 gap-5 pt-1 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <DashboardFormSelect
                              name="status"
                              defaultValue={dashboardDraftValue(
                                draftValues,
                                "status",
                                "draft",
                              )}
                              options={pageStatusOptions}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <TextField
                              name="descriptionBn"
                              label="Description (BN)"
                              defaultValue={dashboardDraftValue(
                                draftValues,
                                "descriptionBn",
                              )}
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <TextField
                              name="descriptionEn"
                              label="Description (EN)"
                              defaultValue={dashboardDraftValue(
                                draftValues,
                                "descriptionEn",
                              )}
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <DashboardFormCheckbox
                              name="showInNavigation"
                              defaultChecked={dashboardDraftBoolean(
                                draftValues,
                                "showInNavigation",
                                true,
                              )}
                              label={
                                locale === "bn"
                                  ? "স্টোরফ্রন্ট নেভিগেশনে দেখান"
                                  : "Show in storefront navigation"
                              }
                            />
                          </div>
                          <div className="md:col-span-2 rounded-xl border border-border/70 bg-muted/25 p-4 text-sm text-muted-foreground">
                            {locale === "bn"
                              ? "সিস্টেম রুট যেমন products, cart, checkout, orders, profile, login, dashboard, collections, payment-return ব্যবহার করবেন না। পেজ তৈরি হওয়ার পর সেটির সেকশন ও লেআউট `/dashboard/pages/[id]` থেকে সম্পাদনা করতে পারবেন।"
                              : "Avoid system slugs such as products, cart, checkout, orders, profile, login, dashboard, collections, and payment-return. After creation, you can edit the page sections and layout from `/dashboard/pages/[id]`."}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="md:col-span-2">
                    <Button type="submit">
                      {locale === "bn" ? "পেজ তৈরি করুন" : "Create page"}
                    </Button>
                  </div>
                </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <RoshalPagesTable pages={visibleDashboardPages} locale={locale} />
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  rows,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} rows={rows} />
    </div>
  );
}

function getPageListErrorMessage(
  locale: "bn" | "en",
  code: string | undefined,
  slug: string | undefined,
) {
  switch (code) {
    case "reserved-slug":
      return locale === "bn"
        ? `\`${slug || ""}\` স্লাগটি সিস্টেম রুটের সঙ্গে সংঘর্ষ করছে। অন্য একটি স্লাগ ব্যবহার করুন।`
        : `The slug \`${slug || ""}\` conflicts with a system route. Choose a different slug.`;
    case "duplicate-slug":
      return locale === "bn"
        ? `\`${slug || ""}\` স্লাগটি ইতিমধ্যেই অন্য একটি মার্কেটিং পেজে ব্যবহৃত হচ্ছে।`
        : `The slug \`${slug || ""}\` is already used by another marketing page.`;
    case "invalid-slug":
      return locale === "bn"
        ? "পেজ স্লাগে শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন ব্যবহার করুন।"
        : "Use only lowercase letters, numbers, and hyphens in page slugs.";
    default:
      return getDashboardActionErrorMessage(code) || null;
  }
}
