import { Response } from "express";
import { prisma } from "../prisma";
import { MulterRequest } from "../types";
import { StorageService } from "../services/storage.service";

// ============ CREATE CATEGORY WITH IMAGE (ZORUNLU) ============
export const createCategory = async (req: MulterRequest, res: Response) => {
  try {
    const { name } = req.body;

    // ========== RESİM ZORUNLU KONTROLÜ ==========
    if (!req.file) {
      return res.status(422).json({
        success: false,
        error: "Kategori resmi zorunludur",
      });
    }

    // İsim formatla
    const editedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const trimmedName = editedName.replace(/\s+/g, " ").trim();

    // Validasyon
    if (!trimmedName) {
      return res.status(422).json({ error: "Name is required" });
    }

    if (trimmedName.length < 3) {
      return res
        .status(422)
        .json({ error: "Name must be at least 3 characters long" });
    }

    if (trimmedName.length > 50) {
      return res
        .status(422)
        .json({ error: "Name must be at most 50 characters long" });
    }

    // Kategori var mı kontrol et
    const existingCategory = await prisma.category.findUnique({
      where: { name: trimmedName },
    });

    if (existingCategory) {
      return res
        .status(409)
        .json({ error: `${trimmedName} category already exists` });
    }

    // ========== RESİM YÜKLEME ==========
    let imageUrl: string;

    try {
      console.log("📤 Resim yükleniyor:", req.file.originalname);

      const uploadResult = await StorageService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        "CATEGORIES",
        req.file.mimetype
      );

      imageUrl = uploadResult.url;
      console.log("✅ Resim başarıyla yüklendi:", imageUrl);
    } catch (uploadError: any) {
      console.error("❌ Resim yüklenemedi:", uploadError);

      return res.status(500).json({
        success: false,
        error: "Resim yüklenirken hata oluştu",
        details: uploadError.message,
      });
    }

    // Kategori oluştur
    const newCategory = await prisma.category.create({
      data: {
        name: trimmedName,
        imageUrl: imageUrl,
      },
    });

    return res.status(201).json({
      success: true,
      data: newCategory,
      message: "Kategori başarıyla oluşturuldu",
    });
  } catch (error: any) {
    console.error("❌ Create category error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

// ============ UPDATE CATEGORY BY ID ============
export const updateCategoryById = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // ID validasyonu
    if (!id) {
      return res.status(422).json({ error: "Category ID is required" });
    }

    if (isNaN(Number(id))) {
      return res.status(422).json({ error: "Category ID must be a number" });
    }

    if (Number(id) <= 0) {
      return res
        .status(422)
        .json({ error: "Category ID must be greater than zero" });
    }

    // Kategori var mı kontrol et
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // İsim güncelleme - varsayılan olarak mevcut isim kullanılır
    let finalName = category.name;

    if (typeof name === "string" && name.trim() !== "") {
      // Önce fazladan boşlukları tek boşluğa indir ve baş/son boşlukları temizle
      const cleaned = name.replace(/\s+/g, " ").trim();

      // Normalize et: ilk harf büyük, diğerleri küçük
      const processedName =
        cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();

      // Uzunluk kontrolleri
      if (processedName.length < 3) {
        return res
          .status(422)
          .json({ error: "Name must be at least 3 characters long" });
      }

      if (processedName.length > 50) {
        return res
          .status(422)
          .json({ error: "Name must be at most 50 characters long" });
      }

      // Eğer isim gerçekten değişiyorsa (aynı isimse uniq kontrolü atla)
      if (processedName !== category.name) {
        // Aynı isimde başka kategori var mı?
        const existingCategory = await prisma.category.findFirst({
          where: {
            name: processedName,
            id: { not: Number(id) }, // Kendisi hariç
          },
        });

        if (existingCategory) {
          return res
            .status(409)
            .json({ error: `${processedName} category already exists` });
        }
      }

      finalName = processedName;
    }

    // ========== RESİM GÜNCELLEME (OPSIYONEL) ==========
    let imageUrl = category.imageUrl; // Mevcut resim

    if (req.file) {
      try {
        console.log("📤 Yeni resim yükleniyor:", req.file.originalname);

        // Eski resmi sil, yeni resmi yükle
        const uploadResult = await StorageService.replaceFile(
          category.imageUrl,
          req.file.buffer,
          req.file.originalname,
          "CATEGORIES",
          req.file.mimetype
        );

        imageUrl = uploadResult.url;
        console.log("✅ Resim güncellendi:", imageUrl);
      } catch (uploadError: any) {
        console.error("❌ Resim güncellenemedi:", uploadError);

        return res.status(500).json({
          success: false,
          error: "Resim güncellenirken hata oluştu",
          details: uploadError.message,
        });
      }
    }

    // Kategoriyi güncelle
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name: finalName,
        imageUrl: imageUrl,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedCategory,
      message: "Kategori başarıyla güncellendi",
    });
  } catch (error: any) {
    console.error("❌ Update category error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

// ============ GET ALL CATEGORIES ============
export const getAllCategories = async (req: MulterRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    });

    return res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error: any) {
    console.error("❌ Get all categories error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

// ============ GET ALL CATEGORIES WITH PRODUCTS ============
export const getAllCategoriesWithProducts = async (
  req: MulterRequest,
  res: Response
) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ createdAt: "desc" }, { name: "asc" }],
      include: { products: true },
    });

    return res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error: any) {
    console.error("❌ Get all categories error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

// ============ GET CATEGORY BY ID ============
export const getCategoryById = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({ error: "Category ID is required" });
    }

    if (isNaN(Number(id))) {
      return res.status(422).json({ error: "Category ID must be a number" });
    }

    if (Number(id) <= 0) {
      return res
        .status(422)
        .json({ error: "Category ID must be greater than zero" });
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { products: true },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error("❌ Get category by id error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

// ============ DELETE CATEGORY BY ID ============
export const deleteCategoryById = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({ error: "Category ID is required" });
    }

    if (isNaN(Number(id))) {
      return res.status(422).json({ error: "Category ID must be a number" });
    }

    if (Number(id) <= 0) {
      return res
        .status(422)
        .json({ error: "Category ID must be greater than zero" });
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // ========== RESMİ MinIO'DAN SİL ==========
    if (category.imageUrl) {
      const fileName = StorageService.extractFileNameFromUrl(category.imageUrl);
      if (fileName) {
        try {
          await StorageService.deleteFile(fileName, "CATEGORIES");
          console.log("✅ Kategori resmi silindi:", fileName);
        } catch (error) {
          console.warn("⚠️ Resim silinemedi:", error);
          // Resim silinemese bile kategoriyi sil
          return res.status(500).json({
            success: false,
            error: "Kategori resmi silinirken hata oluştu",
          });
        }
      }
    }

    // Kategoriyi sil
    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Kategori başarıyla silindi",
    });
  } catch (error: any) {
    console.error("❌ Delete category error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};
