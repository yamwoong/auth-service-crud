import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '@middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;

  res.status(200).json({
    message: `Welcome to your dashboard, ${user.name}!`,
    user,
  });
});

export default router;
