import { saveRoshalProductReview } from "@/actions/admin";
import { CmsSaveToast } from "@/components/dashboard/cms-save-toast";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import {
  type ReviewRow,
  RoshalReviewsTable,
} from "@/components/dashboard/reviews-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getAllRoshalProducts } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";
import { getRoshalProductReviews } from "@/lib/store-product-reviews";

const ratingOptions = [5, 4, 3, 2, 1].map((rating) => ({
  value: String(rating),
  label: `${rating} star${rating === 1 ? "" : "s"}`,
}));

const reviewErrorMessages: Record<string, string> = {
  "invalid-review-rating": "Choose a rating between 1 and 5.",
  "invalid-review-comment": "Write a short review before saving.",
  "invalid-reviewer": "Reviewer name is required.",
  "invalid-review": "The selected review could not be found.",
};

function formatReviewDate(date: Date, locale: "bn" | "en") {
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function DashboardReviewsPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, products, reviews] = await Promise.all([
    getRoshalLocale(),
    getAllRoshalProducts(),
    getRoshalProductReviews(),
    requireRoshalAdmin(),
  ]);
  const language = locale === "bn" ? "bn" : "en";
  const productNameById = new Map(
    products.map((product) => [
      product.id,
      getLocalizedValue(language, product.name),
    ]),
  );
  const productOptions = products.map((product) => ({
    value: product.id,
    label: getLocalizedValue(language, product.name),
  }));
  const rows: ReviewRow[] = reviews
    .map((review) => ({
      id: review.id,
      productId: review.productId,
      productName: productNameById.get(review.productId) || "Unknown product",
      reviewerName: review.reviewerName,
      reviewerEmail: review.reviewerEmail,
      rating: review.rating,
      comment: review.comment,
      status: review.isPublished ? ("published" as const) : ("hidden" as const),
      createdAt: formatReviewDate(review.createdAt, language),
      createdAtValue: review.createdAt.getTime(),
    }))
    .sort((left, right) => right.createdAtValue - left.createdAtValue);
  const publishedCount = rows.filter(
    (row) => row.status === "published",
  ).length;
  const hiddenCount = rows.length - publishedCount;
  const averageRating =
    rows.length > 0
      ? Number(
          (
            rows.reduce((total, row) => total + row.rating, 0) / rows.length
          ).toFixed(1),
        )
      : 0;
  const errorMessage = resolvedSearchParams.error
    ? reviewErrorMessages[resolvedSearchParams.error] ||
      "The review action could not be completed."
    : "";

  return (
    <div className="min-w-0 space-y-6 px-6 pt-6 pb-4">
      <CmsSaveToast status={resolvedSearchParams.saved} />

      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "রিভিউ" : "Reviews"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {locale === "bn" ? "প্রোডাক্ট রিভিউ" : "Product reviews"}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {locale === "bn"
              ? "গ্রাহকের রেটিং ও মন্তব্য পাবলিশ, হাইড বা ডিলিট করুন।"
              : "Manage real customer ratings and comments for storefront products."}
          </p>
        </div>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardMetricCard
          title={locale === "bn" ? "মোট রিভিউ" : "Total reviews"}
          value={rows.length}
          hint={`${publishedCount} published`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "পাবলিশড" : "Published"}
          value={publishedCount}
          hint="Visible on product pages"
        />
        <DashboardMetricCard
          title={locale === "bn" ? "হিডেন" : "Hidden"}
          value={hiddenCount}
          hint="Not visible to customers"
        />
        <DashboardMetricCard
          title={locale === "bn" ? "গড় রেটিং" : "Average rating"}
          value={averageRating ? `${averageRating}/5` : "0/5"}
          hint="From saved reviews"
        />
      </div>

      <Card className="min-w-0 border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">
            {locale === "bn" ? "নতুন রিভিউ যোগ করুন" : "Add review"}
          </CardTitle>
        </CardHeader>
        <CardContent className="min-w-0">
          {productOptions.length > 0 ? (
            <form
              action={saveRoshalProductReview}
              className="grid min-w-0 gap-4 md:grid-cols-2"
            >
              <div className="space-y-2">
                <Label>Product</Label>
                <DashboardFormSelect
                  name="productId"
                  defaultValue={productOptions[0]?.value || ""}
                  options={productOptions}
                />
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <DashboardFormSelect
                  name="rating"
                  defaultValue="5"
                  options={ratingOptions}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewerName">Customer name</Label>
                <Input
                  id="reviewerName"
                  name="reviewerName"
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewerEmail">Email optional</Label>
                <Input
                  id="reviewerEmail"
                  name="reviewerEmail"
                  type="email"
                  placeholder="customer@example.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comment">Review</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  placeholder="Write the customer feedback here."
                  required
                  rows={3}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
                <DashboardFormCheckbox
                  name="isPublished"
                  defaultChecked
                  label="Publish on storefront"
                />
                <Button type="submit">
                  {locale === "bn" ? "রিভিউ সেভ করুন" : "Save review"}
                </Button>
              </div>
            </form>
          ) : (
            <Alert>
              <AlertDescription>
                Add a product first, then reviews can be attached to it.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <RoshalReviewsTable rows={rows} locale={locale} />
    </div>
  );
}
