import { Request } from "express";

// Direkt Express.Multer.File kullan
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
}

export interface UploadResult {
  url: string;
  fileName: string;
  bucket: string;
  size: number;
}

export interface DeleteResult {
  success: boolean;
  fileName: string;
}
