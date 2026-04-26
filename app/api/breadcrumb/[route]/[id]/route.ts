import { type NextRequest, NextResponse } from "next/server";
import { getBreadcrumbTitle } from "@/lib/breadcrumb-mapping";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ route: string; id: string }> },
) {
  const { route, id } = await params;

  const title = await getBreadcrumbTitle(route, id);

  if (!title) {
    return NextResponse.json({ title: null }, { status: 404 });
  }

  return NextResponse.json({ title });
}
