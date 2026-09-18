import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, Truck, Clock, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const QuickViewModal = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.featuredImage || product.image || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80'];

  const isLiked = isInWishlist(product._id || product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, customNote);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '820px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          {/* Gallery Col */}
          <div>
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-subtle)',
                aspectRatio: '1 / 1',
                marginBottom: '1rem',
              }}
            >
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2px solid var(--rose-primary)' : '1px solid var(--border-subtle)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Col */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--lavender-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
                {product.category}
              </div>

              <h2 style={{ fontSize: '1.45rem', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                {product.name}
              </h2>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', color: '#F59E0B' }}>
                  <Star size={16} fill="#F59E0B" />
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.rating || 4.9}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({product.numReviews || 18} reviews)</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="badge badge-rose">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Description Snippet */}
              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                {product.description?.slice(0, 180)}...
              </p>

              {/* Quick specs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                {product.dimensions && <div><strong>Size:</strong> {product.dimensions}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} color="var(--rose-primary)" />
                  <span>Handcrafted & dispatched in {product.leadTimeDays || 3} business days</span>
                </div>
              </div>

              {/* Custom note if customizable */}
              {product.isCustomizable && (
                <div style={{ marginBottom: '1.2rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={14} color="var(--gold-accent)" /> Personalization Note (Optional):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., Names: Karan & Ananya, Date: 12 Dec 2026"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    style={{ fontSize: '0.88rem', padding: '0.6rem 0.9rem' }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1rem' }}>
                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-ivory)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ border: 'none', background: 'none', padding: '0.6rem 0.9rem', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 600, padding: '0 0.5rem', minWidth: '24px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ border: 'none', background: 'none', padding: '0.6rem 0.9rem', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1 }}>
                  <ShoppingBag size={18} /> Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isLiked ? '#E03131' : 'var(--text-muted)',
                  }}
                >
                  <Heart size={20} fill={isLiked ? '#E03131' : 'none'} />
                </button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link
                  to={`/product/${product.slug || product._id}`}
                  onClick={onClose}
                  style={{ fontSize: '0.88rem', color: 'var(--rose-primary)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  View Full Product Details & Customer Reviews →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
