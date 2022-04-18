import { Router } from "express";
import { activateCard, createCard, getBalance } from "../controllers/cardController.js";
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import validateSchemaMiddleWare from "../middlewares/validateSchemaMiddleware.js";
import activateCardSchema from "../schemas/activateCardSchema.js";
import createCardSchema from "../schemas/createCardSchema.js";

const cardRouter = Router();
cardRouter.post('/cards', validateSchemaMiddleWare(createCardSchema), apiKeyValidationMiddleware, createCard);
cardRouter.post('/activate/:cardId', validateSchemaMiddleWare(activateCardSchema), activateCard);
cardRouter.get('/balance/:cardId', getBalance);

export default cardRouter;