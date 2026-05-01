import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/handle-error";
import { getRoshalProductBySlug } from "@/lib/store-content";
import {
  createRoshalProductReview,
  getRoshalProductReviewBundle,
  RoshalProductReviewError,
} from "@/lib/store-product-reviews";

const productReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(4).max(1000),
});

async function getPublishedProduct(slug: string) {
  const product = await getRoshalProductBySlug(slug);
  return product?.isPublished ? product : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found", code: "product-not-found" },
      { status: 404 },
    );
  }

  const summary = await getRoshalProductReviewBundle(product.id);
  return NextResponse.json(summary);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found", code: "product-not-found" },
      { status: 404 },
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    const body = await request.json();
    const parsed = productReviewSchema.parse(body);
    const reviewerName = session?.user?.name?.trim() || "Guest customer";
    const reviewerEmail = session?.user?.email?.trim() || null;

    const review = await createRoshalProductReview({
      productId: product.id,
      userId: session?.user?.id || null,
      reviewerName,
      reviewerEmail,
      rating: parsed.rating,
      comment: parsed.comment,
    });

    const summary = await getRoshalProductReviewBundle(product.id);
    revalidatePath(`/products/${product.slug}`);

    return NextResponse.json({
      review,
      summary,
    });
  } catch (error) {
    if (error instanceof RoshalProductReviewError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: getErrorMessage(error),
          code: "invalid-review-request",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Could not submit the review", code: "review-unavailable" },
      { status: 500 },
    );
  }
}
