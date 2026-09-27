/**
 * Image URL Sanitizer and Validator
 * Ensures only valid single image URLs are stored and transmitted.
 */

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80';

export const sanitizeImageUrl = (url, fallback = '') => {
  if (!url || typeof url !== 'string') return fallback;
  let clean = url.trim();

  if (!clean || clean === 'null' || clean === 'undefined' || clean === '[object Object]') {
    return fallback;
  }

  // Reject Instagram post links (HTML pages, not direct image files)
  if (clean.includes('instagram.com/p/') || clean.includes('instagram.com/reel/') || clean.includes('instagram.com/tv/')) {
    return fallback;
  }

  // If local /uploads path (e.g. from full URL or relative path)
  if (clean.includes('/uploads/')) {
    const uploadIdx = clean.indexOf('/uploads/');
    return clean.substring(uploadIdx);
  }
  if (clean.startsWith('uploads/')) {
    return `/${clean}`;
  }

  // If it's a Cloudinary or Unsplash URL, ensure valid protocol
  if (clean.startsWith('ihttps://') || clean.startsWith('ihttps//') || clean.startsWith('http//') || clean.startsWith('https//')) {
    clean = clean.replace(/^i?https?:?\/\/?/i, 'https://');
  }

  // Direct valid URLs (HTTP, HTTPS, Base64 Data URI, Blob)
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:image/') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  return clean || fallback;
};

export const sanitizeImageList = (images) => {
  if (!images) return [];
  let list = [];
  if (Array.isArray(images)) {
    list = images;
  } else if (typeof images === 'string') {
    list = images.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return list
    .map((img) => sanitizeImageUrl(img, ''))
    .filter((img) => img && typeof img === 'string' && img.trim() !== '');
};
