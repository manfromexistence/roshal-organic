import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { roshalProductReviews } from "@/lib/schema";
import { ensureRoshalProductReviewSchema } from "@/lib/store-product-review-schema";
import type {
  RoshalProductReview,
  RoshalProductReviewBundle,
} from "@/lib/store-types";

const EMPTY_REVIEW_BUNDLE: RoshalProductReviewBundle = {
  averageRating: 0,
  reviewCount: 0,
  ratingsBreakdown: [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: 0,
    percentage: 0,
  })),
  reviews: [],
};

export class RoshalProductReviewError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = "RoshalProductReviewError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function nextReviewId() {
  return `product-review-${crypto.randomUUID()}`;
}

function mapReview(
  row: typeof roshalProductReviews.$inferSelect,
): RoshalProductReview {
  return {
    id: row.id,
    productId: row.productId,
    userId: row.userId || null,
    reviewerName: row.reviewerName,
    reviewerEmail: row.reviewerEmail || "",
    rating: row.rating,
    comment: row.comment,
    isPublished: Boolean(row.isPublished),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function buildReviewBundle(
  reviews: RoshalProductReview[],
): RoshalProductReviewBundle {
  if (reviews.length === 0) {
    return EMPTY_REVIEW_BUNDLE;
  }

  const ratingsMap = new Map<number, number>(
    [5, 4, 3, 2, 1].map((rating) => [rating, 0]),
  );
  let ratingTotal = 0;

  for (const review of reviews) {
    ratingTotal += review.rating;
    ratingsMap.set(review.rating, (ratingsMap.get(review.rating) || 0) + 1);
  }

  return {
    averageRating: Number((ratingTotal / reviews.length).toFixed(1)),
    reviewCount: reviews.length,
    ratingsBreakdown: [5, 4, 3, 2, 1].map((rating) => {
      const count = ratingsMap.get(rating) || 0;

      return {
        rating,
        count,
        percentage:
          reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0,
      };
    }),
    reviews,
  };
}

export async function getRoshalProductReviewBundle(
  productId: string,
): Promise<RoshalProductReviewBundle> {
  await ensureRoshalProductReviewSchema();

  try {
    const rows = await db
      .select()
      .from(roshalProductReviews)
      .where(
        and(
          eq(roshalProductReviews.productId, productId),
          eq(roshalProductReviews.isPublished, true),
        ),
      )
      .orderBy(desc(roshalProductReviews.createdAt));

    return buildReviewBundle(rows.map(mapReview));
  } catch {
    return EMPTY_REVIEW_BUNDLE;
  }
}

export async function getRoshalProductReviews(): Promise<
  RoshalProductReview[]
> {
  await ensureRoshalProductReviewSchema();

  try {
    const rows = await db
      .select()
      .from(roshalProductReviews)
      .orderBy(desc(roshalProductReviews.createdAt));

    return rows.map(mapReview);
  } catch {
    return [];
  }
}

export async function getPublishedRoshalProductReviews(limitCount = 6) {
  await ensureRoshalProductReviewSchema();

  try {
    const rows = await db
      .select()
      .from(roshalProductReviews)
      .where(eq(roshalProductReviews.isPublished, true))
      .orderBy(desc(roshalProductReviews.createdAt))
      .limit(Math.max(1, limitCount));

    return rows.map(mapReview);
  } catch {
    return [];
  }
}

export async function getRoshalProductReviewSummaries(productIds: string[]) {
  await ensureRoshalProductReviewSchema();

  const uniqueProductIds = Array.from(new Set(productIds.filter(Boolean)));
  if (uniqueProductIds.length === 0) {
    return new Map<
      string,
      Pick<RoshalProductReviewBundle, "averageRating" | "reviewCount">
    >();
  }

  try {
    const rows = await db
      .select()
      .from(roshalProductReviews)
      .where(
        and(
          inArray(roshalProductReviews.productId, uniqueProductIds),
          eq(roshalProductReviews.isPublished, true),
        ),
      );
    const reviewsByProduct = new Map<string, RoshalProductReview[]>();

    for (const row of rows) {
      const review = mapReview(row);
      const productReviews = reviewsByProduct.get(review.productId) || [];
      productReviews.push(review);
      reviewsByProduct.set(review.productId, productReviews);
    }

    return new Map(
      uniqueProductIds.map((productId) => {
        const bundle = buildReviewBundle(reviewsByProduct.get(productId) || []);
        return [
          productId,
          {
            averageRating: bundle.averageRating,
            reviewCount: bundle.reviewCount,
          },
        ] as const;
      }),
    );
  } catch {
    return new Map<
      string,
      Pick<RoshalProductReviewBundle, "averageRating" | "reviewCount">
    >();
  }
}

export async function createRoshalProductReview(input: {
  productId: string;
  userId?: string | null;
  reviewerName: string;
  reviewerEmail?: string | null;
  rating: number;
  comment: string;
  isPublished?: boolean;
}) {
  await ensureRoshalProductReviewSchema();

  const rating = Math.trunc(input.rating);
  const comment = input.comment.trim();
  const reviewerName = input.reviewerName.trim();

  if (rating < 1 || rating > 5) {
    throw new RoshalProductReviewError(
      "invalid-review-rating",
      "Ratings must be between 1 and 5.",
    );
  }

  if (comment.length < 4) {
    throw new RoshalProductReviewError(
      "invalid-review-comment",
      "Please write at least a short review before submitting.",
    );
  }

  if (!reviewerName) {
    throw new RoshalProductReviewError(
      "invalid-reviewer",
      "Reviewer details are missing.",
    );
  }

  const timestamp = new Date();
  const id = nextReviewId();

  await db.insert(roshalProductReviews).values({
    id,
    productId: input.productId,
    userId: input.userId || null,
    reviewerName,
    reviewerEmail: input.reviewerEmail?.trim() || null,
    rating,
    comment,
    isPublished: input.isPublished !== false,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const [createdReview] = await db
    .select()
    .from(roshalProductReviews)
    .where(eq(roshalProductReviews.id, id))
    .limit(1);

  return createdReview ? mapReview(createdReview) : null;
}

export async function updateRoshalProductReviewPublication(
  id: string,
  isPublished: boolean,
) {
  await ensureRoshalProductReviewSchema();

  const reviewId = id.trim();
  if (!reviewId) {
    throw new RoshalProductReviewError(
      "invalid-review",
      "Review details are missing.",
    );
  }

  await db
    .update(roshalProductReviews)
    .set({
      isPublished,
      updatedAt: new Date(),
    })
    .where(eq(roshalProductReviews.id, reviewId));
}

export async function deleteRoshalProductReview(id: string) {
  await ensureRoshalProductReviewSchema();

  const reviewId = id.trim();
  if (!reviewId) {
    throw new RoshalProductReviewError(
      "invalid-review",
      "Review details are missing.",
    );
  }

  await db
    .delete(roshalProductReviews)
    .where(eq(roshalProductReviews.id, reviewId));
}
