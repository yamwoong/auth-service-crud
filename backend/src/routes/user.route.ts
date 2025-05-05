import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// GET /users
router.get('/', userController.getAllUsers.bind(userController));

// POST /users
router.post('/', userController.createUser.bind(userController));

export default router;
