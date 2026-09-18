import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  addAddress,
  toggleWishlist,
  forgotPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.post('/forgot-password', forgotPassword);

export default router;
