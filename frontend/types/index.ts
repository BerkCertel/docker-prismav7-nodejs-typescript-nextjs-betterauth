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

// Prisma şemasından türetilmiş tipler

export enum UserRole {
  user = "user",
  admin = "admin",
  superadmin = "superadmin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string; // API'den string olarak gelir
  updatedAt: string;
  role: UserRole;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
}

// API Response Tipleri
export interface ListUsersResponse {
  users: User[];
  total?: number;
}

export interface ListUsersParams {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface CreateUserResponse {
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
}

export interface ListUsersResponse {
  users: User[];
  total?: number;
}

export interface ListUsersParams {
  limit?: number;
  offset?: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface CreateUserResponse {
  user: User;
}

// ✅ Delete Response
export interface DeleteUserResponse {
  success: boolean;
}
