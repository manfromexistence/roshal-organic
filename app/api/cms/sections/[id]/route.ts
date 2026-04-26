import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { roshalPages, roshalSections } from "@/lib/schema";

const sectionToggleSchema = z.object({
  isEnabled: z.boolean(),
});

function storefrontPathFromSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    const body = sectionToggleSchema.parse(await request.json());
    const [section] = await db
      .select({
        id: roshalSections.id,
        pageId: roshalSections.pageId,
        sectionKey: roshalSections.sectionKey,
      })
      .from(roshalSections)
      .where(eq(roshalSections.id, id))
      .limit(1);

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const [page] = await db
      .select({
        id: roshalPages.id,
        slug: roshalPages.slug,
      })
      .from(roshalPages)
      .where(eq(roshalPages.id, section.pageId))
      .limit(1);

    await db
      .update(roshalSections)
      .set({
        isEnabled: body.isEnabled,
        updatedAt: new Date(),
      })
      .where(eq(roshalSections.id, id));

    if (page) {
      revalidatePath(storefrontPathFromSlug(page.slug));
      revalidatePath(`/dashboard/pages/${page.id}`);
    }

    revalidatePath("/dashboard/pages");

    return NextResponse.json({
      ok: true,
      section: {
        id: section.id,
        sectionKey: section.sectionKey,
        isEnabled: body.isEnabled,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid section update request" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Could not update section state" },
      { status: 500 },
    );
  }
}
