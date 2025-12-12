// app/test-ssr/page.tsx (SERVER COMPONENT)

import { authClient } from "@/utils/auth-client";

export default async function TestSSRPage() {
  const { data: session } = await authClient.getSession();

  console.log("SSR Session:", session);

  if (!session) {
    return (
      <div>
        <h1>Login Required</h1>
        <p>Bu sayfa server-side çalışıyor ve session bulunamadı.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Server Side Session Test</h1>
      <p>
        <strong>Kullanıcı Adı:</strong> {session.user.name}
      </p>
      <p>
        <strong>Email:</strong> {session.user.email}
      </p>

      <pre
        style={{
          marginTop: 20,
          padding: 10,
          background: "#111",
          color: "#0f0",
        }}
      >
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
