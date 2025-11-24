import { Request, Response } from "express";
import { prisma } from "../prisma";

// CREATE CATEGORY
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const editedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const trimmedName = editedName.replace(/\s+/g, " ").trim();

    if (!trimmedName) {
      return res.status(422).json({ error: "Name is required" });
    }

    if (await prisma.category.findUnique({ where: { name: trimmedName } })) {
      return res
        .status(409)
        .json({ error: `${trimmedName} category already exists` });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: trimmedName,
      },
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// UPDATE CATEGORY BY ID

export const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const editedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const trimmedName = editedName.replace(/\s+/g, " ").trim();

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

    if (
      trimmedName.trim() === "" ||
      !trimmedName ||
      trimmedName === null ||
      trimmedName === undefined ||
      typeof trimmedName !== "string" ||
      /^\s*$/.test(trimmedName)
    ) {
      return res
        .status(422)
        .json({ error: "Name cannot be empty or whitespace" });
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name: trimmedName },
    });

    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// GET ALL CATEGORIES

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// GET CATEGORY BY ID
export const getCategoryById = async (req: Request, res: Response) => {
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

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// DELETE CATEGORY BY ID
export const deleteCategoryById = async (req: Request, res: Response) => {
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

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
