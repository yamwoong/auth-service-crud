import { Router } from 'express';
import { login, refresh } from '@controllers/auth.controller';

const router = Router();

// Login endpoint
router.post('/login', login);

// Refresh access token using the refresh token
router.post('/refresh', refresh);

export default router;
