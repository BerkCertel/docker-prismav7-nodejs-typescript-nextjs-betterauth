"use client";
import { authClient } from "@/utils/auth-client";
import React from "react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  console.log(session);

  // if (
  //   !session ||
  //   // (session.user.role !== "admin" && session.user.role !== "superadmin")
  // ) {
  //   return <div>Access Denied. Admins only.</div>;
  // }

  return <> {children}</>;
}

export default AdminLayout;
