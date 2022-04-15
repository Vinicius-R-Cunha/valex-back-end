import { Router } from "express";
import { createCard } from "../controllers/cardController.js";
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import validateSchemaMiddleWare from "../middlewares/validateSchemaMiddleware.js";
import createCardSchema from "../schemas/createCardSchema.js";

const cardRouter = Router();
cardRouter.post('/cards', validateSchemaMiddleWare(createCardSchema), apiKeyValidationMiddleware, createCard);

export default cardRouter;