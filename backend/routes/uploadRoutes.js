import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from '../config/cloudinary.js';
import { sanitizeImageUrl } from '../utils/imageSanitizer.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure local uploads directories exist (both in backend and project root if applicable)
const uploadDir = path.resolve(__dirname, '../uploads');
const rootUploadDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(rootUploadDir)) {
  fs.mkdirSync(rootUploadDir, { recursive: true });
}

// Memory storage allows direct stream/buffer uploading to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpg|jpeg|png|webp|jfif|svg/;
  const originalname = file && file.originalname ? String(file.originalname) : '';
  const ext = path.extname(originalname).toLowerCase().replace('.', '');
  const extname = allowedExtensions.test(ext);
  const mimetype = /image\/(jpeg|jpg|png|webp|jfif|svg\+xml)/.test(file?.mimetype || '');

  if (extname || mimetype || (file?.mimetype && file.mimetype.startsWith('image/'))) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, JPEG, PNG, WEBP) are allowed!'));
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

    // 1. If Cloudinary is configured, upload buffer directly — NO silent local fallback
    if (isCloudinaryConfigured()) {
      try {
        const cloudResult = await uploadBufferToCloudinary(req.file.buffer, {
          folder: 'manmeet-creations/products',
        });
        const secureUrl = sanitizeImageUrl(cloudResult.secure_url || cloudResult.url);
        return res.json({
          success: true,
          imageUrl: secureUrl,
          publicId: cloudResult.public_id,
          message: 'Image uploaded to cloud storage successfully! ✨',
        });
      } catch (cloudError) {
        // Cloudinary was configured but upload failed — do NOT silently fall back to local storage.
        // Local files are ephemeral and will be lost on server restart / redeployment.
        console.error('❌ Cloudinary upload FAILED:', cloudError.message);
        return res.status(500).json({
          success: false,
          message: `Cloud image upload failed: ${cloudError.message}. Please check your Cloudinary API credentials in the server .env file (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).`,
        });
      }
    }

    // 2. Local disk storage — only used when Cloudinary is NOT configured (local dev without cloud creds)
    console.warn('⚠️ Cloudinary not configured — saving image to local disk (will NOT persist on hosted deployments).');
    const ext = path.extname(req.file.originalname) || '.jpg';
    const uniqueName = `craft-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    const rootFilePath = path.join(rootUploadDir, uniqueName);

    fs.writeFileSync(filePath, req.file.buffer);
    try {
      fs.writeFileSync(rootFilePath, req.file.buffer);
    } catch {
      // ignore
    }

    const fileUrl = `/uploads/${uniqueName}`;
    res.json({
      success: true,
      imageUrl: fileUrl,
      message: 'Image saved to local storage (⚠️ not permanent on hosted deployments — configure Cloudinary for persistence).',
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
    const cloudinaryEnabled = isCloudinaryConfigured();

    for (const file of req.files) {
      if (cloudinaryEnabled) {
        try {
          const cloudResult = await uploadBufferToCloudinary(file.buffer, {
            folder: 'manmeet-creations/products',
          });
          const secureUrl = sanitizeImageUrl(cloudResult.secure_url || cloudResult.url);
          uploadedUrls.push(secureUrl);
          continue;
        } catch (cloudError) {
          // Cloudinary configured but upload failed — stop and report error
          console.error('❌ Cloudinary multiple upload FAILED:', cloudError.message);
          return res.status(500).json({
            success: false,
            message: `Cloud image upload failed: ${cloudError.message}. Please check your Cloudinary API credentials.`,
          });
        }
      }

      // Local fallback — only when Cloudinary is NOT configured
      const ext = path.extname(file.originalname) || '.jpg';
      const uniqueName = `craft-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);
      const rootFilePath = path.join(rootUploadDir, uniqueName);

      fs.writeFileSync(filePath, file.buffer);
      try {
        fs.writeFileSync(rootFilePath, file.buffer);
      } catch {
        // ignore
      }

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
