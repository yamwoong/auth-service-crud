import { Router } from 'express';
import { createUser, getAllUsers } from '@controllers/user.controller';
import { updatePassword } from '@controllers/auth.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate';
import { updatePasswordSchema } from '@validations/user.validation';

const router = Router();

// GET /users
router.get('/', getAllUsers);

// POST /users
router.post('/', createUser);

// PATCH /users/me/password
router.patch('/me/password', authMiddleware, validate(updatePasswordSchema), updatePassword);

export default router;
