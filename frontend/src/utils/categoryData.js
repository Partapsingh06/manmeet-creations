/**
 * Authoritative Category Configuration & Image Mapping for Manmeet Creations
 */

export const CATEGORY_IMAGE_MAP = {
  'handmade embroidery': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
  'resin art': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  'fabric painting': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  'portraits': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  'portrait': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  'handmade gift': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  'handmade gifts': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  'customized gift': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
  'customized gifts': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
  'handmade jewellery': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  'decorative crafts': 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
};

/**
 * Default Hero Section Featured Artwork Image (Easily configurable)
 */
export const HERO_FEATURED_IMAGE = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80';

/**
 * Returns the exact assigned image for a category, prioritizing any uploaded custom image first,
 * then falling back to known category map, and finally the default placeholder.
 */
export const getCategoryDefaultImage = (categoryName, customImage = '') => {
  if (customImage && typeof customImage === 'string' && customImage.trim() !== '') {
    return customImage.trim();
  }
  const normalized = String(categoryName || '').trim().toLowerCase();
  if (CATEGORY_IMAGE_MAP[normalized]) {
    return CATEGORY_IMAGE_MAP[normalized];
  }
  return HERO_FEATURED_IMAGE;
};
