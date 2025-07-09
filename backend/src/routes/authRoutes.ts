import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(authenticateToken);
router.get('/profile', getProfile);
router.put('/profile', uploadSingle('profileImage'), updateProfile);
router.put('/change-password', changePassword);

export default router;
