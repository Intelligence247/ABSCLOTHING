import express from 'express';
import { upload } from '../utils/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private / Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No image provided' });
  }

  res.send({
    message: 'Image Uploaded successfully',
    image: req.file.path,
  });
});

export default router;
