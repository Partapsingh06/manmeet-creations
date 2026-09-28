/**
 * Authoritative Category Configuration & Image Mapping for Manmeet Creations
 */

export const CATEGORY_IMAGE_MAP = {
  'handmade embroidery': 'https://tse1.mm.bing.net/th/id/OIP.1pN9caN2nSmEolbhHiy0mAHaJ7?r=0&pid=Api&h=220&P=0',
  'resin art': 'https://tse1.mm.bing.net/th/id/OIP.dlAspPjeTueR2a-yylVfQgHaEK?r=0&pid=Api&h=220&P=0',
  'fabric painting': 'https://tse2.mm.bing.net/th/id/OIP.zFDMyBBuzRkg1Bt82kl8PwHaEK?r=0&pid=Api&h=220&P=0',
  'portraits': 'https://tse2.mm.bing.net/th/id/OIP.UEhulIfX9VYoWq78GB2qfgHaJ3?r=0&pid=Api&h=220&P=0',
  'portrait': 'https://tse2.mm.bing.net/th/id/OIP.UEhulIfX9VYoWq78GB2qfgHaJ3?r=0&pid=Api&h=220&P=0',
  'handmade gift': 'https://tse1.mm.bing.net/th/id/OIP.LmZ7SNJB4wiph8EsbuPttQHaLH?r=0&pid=Api&h=220&P=0',
  'handmade gifts': 'https://tse1.mm.bing.net/th/id/OIP.LmZ7SNJB4wiph8EsbuPttQHaLH?r=0&pid=Api&h=220&P=0',
  'customized gift': 'https://cdn.shopify.com/s/files/1/2690/0106/files/pink-card-hand-stitched-flowers-faef3548-858ba64178224b6ea52447387c5c8c4b_480x480.jpg?v=1719993524',
  'customized gifts': 'https://cdn.shopify.com/s/files/1/2690/0106/files/pink-card-hand-stitched-flowers-faef3548-858ba64178224b6ea52447387c5c8c4b_480x480.jpg?v=1719993524',
  'handmade jewellery': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  'decorative crafts': 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
};

/**
 * Default Hero Section Featured Artwork Image (Easily configurable)
 * Beautiful handmade floral embroidery hoop artwork matching the cream, beige & soft pink theme.
 */
export const HERO_FEATURED_IMAGE = 'https://tse1.mm.bing.net/th/id/OIP.1pN9caN2nSmEolbhHiy0mAHaJ7?r=0&pid=Api&h=220&P=0';

/**
 * Returns the exact assigned image for a category by name, falling back to any valid provided image or default placeholder.
 */
export const getCategoryDefaultImage = (categoryName, fallbackImage = '') => {
  const normalized = String(categoryName || '').trim().toLowerCase();
  if (CATEGORY_IMAGE_MAP[normalized]) {
    return CATEGORY_IMAGE_MAP[normalized];
  }
  return fallbackImage || HERO_FEATURED_IMAGE;
};
