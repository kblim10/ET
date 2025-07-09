import express from 'express';
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz,
  getQuizResults,
  updateQuiz,
  deleteQuiz
} from '../controllers/quizController';
import { authenticateToken, authorizeRoles, optionalAuth } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes (with optional auth for attempt tracking)
router.get('/', optionalAuth, getAllQuizzes);
router.get('/:id', optionalAuth, getQuizById);

// Protected routes
router.use(authenticateToken);

// Student routes
router.post('/:id/submit', submitQuiz);
router.get('/:id/results', getQuizResults);

// Teacher and admin routes
router.post('/', authorizeRoles('guru', 'superadmin'), createQuiz);
router.put('/:id', authorizeRoles('guru', 'superadmin'), updateQuiz);
router.delete('/:id', authorizeRoles('guru', 'superadmin'), deleteQuiz);

export default router;
