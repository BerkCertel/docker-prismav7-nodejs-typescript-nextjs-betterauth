import multer from "multer";
import { FILE_CONFIG } from "../config/minio.config";
import { Request } from "express";

// Memory storage kullan (buffer olarak al)
const storage = multer.memoryStorage();

// Dosya filtresi
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // MIME type kontrolü
  if (FILE_CONFIG.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Geçersiz dosya tipi. İzin verilenler: ${FILE_CONFIG.ALLOWED_TYPES.join(
          ", "
        )}`
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: FILE_CONFIG.MAX_SIZE,
  },
  fileFilter,
});
