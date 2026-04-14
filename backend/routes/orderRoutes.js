import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  deleteOrder,
  getGuestOrderSummary,
  uploadOrderReceipt,
  verifyBankPayment,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadReceipt } from '../utils/cloudinary.js';

router.route('/').post(addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);

router.get('/:id/guest-summary', getGuestOrderSummary);
router.post('/:id/receipt', uploadReceipt.single('receipt'), uploadOrderReceipt);
router.put('/:id/payment-verify', protect, admin, verifyBankPayment);

router.route('/:id/pay').put(updateOrderToPaid);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);

export default router;
