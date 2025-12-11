import { Router } from "express";
import { createProduct, getProducts } from "../controllers/productController";
import { upload } from "../middlewares/imageUpload.middleware";
import { validateFile } from "../middlewares/fileValidation.middleware";
import { hasPermission, isAdmin, protect } from "../middlewares/authMiddlwares";

const productRouter = Router();

// CREATE - Resimle birlikte kategori oluştur (RESİM ZORUNLU)
productRouter.post(
  "/create-product",
  upload.single("image"), // "image" field name
  validateFile, // Dosya validasyonu
  protect,
  isAdmin,
  hasPermission,
  createProduct
);

// // UPDATE - Kategori güncelle (resim opsiyonel)
// categoryRouter.put(
//   "/update-category/:id",
//   upload.single("image"), // "image" varsa al
//   updateCategoryById
// );

// GET ALL - Tüm ürünleri listele
productRouter.get("/all-products", getProducts);

// // GET BY ID - Tek kategori getir
// categoryRouter.get("/get-simple-category/:id", getCategoryById);

// // DELETE - Kategori sil (resim de silinir)
// categoryRouter.delete("/delete-category/:id", deleteCategoryById);

export default productRouter;
