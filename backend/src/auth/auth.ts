import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 gün
    updateAge: 60 * 60 * 24, // 24 saat
  },
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
});
