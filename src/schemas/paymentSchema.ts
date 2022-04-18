import joi from "joi";

const paymentSchema = joi.object(
    {
        password: joi.string().required(),
        businessId: joi.number().required(),
        amount: joi.number().positive().required()
    }
);

export default paymentSchema;