import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { accounts, sessions, users } from "./schema";

const defaultTrustedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://roshalorganic.bd",
  "https://www.roshalorganic.bd",
  "https://*.vercel.app",
];

function addOrigin(origins: Set<string>, value: string | undefined) {
  if (!value) {
    return;
  }

  const normalizedValue = value.startsWith("http") ? value : `https://${value}`;

  try {
    origins.add(new URL(normalizedValue).origin);
  } catch {
    // Ignore malformed environment URLs instead of blocking auth startup.
  }
}

function getTrustedOrigins() {
  const origins = new Set(defaultTrustedOrigins);

  addOrigin(origins, process.env.BETTER_AUTH_URL);
  addOrigin(origins, process.env.NEXT_PUBLIC_APP_URL);
  addOrigin(origins, process.env.VERCEL_URL);

  return Array.from(origins);
}

export const permissions = {
  user: ["read:storefront", "manage:profile", "create:orders"],
  admin: [
    "manage:catalog",
    "manage:orders",
    "manage:users",
    "manage:marketing",
    "manage:theme",
  ],
} as const;

export type Role = keyof typeof permissions;
export type Permission = (typeof permissions)[Role][number];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: getTrustedOrigins(),
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
        type: ["user", "admin"],
        required: false,
        defaultValue: "user",
        input: false,
      },
      preferredLanguage: {
        type: "string",
        required: false,
        defaultValue: "bn",
      },
      phone: {
        type: "string",
        required: false,
      },
      defaultAddress: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
