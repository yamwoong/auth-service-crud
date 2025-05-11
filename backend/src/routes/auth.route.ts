import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import {
  login,
  refresh,
  logout,
  googleAuthRedirect,
  googleAuthCallback,
  forgotPassword,
  resetPassword,
} from '@controllers/auth.controller';

const router = Router();

// Login endpoint
router.post('/login', login);

// Refresh access token using the refresh token
router.post('/refresh', refresh);

router.post('/logout', authMiddleware, logout);

router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);
export default router;
