import express from 'express';
import {
  createContactMessage,
  getAdminContactMessages,
  replyToContactMessage,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createContactMessage);
router.get('/admin/messages', protect, admin, getAdminContactMessages);
router.post('/admin/messages/:id/reply', protect, admin, replyToContactMessage);

export default router;
