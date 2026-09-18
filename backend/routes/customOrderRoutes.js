import express from 'express';
import {
  createCustomOrder,
  getAllCustomOrders,
  getCustomOrderById,
  updateCustomOrderStatus,
} from '../controllers/customOrderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createCustomOrder)
  .get(protect, admin, getAllCustomOrders);

router.route('/:id')
  .get(getCustomOrderById)
  .put(protect, admin, updateCustomOrderStatus);

export default router;
