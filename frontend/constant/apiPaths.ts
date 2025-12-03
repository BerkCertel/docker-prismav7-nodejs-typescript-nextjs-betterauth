export const API_PATHS = {
  CATEGORY: {
    GET_CATEGORIES: "all-categories",
    GET_CATEGORY_BY_ID: (id: number) => `/category/${id}`,
    CREATE_CATEGORY: "create-category",
    UPDATE_CATEGORY: (id: number) => `/category/${id}`,
    DELETE_CATEGORY: (id: number) => `/category/${id}`,
  },
};
