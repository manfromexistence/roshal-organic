import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

const passwordResetRequestSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  redirectTo: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const parsed = passwordResetRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please enter a valid account email address." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!existingUser.length) {
    return NextResponse.json(
      { message: "No account found with this email address." },
      { status: 404 },
    );
  }

  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: parsed.data.redirectTo || "/reset-password",
    },
  });

  return NextResponse.json({
    message: "Password reset link has been sent to your email.",
  });
}
