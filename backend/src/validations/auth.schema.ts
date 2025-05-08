import Joi from 'joi';

/**
 * Login validation schema
 * - Requires either email or username
 * - Password must be at least 6 characters
 */

export const loginSchema = Joi.object({
  email: Joi.string().email(),
  username: Joi.string().alphanum().min(3),
  password: Joi.string().min(6).required(),
})
  .or('email', 'username')
  .messages({
    'object.missing': 'Either email or username is required',
    'string.email': 'Email must be a valid email address',
    'string.min': '{#label} must be at least {#limit} characters',
    'any.required': '{#label} is required',
  });
