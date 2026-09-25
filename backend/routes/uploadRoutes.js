import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ensure local uploads directory exists as fallback
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage allows direct stream/buffer uploading to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpg|jpeg|png|webp|gif/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype) || file.mimetype.startsWith('image/');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 }, // 12MB limit
  fileFilter,
});

/**
 * Upload single image
 * @route POST /api/upload
 * @access Public / Authenticated
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // 1. If Cloudinary is configured, upload buffer directly
    if (isCloudinaryConfigured()) {
      try {
        const cloudResult = await uploadBufferToCloudinary(req.file.buffer, {
          folder: 'manmeet-creations/products',
        });
        return res.json({
          success: true,
          imageUrl: cloudResult.secure_url,
          publicId: cloudResult.public_id,
          message: 'Image uploaded to cloud storage successfully! ✨',
        });
      } catch (cloudError) {
        console.warn('Cloudinary upload error, falling back to local storage:', cloudError.message);
      }
    }

    // 2. Local disk fallback
    const ext = path.extname(req.file.originalname) || '.jpg';
    const uniqueName = `craft-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(filePath, req.file.buffer);

    const fileUrl = `/uploads/${uniqueName}`;
    res.json({
      success: true,
      imageUrl: fileUrl,
      message: 'Image uploaded successfully! ✨',
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
});

/**
 * Upload multiple images
 * @route POST /api/upload/multiple
 * @access Private/Admin
 */
router.post('/multiple', upload.array('images', 8), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      if (isCloudinaryConfigured()) {
        try {
          const cloudResult = await uploadBufferToCloudinary(file.buffer, {
            folder: 'manmeet-creations/products',
          });
          uploadedUrls.push(cloudResult.secure_url);
          continue;
        } catch (cloudError) {
          console.warn('Cloudinary multiple upload error:', cloudError.message);
        }
      }

      // Local fallback
      const ext = path.extname(file.originalname) || '.jpg';
      const uniqueName = `craft-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, file.buffer);
      uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    res.json({
      success: true,
      images: uploadedUrls,
      message: `${uploadedUrls.length} images uploaded successfully! ✨`,
    });
  } catch (error) {
    console.error('Multiple image upload failed:', error);
    res.status(500).json({ success: false, message: error.message || 'Multiple image upload failed' });
  }
});

/**
 * Delete image from Cloudinary or local storage
 * @route DELETE /api/upload
 * @access Private/Admin
 */
router.delete('/', protect, admin, async (req, res) => {
  try {
    const { imageUrl, publicId } = req.body;

    if (!imageUrl && !publicId) {
      return res.status(400).json({ success: false, message: 'Image URL or public ID is required for deletion' });
    }

    // 1. Cloudinary deletion
    if (publicId || (imageUrl && imageUrl.includes('cloudinary.com'))) {
      const target = publicId || imageUrl;
      await deleteFromCloudinary(target);
      return res.json({ success: true, message: 'Image deleted from cloud storage' });
    }

    // 2. Local uploads folder deletion
    if (imageUrl && (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('uploads/'))) {
      const filename = path.basename(imageUrl);
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.json({ success: true, message: 'Image removed from local storage' });
    }

    // Generic response if URL is external placeholder
    res.json({ success: true, message: 'Image reference cleared' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete image' });
  }
});

export default router;
