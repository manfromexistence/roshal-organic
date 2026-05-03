import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { inArray } from "drizzle-orm";
import { db } from "./db";
import { accounts, sessions, users, verification } from "./schema";
import { sendRoshalPasswordResetEmail } from "./store-email";
import {
  isBangladeshPhoneComplete,
  normalizeBangladeshPhoneInput,
} from "./store-phone";

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

function getBangladeshPhoneCandidates(value: unknown) {
  const normalized = normalizeBangladeshPhoneInput(String(value || ""));

  if (!isBangladeshPhoneComplete(normalized)) {
    return [];
  }

  return Array.from(
    new Set([
      normalized,
      `880${normalized.slice(1)}`,
      `+880${normalized.slice(1)}`,
    ]),
  );
}

async function assertUniqueSignupPhone(phone: unknown) {
  const candidates = getBangladeshPhoneCandidates(phone);

  if (candidates.length === 0) {
    return "";
  }

  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(inArray(users.phone, candidates))
    .limit(1);

  if (existingUser) {
    throw new APIError("BAD_REQUEST", {
      message: "User already exist. Use another Mobile/Email.",
    });
  }

  return candidates[0];
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
      verification,
    },
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!("phone" in user)) {
            return { data: user };
          }

          const normalizedPhone = await assertUniqueSignupPhone(user.phone);

          return {
            data: {
              ...user,
              ...(normalizedPhone ? { phone: normalizedPhone } : {}),
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      const result = await sendRoshalPasswordResetEmail({
        name: user.name,
        to: user.email,
        url,
      });

      if (!result.sent) {
        console.warn(
          "Roshal password reset email was not sent:",
          result.reason,
        );
      }
    },
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
