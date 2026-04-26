import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/schema";

// Simple password hash function
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// GET all users
export async function GET() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

// POST create user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role, password } = body;

    if (!email || !name || !role || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = nanoid();

    const newUser = await db
      .insert(users)
      .values({
        id: userId,
        email,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await db.insert(accounts).values({
      id: nanoid(),
      userId,
      providerId: "local",
      accountId: email,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(newUser[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}

// PUT update user
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, email, name, role, password } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const updateData: any = {
      email,
      name,
      role,
      updatedAt: new Date(),
    };

    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

// DELETE user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
