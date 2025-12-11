"use client";

import { Button } from "@/components/ui/button";
import {
  useCreateAdminUserMutation,
  useListUsersQuery,
  useDeleteUserMutation,
} from "@/services/authService";
import { UserRole } from "@/types";
import { Trash2, RefreshCw, UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";

function UsersPage() {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Query hook
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useListUsersQuery({ limit: 15 });

  // Mutation hooks
  const [createAdminUser, { isLoading: isCreating }] =
    useCreateAdminUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleCreateAdminUser = async () => {
    try {
      const result = await createAdminUser({
        email: "testadmin@gmail.com",
        password: "testadmin1234",
        name: "testAdmin",
        role: UserRole.user,
      }).unwrap();

      console.log("Created user:", result);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    // Onay iste
    const confirmed = window.confirm(
      `"${userEmail}" kullanıcısını silmek istediğinize emin misiniz?`
    );

    if (!confirmed) return;

    setDeletingUserId(userId);

    try {
      await deleteUser({ userId }).unwrap();
      console.log("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Kullanıcı silinirken bir hata oluştu!");
    } finally {
      setDeletingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Hata: {JSON.stringify(error)}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6">
        <Button onClick={handleCreateAdminUser} disabled={isCreating}>
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Oluşturuluyor...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Kullanıcı Oluştur
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Yenile
        </Button>
      </div>

      <div className="space-y-2">
        {usersData?.users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border p-4 rounded-lg hover:bg-gray-50"
          >
            <div className="flex-1">
              <div className="font-medium">{user.email}</div>
              <div className="text-sm text-gray-500">
                {user.name} • <span className="capitalize">{user.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Role Badge */}
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  user.role === "superadmin"
                    ? "bg-purple-100 text-purple-700"
                    : user.role === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role}
              </span>

              {/* Ban Status */}
              {user.banned && (
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                  Banned
                </span>
              )}

              {/* Delete Button */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteUser(user.id, user.email)}
                disabled={deletingUserId === user.id}
              >
                {deletingUserId === user.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {usersData?.users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Henüz kullanıcı bulunmuyor.
        </div>
      )}

      {usersData?.total && (
        <div className="mt-4 text-sm text-gray-500">
          Toplam: {usersData.total} kullanıcı
        </div>
      )}
    </div>
  );
}

export default UsersPage;
