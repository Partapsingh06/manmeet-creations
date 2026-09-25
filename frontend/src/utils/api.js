// Manmeet Creations - Central API Client Configuration
const DEFAULT_PROD_API_URL = 'https://manmeet-creations.onrender.com';
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
 * Robust image URL sanitizer
 * Catches concatenated URLs (e.g. instagram + unsplash), malformed schemas, and HTML links
 */
export const getImageUrl = (imageSrc, fallback = DEFAULT_PLACEHOLDER_IMAGE) => {
  if (!imageSrc || typeof imageSrc !== 'string') return fallback;
  let clean = imageSrc.trim();

  if (!clean || clean === 'null' || clean === 'undefined' || clean === '[object Object]') {
    return fallback;
  }

  // Detect and extract embedded valid Cloudinary or Unsplash URLs if concatenated
  if (clean.includes('cloudinary.com') || clean.includes('unsplash.com')) {
    const cloudMatch = clean.match(/https?:\/\/[^\s"'<>]*(?:res\.cloudinary\.com|cloudinary\.com)[^\s"'<>]+/i);
    if (cloudMatch) return cloudMatch[0];

    const unsplashMatch = clean.match(/(?:https?:\/\/)?(?:i?mages\.unsplash\.com)[^\s"'<>]+/i);
    if (unsplashMatch) {
      let uUrl = unsplashMatch[0];
      if (!uUrl.startsWith('http')) {
        uUrl = `https://${uUrl.replace(/^i?mages\./, 'images.')}`;
      }
      return uUrl;
    }
  }

  // Reject Instagram post links (HTML pages, not direct images)
  if (clean.includes('instagram.com/p/') || clean.includes('instagram.com/reel/') || clean.includes('instagram.com/tv/')) {
    return fallback;
  }

  // Fix malformed protocol prefixes (e.g. 'ihttps//', 'http//')
  if (clean.startsWith('ihttps://') || clean.startsWith('ihttps//') || clean.startsWith('http//') || clean.startsWith('https//')) {
    clean = clean.replace(/^i?https?:?\/\/?/i, 'https://');
  }

  // Local uploads path
  if (clean.startsWith('/uploads') || clean.startsWith('uploads/')) {
    const cleanUploadPath = clean.startsWith('/') ? clean : `/${clean}`;
    let base = getBaseApiUrl().replace(/\/+$/, '').replace(/\/api$/, '');
    return base ? `${base}${cleanUploadPath}` : cleanUploadPath;
  }

  // Direct valid URLs
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:') || clean.startsWith('blob:')) {
    // If concatenated with a second http in the string, extract the second if valid
    const secondHttp = clean.indexOf('http', 8);
    if (secondHttp !== -1) {
      const secondPart = clean.substring(secondHttp);
      if (secondPart.startsWith('http://') || secondPart.startsWith('https://')) {
        return getImageUrl(secondPart, fallback);
      }
      return fallback;
    }
    return clean;
  }

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
