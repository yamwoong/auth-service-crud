import Joi from 'joi';

export const createPostSchema = Joi.object({
  title: Joi.string().trim().min(3).required().messages({
    'string.empty': 'Title is required.',
    'string.min': 'Title must be at least 3 characters.',
  }),
  content: Joi.string().required().messages({ 'string.empty': 'Content is required.' }),
  authorId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Author ID must be a 24-character hex string.',
  }),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(3).messages({
    'string.min': 'Title must be at least 3 characters.',
  }),
  content: Joi.string().messages({ 'string.empty': 'Content cannot be empty.' }),
})
  .or('title', 'content')
  .messages({
    'object.missing': 'At least one of title or content must be provided.',
  });
