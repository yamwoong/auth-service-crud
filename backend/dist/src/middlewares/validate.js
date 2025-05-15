"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const AppError_1 = require("@errors/AppError");
const errors_1 = require("@constants/errors");
/**
 * Request validation middleware based on Joi schema.
 *
 * @param schema Joi schema object (e.g., loginSchema)
 * @param property The part of the request to validate ('body' | 'query' | 'params')
 */
const validate = (schema, property = 'body') => (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
        const message = error.details.map((detail) => detail.message).join(', ');
        throw new AppError_1.AppError(errors_1.COMMON_ERRORS.VALIDATION_FAILED, 400);
    }
    next();
};
exports.validate = validate;
