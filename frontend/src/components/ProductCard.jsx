import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isLiked = isInWishlist(product._id || product.id);
  const imageUrl =
    (Array.isArray(product.images) && product.images.length > 0)
      ? product.images[0]
      : (product.featuredImage || product.image || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80');

  const discount = product.discountPercent || (
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  );

  return (
    <div className="craft-card product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* Product Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '105%', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)' }}>
        <Link to={`/product/${product.slug || product._id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
            }}
            className="product-card-img"
          />
        </Link>

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {discount > 0 && (
            <span className="badge badge-rose" style={{ fontWeight: 700, fontSize: '0.72rem' }}>
              {discount}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
              <Sparkles size={11} /> Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition-fast)',
            zIndex: 3,
            color: isLiked ? '#E03131' : 'var(--text-muted)',
          }}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={isLiked ? '#E03131' : 'none'} color={isLiked ? '#E03131' : 'currentColor'} />
        </button>

        {/* Quick View Hover Button */}
        <div className="quick-actions-overlay">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
            className="btn btn-sm btn-secondary"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              fontSize: '0.8rem',
              padding: '0.45rem 0.9rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Eye size={15} /> Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Category */}
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--lavender-primary)', fontWeight: 600, marginBottom: '0.35rem' }}>
            {product.category}
          </div>

          {/* Title */}
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.45rem', lineHeight: '1.35', fontFamily: 'var(--font-sans)' }}>
            <Link to={`/product/${product.slug || product._id}`} style={{ color: 'var(--text-main)' }}>
              {product.name}
            </Link>
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', color: '#F59E0B' }}>
              <Star size={14} fill="#F59E0B" />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {product.rating || 4.9}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ({product.numReviews || 12})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Footer */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.9rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-serif-display)' }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="btn btn-sm btn-outline-rose btn-block"
            style={{
              padding: '0.55rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <ShoppingBag size={15} /> Add to Cart
          </button>
        </div>
      </div>

      <style>{`
        .product-card:hover .product-card-img {
          transform: scale(1.06);
        }
        .quick-actions-overlay {
          position: absolute;
          bottom: 12px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          pointer-events: none;
          z-index: 4;
        }
        .product-card:hover .quick-actions-overlay {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
};
