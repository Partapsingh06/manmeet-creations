export const DEFAULT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80';

export const getBaseApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (import.meta.env.PROD) {
    return DEFAULT_PROD_API_URL;
  }
  return '';
};

/**
 * Builds a clean, non-duplicate API endpoint URL.
 * Guarantees that `/api/api/` is NEVER produced.
 */
export const buildUrl = (endpoint) => {
  let base = getBaseApiUrl();
  // Strip trailing /api and trailing slashes so base is root domain
  base = base.replace(/\/+$/, '').replace(/\/api$/, '');

  let path = (endpoint || '').trim();
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  // Ensure path starts with /api (without duplicating)
  if (!path.startsWith('/api/') && path !== '/api') {
    path = `/api${path}`;
  }
  // Remove any duplicate /api/api occurrences
  path = path.replace(/^\/api(\/api)+/, '/api');

  return base ? `${base}${path}` : path;
};

/**
 * Normalizes and cleans Cloudinary URLs:
 * - Fixes protocol (https://)
 * - Repairs malformed transformations such as `q_auto:best:1`, `q_auto:good:1`, `q_auto:1`
 * - Removes double slashes
 */
export const cleanCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }
  let clean = url.trim().replace(/^["']+|["']+$/g, '');

  // Fix protocol prefixes
  if (clean.startsWith('//')) {
    clean = `https:${clean}`;
  }
  if (clean.startsWith('res.cloudinary.com') || clean.startsWith('cloudinary.com')) {
    clean = `https://${clean}`;
  }
  clean = clean.replace(/^i?https?:?\/?\/?/i, 'https://');

  // Fix malformed quality transformations such as q_auto:best:1 or q_auto:good:1 or q_auto:1
  clean = clean.replace(/q_auto:(best|good|eco|low):\d+/g, 'q_auto:$1');
  clean = clean.replace(/q_auto:\d+/g, 'q_auto');

  // Fix double slashes in path
  clean = clean.replace(/(https?:\/\/res\.cloudinary\.com\/[^/]+)\/\/+/g, '$1/');
  clean = clean.replace(/\/upload\/\/+/g, '/upload/');

  return clean;
};

/**
 * Robust image URL sanitizer
 * Catches concatenated URLs, malformed schemas, and broken transformation queries
 */
export const getImageUrl = (imageSrc, fallback = DEFAULT_PLACEHOLDER_IMAGE) => {
  if (!imageSrc || typeof imageSrc !== 'string') return fallback;
  let clean = imageSrc.trim().replace(/^["']+|["']+$/g, '');

  if (!clean || clean === 'null' || clean === 'undefined' || clean === '[object Object]') {
    return fallback;
  }

  // Reject Instagram post links (HTML pages, not direct images)
  if (clean.includes('instagram.com/p/') || clean.includes('instagram.com/reel/') || clean.includes('instagram.com/tv/')) {
    return fallback;
  }

  // Handle Cloudinary URLs with auto-repair
  if (clean.includes('cloudinary.com')) {
    return cleanCloudinaryUrl(clean);
  }

  // Fix protocol-less URLs
  if (clean.startsWith('//')) {
    clean = `https:${clean}`;
  }

  // Fix malformed protocol prefixes (e.g. 'ihttps//', 'http//')
  if (clean.startsWith('ihttps://') || clean.startsWith('ihttps//') || clean.startsWith('http//') || clean.startsWith('https//')) {
    clean = clean.replace(/^i?https?:?\/?\/?/i, 'https://');
  }

  // Local uploads path (relative or with preceding slash)
  if (clean.startsWith('/uploads') || clean.startsWith('uploads/')) {
    const cleanUploadPath = clean.startsWith('/') ? clean : `/${clean}`;
    let base = getBaseApiUrl().replace(/\/+$/, '').replace(/\/api$/, '');
    return base ? `${base}${cleanUploadPath}` : cleanUploadPath;
  }

  // Full URL containing /uploads/
  if (clean.includes('/uploads/')) {
    const uploadIdx = clean.indexOf('/uploads/');
    const cleanUploadPath = clean.substring(uploadIdx);
    let base = getBaseApiUrl().replace(/\/+$/, '').replace(/\/api$/, '');
    return base ? `${base}${cleanUploadPath}` : cleanUploadPath;
  }

  // Direct valid URLs (HTTP, HTTPS, Base64 Data URLs, Blob URLs for local temporary preview)
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:image/') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  // Anything that's not a recognized URL pattern is invalid — return fallback
  return fallback;
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('manmeet_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData (e.g. file upload), remove Content-Type so browser sets multipart boundary
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const url = buildUrl(endpoint);
  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.data = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

/**
 * Upload single image file to server (Cloudinary or local storage)
 * @param {File} file 
 * @returns {Promise<{ success: boolean, imageUrl: string, message: string }>}
 */
export const uploadImageFile = async (file) => {
  if (!file) throw new Error('No file selected for upload');
  
  // Format check: JPG, JPEG, PNG, WEBP
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const isAllowedExt = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!allowedTypes.includes(file.type) && !isAllowedExt) {
    throw new Error('Please select a valid image file (.jpg, .jpeg, .png, .webp)');
  }

  // Size limit: 12MB
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('Image is too large. Maximum allowed size is 12MB.');
  }

  const formData = new FormData();
  formData.append('image', file);

  return await apiRequest('/upload', {
    method: 'POST',
    body: formData,
  });
};

/**
 * Delete image file from server / Cloudinary
 * @param {string} imageUrl 
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteImageFile = async (imageUrl) => {
  if (!imageUrl) return { success: true };
  try {
    return await apiRequest('/upload', {
      method: 'DELETE',
      body: JSON.stringify({ imageUrl }),
    });
  } catch (err) {
    console.warn('Image deletion request error:', err.message);
    return { success: false, message: err.message };
  }
};

export default apiRequest;
