const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const buildUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!API_URL) {
    return cleanEndpoint.startsWith('/api/') || cleanEndpoint === '/api'
      ? cleanEndpoint
      : `/api${cleanEndpoint}`;
  }

  if (API_URL.endsWith('/api')) {
    const withoutApi = cleanEndpoint.replace(/^\/api(\/|$)/, '/');
    return `${API_URL}${withoutApi.startsWith('/') ? withoutApi : `/${withoutApi}`}`;
  }

  const withApi = cleanEndpoint.startsWith('/api/') || cleanEndpoint === '/api'
    ? cleanEndpoint
    : `/api${cleanEndpoint}`;
  return `${API_URL}${withApi}`;
};

export const getImageUrl = (imageSrc, fallback = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80') => {
  if (!imageSrc) return fallback;
  if (typeof imageSrc !== 'string') return fallback;
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) {
    return imageSrc;
  }
  if (imageSrc.startsWith('/uploads')) {
    const baseUrl = API_URL ? API_URL.replace(/\/api\/?$/, '') : '';
    return baseUrl ? `${baseUrl}${imageSrc}` : imageSrc;
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
    throw new Error(errorMsg);
  }

  return data;
};

export default apiRequest;
