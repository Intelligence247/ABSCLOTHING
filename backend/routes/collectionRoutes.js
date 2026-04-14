import express from 'express';
const router = express.Router();
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collectionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getCollections).post(protect, admin, createCollection);
router
  .route('/:id')
  .get(getCollectionById)
  .put(protect, admin, updateCollection)
  .delete(protect, admin, deleteCollection);

export default router;
