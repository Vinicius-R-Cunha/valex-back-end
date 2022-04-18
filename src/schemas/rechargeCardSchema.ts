import joi from "joi";

const rechargeCardSchema = joi.object(
    {
        amount: joi.number().positive().required()
    }
);

export default rechargeCardSchema;