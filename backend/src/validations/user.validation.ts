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

  provider: Joi.string().valid('local', 'google').default('local'),

  password: Joi.when('provider', {
    is: 'local',
    then: Joi.string().min(6).required().messages({
      'any.required': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    }),
    otherwise: Joi.forbidden(),
  }),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required().messages({
    'any.required': 'Current password is required',
    'string.min': 'Current password must be at least 6 characters',
  }),

  newPassword: Joi.string().min(6).required().messages({
    'any.required': 'New password is required',
    'string.min': 'New password must be at least 6 characters',
  }),
});
