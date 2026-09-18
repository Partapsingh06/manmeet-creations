import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { apiRequest } from '../utils/api';
import { ProductCard } from '../components/ProductCard';

export const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'orders';

  const { user, logout, updateProfile, addAddress } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(currentTab);
  const [myOrders, setMyOrders] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Add Address State
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPin, setNewPin] = useState('');

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'orders');
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Fetch customer orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await apiRequest('/orders/myorders');
        if (data.success) {
          setMyOrders(data.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Fetch full products for wishlist
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistItems.length === 0) {
        setWishlistProducts([]);
        return;
      }
      setLoadingWishlist(true);
      try {
        const data = await apiRequest('/products');
        if (data.success) {
          const matched = data.products.filter((p) => wishlistItems.includes(p._id));
          setWishlistProducts(matched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistItems]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile({ name, phone, email });
    } catch {
      // Toast handled in context
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPin) {
      addToast('Please fill all address fields', 'error');
      return;
    }

    try {
      await addAddress({
        street: newStreet,
        city: newCity,
        state: newState || 'Punjab',
        postalCode: newPin,
        country: 'India',
      });
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewPin('');
    } catch {
      // Error handled in context
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', paddingBottom: '6rem' }}>
      
      {/* Profile Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EAE8 100%)',
          padding: '3rem 0 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '3rem',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--rose-primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-serif-display)' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Welcome, {user?.name || 'Art Lover'}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user?.email} • {user?.role === 'admin' ? 'Studio Administrator' : 'Valued Patron'}</p>
            </div>
          </div>

          <button onClick={logout} className="btn btn-sm btn-secondary" style={{ color: '#dc3545', gap: '0.4rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem' }} className="profile-layout">
          
          {/* Left Navigation Sidebar */}
          <aside>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '1.2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { id: 'orders', label: 'My Orders', icon: <Package size={18} />, count: myOrders.length },
                { id: 'wishlist', label: 'My Wishlist', icon: <Heart size={18} />, count: wishlistItems.length },
                { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={18} /> },
                { id: 'profile', label: 'Account Details', icon: <User size={18} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: activeTab === tab.id ? 'var(--rose-light)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--rose-primary)' : 'var(--text-main)',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    {tab.icon} {tab.label}
                  </span>
                  {tab.count !== undefined && (
                    <span style={{ fontSize: '0.75rem', backgroundColor: activeTab === tab.id ? 'var(--rose-primary)' : 'var(--bg-subtle)', color: activeTab === tab.id ? '#FFF' : 'var(--text-muted)', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Right Tab Content */}
          <main>
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                  Order History ({myOrders.length})
                </h3>

                {loadingOrders ? (
                  <p style={{ color: 'var(--text-muted)' }}>Loading order history...</p>
                ) : myOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <Package size={44} color="var(--rose-primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                    <h4 style={{ marginBottom: '0.4rem' }}>No orders yet</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Your customized purchases will appear here.</p>
                    <Link to="/shop" className="btn btn-sm btn-primary">Start Exploring</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {myOrders.map((order) => (
                      <div
                        key={order._id}
                        style={{
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '1.5rem',
                          backgroundColor: 'var(--bg-ivory)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                          <div>
                            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Order Reference</span>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>#{order.orderId || order._id}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date Placed</span>
                            <div style={{ fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Amount</span>
                            <div style={{ fontWeight: 700, color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                          </div>
                          <div>
                            <span
                              className={`badge ${
                                order.status === 'Delivered'
                                  ? 'badge-success'
                                  : order.status === 'Cancelled'
                                  ? 'badge-rose'
                                  : 'badge-gold'
                              }`}
                              style={{ padding: '0.35rem 0.8rem' }}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Ordered Items Preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {order.orderItems?.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} • ₹{item.price} each</div>
                                </div>
                              </div>
                              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.8rem' }}>
                          <Link to={`/order-success/${order.orderId || order._id}`} style={{ fontSize: '0.85rem', color: 'var(--rose-primary)', fontWeight: 600 }}>
                            View Complete Tracking Invoice →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                  Saved to Wishlist ({wishlistProducts.length})
                </h3>

                {loadingWishlist ? (
                  <p style={{ color: 'var(--text-muted)' }}>Loading wishlist items...</p>
                ) : wishlistProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <Heart size={44} color="var(--rose-primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                    <h4 style={{ marginBottom: '0.4rem' }}>Your wishlist is empty</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Save your favorite handcrafted creations to track later.</p>
                    <Link to="/shop" className="btn btn-sm btn-primary">Discover Crafts</Link>
                  </div>
                ) : (
                  <div className="grid-3" style={{ gap: '1.5rem' }}>
                    {wishlistProducts.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                  Delivery Addresses
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  {user?.addresses?.map((addr, idx) => (
                    <div key={idx} style={{ padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-cream)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                        <MapPin size={16} color="var(--rose-primary)" /> Address #{idx + 1}
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                        {addr.street}<br />
                        {addr.city}, {addr.state} - {addr.postalCode}<br />
                        {addr.country}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add new address */}
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add New Address</h4>
                <form onSubmit={handleSaveAddress}>
                  <div className="form-group">
                    <label className="form-label">Street Address *</label>
                    <input type="text" className="form-control" placeholder="House/Flat No, Landmark" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label className="form-label">City *</label>
                      <input type="text" className="form-control" placeholder="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} required />
                    </div>
                    <div>
                      <label className="form-label">State</label>
                      <input type="text" className="form-control" placeholder="State" value={newState} onChange={(e) => setNewState(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">PIN Code *</label>
                      <input type="text" className="form-control" placeholder="Postal Code" value={newPin} onChange={(e) => setNewPin(e.target.value)} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-sm btn-primary">Save Address</button>
                </form>
              </div>
            )}

            {/* Account Details Tab */}
            {activeTab === 'profile' && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                  Personal Information
                </h3>

                <form onSubmit={handleProfileUpdate} style={{ maxWidth: '500px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>

                  <button type="submit" disabled={isUpdating} className="btn btn-primary">
                    {isUpdating ? 'Saving...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}

          </main>

        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .profile-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
