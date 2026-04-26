import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { accounts, sessions, users } from "./schema";

// Define permissions for each role
export const permissions = {
  user: ["read:documents", "read:projects"],
  admin: [
    "read:documents",
    "write:documents",
    "delete:documents",
    "read:projects",
    "write:projects",
    "delete:projects",
    "manage:users",
  ],
  client: ["read:documents", "read:projects", "read:reports"],
  pmc: [
    "read:documents",
    "write:documents",
    "read:projects",
    "write:projects",
    "approve:documents",
  ],
  vendor: ["read:documents", "write:documents", "read:projects"],
  subcontractor: ["read:documents", "write:documents", "read:projects"],
} as const;

export type Role = keyof typeof permissions;
export type Permission = (typeof permissions)[Role][number];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    generateId: () => crypto.randomUUID(),
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
