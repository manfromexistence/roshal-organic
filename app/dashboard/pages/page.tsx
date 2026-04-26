import { saveRoshalPage } from "@/actions/roshal-admin";
import { DashboardFormCheckbox } from "@/components/roshal/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/roshal/dashboard/form-select";
import { HomepageControlCenter } from "@/components/roshal/dashboard/homepage-control-center";
import { RoshalPagesTable } from "@/components/roshal/dashboard/pages-table";
import { ImageUploadField } from "@/components/roshal/shared/image-upload-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/roshal/auth";
import { getRoshalPages } from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";

const pageStatusOptions = [
  { value: "published", label: "published" },
  { value: "draft", label: "draft" },
];

export default async function DashboardPagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; slug?: string }>;
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

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "মার্কেটিং পেজ" : "Marketing pages"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {locale === "bn" ? "কনটেন্ট ও লেআউট" : "Content and layout"}
        </h1>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <HomepageControlCenter locale={locale} />

      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "নতুন মার্কেটিং পেজ" : "Create marketing page"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveRoshalPage} className="grid gap-5 md:grid-cols-2">
            <Field
              name="slug"
              label="Slug"
              defaultValue=""
              placeholder="faq, wholesale, delivery-policy"
            />
            <div className="space-y-2">
              <Label>Status</Label>
              <DashboardFormSelect
                name="status"
                defaultValue="draft"
                options={pageStatusOptions}
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploadField
                name="heroImage"
                label={
                  locale === "bn" ? "হিরো বা কভার ইমেজ" : "Hero or cover image"
                }
                helperText={
                  locale === "bn"
                    ? "নতুন পেজে hero/story সেকশন না থাকলে এই ইমেজটি উপরের কভার হিসেবে ব্যবহৃত হবে।"
                    : "This image will be used as the top cover when the page has no hero/story section yet."
                }
                value=""
              />
            </div>
            <Field
              name="navigationLabelBn"
              label="Navigation Label (BN)"
              defaultValue=""
            />
            <Field
              name="navigationLabelEn"
              label="Navigation Label (EN)"
              defaultValue=""
            />
            <Field name="titleBn" label="Title (BN)" defaultValue="" />
            <Field name="titleEn" label="Title (EN)" defaultValue="" />
            <div className="md:col-span-2">
              <TextField
                name="descriptionBn"
                label="Description (BN)"
                defaultValue=""
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <TextField
                name="descriptionEn"
                label="Description (EN)"
                defaultValue=""
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <DashboardFormCheckbox
                name="showInNavigation"
                defaultChecked
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
            <div className="md:col-span-2">
              <Button type="submit">
                {locale === "bn" ? "পেজ তৈরি করুন" : "Create page"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <RoshalPagesTable pages={pages} locale={locale} />
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
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
      return null;
  }
}
