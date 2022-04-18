import { Router } from "express";
import { payService } from "../controllers/paymentController.js";
import validateSchemaMiddleWare from "../middlewares/validateSchemaMiddleware.js";
import paymentSchema from "../schemas/paymentSchema.js";

const paymentRouter = Router();
paymentRouter.post(
    '/payment/:cardId',
    validateSchemaMiddleWare(paymentSchema),
    payService
);

export default paymentRouter;