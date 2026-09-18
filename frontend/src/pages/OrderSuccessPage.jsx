import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  Sparkles,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { apiRequest } from '../utils/api';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiRequest(`/orders/${id}`);
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Error fetching order details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving your order invoice...</p>
      </div>
    );
  }

  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '916239661708';
  const handleWhatsAppTracking = () => {
    const text = encodeURIComponent(
      `Hello Manmeet! I just placed Order #${order?.orderId || id} for ₹${order?.totalAmount}. Could you please share the estimated dispatch date?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        
        {/* Success Card Header */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E8F7EE', color: '#28a745', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={46} />
          </div>

          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>
            Order Placed Successfully 🎉
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            Thank you for supporting authentic handmade craftsmanship! We are preparing your order with love.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'var(--rose-light)', color: 'var(--rose-dark)', padding: '0.5rem 1.4rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '1rem', marginBottom: '2rem' }}>
            <Sparkles size={16} /> Order Reference: {order?.orderId || id}
          </div>

          {/* Status Stepper */}
          <div
            style={{
              backgroundColor: 'var(--bg-cream)',
              padding: '1.8rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Status</span>
                <div style={{ fontWeight: 700, color: 'var(--rose-primary)', fontSize: '1.1rem' }}>
                  {order?.status || 'Confirmed'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Payment Method</span>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  {order?.paymentMethod || 'Cash on Delivery'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Est. Delivery</span>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  4 - 6 Business Days
                </div>
              </div>
            </div>

            {/* Stepper Visual */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginTop: '1.5rem' }}>
              <div style={{ position: 'absolute', top: '14px', left: '20px', right: '20px', height: '3px', backgroundColor: 'var(--border-subtle)', zIndex: 1 }} />
              
              {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                const isPassed = idx === 0 || (order?.status === 'Processing' && idx <= 1) || (order?.status === 'Shipped' && idx <= 2) || (order?.status === 'Delivered');
                return (
                  <div key={step} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: isPassed ? 'var(--rose-primary)' : '#E0D6CD', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: isPassed ? 700 : 500, color: isPassed ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={handleWhatsAppTracking} className="btn" style={{ backgroundColor: '#25D366', color: '#FFF' }}>
              <MessageCircle size={18} /> Track on WhatsApp
            </button>
            <Link to="/profile?tab=orders" className="btn btn-secondary">
              View Order History
            </Link>
            <Link to="/shop" className="btn btn-outline-rose">
              Continue Shopping →
            </Link>
          </div>
        </div>

        {/* Itemized Invoice Details */}
        {order && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-light)',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
              Order Itemization
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.8rem' }}>
              {order.orderItems?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.name}</h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</div>
                      {item.customNote && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--rose-dark)', backgroundColor: 'var(--rose-light)', padding: '0.2rem 0.4rem', borderRadius: '4px', marginTop: '0.2rem', display: 'inline-block' }}>
                          Note: {item.customNote}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif-display)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Total summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.92rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', maxWidth: '300px', marginLeft: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping:</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>
                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.3rem' }}>Delivery To:</strong>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {order.customerInfo?.name}<br />
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                  {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
                  Phone: {order.customerInfo?.phone}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
