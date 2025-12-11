import {
  CreateUserRequest,
  CreateUserResponse,
  ListUsersParams,
  ListUsersResponse,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    // Backend URL'ini kullan
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", // Cookie'ler için önemli
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Better-auth admin endpoint'i
    listUsers: builder.query<ListUsersResponse, ListUsersParams | void>({
      query: (params) => ({
        url: "/auth/admin/list-users", // better-auth'un tam path'i
        method: "GET",
        params: {
          limit: params?.limit ?? 15,
          offset: params?.offset ?? 0,
        },
      }),
      // Response'u transform et (better-auth formatına göre)
      transformResponse: (response: any) => {
        console.log("🔥 RAW BetterAuth Response:", response);
        return {
          users: response.users || [],
          total: response.total || 0,
        };
      },
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    createAdminUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (userData) => ({
        url: "/auth/admin/create-user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // ✅ Kullanıcı sil
    deleteUser: builder.mutation<{ success: boolean }, { userId: string }>({
      query: ({ userId }) => ({
        url: "/auth/admin/remove-user",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListUsersQuery,
  useCreateAdminUserMutation,
  useDeleteUserMutation,
} = userApi;
