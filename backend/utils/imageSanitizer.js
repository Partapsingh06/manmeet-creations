/**
 * Image URL Sanitizer and Validator
 * Ensures only valid single image URLs are stored and transmitted.
 */

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80';

export const sanitizeImageUrl = (url, fallback = DEFAULT_PLACEHOLDER) => {
  if (!url || typeof url !== 'string') return fallback;
  let clean = url.trim();

  if (!clean || clean === 'null' || clean === 'undefined' || clean === '[object Object]') {
    return fallback;
  }

  // Detect and fix concatenated URLs (e.g. instagram + unsplash or double https)
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

  // Reject Instagram post links (not direct images)
  if (clean.includes('instagram.com/p/') || clean.includes('instagram.com/reel/') || clean.includes('instagram.com/tv/')) {
    return fallback;
  }

  // Fix malformed protocol prefixes (e.g. 'ihttps//', 'http//')
  if (clean.startsWith('ihttps://') || clean.startsWith('ihttps//') || clean.startsWith('http//') || clean.startsWith('https//')) {
    clean = clean.replace(/^i?https?:?\/\/?/i, 'https://');
  }

  // Local uploads path
  if (clean.startsWith('/uploads') || clean.startsWith('uploads/')) {
    return clean.startsWith('/') ? clean : `/${clean}`;
  }

  // Direct valid URLs
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:') || clean.startsWith('blob:')) {
    // If concatenated with a second http, extract the second one if valid
    const secondHttp = clean.indexOf('http', 8);
    if (secondHttp !== -1) {
      const secondPart = clean.substring(secondHttp);
      if (secondPart.startsWith('http://') || secondPart.startsWith('https://')) {
        return sanitizeImageUrl(secondPart, fallback);
      }
      return fallback;
    }
    return clean;
  }

  return fallback;
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
