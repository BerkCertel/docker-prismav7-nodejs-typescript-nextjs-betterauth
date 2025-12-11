import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "../prisma";
import {
  adminRole,
  superAdminRole,
  userRole,
  ac,
} from "../middlewares/authPermissionsMiddleware";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 gün
    updateAge: 60 * 60 * 24, // 24 saat
  },
  cookies: {
    sessionToken: {
      name: "better-auth.session",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
      },
    },
  },

  disabledPaths: [
    "/sign-up/email", // ❌ Email ile kayıt kapalı
    // "/sign-in/email", // ⚠️ Bunu kapatma! Giriş yapılamaz olur
  ],
  secret: process.env.BETTER_AUTH_SECRET as string,
  trustedOrigins: [process.env.CLIENT_URL as string],
  plugins: [
    admin({
      defaultRole: "user",
      ac: ac,
      roles: {
        user: userRole,
        admin: adminRole,
        superadmin: superAdminRole,
      },
    }),
  ],
});
