import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = () => {
  return Boolean(cloudName && apiKey && apiSecret);
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
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
      folder: 'manmeet-creations',
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
    // Remove version tag e.g. v123456789/
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
    // Remove file extension
    const dotIndex = pathAfterUpload.lastIndexOf('.');
    if (dotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, dotIndex);
    }
    return decodeURIComponent(pathAfterUpload);
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
  if (publicIdOrUrl.startsWith('http')) {
    const extracted = extractCloudinaryPublicId(publicIdOrUrl);
    if (!extracted) {
      return { success: false, message: 'Could not extract Cloudinary public ID' };
    }
    publicId = extracted;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
};

export default cloudinary;
