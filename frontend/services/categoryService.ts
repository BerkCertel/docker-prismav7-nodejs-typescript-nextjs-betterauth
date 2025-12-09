import { API_PATHS } from "@/constant/apiPaths";
import {
  Category,
  CreateCategoryResponse,
  GetCategoriesResponse,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/category`,
    // credentials: "include",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => API_PATHS.CATEGORY.GET_CATEGORIES,
      transformResponse: (response: GetCategoriesResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              { type: "Category", id: "LIST" },
              ...result.map((category) => ({
                type: "Category" as const,
                id: category.id,
              })),
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    createCategory: builder.mutation<
      CreateCategoryResponse,
      { name: string; image: File }
    >({
      query: ({ name, image }) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);

        return {
          url: API_PATHS.CATEGORY.CREATE_CATEGORY,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Category", id: "LIST" }], // listeyi otomatik ye
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoryApi;
