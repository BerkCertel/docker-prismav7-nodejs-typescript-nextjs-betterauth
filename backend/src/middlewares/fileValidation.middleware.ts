import { MulterRequest } from "../types/index";
import { Response, NextFunction } from "express";

import { FILE_CONFIG } from "../config/minio.config";

export const validateFile = (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "Dosya seçilmedi",
    });
  }

  const file = req.file;

  // Dosya boyutu kontrolü (ekstra güvenlik)
  if (file.size > FILE_CONFIG.MAX_SIZE) {
    return res.status(400).json({
      success: false,
      error: `Dosya boyutu çok büyük. Maksimum: ${
        FILE_CONFIG.MAX_SIZE / 1024 / 1024
      }MB`,
    });
  }

  // MIME type kontrolü
  if (!FILE_CONFIG.ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: "Geçersiz dosya tipi",
    });
  }

  next();
};
