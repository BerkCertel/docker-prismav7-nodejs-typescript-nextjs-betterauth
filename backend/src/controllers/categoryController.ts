import { Request, Response } from "express";
import { prisma } from "../prisma";

export const createCategory = async (req: Request, res: Response) => {
  try {
    if (!req.body.name) {
      return res.status(422).json({ error: "Name is required" });
    }

    if (await prisma.category.findUnique({ where: { name: req.body.name } })) {
      return res
        .status(409)
        .json({ error: `${req.body.name} category already exists` });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: req.body.name,
      },
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
