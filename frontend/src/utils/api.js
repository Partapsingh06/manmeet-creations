// Manmeet Creations - Central API Client Configuration
const DEFAULT_PROD_API_URL = 'https://manmeet-creations.onrender.com';

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

export const buildUrl = (endpoint) => {
  const baseUrl = getBaseApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!baseUrl) {
    return cleanEndpoint.startsWith('/api/') || cleanEndpoint === '/api'
      ? cleanEndpoint
      : `/api${cleanEndpoint}`;
  }

  if (baseUrl.endsWith('/api')) {
    const withoutApi = cleanEndpoint.replace(/^\/api(\/|$)/, '/');
    return `${baseUrl}${withoutApi.startsWith('/') ? withoutApi : `/${withoutApi}`}`;
  }

  const withApi = cleanEndpoint.startsWith('/api/') || cleanEndpoint === '/api'
    ? cleanEndpoint
    : `/api${cleanEndpoint}`;
  return `${baseUrl}${withApi}`;
};

export const getImageUrl = (
  imageSrc,
  fallback = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80'
) => {
  if (!imageSrc) return fallback;
  if (typeof imageSrc !== 'string') return fallback;
  if (
    imageSrc.startsWith('http://') ||
    imageSrc.startsWith('https://') ||
    imageSrc.startsWith('data:') ||
    imageSrc.startsWith('blob:')
  ) {
    return imageSrc;
  }
  if (imageSrc.startsWith('/uploads') || imageSrc.startsWith('uploads/')) {
    const cleanUploadPath = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
    const baseUrl = getBaseApiUrl().replace(/\/api\/?$/, '');
    return baseUrl ? `${baseUrl}${cleanUploadPath}` : cleanUploadPath;
  }
  return imageSrc;
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('manmeet_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData (e.g. file upload), remove Content-Type so browser sets boundary
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
  
  // Format check
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type) && !/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
    throw new Error('Please select a valid image (JPG, JPEG, PNG, WEBP, GIF)');
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
