import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest } from '../utils/api';

export const CheckoutPage = () => {
  const { cartItems, subtotal, shippingPrice, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone : '',
    email: user ? user.email : '',
    street: '',
    city: '',
    state: 'Punjab',
    postalCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); // 'Cash on Delivery' | 'UPI / Online Payment'
  const [isProcessing, setIsProcessing] = useState(false);
  const [onlineModalOpen, setOnlineModalOpen] = useState(false);

  // Pre-fill default user address if present
  useEffect(() => {
    if (user) {
      setShippingDetails((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        street: user.addresses && user.addresses.length > 0 ? user.addresses[0].street : prev.street,
        city: user.addresses && user.addresses.length > 0 ? user.addresses[0].city : prev.city,
        state: user.addresses && user.addresses.length > 0 ? user.addresses[0].state : prev.state,
        postalCode: user.addresses && user.addresses.length > 0 ? user.addresses[0].postalCode : prev.postalCode,
      }));
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>No items to checkout</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your shopping bag is currently empty.</p>
        <Link to="/shop" className="btn btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.email || !shippingDetails.street || !shippingDetails.city || !shippingDetails.postalCode) {
      addToast('Please complete all shipping address fields', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          customNote: item.customNote || '',
        })),
        customerInfo: {
          name: shippingDetails.name,
          phone: shippingDetails.phone,
          email: shippingDetails.email,
        },
        shippingAddress: {
          street: shippingDetails.street,
          city: shippingDetails.city,
          state: shippingDetails.state,
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country,
        },
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        totalAmount,
      };

      const data = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      if (data.success && data.order) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D47376', '#C59A4E', '#8E7C93'],
        });

        clearCart();
        addToast('Order Placed Successfully 🎉', 'success');
        navigate(`/order-success/${data.order.orderId || data.order._id}`);
      }
    } catch (err) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setOnlineModalOpen(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'UPI / Online Payment') {
      setOnlineModalOpen(true);
    } else {
      handlePlaceOrder();
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', paddingBottom: '6rem' }}>
      
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EAE8 100%)',
          padding: '2.5rem 0 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Link to="/cart" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ChevronLeft size={20} /> Back to Bag
          </Link>
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Secure Boutique Checkout</h1>
        </div>
      </div>

      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
            
            {/* Left: Shipping Details & Payment Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Shipping Address Box */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={20} color="var(--rose-primary)" /> Delivery Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                  <div className="form-group">
                    <label className="form-label">Recipient Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Navjot Kaur"
                      value={shippingDetails.name}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +91 98765 43210"
                      value={shippingDetails.phone}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Email Address (for order tracking updates) *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. navjot@gmail.com"
                      value={shippingDetails.email}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Street Address & Flat / House No. *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. House 42, Sector 15, Near Heritage Park"
                      value={shippingDetails.street}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, street: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Chandigarh"
                      value={shippingDetails.city}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Punjab"
                      value={shippingDetails.state}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PIN Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 160015"
                      value={shippingDetails.postalCode}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingDetails.country}
                      disabled
                      style={{ backgroundColor: 'var(--bg-subtle)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Box */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={20} color="var(--rose-primary)" /> Select Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* COD */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.2rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'Cash on Delivery' ? '2px solid var(--rose-primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: paymentMethod === 'Cash on Delivery' ? 'var(--rose-light)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        Cash on Delivery (COD)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Pay safely with cash or mobile UPI upon physical delivery at your doorstep
                      </div>
                    </div>
                  </label>

                  {/* UPI / Online Payment */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.2rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'UPI / Online Payment' ? '2px solid var(--rose-primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: paymentMethod === 'UPI / Online Payment' ? 'var(--rose-light)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI / Online Payment'}
                      onChange={() => setPaymentMethod('UPI / Online Payment')}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        UPI / Instant Online Payment <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>Fast-Track Dispatch</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Pay via GooglePay, PhonePe, Paytm, BHIM UPI or Cards (Zero transaction fee)
                      </div>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* Right: Order Summary Sidebar */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                Your Order ({cartItems.length} items)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.3rem' }}>
                {cartItems.map((item) => (
                  <div key={item.product} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div style={{ flex: 1, fontSize: '0.88rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.3' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.2rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
                  <span>Items Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
                  <span>Pan-India Delivery</span>
                  <span style={{ fontWeight: 600, color: shippingPrice === 0 ? '#28a745' : 'inherit' }}>
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 700 }}>
                  <span>Total Due</span>
                  <span style={{ color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-lg btn-primary btn-block"
                style={{ padding: '1rem' }}
              >
                {isProcessing ? 'Securing Order...' : `PLACE ORDER (₹${totalAmount.toLocaleString('en-IN')})`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                <ShieldCheck size={16} color="#28a745" /> 256-Bit SSL Encrypted & Protected
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Online UPI Simulated Gateway Modal */}
      {onlineModalOpen && (
        <div className="modal-backdrop" onClick={() => setOnlineModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '480px', padding: '2rem', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={30} color="var(--rose-primary)" />
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Scan & Pay with Any UPI App</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              GPay, PhonePe, Paytm, BHIM, or Banking Apps
            </p>

            {/* Simulated UPI QR Code */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '2px dashed var(--border-subtle)',
                display: 'inline-block',
                marginBottom: '1.5rem',
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=manmeetcreations@upi&pn=ManmeetCreations&am=${totalAmount}&cu=INR`}
                alt="UPI Payment QR"
                style={{ width: '180px', height: '180px', margin: '0 auto' }}
              />
              <div style={{ marginTop: '0.6rem', fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UPI ID: manmeetcreations@upi</div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              In live production, your Razorpay/Stripe environment variables process real bank gateway transactions securely.
            </p>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="btn btn-primary btn-block"
              style={{ padding: '0.9rem' }}
            >
              {isProcessing ? 'Verifying Payment...' : 'I Have Paid / Complete Order 🎉'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
