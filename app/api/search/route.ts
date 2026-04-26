import { desc, like, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roshalOrders, roshalPages, roshalProducts, users } from "@/lib/schema";
import { getRoshalSessionUser } from "@/lib/store-auth";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  category: "product" | "order" | "user" | "marketing-page";
  href: string;
  meta: string;
};

export async function GET(request: Request) {
  const sessionUser = await getRoshalSessionUser();

  if (!sessionUser?.id || sessionUser.role !== "admin") {
    return NextResponse.json(
      { results: [] satisfies SearchResult[] },
      { status: 401 },
    );
  }

  const query = new URL(request.url).searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ results: [] satisfies SearchResult[] });
  }

  const wildcardQuery = `%${query}%`;

  try {
    const [productRows, orderRows, userRows, pageRows] = await Promise.all([
      db
        .select({
          id: roshalProducts.id,
          nameEn: roshalProducts.nameEn,
          sku: roshalProducts.sku,
          categoryLabelEn: roshalProducts.categoryLabelEn,
          inventory: roshalProducts.inventory,
          isPublished: roshalProducts.isPublished,
        })
        .from(roshalProducts)
        .where(
          or(
            like(roshalProducts.nameEn, wildcardQuery),
            like(roshalProducts.nameBn, wildcardQuery),
            like(roshalProducts.sku, wildcardQuery),
            like(roshalProducts.slug, wildcardQuery),
            like(roshalProducts.categoryLabelEn, wildcardQuery),
            like(roshalProducts.categoryLabelBn, wildcardQuery),
          ),
        )
        .orderBy(desc(roshalProducts.updatedAt))
        .limit(8),
      db
        .select({
          id: roshalOrders.id,
          orderNumber: roshalOrders.orderNumber,
          customerName: roshalOrders.customerName,
          paymentMethod: roshalOrders.paymentMethod,
          status: roshalOrders.status,
          total: roshalOrders.total,
        })
        .from(roshalOrders)
        .where(
          or(
            like(roshalOrders.orderNumber, wildcardQuery),
            like(roshalOrders.customerName, wildcardQuery),
            like(roshalOrders.phone, wildcardQuery),
            like(roshalOrders.email, wildcardQuery),
            like(roshalOrders.status, wildcardQuery),
          ),
        )
        .orderBy(desc(roshalOrders.updatedAt))
        .limit(8),
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          phone: users.phone,
          isActive: users.isActive,
        })
        .from(users)
        .where(
          or(
            like(users.name, wildcardQuery),
            like(users.email, wildcardQuery),
            like(users.role, wildcardQuery),
            like(users.phone, wildcardQuery),
          ),
        )
        .orderBy(desc(users.updatedAt))
        .limit(8),
      db
        .select({
          id: roshalPages.id,
          slug: roshalPages.slug,
          titleEn: roshalPages.titleEn,
          navigationLabelEn: roshalPages.navigationLabelEn,
          status: roshalPages.status,
        })
        .from(roshalPages)
        .where(
          or(
            like(roshalPages.slug, wildcardQuery),
            like(roshalPages.titleEn, wildcardQuery),
            like(roshalPages.titleBn, wildcardQuery),
            like(roshalPages.navigationLabelEn, wildcardQuery),
            like(roshalPages.navigationLabelBn, wildcardQuery),
          ),
        )
        .orderBy(desc(roshalPages.updatedAt))
        .limit(8),
    ]);

    const results: SearchResult[] = [
      ...productRows.map((product) => ({
        id: product.id,
        title: product.nameEn,
        subtitle: product.sku,
        category: "product" as const,
        href: `/dashboard/products/${product.id}`,
        meta: [
          product.categoryLabelEn,
          product.isPublished ? "Published" : "Draft",
          `Stock ${product.inventory}`,
        ]
          .filter(Boolean)
          .join(" | "),
      })),
      ...orderRows.map((order) => ({
        id: order.id,
        title: order.orderNumber,
        subtitle: order.customerName,
        category: "order" as const,
        href: `/dashboard/orders/${order.id}`,
        meta: [order.status, order.paymentMethod, `BDT ${order.total}`]
          .filter(Boolean)
          .join(" | "),
      })),
      ...userRows.map((user) => ({
        id: user.id,
        title: user.name,
        subtitle: user.email,
        category: "user" as const,
        href: `/dashboard/users/${user.id}`,
        meta: [
          user.role === "admin" ? "Admin" : "User",
          user.isActive ? "Active" : "Inactive",
          user.phone || "",
        ]
          .filter(Boolean)
          .join(" | "),
      })),
      ...pageRows.map((page) => ({
        id: page.id,
        title: page.titleEn,
        subtitle: `/${page.slug}`,
        category: "marketing-page" as const,
        href: `/dashboard/pages/${page.id}`,
        meta: [page.navigationLabelEn, page.status].filter(Boolean).join(" | "),
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error searching dashboard workspace:", error);
    return NextResponse.json({ results: [] satisfies SearchResult[] });
  }
}
