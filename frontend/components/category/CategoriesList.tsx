"use client";

import { useGetCategoriesQuery } from "@/services/categoryService";

function CategoryList() {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategoriesQuery();

  return (
    <div>
      {isCategoriesLoading ? (
        <p>Loading categories...</p>
      ) : isCategoriesError ? (
        <div>
          <p>Error loading categories:</p>
          <pre>{JSON.stringify(categoriesError, null, 2)}</pre>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Categories</h1>

          <ul className="list-disc pl-6">
            {categories?.map((category) => (
              <li key={category.id} className="mb-2">
                <span className="font-medium">{category.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CategoryList;
