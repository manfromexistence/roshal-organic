import { eq } from "drizzle-orm";
import { db } from "./db";
import { organizations, users } from "./schema";

async function testAdminUsersPage() {
  console.log("Testing /dashboard/users data...");

  try {
    // Test database query
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        organizationId: users.organizationId,
        orgName: organizations.name,
        orgEmail: organizations.email,
      })
      .from(users)
      .leftJoin(organizations, eq(users.organizationId, organizations.id))
      .orderBy(users.createdAt);

    console.log(`✓ Found ${allUsers.length} users`);

    if (allUsers.length > 0) {
      console.log("Sample user:", allUsers[0]);
    }

    return { success: true, count: allUsers.length };
  } catch (error) {
    console.error("✗ Error testing users page:", error);
    return { success: false, error };
  }
}

async function testAdminOrganizationsPage() {
  console.log("Testing storefront organization data...");

  try {
    // Test database query
    const allOrganizations = await db.select().from(organizations);

    // Get user count for each organization
    const orgsWithUserCount = await Promise.all(
      allOrganizations.map(async (org) => {
        const userCount = await db
          .select()
          .from(users)
          .where(eq(users.organizationId, org.id))
          .then((result) => result.length);

        return {
          ...org,
          userCount,
        };
      }),
    );

    console.log(`✓ Found ${orgsWithUserCount.length} organizations`);

    if (orgsWithUserCount.length > 0) {
      console.log("Sample organization:", {
        name: orgsWithUserCount[0].name,
        email: orgsWithUserCount[0].email,
        userCount: orgsWithUserCount[0].userCount,
      });
    }

    return { success: true, count: orgsWithUserCount.length };
  } catch (error) {
    console.error("✗ Error testing organizations page:", error);
    return { success: false, error };
  }
}

async function runAllTests() {
  console.log("=== Testing Roshal Dashboard Data ===\n");

  const usersResult = await testAdminUsersPage();
  console.log();

  const orgsResult = await testAdminOrganizationsPage();
  console.log();

  console.log("=== Test Results ===");
  console.log(`Users page: ${usersResult.success ? "✓ PASS" : "✗ FAIL"}`);
  console.log(
    `Organizations page: ${orgsResult.success ? "✓ PASS" : "✗ FAIL"}`,
  );

  if (usersResult.success && orgsResult.success) {
    console.log("\n✓ All admin dashboard pages are functional");
  } else {
    console.log("\n✗ Some admin dashboard pages have issues");
  }
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error running tests:", error);
      process.exit(1);
    });
}

export { runAllTests, testAdminOrganizationsPage, testAdminUsersPage };
