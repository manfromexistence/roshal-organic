import { hashPassword } from "@better-auth/utils/password";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/schema";
import {
  defaultRoshalPages,
  defaultRoshalPaymentSettings,
  defaultRoshalProducts,
  defaultRoshalSections,
  defaultRoshalSiteSettings,
} from "@/lib/store-defaults";
import {
  upsertRoshalPage,
  upsertRoshalPaymentSettings,
  upsertRoshalProduct,
  upsertRoshalSection,
  upsertRoshalSiteSettings,
} from "@/lib/store-mutations";

const seedUsers = [
  {
    email: "user@gmail.com",
    name: "Roshal User",
    role: "user",
    password: "password",
  },
  {
    email: "admin@gmail.com",
    name: "Roshal Admin",
    role: "admin",
    password: "password",
  },
];

async function seedUsersAndAccounts() {
  for (const user of seedUsers) {
    const passwordHash = await hashPassword(user.password);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1);

    let userId: string;
    if (existingUser.length === 0) {
      userId = nanoid();
      await db.insert(users).values({
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role,
        preferredLanguage: "bn",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created user: ${user.email} (${user.role})`);
    } else {
      userId = existingUser[0].id;
      await db
        .update(users)
        .set({
          name: user.name,
          role: user.role,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
      console.log(`Updated user: ${user.email}`);
    }

    const existingAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId))
      .limit(1);

    if (existingAccount.length === 0) {
      await db.insert(accounts).values({
        id: nanoid(),
        userId,
        providerId: "credential",
        accountId: user.email,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created account for: ${user.email}`);
    } else {
      await db
        .update(accounts)
        .set({
          password: passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(accounts.userId, userId));
      console.log(`Updated account for: ${user.email}`);
    }
  }
}

async function seedRoshalContent() {
  await upsertRoshalSiteSettings({
    id: defaultRoshalSiteSettings.id,
    brandName: defaultRoshalSiteSettings.brandName,
    taglineBn: defaultRoshalSiteSettings.tagline.bn,
    taglineEn: defaultRoshalSiteSettings.tagline.en,
    contactPhone: defaultRoshalSiteSettings.contactPhone,
    contactEmail: defaultRoshalSiteSettings.contactEmail,
    whatsappPhone: defaultRoshalSiteSettings.whatsappPhone,
    addressBn: defaultRoshalSiteSettings.address.bn,
    addressEn: defaultRoshalSiteSettings.address.en,
    heroLayout: defaultRoshalSiteSettings.heroLayout,
    cardStyle: defaultRoshalSiteSettings.cardStyle,
    sectionSpacing: defaultRoshalSiteSettings.sectionSpacing,
    primaryCtaHref: defaultRoshalSiteSettings.primaryCtaHref,
    primaryCtaLabelBn: defaultRoshalSiteSettings.primaryCtaLabel.bn,
    primaryCtaLabelEn: defaultRoshalSiteSettings.primaryCtaLabel.en,
    deliveryZones: defaultRoshalSiteSettings.deliveryZones,
    deliverySettings: defaultRoshalSiteSettings.deliverySettings,
  });

  await upsertRoshalPaymentSettings({
    id: defaultRoshalPaymentSettings.id,
    manualReviewNoticeBn: defaultRoshalPaymentSettings.manualReviewNotice.bn,
    manualReviewNoticeEn: defaultRoshalPaymentSettings.manualReviewNotice.en,
    supportMessageBn: defaultRoshalPaymentSettings.supportMessage.bn,
    supportMessageEn: defaultRoshalPaymentSettings.supportMessage.en,
    options: defaultRoshalPaymentSettings.options,
  });

  for (const page of defaultRoshalPages) {
    await upsertRoshalPage({
      id: page.id,
      slug: page.slug,
      navigationLabelBn: page.navigationLabel.bn,
      navigationLabelEn: page.navigationLabel.en,
      titleBn: page.title.bn,
      titleEn: page.title.en,
      descriptionBn: page.description.bn,
      descriptionEn: page.description.en,
      heroImage: page.heroImage,
      status: page.status,
      showInNavigation: page.showInNavigation,
    });
  }

  for (const section of defaultRoshalSections) {
    await upsertRoshalSection({
      id: section.id,
      pageId: section.pageId,
      sectionKey: section.sectionKey,
      type: section.type,
      sortOrder: section.sortOrder,
      layout: section.layout,
      variant: section.variant,
      isEnabled: section.isEnabled,
      eyebrowBn: section.eyebrow.bn,
      eyebrowEn: section.eyebrow.en,
      titleBn: section.title.bn,
      titleEn: section.title.en,
      bodyBn: section.body.bn,
      bodyEn: section.body.en,
      ctaLabelBn: section.ctaLabel.bn,
      ctaLabelEn: section.ctaLabel.en,
      ctaHref: section.ctaHref,
      imageUrl: section.imageUrl,
      itemsJson: JSON.stringify(section.items),
      stylesJson: JSON.stringify(section.styles),
    });
  }

  for (const product of defaultRoshalProducts) {
    await upsertRoshalProduct({
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      nameBn: product.name.bn,
      nameEn: product.name.en,
      summaryBn: product.summary.bn,
      summaryEn: product.summary.en,
      descriptionBn: product.description.bn,
      descriptionEn: product.description.en,
      categoryKey: product.categoryKey,
      categoryLabelBn: product.categoryLabel.bn,
      categoryLabelEn: product.categoryLabel.en,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      inventory: product.inventory,
      badge: product.badge,
      heroImage: product.heroImage,
      galleryJson: JSON.stringify(product.gallery),
      featuresBnJson: JSON.stringify(product.features.map((item) => item.bn)),
      featuresEnJson: JSON.stringify(product.features.map((item) => item.en)),
      isFeatured: product.isFeatured,
      isPublished: product.isPublished,
      sortOrder: product.sortOrder,
    });
  }
}

async function seed() {
  console.log("Seeding Roshal Organic users and storefront content...");
  await seedUsersAndAccounts();
  await seedRoshalContent();
  console.log("Roshal Organic seed completed.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
