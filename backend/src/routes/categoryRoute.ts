import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  deleteCategoryById,
  getCategoryById,
  updateCategoryById,
  getAllCategoriesWithProducts,
} from "../controllers/categoryController";
import { upload } from "../middlewares/imageUpload.middleware";
import { validateFile } from "../middlewares/fileValidation.middleware";
import { hasPermission, isAdmin, protect } from "../middlewares/authMiddlwares";

const categoryRouter = Router();

// CREATE - Resimle birlikte kategori oluştur (RESİM ZORUNLU)
categoryRouter.post(
  "/create-category",
  upload.single("image"), // "image" field name
  validateFile, // Dosya validasyonu
  protect,
  // isAdmin,
  hasPermission({ resource: "category", action: "create" }),
  createCategory
);

// UPDATE - Kategori güncelle (resim opsiyonel)
categoryRouter.put(
  "/update-category/:id",
  upload.single("image"), // "image" varsa al
  updateCategoryById
);

// GET ALL - Tüm kategorileri listele
categoryRouter.get("/all-categories", getAllCategories);

// GET ALL WITH PRODUCTS - Tüm kategorileri ürünleriyle birlikte listele
categoryRouter.get(
  "/all-categories-with-products",
  getAllCategoriesWithProducts
);

// GET BY ID - Tek kategori getir
categoryRouter.get("/get-simple-category/:id", getCategoryById);

// DELETE - Kategori sil (resim de silinir)
categoryRouter.delete("/delete-category/:id", deleteCategoryById);

export default categoryRouter;
