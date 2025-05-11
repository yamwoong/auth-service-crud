import Joi from 'joi';

/**
 * DTO for password reset
 */

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

/**
 * Joi schema to validate reset-password request
 */

export const resetPasswordSchema = Joi.object<ResetPasswordDto>({
  token: Joi.string().required().messages({
    'any.required': 'Reset token is required',
    'string.empty': 'Reset token cannot be empty',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'any.required': 'New password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
});
