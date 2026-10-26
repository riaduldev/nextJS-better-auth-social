
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from "resend";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("better-auth-db");

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [user.email],
        subject: "Reset your password",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px;">
            <h2>Reset your password</h2>
            <p>Hi ${user.name || "there"},</p>
            <p>Click below to reset your password.</p>
            <a href="${url}">Reset Password</a>
          </div>
        `,
      });

      if (error) {
        console.error("Password reset email error:", error);
        throw new Error(error.message);
      }

      console.log("Password reset email accepted:", data?.id);
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24 * 15,

    sendVerificationEmail: async ({ user, url }) => {
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [user.email],
        subject: "Verify your email address",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px;">
            <h2>Verify your email address</h2>
            <p>Hi ${user.name || "there"},</p>
            <p>Please verify your email to activate your account.</p>
            <a
              href="${url}"
              style="display:inline-block;padding:12px 20px;background:#111827;color:#fff;text-decoration:none;border-radius:6px"
            >
              Verify Email
            </a>
            <p>This verification link expires in 15 days.</p>
          </div>
        `,
      });

      if (error) {
        console.error("Verification email error:", error);
        throw new Error(error.message);
      }

      console.log("Verification email accepted:", data?.id);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
    },

    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
});
