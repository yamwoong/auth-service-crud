import Joi from 'joi';

/**
 * Shape of the request body for password reset request.
 */

export interface ForgotPasswordDto {
  username: string;
}

/**
 * Joi schema to validate forgot-password input.
 */

export const forgotPasswordSchema = Joi.object<ForgotPasswordDto>({
  username: Joi.string().min(3).max(30).required().messages({
    'any.required': 'Username is required',
    'string.min': 'Username must be at least 3 characters',
  }),
});
