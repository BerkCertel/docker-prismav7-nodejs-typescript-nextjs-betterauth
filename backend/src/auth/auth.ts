import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";

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
        sameSite: "none",
        secure: false, // local için false, production'da true
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET as string,
  trustedOrigins: [process.env.CLIENT_URL as string],
});
