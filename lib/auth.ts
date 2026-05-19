import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { openAPI } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
// import { sendEmail } from "@/app/actions/email-actions";
// import { sendUserVerificationEmail } from "@/app/actions/send-emails/verify-email";
// import { sendResetPasswordEmail } from "@/app/actions/send-emails/reset-password-email";

// ─────────────────────────────
// 🔐 JWT CONFIG (for mobile clients)
// ─────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_EXPIRES_IN = "7d";


// const BASE_URL =
//   // process.env.BETTER_AUTH_URL ||
//   // process.env.NEXT_PUBLIC_SITE_URL ||
//   "https://medslearn.com";

// const TRUSTED_ORIGINS = [
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",
//   "https://talktomeds.com",
//   "https://www.talktomeds.com",
// ];


export function generateUserToken(user: any) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyUserToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ─────────────────────────────
// 🧩 BETTER AUTH CONFIG
// ─────────────────────────────
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET ?? "cadical-fallback-secret-please-set-in-prod",
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://skillride.com.ng",

  // trustedOrigins: TRUSTED_ORIGINS,



  database: prismaAdapter(prisma, { provider: "postgresql" }),

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 * 7, // refresh every 7 days
    storeSessionInDatabase: true, 
    preserveSessionInDatabase: true, 
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 3,
      // strategy: "jwt"
    },
  },

  advanced: {
    disableOriginCheck: true
  },

  user: {
    // additionalFields: {
    //   premium: { type: "boolean", required: false },
    // },
    changeEmail: {
      enabled: true,
      // sendChangeEmailVerification: async ({ newEmail, url }) => {
      //   await sendEmail({
      //     app_name: "TalkToMeds",
      //     to: newEmail,
      //     subject: "Verify your email change",
      //     text: `Click the link to verify: ${url}`,
      //     html: `<a href=${url}>Click here to verify</a>`,
      //   });
      // },
    },
  },

  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),

  plugins: [
    openAPI(),
    admin({
      impersonationSessionDuration: 60 * 60 * 24 * 7,
    }),
  ],
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    // sendResetPassword: async ({ user, url, token }, request) => {
      // await sendResetPasswordEmail(user.email, user.email, url );
     
    // },
  },

  emailVerification: {
    // sendOnSignUp: true,
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    // sendVerificationEmail: async ({ user, url, token }, request) => {
     
    //   await sendUserVerificationEmail(user.email, user.name || "", url);
    // },
  },
} satisfies BetterAuthOptions);

// ─────────────────────────────
// ✅ Universal Auth Helper
// ─────────────────────────────
export type Session = typeof auth.$Infer.Session;

/**
 * For any API route that needs authentication
 * Works for both mobile (JWT) and web (cookies)
 */
export async function authenticateRequest(req: Request) {
  // 1️⃣ Try JWT (mobile)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyUserToken(token);
    if (decoded) return decoded;
  }

  // 2️⃣ Try cookie session (web).
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user) return session.user;
  } catch {
    // ignore errors
  }

  return null;
}









