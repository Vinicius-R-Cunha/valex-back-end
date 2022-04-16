import joi from "joi";

const activateCardSchema = joi.object(
    {
        password: joi.string().length(4).pattern(/^[0-9]+$/).required(),
        cvc: joi.string().length(3).required()
    }
);

export default activateCardSchema;