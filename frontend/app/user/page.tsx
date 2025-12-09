"use client";
import { authClient } from "@/utils/auth-client";

export default function UserState() {
  const handleSignUp = async () => {
    try {
      const result = await authClient.signUp.email({
        email: "test12@gmail.com",
        password: "test123456",
        name: "Test User",
      });

      if (result.data?.user) {
        console.log("Sign up successful:", result.data.user);
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      console.log(error);
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await authClient.signIn.email({
      email: "test2@gmail.com",
      password: "test123456",
      callbackURL: "/dashboard",
    });

    if (data) {
      console.log("Sign in data:", data);
    }

    if (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button onClick={() => handleSignUp()}>Kayıt Ol</button>
      <button onClick={() => handleSignIn()}>Giriş Yap</button>
      <button onClick={() => handleSignOut()}>Çıkış Yap</button>
    </div>
  );
}
