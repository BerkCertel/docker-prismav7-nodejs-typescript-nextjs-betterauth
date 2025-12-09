// frontend/auth.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5000/api/auth", // Backend URL'in
  credentials: "include", // Cookie için gerekli
  useCookies: true,
});

export const { signIn, signUp, signOut, useSession } = authClient;

// ✅ Tüm hata kodlarını içeren tip
export type AllErrorCodes = typeof authClient.$ERROR_CODES;
