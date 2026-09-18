import express from 'express';
import {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage,
  updateMessageStatus,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createContactMessage)
  .get(protect, admin, getAllContactMessages);

router.route('/:id')
  .put(protect, admin, updateMessageStatus)
  .delete(protect, admin, deleteContactMessage);

export default router;
