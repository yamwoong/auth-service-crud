import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'any.required': 'Username is required',
    'string.min': 'Username must be at least 3 characters',
  }),

  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),

  name: Joi.string().required().messages({
    'any.required': 'Name is required',
  }),

  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
});
