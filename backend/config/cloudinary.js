import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cleanEnvVar = (val) => {
  if (!val) return '';
  return String(val).trim().replace(/^["']+|["']+$/g, '');
};

/**
 * Check if Cloudinary is configured with valid credentials.
 * Returns false if credentials are missing, placeholders, or obviously wrong
 * (e.g. a Razorpay key pasted into the Cloudinary API key field).
 */
export const isCloudinaryConfigured = () => {
  const cloudinaryUrl = cleanEnvVar(process.env.CLOUDINARY_URL);
  const cloudName = cleanEnvVar(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME);
  const apiKey = cleanEnvVar(process.env.CLOUDINARY_API_KEY);
  const apiSecret = cleanEnvVar(process.env.CLOUDINARY_API_SECRET);

  if (
    cloudinaryUrl &&
    !cloudinaryUrl.includes('placeholder') &&
    !cloudinaryUrl.includes('your_') &&
    !cloudinaryUrl.includes('<')
  ) {
    return true;
  }

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  // Detect placeholder / example strings
  const isPlaceholder = (val) =>
    val.includes('placeholder') ||
    val.includes('your_') ||
    val.includes('<') ||
    val.includes('>');

  if (isPlaceholder(apiKey) || isPlaceholder(apiSecret) || isPlaceholder(cloudName)) {
    return false;
  }

  // Detect obviously wrong keys (e.g. Razorpay / Stripe keys pasted by mistake)
  if (apiKey.startsWith('rzp_') || apiKey.startsWith('sk_') || apiKey.startsWith('pk_')) {
    console.error(
      '❌ CLOUDINARY_API_KEY appears to be a Razorpay/Stripe key, not a Cloudinary key!',
      'Cloudinary API keys are numeric (e.g. 123456789012345).',
      'Please set your genuine Cloudinary API key in backend/.env or Render environment variables.'
    );
    return false;
  }

  return true;
};

/**
 * Get Cloudinary diagnostic status for troubleshooting
 */
export const getCloudinaryStatus = () => {
  const isConfigured = isCloudinaryConfigured();
  const cloudName = cleanEnvVar(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME);
  const apiKey = cleanEnvVar(process.env.CLOUDINARY_API_KEY);
  const hasSecret = Boolean(cleanEnvVar(process.env.CLOUDINARY_API_SECRET));

  let reason = 'Ready for cloud uploads';
  if (!isConfigured) {
    if (apiKey.startsWith('rzp_') || apiKey.startsWith('sk_') || apiKey.startsWith('pk_')) {
      reason = 'CLOUDINARY_API_KEY contains a payment gateway key instead of numeric Cloudinary API Key';
    } else if (!cloudName || !apiKey || !hasSecret) {
      const missing = [];
      if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
      if (!apiKey) missing.push('CLOUDINARY_API_KEY');
      if (!hasSecret) missing.push('CLOUDINARY_API_SECRET');
      reason = `Missing Cloudinary environment variable(s): ${missing.join(', ')}`;
    } else {
      reason = 'Cloudinary credentials appear invalid or contain placeholder template values';
    }
  }

  return {
    configured: isConfigured,
    cloudName: isConfigured ? cloudName : undefined,
    reason,
  };
};

/**
 * Ensures Cloudinary is configured with latest process.env values
 */
export const ensureCloudinaryConfig = () => {
  if (!isCloudinaryConfigured()) return false;

  const cUrl = cleanEnvVar(process.env.CLOUDINARY_URL);
  const cName = cleanEnvVar(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME);
  const aKey = cleanEnvVar(process.env.CLOUDINARY_API_KEY);
  const aSecret = cleanEnvVar(process.env.CLOUDINARY_API_SECRET);

  if (cUrl) {
    cloudinary.config({
      cloudinary_url: cUrl,
      secure: true,
    });
  } else if (cName && aKey && aSecret) {
    cloudinary.config({
      cloud_name: cName,
      api_key: aKey,
      api_secret: aSecret,
      secure: true,
    });
  }
  return true;
};

// Initial config attempt
ensureCloudinaryConfig();

/**
 * Upload buffer to Cloudinary with collision-free unique public ID
 * @param {Buffer} buffer 
 * @param {Object} options 
 * @returns {Promise<Object>}
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!ensureCloudinaryConfig()) {
      return reject(new Error('Cloudinary credentials are not properly configured.'));
    }

    const uniquePublicId = `craft-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const uploadOptions = {
      folder: 'manmeet-creations/products',
      public_id: uniquePublicId,
      resource_type: 'image',
      unique_filename: true,
      overwrite: false,
      use_filename: false,
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary stream upload error:', error.message || error);
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
 * Delete image from Cloudinary safely
 * @param {string} publicIdOrUrl 
 * @returns {Promise<Object>}
 */
export const deleteFromCloudinary = async (publicIdOrUrl) => {
  if (!ensureCloudinaryConfig() || !publicIdOrUrl) {
    return { success: false, message: 'Cloudinary not configured or invalid id' };
  }

  // Never attempt to delete external placeholder images (e.g. Unsplash)
  if (typeof publicIdOrUrl === 'string' && (publicIdOrUrl.includes('unsplash.com') || !publicIdOrUrl.includes('cloudinary.com'))) {
    return { success: true, message: 'Skipped non-Cloudinary image' };
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
    console.warn('Cloudinary delete warning:', error.message);
    return { success: false, error: error.message };
  }
};

export default cloudinary;
