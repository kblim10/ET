import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
  getUserPosts
} from '../controllers/communityController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes with optional auth
router.get('/posts', optionalAuth, getAllPosts);
router.get('/posts/:id', optionalAuth, getPostById);

// Protected routes
router.use(authenticateToken);

// Post management
router.post('/posts', uploadSingle('media'), createPost);
router.put('/posts/:id', uploadSingle('media'), updatePost);
router.delete('/posts/:id', deletePost);

// Post interactions
router.post('/posts/:id/like', toggleLikePost);
router.post('/posts/:id/comments', addComment);

// User content
router.get('/my-posts', getUserPosts);

export default router;
