export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  products: Product[];
}

export interface CreateCategoryResponse {
  success: boolean;
  data: Category;
  message: string;
}

export interface GetCategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string;
  price: number;
  currency: string;
  quantity: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  category: Category;
}
