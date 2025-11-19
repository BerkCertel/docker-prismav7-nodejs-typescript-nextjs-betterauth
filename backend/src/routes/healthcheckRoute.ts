import { Router } from "express";
import { healthcheck } from "../controllers/healthcheckController";

const healthcheckRouter = Router();

healthcheckRouter.get("/", healthcheck);

export default healthcheckRouter;
