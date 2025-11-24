import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  deleteCategoryById,
  getCategoryById,
  updateCategoryById,
} from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.post("/create-category", createCategory);
categoryRouter.get("/all-categories", getAllCategories);
categoryRouter.get("/get-simple-category/:id", getCategoryById);
categoryRouter.delete("/delete-category/:id", deleteCategoryById);
categoryRouter.put("/update-category/:id", updateCategoryById);

export default categoryRouter;
