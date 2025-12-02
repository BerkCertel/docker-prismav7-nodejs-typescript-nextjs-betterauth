import { Response } from "express";
import { prisma } from "../prisma";
import { MulterRequest } from "../types";
import { StorageService } from "../services/storage.service";

export const createProduct = async (req: MulterRequest, res: Response) => {
  try {
    const { name, description, price, categoryId, quantity, active } = req.body;

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
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      return res
        .status(422)
        .json({ error: "Price must be a valid non-negative number" });
    }

    if (description === undefined || description === null) {
      return res.status(422).json({ error: "Description is required" });
    }

    if (description.trim() === "" || description.length === 0) {
      return res.status(422).json({ error: "Description cannot be empty" });
    }

    if (!description) {
      return res.status(422).json({ error: "Description is required" });
    }

    if (!price) {
      return res.status(422).json({ error: "Price is required" });
    }

    if (!categoryId) {
      return res.status(422).json({ error: "Category is required" });
    }

    // Kategori var mı kontrol et
    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    const existingProductWithCategory = await prisma.product.findFirst({
      where: {
        name: trimmedName,
        categoryId: Number(categoryId),
      },
    });

    if (existingProductWithCategory) {
      return res.status(409).json({
        error: "A product with the same name already exists in this category",
      });
    }

    if (!existingCategory) {
      return res
        .status(404)
        .json({ error: "Ürün için belirtilen kategori bulunamadı" });
    }

    // ========== RESİM ZORUNLU KONTROLÜ ==========
    if (!req.file) {
      return res.status(422).json({
        success: false,
        error: "Ürün resmi zorunludur",
      });
    }

    // ========== RESİM YÜKLEME ==========
    let imageUrl: string;
    try {
      console.log("📤 Resim yükleniyor:", req.file.originalname);
      const uploadResult = await StorageService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        "PRODUCTS",
        req.file.mimetype
      );
      imageUrl = uploadResult.url;
      console.log("✅ Resim yüklendi:", imageUrl);
    } catch (uploadError) {
      console.error("❌ Resim yükleme hatası:", uploadError);
      return res.status(500).json({
        success: false,
        error: "Resim yüklenirken bir hata oluştu",
      });
    }
    // Ürün oluştur
    const newProduct = await prisma.product.create({
      data: {
        name: trimmedName,
        description,
        price: priceNumber,
        imageUrl,
        categoryId: Number(categoryId),
        active: Boolean(active),
        quantity: Number(quantity),
      },
    });
    return res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Ürün oluşturma hatası:", error);
    return res.status(500).json({
      success: false,
      error: "Ürün oluşturulurken bir hata oluştu",
    });
  }
};

export const getProducts = async (req: MulterRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      omit: { categoryId: true }, // categoryId alanını hariç tut
      include: { category: { select: { id: true, name: true } } }, // sadece seçilen  kategori bilgilerini dahil et
      // include: { category: true }, // tüm kategori bilgilerini de dahil et
    });
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Ürünleri getirme hatası:", error);
    return res.status(500).json({
      success: false,
      error: "Ürünleri getirme sırasında bir hata oluştu",
    });
  }
};
