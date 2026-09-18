import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingThreshold,
    amountNeededForFreeShipping,
    shippingPrice,
    totalAmount,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(26, 20, 18, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFDF9',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInRight 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--rose-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Boutique Cart</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({cartItems.length})</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '0.9rem 1.5rem', backgroundColor: 'var(--bg-cream)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
            {amountNeededForFreeShipping > 0 ? (
              <span>Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>FREE Pan-India Delivery!</strong></span>
            ) : (
              <span style={{ color: '#28a745', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={14} /> You unlocked FREE Express Delivery!
              </span>
            )}
            <span>{freeShippingProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
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

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', margin: '0 auto 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={32} color="var(--rose-primary)" />
              </div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '0.4rem' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Discover handcrafted treasures curated just for you.</p>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="btn btn-sm btn-primary"
              >
                Explore Shop
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.2rem',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem', lineHeight: '1.3' }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.customNote && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--rose-dark)', backgroundColor: 'var(--rose-light)', padding: '0.2rem 0.4rem', borderRadius: '4px', marginBottom: '0.4rem' }}>
                        Note: {item.customNote}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', backgroundColor: '#FFFFFF' }}>
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          style={{ border: 'none', background: 'none', padding: '0.2rem 0.6rem', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.3rem' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          style={{ border: 'none', background: 'none', padding: '0.2rem 0.6rem', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>

                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif-display)' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Pan-India Delivery</span>
              <span style={{ fontWeight: 600, color: shippingPrice === 0 ? '#28a745' : 'var(--text-main)' }}>
                {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', fontSize: '1.15rem', fontWeight: 700, borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="btn btn-primary btn-block"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                className="btn btn-secondary btn-block"
              >
                View Full Cart
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
              <ShieldCheck size={14} color="#28a745" /> 100% Safe & Secure Checkout
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
