import { Router } from "express";
import { healthcheck } from "../controllers/healthcheckController";

const healthcheckRouter = Router();

healthcheckRouter.get("/ping", healthcheck);

export default healthcheckRouter;
