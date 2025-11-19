import { Router } from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.post("/create-category", createCategory);
categoryRouter.get("/all-categories", getAllCategories);
export default categoryRouter;
