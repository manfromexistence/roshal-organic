interface TestResult {
  url: string;
  success: boolean;
  data?: unknown;
  error?: string;
}

async function _testPageAPI(url: string, testFn: () => Promise<unknown>) {
  try {
    const result = await testFn();
    console.log(`✓ ${url} - API working`);
    return { url, success: true, data: result };
  } catch (error) {
    console.log(`✗ ${url} - API failed: ${(error as Error).message}`);
    return { url, success: false, error: (error as Error).message };
  }
}

async function testAllPageAPIs() {
  console.log("=== Testing All Dashboard Page APIs ===\n");

  const results: TestResult[] = [];

  // Test dashboard
  try {
    const { getEdmsDashboardData } = await import("@/lib/edms/dashboard");
    const { getRequiredDashboardSessionUser } = await import(
      "@/lib/edms/session"
    );
    const sessionUser = await getRequiredDashboardSessionUser();
    const data = await getEdmsDashboardData(sessionUser);
    results.push({
      url: "/projects",
      success: true,
      data: { projectCount: data.projects.length },
    });
    console.log(`✓ /projects - API working (${data.projects.length} projects)`);
  } catch (error) {
    results.push({
      url: "/projects",
      success: false,
      error: (error as Error).message,
    });
    console.log(`✗ /projects - API failed: ${(error as Error).message}`);
  }

  // Test transmittals
  try {
    const { getTransmittalManagementData } = await import(
      "@/lib/edms/transmittals"
    );
    const { getRequiredDashboardSessionUser } = await import(
      "@/lib/edms/session"
    );
    const sessionUser = await getRequiredDashboardSessionUser();
    const data = await getTransmittalManagementData(sessionUser);
    results.push({
      url: "/transmittals",
      success: true,
      data: { transmittalCount: data.transmittals.length },
    });
    console.log(
      `✓ /transmittals - API working (${data.transmittals.length} transmittals)`,
    );
  } catch (error) {
    results.push({
      url: "/transmittals",
      success: false,
      error: (error as Error).message,
    });
    console.log(`✗ /transmittals - API failed: ${(error as Error).message}`);
  }

  // Test admin users
  try {
    const { eq } = await import("drizzle-orm");
    const { db } = await import("@/lib/db");
    const { organizations, users } = await import("@/lib/schema");
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
    results.push({
      url: "/admin/users",
      success: true,
      data: { userCount: allUsers.length },
    });
    console.log(`✓ /admin/users - API working (${allUsers.length} users)`);
  } catch (error) {
    results.push({
      url: "/admin/users",
      success: false,
      error: (error as Error).message,
    });
    console.log(`✗ /admin/users - API failed: ${(error as Error).message}`);
  }

  // Test admin organizations
  try {
    const { eq } = await import("drizzle-orm");
    const { db } = await import("@/lib/db");
    const { organizations, users } = await import("@/lib/schema");
    const allOrganizations = await db.select().from(organizations);
    const orgsWithUserCount = await Promise.all(
      allOrganizations.map(async (org) => {
        const userCount = await db
          .select()
          .from(users)
          .where(eq(users.organizationId, org.id))
          .then((result) => result.length);
        return { ...org, userCount };
      }),
    );
    results.push({
      url: "/admin/organizations",
      success: true,
      data: { orgCount: orgsWithUserCount.length },
    });
    console.log(
      `✓ /admin/organizations - API working (${orgsWithUserCount.length} organizations)`,
    );
  } catch (error) {
    results.push({
      url: "/admin/organizations",
      success: false,
      error: (error as Error).message,
    });
    console.log(
      `✗ /admin/organizations - API failed: ${(error as Error).message}`,
    );
  }

  // Test config
  try {
    const { getProjectConfigData } = await import("@/lib/edms/project-config");
    const { getRequiredDashboardSessionUser } = await import(
      "@/lib/edms/session"
    );
    const sessionUser = await getRequiredDashboardSessionUser();
    const _data = await getProjectConfigData(sessionUser, "test-project-id");
    results.push({ url: "/config", success: true, data: { hasConfig: true } });
    console.log(`✓ /config - API working`);
  } catch (error) {
    results.push({
      url: "/config",
      success: false,
      error: (error as Error).message,
    });
    console.log(`✗ /config - API failed: ${(error as Error).message}`);
  }

  console.log(`\n=== API Test Results ===`);
  const success = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  console.log(`Total tested: ${results.length}`);
  console.log(`Success: ${success.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log(`\n=== Failed APIs ===`);
    failed.forEach((f) => {
      console.log(`  ${f.url}: ${f.error}`);
    });
  }

  return {
    total: results.length,
    success: success.length,
    failed: failed.length,
  };
}

// Run tests if executed directly
if (require.main === module) {
  testAllPageAPIs()
    .then((result) => {
      if (result.failed === 0) {
        console.log("\n✓ All tested APIs are working");
        process.exit(0);
      } else {
        console.log(`\n✗ ${result.failed} APIs have issues`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Error running tests:", error);
      process.exit(1);
    });
}

export { testAllPageAPIs };
