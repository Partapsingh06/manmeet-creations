import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryUrl = process.env.CLOUDINARY_URL;

export const isCloudinaryConfigured = () => {
  if (cloudinaryUrl && cloudinaryUrl.trim() !== '' && !cloudinaryUrl.includes('placeholder')) return true;
  if (!cloudName || !apiKey || !apiSecret) return false;
  // If razorpay test key or placeholder is placed in CLOUDINARY_API_KEY, do not attempt Cloudinary
  if (apiKey.startsWith('rzp_') || apiKey.includes('placeholder') || apiSecret.includes('placeholder')) {
    return false;
  }
  return true;
};

if (isCloudinaryConfigured()) {
  if (cloudinaryUrl) {
    cloudinary.config({
      cloudinary_url: cloudinaryUrl,
      secure: true,
    });
  } else {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
}

/**
 * Upload buffer to Cloudinary
 * @param {Buffer} buffer 
 * @param {Object} options 
 * @returns {Promise<Object>}
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error('Cloudinary credentials are not configured.'));
    }

    const uploadOptions = {
      folder: 'manmeet-creations/products',
      resource_type: 'image',
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    stream.end(buffer);
  });
};

/**
 * Extract publicId from a Cloudinary URL
 * Accurately skips transformation segments (e.g. q_auto:best, f_auto, w_500, etc.)
 * and version segments (v123456789)
 * @param {string} url 
 * @returns {string|null}
 */
export const extractCloudinaryPublicId = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return null;
  }
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let pathAfterUpload = parts[1];

    // Remove query params if any
    pathAfterUpload = pathAfterUpload.split('?')[0];

    // Split path into directory & file segments
    const segments = pathAfterUpload.split('/');
    let startIndex = 0;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      // Check if version segment (e.g. v1709123456)
      if (/^v\d+$/.test(seg)) {
        startIndex = i + 1;
        break;
      }
      // Check if transformation segment (e.g. q_auto, q_auto:best, f_auto, w_800, c_crop, etc.)
      const isTransformation = /^[a-z]{1,4}_[a-zA-Z0-9_:,.-]+$/.test(seg) || seg.includes(',');
      if (isTransformation) {
        startIndex = i + 1;
      } else {
        startIndex = i;
        break;
      }
    }

    const publicIdSegments = segments.slice(startIndex);
    if (publicIdSegments.length === 0) return null;

    let fullPublicId = publicIdSegments.join('/');
    // Strip file extension (.jpg, .png, .webp, etc.)
    const dotIndex = fullPublicId.lastIndexOf('.');
    if (dotIndex !== -1) {
      fullPublicId = fullPublicId.substring(0, dotIndex);
    }
    return decodeURIComponent(fullPublicId);
  } catch {
    return null;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicIdOrUrl 
 * @returns {Promise<Object>}
 */
export const deleteFromCloudinary = async (publicIdOrUrl) => {
  if (!isCloudinaryConfigured() || !publicIdOrUrl) {
    return { success: false, message: 'Cloudinary not configured or invalid id' };
  }

  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.startsWith('http') || publicIdOrUrl.includes('/')) {
    const extracted = extractCloudinaryPublicId(publicIdOrUrl);
    if (extracted) {
      publicId = extracted;
    }
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
    return { success: false, error: error.message };
  }
};

export default cloudinary;
