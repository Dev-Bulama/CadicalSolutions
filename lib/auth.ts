import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import jwt from "jsonwebtoken";
import { openAPI } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import prisma from "./prisma";

// ─────────────────────────────
// 🔐 JWT CONFIG (for mobile clients)
// ─────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_EXPIRES_IN = "7d";

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
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 * 7, // refresh every 7 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  user: {
    additionalFields: {
      premium: { type: "boolean", required: false },
    },
    changeEmail: {
      enabled: false,
      // sendChangeEmailVerification: async ({ newEmail, url }) => {
      //   await sendEmail({
      //     app_name: "mnlearn",
      //     to: newEmail,
      //     subject: "Verify your email change",
      //     text: `Click the link to verify: ${url}`,
      //     html: `<a href=${url}>Click here to verify</a>`,
      //   });
      // },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    openAPI(),
    admin({
      impersonationSessionDuration: 60 * 60 * 24 * 7,
    }),
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // sendResetPassword: async ({ user, url }) => {
    //   await sendEmail({
    //     app_name: "mnlearn",
    //     to: user.email,
    //     subject: "Reset your password",
    //     text: `Click the link to reset your password: ${url}`,
    //     html: `<a href=${url}>Click here to reset your password.</a>`,
    //   });
    // },
  },

  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    // sendVerificationEmail: async ({ user, token }) => {
    //   const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
    //   await sendEmail({
    //     app_name: "mnlearn",
    //     to: user.email,
    //     subject: "Verify your email address",
    //     text: `Click the link to verify your email: ${verificationUrl}`,
    //     html: `<a href=${verificationUrl}>Click here to verify your email.</a>`,
    //   });
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






































// import { betterAuth, BetterAuthOptions } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import prisma from "@/lib/prisma";
// // import { sendEmail } from "@/actions/email";
// import { openAPI } from "better-auth/plugins";
// import { admin } from "better-auth/plugins";
// import { sendEmail } from "./app/actions/email-actions";


// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),
//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // 7 days
//     // BUG: Prob a bug with updateAge method. It throws an error - Argument `where` of type SessionWhereUniqueInput needs at least one of `id` arguments. 
//     // As a workaround, set updateAge to a large value for now.
//     updateAge: 60 * 60 * 24 * 7, // 7 days (every 7 days the session expiration is updated)
//     cookieCache: {
//       enabled: true,
//       maxAge: 5 * 60 // Cache duration in seconds
//     }
//   },
//   user: {
//     additionalFields: {
//       premium: {
//         type: "boolean",
//         required: false,
//       },
//     },
//     changeEmail: {
//       enabled: true,
//       sendChangeEmailVerification: async ({ newEmail, url }) => {
//         await sendEmail({
//           app_name: "Firmmall",
//           to: newEmail,
//           subject: 'Verify your email change',
//           text: `Click the link to verify: ${url}`,
//           html: `<a href=${url}>Click here to verify</a>`
//         })
//       }
//     }
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
//   plugins: [openAPI(), admin({
//     impersonationSessionDuration: 60 * 60 * 24 * 7, // 7 days
//   })], // api/auth/reference
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: false,
//     sendResetPassword: async ({ user, url, token }) => {
//       await sendEmail({
//         app_name: "Firmmall",
//         to: user.email,
//         subject: "Reset your password",
//         text: `Click the link to reset your password: ${url}`,
//         html: `<a href=${url}>Click the here to reset your password.</a>`
//       });
//     },
//     // onPasswordReset: async ({ user }, request) => {
//     //   // your logic here
//     //   console.log(`Password for user ${user.email} has been reset.`);
//     // },
//   },
//   emailVerification: {
//     sendOnSignUp: true,
//     autoSignInAfterVerification: true,
//     sendVerificationEmail: async ({ user, token }) => {
//       const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
//       await sendEmail({
//         app_name: "Firmmall",
//         to: user.email,
//         subject: "Verify your email address",
//         text: `Click the link to verify your email: ${verificationUrl}`,
//         html: `<a href=${verificationUrl}>Click the here to reset your password.</a>`
//       });
//     },
//   }
// } satisfies BetterAuthOptions);

// export type Session = typeof auth.$Infer.Session;
