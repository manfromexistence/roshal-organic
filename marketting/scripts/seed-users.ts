import { hashPassword } from "@better-auth/utils/password";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/schema";

const seedUsers = [
  {
    email: "user@gmail.com",
    name: "Demo User",
    role: "user",
    password: "password",
  },
  {
    email: "admin@gmail.com",
    name: "Demo Admin",
    role: "admin",
    password: "password",
  },
  {
    email: "client@gmail.com",
    name: "Demo Client",
    role: "client",
    password: "password",
  },
  {
    email: "pmc@gmail.com",
    name: "Demo PMC",
    role: "pmc",
    password: "password",
  },
  {
    email: "vendor@gmail.com",
    name: "Demo Vendor",
    role: "vendor",
    password: "password",
  },
  {
    email: "subcontractor@gmail.com",
    name: "Demo Subcontractor",
    role: "subcontractor",
    password: "password",
  },
];

async function seed() {
  console.log("Seeding users...");

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
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created user: ${user.email} (${user.role})`);
    } else {
      userId = existingUser[0].id;
      console.log(`User already exists: ${user.email}`);
    }

    // Create or update account for email/password provider
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

  console.log("Seeding completed!");
}

seed().catch(console.error);
