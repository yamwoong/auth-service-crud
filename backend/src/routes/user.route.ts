import { Router } from 'express';
import { createUser, getAllUsers } from '../controllers/user.controller';

const router = Router();

// GET /users
router.get('/', getAllUsers);

// POST /users
router.post('/', createUser);

export default router;
