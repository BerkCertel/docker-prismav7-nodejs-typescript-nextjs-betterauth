// frontend/app/server/page.tsx
"use client";

import { authClient } from "@/utils/auth-client";

export default function ClientPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Yükleniyor...</div>;
  }

  if (!session) {
    return <div>Giriş yapılmamış</div>;
  }

  return (
    <div>
      <h1>Client Component</h1>
      <p>Hoşgeldin {session.user.name}</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
