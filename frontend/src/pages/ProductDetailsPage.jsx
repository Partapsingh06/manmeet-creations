import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  Clock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  ChevronRight,
  Send,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest, getImageUrl } from '../utils/api';

export const ProductDetailsPage = () => {
  const { idOrSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'specs' | 'shipping' | 'reviews'

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`/products/${idOrSlug}`);
        if (data.success) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          setReviews(data.reviews || []);
          setSelectedImage(0);
          window.scrollTo(0, 0);
        }
      } catch (err) {
        console.error('Error fetching product:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '45px', height: '45px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--rose-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.2rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading artisan masterpiece...</p>
        </div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Art Piece Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>The creation you are looking for might have been archived.</p>
        <Link to="/shop" className="btn btn-primary">Browse All Collections</Link>
      </div>
    );
  }

  const rawImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.featuredImage || product.image];

  const images = rawImages.map(img => getImageUrl(img));

  const isLiked = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity, customNote);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, customNote);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out "${product.name}" handcrafted by Manmeet Creations!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard! 📋', 'success');
    }
  };

  const handleWhatsAppEnquiry = () => {
    const phone = import.meta.env.VITE_WHATSAPP_PHONE || '916239661708';
    const text = encodeURIComponent(
      `Hello Manmeet! I am interested in ordering "${product.name}" (Price: ₹${product.price}).\nCustomization details: ${customNote || 'Standard specification'}\nLink: ${window.location.href}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      addToast('Please write your review thoughts', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const data = await apiRequest(`/products/${product._id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          name: reviewerName || (user ? user.name : 'Art Enthusiast'),
          city: reviewerCity || 'India',
        }),
      });

      if (data.success) {
        setReviews([data.review, ...reviews]);
        setReviewComment('');
        addToast('Thank you for your lovely review! ✨', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', paddingBottom: '5rem' }}>
      
      {/* Breadcrumb Bar */}
      <div style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: '#FFFFFF', padding: '0.8rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" style={{ color: 'var(--text-muted)' }}>Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--text-muted)' }}>
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <section className="container" style={{ paddingTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem' }}>
          
          {/* Left Gallery Col */}
          <div>
            {/* Main Featured Image with Zoom */}
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-subtle)',
                aspectRatio: '1 / 1',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-light)',
                position: 'relative',
                marginBottom: '1.2rem',
              }}
            >
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.discountPercent > 0 && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge badge-rose" style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem', fontWeight: 700 }}>
                    {product.discountPercent}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Ribbon */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2.5px solid var(--rose-primary)' : '1px solid var(--border-subtle)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0,
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details & Action Col */}
          <div>
            {/* Category */}
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--lavender-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
              {product.category}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '2.1rem', marginBottom: '0.6rem', lineHeight: '1.25' }}>
              {product.name}
            </h1>

            {/* Tagline */}
            {product.tagline && (
              <p style={{ fontFamily: 'var(--font-serif-elegant)', fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--rose-primary)', marginBottom: '1rem' }}>
                “{product.tagline}”
              </p>
            )}

            {/* Rating & Review counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem' }}>
              <div style={{ display: 'flex', color: '#F59E0B' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating || 5) ? '#F59E0B' : 'none'} color="#F59E0B" />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {product.rating || 4.9}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ({product.numReviews || reviews.length} customer reviews)
              </span>
            </div>

            {/* Price Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                padding: '1.2rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.8rem',
              }}
            >
              <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="badge badge-rose" style={{ marginLeft: 'auto' }}>
                  You Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Customization Note Box */}
            {product.isCustomizable && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  border: '1.5px dashed var(--rose-primary)',
                  marginBottom: '1.8rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  <Sparkles size={18} color="var(--gold-accent)" /> Customization Available
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                  {product.customizationNote || 'This piece can be personalized with your names, special dates, custom color palettes, or quotes.'}
                </p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your customization details (e.g. Names, Date, Preferred Colors)..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  style={{ fontSize: '0.9rem', backgroundColor: 'var(--bg-cream)' }}
                />
              </div>
            )}

            {/* Quantity Selector & Main Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', backgroundColor: '#FFFFFF', padding: '0.2rem' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ border: 'none', background: 'none', padding: '0.6rem 1.1rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 700, padding: '0 0.6rem', minWidth: '30px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ border: 'none', background: 'none', padding: '0.6rem 1.1rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, padding: '0.9rem 1.5rem' }}>
                  <ShoppingBag size={18} /> Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--border-subtle)',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isLiked ? '#E03131' : 'var(--text-muted)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  title="Wishlist"
                >
                  <Heart size={22} fill={isLiked ? '#E03131' : 'none'} />
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--border-subtle)',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  title="Share"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button onClick={handleBuyNow} className="btn btn-gold btn-block" style={{ padding: '0.9rem' }}>
                Buy Now with 1-Click Checkout →
              </button>

              {/* Enquire on WhatsApp */}
              <button
                onClick={handleWhatsAppEnquiry}
                className="btn btn-block"
                style={{ backgroundColor: '#25D366', color: '#FFFFFF', padding: '0.85rem' }}
              >
                <MessageCircle size={18} /> Enquire / Customize via WhatsApp
              </button>
            </div>

            {/* Quick Shipping & Craft Promises */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem' }}>
                <Clock size={18} color="var(--rose-primary)" />
                <span>Dispatched in <strong>{product.leadTimeDays || 3} business days</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem' }}>
                <Truck size={18} color="var(--rose-primary)" />
                <span>Free Shipping on orders &gt; ₹999</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem' }}>
                <ShieldCheck size={18} color="var(--rose-primary)" />
                <span>Secure Multi-Layer Gift Packaging</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
          
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
            {[
              { id: 'description', label: 'Artisan Description' },
              { id: 'specs', label: 'Materials & Dimensions' },
              { id: 'shipping', label: 'Care & Shipping' },
              { id: 'reviews', label: `Customer Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.05rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? 'var(--rose-primary)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--rose-primary)' : '2px solid transparent',
                  paddingBottom: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'description' && (
              <div style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--text-body)' }}>
                <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>{product.description}</p>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>Handmade Essence:</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  Each item from Manmeet Creations is created by hand in our dedicated Chandigarh studio. Because each piece is genuinely handcrafted, minor natural variations in thread tension, floral placement, or resin pigment swirl make your piece uniquely yours.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ maxWidth: '700px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.2rem', fontSize: '0.95rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Dimensions:</div>
                  <div>{product.dimensions || 'Customizable to requirement'}</div>

                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Materials:</div>
                  <div>
                    {Array.isArray(product.materials) && product.materials.length > 0
                      ? product.materials.join(', ')
                      : 'Artisan Grade Materials'}
                  </div>

                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Customizable:</div>
                  <div>{product.isCustomizable ? 'Yes, personalized upon request' : 'Standard Edition'}</div>

                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Stock Availability:</div>
                  <div>{product.inStock ? `${product.countInStock || 10} units handcrafted / in queue` : 'Out of Stock'}</div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div style={{ maxWidth: '750px', lineHeight: '1.7', color: 'var(--text-body)' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Pan-India Delivery Timeline</h4>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Standard creation and dispatch takes 2-4 business days. Courier transit takes an additional 2-5 days depending on destination city (Delhi NCR / Mumbai / Bengaluru: 2-3 days).
                </p>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Care & Maintenance</h4>
                <p style={{ fontSize: '0.95rem' }}>
                  • <strong>Embroidery:</strong> Keep away from direct excessive moisture. Gently dust with a soft brush.<br />
                  • <strong>Resin Art:</strong> Clean with a soft microfiber cloth. Avoid harsh abrasive cleaners or extreme direct heat.<br />
                  • <strong>Fabric Painting:</strong> Gentle hand wash in cold water with mild detergent inside-out. Do not scrub directly on painted motifs.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Submit Review Form */}
                <div style={{ backgroundColor: 'var(--bg-cream)', padding: '1.8rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', maxWidth: '700px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Share Your Experience ✨</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                    Have you purchased or received this piece? Let others know what you thought!
                  </p>

                  <form onSubmit={handleReviewSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Your Rating:</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setReviewRating(num)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                          >
                            <Star size={24} fill={num <= reviewRating ? '#F59E0B' : 'none'} color="#F59E0B" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Your Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="E.g., Priya Verma"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Your City:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="E.g., Delhi, Mumbai"
                          value={reviewerCity}
                          onChange={(e) => setReviewerCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.2rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Your Review:</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Tell us about the craft quality, packaging, and personalization..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" disabled={submittingReview} className="btn btn-sm btn-primary">
                      <Send size={15} /> {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>Be the first to review this handcrafted masterpiece!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
                    {reviews.map((r, idx) => (
                      <div key={idx} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                            {r.name} {r.city && <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.85rem' }}>({r.city})</span>}
                          </div>
                          <div style={{ display: 'flex', color: '#F59E0B' }}>
                            {[...Array(r.rating || 5)].map((_, i) => (
                              <Star key={i} size={14} fill="#F59E0B" />
                            ))}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                          {r.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="container" style={{ marginTop: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="section-subtitle">
                <Sparkles size={14} /> You May Also Adore
              </span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Related {product.category}
              </h2>
            </div>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="btn btn-outline-rose" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
              View Category <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-4">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
