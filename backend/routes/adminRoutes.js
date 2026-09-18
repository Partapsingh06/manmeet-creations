import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllReviews,
  deleteReview,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;
