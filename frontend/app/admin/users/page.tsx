"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/utils/auth-client";
import { useState } from "react";

function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  const handleCreateAdminUser = async () => {
    const result = await authClient.admin.createUser({
      email: "admin@gmail.com",
      password: "admin1234",
      name: "Admin",
      role: "admin",
    });
    console.log(result.data?.user);
    console.log(result.error);
  };

  const handleListUsers = async () => {
    const result = await authClient.admin.listUsers({
      query: {
        limit: 15,
      },
    });
    // console.log(result);

    if (result.data?.users) {
      console.log("Users:", result.data.users);
      setUsers(result.data.users);
    }

    console.log(result.error);
  };

  return (
    <div>
      <Button onClick={handleCreateAdminUser}>Create Admin User</Button>
      <Button onClick={handleListUsers}>List Users</Button>

      <div className="mt-4">
        {users.map((user) => (
          <div key={user.id}>
            <div>{user.email}</div>
            <div>{user.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersPage;
