import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000",
  region: "us-east-1", // MinIO için önemli değil ama gerekli
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER as string,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD as string,
  },
  forcePathStyle: true, // MinIO için gerekli
});

export const BUCKETS = {
  CATEGORIES: "categories",
  PRODUCTS: "products",
  QRCODES: "qrcodes",
} as const;

export const FILE_CONFIG = {
  MAX_SIZE: parseInt(process.env.MAX_FILE_SIZE || "5242880"), // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
};
