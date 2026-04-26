import { eq } from "drizzle-orm";
import { db } from "./db";
import { organizations, users } from "./schema";

export async function seedDatabase() {
  console.log("Seeding database...");

  // Create default organization
  const existingOrg = await db
    .select()
    .from(organizations)
    .where(eq(organizations.email, "admin@quadra.com"))
    .limit(1);

  let organizationId: string;

  if (existingOrg.length === 0) {
    const newOrg = await db
      .insert(organizations)
      .values({
        id: crypto.randomUUID(),
        name: "Quadra",
        email: "admin@quadra.com",
        avatar: "/evilrabbit.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    organizationId = newOrg[0].id;
    console.log("Created default organization");
  } else {
    organizationId = existingOrg[0].id;
    console.log("Organization already exists");
  }

  // Create admin user
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@quadra.com"))
    .limit(1);

  if (existingUser.length === 0) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: "admin@quadra.com",
      name: "Admin User",
      role: "admin",
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Created admin user");
  } else {
    console.log("Admin user already exists");
  }

  console.log("Database seeded successfully");
}

// Run seed if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error seeding database:", error);
      process.exit(1);
    });
}
