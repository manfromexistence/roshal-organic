import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { roshalPages, roshalSections } from "@/lib/schema";
import {
  defaultRoshalPages,
  defaultRoshalSections,
} from "@/lib/store-defaults";

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
    let [section] = await db
      .select({
        id: roshalSections.id,
        pageId: roshalSections.pageId,
        sectionKey: roshalSections.sectionKey,
      })
      .from(roshalSections)
      .where(eq(roshalSections.id, id))
      .limit(1);

    if (!section) {
      const defaultSection = defaultRoshalSections.find(
        (item) => item.id === id,
      );

      if (!defaultSection) {
        return NextResponse.json(
          { error: "Section not found" },
          { status: 404 },
        );
      }

      const defaultPage = defaultRoshalPages.find(
        (pageItem) => pageItem.id === defaultSection.pageId,
      );

      if (!defaultPage) {
        return NextResponse.json(
          { error: "Section page not found" },
          { status: 404 },
        );
      }

      let [page] = await db
        .select({
          id: roshalPages.id,
          slug: roshalPages.slug,
        })
        .from(roshalPages)
        .where(eq(roshalPages.id, defaultPage.id))
        .limit(1);

      if (!page) {
        [page] = await db
          .select({
            id: roshalPages.id,
            slug: roshalPages.slug,
          })
          .from(roshalPages)
          .where(eq(roshalPages.slug, defaultPage.slug))
          .limit(1);
      }

      if (!page) {
        const timestamp = new Date();

        await db.insert(roshalPages).values({
          id: defaultPage.id,
          slug: defaultPage.slug,
          navigationLabelBn: defaultPage.navigationLabel.bn,
          navigationLabelEn: defaultPage.navigationLabel.en,
          titleBn: defaultPage.title.bn,
          titleEn: defaultPage.title.en,
          descriptionBn: defaultPage.description.bn,
          descriptionEn: defaultPage.description.en,
          heroImage: defaultPage.heroImage,
          status: defaultPage.status,
          showInNavigation: defaultPage.showInNavigation,
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        page = {
          id: defaultPage.id,
          slug: defaultPage.slug,
        };
      }

      const timestamp = new Date();

      await db
        .insert(roshalSections)
        .values({
          id: defaultSection.id,
          pageId: page.id,
          sectionKey: defaultSection.sectionKey,
          type: defaultSection.type,
          sortOrder: defaultSection.sortOrder,
          layout: defaultSection.layout,
          variant: defaultSection.variant,
          isEnabled: body.isEnabled,
          eyebrowBn: defaultSection.eyebrow.bn,
          eyebrowEn: defaultSection.eyebrow.en,
          titleBn: defaultSection.title.bn,
          titleEn: defaultSection.title.en,
          bodyBn: defaultSection.body.bn,
          bodyEn: defaultSection.body.en,
          ctaLabelBn: defaultSection.ctaLabel.bn,
          ctaLabelEn: defaultSection.ctaLabel.en,
          ctaHref: defaultSection.ctaHref,
          imageUrl: defaultSection.imageUrl,
          itemsJson: JSON.stringify(defaultSection.items),
          stylesJson: JSON.stringify(defaultSection.styles),
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        .onConflictDoUpdate({
          target: roshalSections.id,
          set: {
            isEnabled: body.isEnabled,
            updatedAt: timestamp,
          },
        });

      section = {
        id: defaultSection.id,
        pageId: page.id,
        sectionKey: defaultSection.sectionKey,
      };
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
      .where(eq(roshalSections.id, section.id));

    if (page) {
      revalidatePath(storefrontPathFromSlug(page.slug));
      revalidatePath(`/dashboard/pages/${page.id}`);
    }

    revalidatePath("/dashboard/pages");
    revalidatePath("/dashboard/marketing");

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
