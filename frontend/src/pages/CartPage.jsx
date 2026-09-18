import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    originalSubtotal,
    discountTotal,
    shippingPrice,
    totalAmount,
    amountNeededForFreeShipping,
    shippingThreshold,
  } = useCart();

  const { addToast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const code = couponCode.trim().toUpperCase();
    if (code === 'ARTLOVE10' || code === 'MANMEET10') {
      const discountVal = Math.round(subtotal * 0.1);
      setCouponDiscount(discountVal);
      setAppliedCoupon(code);
      addToast(`Coupon "${code}" applied! You saved ₹${discountVal} ✨`, 'success');
      setCouponCode('');
    } else if (code === 'WELCOME50') {
      setCouponDiscount(50);
      setAppliedCoupon(code);
      addToast(`Coupon "${code}" applied! ₹50 OFF ✨`, 'success');
      setCouponCode('');
    } else {
      addToast('Invalid or expired coupon code. Try "ARTLOVE10"', 'error');
    }
  };

  const finalTotal = Math.max(0, totalAmount - couponDiscount);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBag size={38} color="var(--rose-primary)" />
        </div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
          Explore our handcrafted collections and discover bespoke keepsakes made with love.
        </p>
        <Link to="/shop" className="btn btn-lg btn-primary">
          Explore Handcrafted Creations <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', paddingBottom: '6rem' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EAE8 100%)',
          padding: '3rem 0 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '3rem',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-subtitle">
              <ShoppingBag size={14} /> Review Your Selection
            </span>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.2rem' }}>
              Your Boutique Bag
            </h1>
          </div>
          <button
            onClick={clearCart}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <RotateCcw size={14} /> Clear All Items
          </button>
        </div>
      </div>

      <div className="container">
        
        {/* Free Delivery Meter */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.2rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
            {amountNeededForFreeShipping > 0 ? (
              <span>Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>FREE Pan-India Delivery!</strong></span>
            ) : (
              <span style={{ color: '#28a745', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} /> Congratulations! You unlocked FREE Express Delivery 🎉
              </span>
            )}
            <span style={{ fontWeight: 600 }}>{freeShippingProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-cream)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor: amountNeededForFreeShipping > 0 ? 'var(--rose-primary)' : '#28a745',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Layout: Cart Items Table + Summary Box */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
          
          {/* Left: Items List */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
              Items in Bag ({cartItems.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    paddingBottom: '1.8rem',
                    borderBottom: '1px solid var(--border-light)',
                    alignItems: 'flex-start',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', flexShrink: 0 }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--lavender-primary)', fontWeight: 600 }}>
                          {item.category}
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.4rem' }}>
                          <Link to={`/product/${item.slug || item.product}`}>{item.name}</Link>
                        </h4>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                        title="Remove from bag"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {item.customNote && (
                      <div style={{ fontSize: '0.82rem', backgroundColor: 'var(--rose-light)', color: 'var(--rose-dark)', padding: '0.3rem 0.6rem', borderRadius: '6px', marginBottom: '0.6rem', display: 'inline-block' }}>
                        Custom Note: {item.customNote}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-ivory)' }}>
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          style={{ border: 'none', background: 'none', padding: '0.35rem 0.8rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, padding: '0 0.5rem', minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          style={{ border: 'none', background: 'none', padding: '0.35rem 0.8rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-serif-display)' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          ₹{item.price} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <Link to="/shop" style={{ color: 'var(--rose-primary)', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right: Order Summary Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Promo Code Input */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.6rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Tag size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Coupon (e.g. ARTLOVE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ paddingLeft: '36px', textTransform: 'uppercase', fontSize: '0.88rem' }}
                  />
                </div>
                <button type="submit" className="btn btn-sm btn-secondary">Apply</button>
              </form>

              {appliedCoupon && (
                <div style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: '#28a745', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                  <Sparkles size={14} /> Coupon {appliedCoupon} active (₹{couponDiscount} saved)
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
                  <span>Bag Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#28a745' }}>
                    <span>Catalog Savings</span>
                    <span>-₹{discountTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#28a745' }}>
                    <span>Promo Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
                  <span>Pan-India Delivery</span>
                  <span style={{ fontWeight: 600, color: shippingPrice === 0 ? '#28a745' : 'inherit' }}>
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 700 }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-lg btn-primary btn-block"
                style={{ padding: '1rem' }}
              >
                PROCEED TO CHECKOUT <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1.2rem' }}>
                <ShieldCheck size={16} color="#28a745" /> Guaranteed Safe & Encrypted Checkout
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
