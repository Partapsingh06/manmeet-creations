import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Palette,
  Users,
  MessageSquare,
  Star,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Eye,
  X,
  Upload,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
  Inbox
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);

  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Handmade Embroidery',
    price: '',
    originalPrice: '',
    description: '',
    images: '',
    materials: '',
    dimensions: '',
    leadTimeDays: 3,
    isCustomizable: true,
    isFeatured: false,
    isBestSeller: false,
    countInStock: 10,
  });

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    image: '',
    iconName: 'Sparkles',
  });

  // Selected Custom Order Modal for Image View
  const [viewCustomOrder, setViewCustomOrder] = useState(null);

  // Fetch admin stats & initial lists
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodsRes, catsRes, ordersRes, customRes, usersRes, reviewsRes, msgsRes] = await Promise.all([
        apiRequest('/admin/stats'),
        apiRequest('/products'),
        apiRequest('/categories'),
        apiRequest('/orders'),
        apiRequest('/custom-orders'),
        apiRequest('/admin/users'),
        apiRequest('/admin/reviews'),
        apiRequest('/contact'),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (prodsRes.success) setProducts(prodsRes.products);
      if (catsRes.success) setCategories(catsRes.categories);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (customRes.success) setCustomOrders(customRes.customOrders);
      if (usersRes.success) setCustomers(usersRes.users);
      if (reviewsRes.success) setReviews(reviewsRes.reviews);
      if (msgsRes.success) setMessages(msgsRes.messages);
    } catch (err) {
      console.error('Error loading admin stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Product CRUD Handlers ---
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductFormData({
        name: prod.name,
        category: prod.category,
        price: prod.price,
        originalPrice: prod.originalPrice || prod.price,
        description: prod.description,
        images: Array.isArray(prod.images) ? prod.images.join(', ') : prod.images,
        materials: Array.isArray(prod.materials) ? prod.materials.join(', ') : prod.materials,
        dimensions: prod.dimensions || '',
        leadTimeDays: prod.leadTimeDays || 3,
        isCustomizable: prod.isCustomizable !== undefined ? prod.isCustomizable : true,
        isFeatured: prod.isFeatured || false,
        isBestSeller: prod.isBestSeller || false,
        countInStock: prod.countInStock || 10,
      });
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        category: categories.length > 0 ? categories[0].name : 'Handmade Embroidery',
        price: '',
        originalPrice: '',
        description: '',
        images: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
        materials: 'Linen, DMC Floss, Wood',
        dimensions: '10 inch diameter',
        leadTimeDays: 3,
        isCustomizable: true,
        isFeatured: false,
        isBestSeller: false,
        countInStock: 10,
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productFormData,
        price: Number(productFormData.price),
        originalPrice: Number(productFormData.originalPrice || productFormData.price),
        images: productFormData.images.split(',').map((img) => img.trim()).filter(Boolean),
        materials: productFormData.materials.split(',').map((m) => m.trim()).filter(Boolean),
      };

      if (editingProduct) {
        const data = await apiRequest(`/products/${editingProduct._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (data.success) {
          setProducts(products.map((p) => (p._id === editingProduct._id ? data.product : p)));
          addToast('Product updated successfully! ✨', 'success');
        }
      } else {
        const data = await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (data.success) {
          setProducts([data.product, ...products]);
          addToast('Product added to collection! ✨', 'success');
        }
      }
      setProductModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product from the boutique collection?')) return;
    try {
      const data = await apiRequest(`/products/${id}`, { method: 'DELETE' });
      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
        addToast('Product deleted', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // --- Order Status Update Handler ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const data = await apiRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (data.success) {
        setOrders(orders.map((o) => (o._id === orderId ? data.order : o)));
        addToast(`Order marked as "${newStatus}"!`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // --- Custom Order Status / Quote Update ---
  const handleUpdateCustomStatus = async (reqId, newStatus, quote = 0) => {
    try {
      const data = await apiRequest(`/custom-orders/${reqId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, adminQuoteAmount: quote }),
      });
      if (data.success) {
        setCustomOrders(customOrders.map((c) => (c._id === reqId ? data.customOrder : c)));
        addToast(`Custom order status updated to "${newStatus}"!`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update custom request', 'error');
    }
  };

  // --- Category Create Handler ---
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryFormData),
      });
      if (data.success) {
        setCategories([...categories, data.category]);
        addToast('Category created!', 'success');
        setCategoryModalOpen(false);
      }
    } catch (err) {
      addToast(err.message || 'Failed to save category', 'error');
    }
  };

  // --- Delete Message Handler ---
  const handleDeleteMessage = async (id) => {
    try {
      await apiRequest(`/contact/${id}`, { method: 'DELETE' });
      setMessages(messages.filter((m) => m._id !== id));
      addToast('Message deleted', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // --- Delete Review Handler ---
  const handleDeleteReview = async (id) => {
    try {
      await apiRequest(`/admin/reviews/${id}`, { method: 'DELETE' });
      setReviews(reviews.filter((r) => r._id !== id));
      addToast('Review deleted', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Admin Navigation Bar */}
      <div
        style={{
          backgroundColor: '#201A18',
          color: '#FAF7F2',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.4rem', fontWeight: 700 }}>
            Manmeet Creations
          </span>
          <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
            Admin Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.88rem', color: '#B3AAA4' }}>
            Logged in as <strong>{user?.name}</strong>
          </span>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-outline-rose"
            style={{ color: '#FFF', padding: '0.35rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <ExternalLink size={14} /> View Live Store
          </a>
        </div>
      </div>

      {/* Main Admin Layout: Sidebar + Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', flex: 1 }} className="admin-layout">
        
        {/* Admin Sidebar */}
        <aside style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid var(--border-subtle)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'products', label: 'Products', icon: <Package size={18} />, count: products.length },
            { id: 'categories', label: 'Categories', icon: <Layers size={18} />, count: categories.length },
            { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} />, count: orders.length },
            { id: 'custom-orders', label: 'Custom Requests', icon: <Palette size={18} />, count: customOrders.length },
            { id: 'customers', label: 'Customers', icon: <Users size={18} />, count: customers.length },
            { id: 'reviews', label: 'Reviews', icon: <Star size={18} />, count: reviews.length },
            { id: 'messages', label: 'Contact Messages', icon: <Inbox size={18} />, count: messages.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--rose-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--rose-primary)' : 'var(--text-main)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.9rem',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {tab.icon} {tab.label}
              </span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: activeTab === tab.id ? 'var(--rose-primary)' : 'var(--bg-subtle)',
                    color: activeTab === tab.id ? '#FFF' : 'var(--text-muted)',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Admin Workspace Content */}
        <main style={{ padding: '2.5rem', overflowY: 'auto' }}>
          
          {/* ================= 1. OVERVIEW DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Boutique Performance Overview</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time aggregated sales, catalog inventory, and custom order requests</p>
              </div>

              {/* 6 KPI Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                
                {/* Revenue */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={18} color="var(--gold-dark)" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-serif-display)' }}>
                    ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : '0'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#28a745', marginTop: '0.3rem' }}>✓ From all confirmed store orders</div>
                </div>

                {/* Total Orders */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={18} color="var(--rose-primary)" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {stats?.totalOrders || orders.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    {stats?.completedOrders || 0} Delivered successfully
                  </div>
                </div>

                {/* Pending Orders */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Dispatch</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFF4E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={18} color="#B25E02" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#B25E02' }}>
                    {stats?.pendingOrders || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Requires packing & tracking</div>
                </div>

                {/* Custom Requests */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Custom Requests</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--lavender-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Palette size={18} color="var(--lavender-dark)" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {stats?.totalCustomRequests || customOrders.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--rose-primary)', marginTop: '0.3rem' }}>
                    {stats?.pendingCustomRequests || 0} New inquiries pending quote
                  </div>
                </div>

                {/* Total Products */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Active Products</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={18} color="var(--text-main)" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {products.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Across {categories.length} craft categories</div>
                </div>

                {/* Total Customers */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Patrons</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E8F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={18} color="#0E627C" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {customers.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Registered patrons</div>
                </div>

              </div>

              {/* Recent Orders & Recent Custom Commissions Split */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                
                {/* Recent Orders */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '1.8rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Store Orders</h3>
                    <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: 'var(--rose-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.slice(0, 5).map((ord) => (
                      <div key={ord._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>#{ord.orderId || ord._id}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ord.customerInfo?.name} • {ord.orderItems?.length} items</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>₹{ord.totalAmount?.toLocaleString('en-IN')}</div>
                          <span className={`badge ${ord.status === 'Delivered' ? 'badge-success' : 'badge-gold'}`} style={{ fontSize: '0.7rem' }}>
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Custom Requests */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '1.8rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Bespoke Inquiries</h3>
                    <button onClick={() => setActiveTab('custom-orders')} style={{ background: 'none', border: 'none', color: 'var(--rose-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {customOrders.slice(0, 5).map((req) => (
                      <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>#{req.requestId} - {req.whatWouldYouLike}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.fullName} • Need by: {req.requiredDate}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= 2. PRODUCTS MANAGEMENT ================= */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Products Management</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your handcrafted catalog ({products.length} active products)</p>
                </div>
                <button onClick={() => handleOpenProductModal()} className="btn btn-primary">
                  <Plus size={18} /> Add New Craft Piece
                </button>
              </div>

              {/* Products Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead style={{ backgroundColor: 'var(--bg-cream)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th style={{ padding: '1rem 1.2rem' }}>Product</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Category</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Price</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Stock</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Featured</th>
                      <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const img = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.featuredImage || p.image);
                      return (
                        <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <img src={img} alt="" style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.dimensions}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.2rem' }}>
                            <span className="badge badge-lavender">{p.category}</span>
                          </td>
                          <td style={{ padding: '1rem 1.2rem', fontWeight: 700 }}>
                            ₹{p.price.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '1rem 1.2rem' }}>
                            <span className={`badge ${p.inStock ? 'badge-success' : 'badge-rose'}`}>
                              {p.inStock ? `${p.countInStock || 10} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.2rem' }}>
                            {p.isFeatured ? <Sparkles size={16} color="var(--gold-dark)" /> : '-'}
                          </td>
                          <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleOpenProductModal(p)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '4px' }}
                                title="Edit Product"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', padding: '4px' }}
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 3. CATEGORIES MANAGEMENT ================= */}
          {activeTab === 'categories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Categories Management</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage craft collections & mediums</p>
                </div>
                <button onClick={() => setCategoryModalOpen(true)} className="btn btn-primary">
                  <Plus size={18} /> Add Category
                </button>
              </div>

              <div className="grid-3">
                {categories.map((cat) => (
                  <div key={cat._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '1.2rem' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{cat.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>{cat.description}</p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--rose-primary)', fontWeight: 600 }}>{cat.itemCount || 0} active products</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. ORDERS MANAGEMENT ================= */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Store Orders ({orders.length})</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage order fulfillment, tracking numbers, and delivery statuses</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((ord) => (
                  <div key={ord._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '1.8rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                          Order #{ord.orderId || ord._id}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Placed on {new Date(ord.createdAt).toLocaleString()} by <strong>{ord.customerInfo?.name}</strong> ({ord.customerInfo?.email}, {ord.customerInfo?.phone})
                        </div>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="form-control"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.88rem', width: 'auto', fontWeight: 700 }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Ordered Items Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                      {ord.orderItems?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', backgroundColor: 'var(--bg-cream)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                          <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity} (₹{item.price * item.quantity})</div>
                            {item.customNote && <div style={{ fontSize: '0.75rem', color: 'var(--rose-dark)' }}>Note: {item.customNote}</div>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address & Totals */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.8rem' }}>
                      <div>
                        <strong>Shipping Address:</strong> {ord.shippingAddress?.street}, {ord.shippingAddress?.city}, {ord.shippingAddress?.state} - {ord.shippingAddress?.postalCode}
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: 'var(--rose-primary)' }}>
                        Total: ₹{ord.totalAmount?.toLocaleString('en-IN')} ({ord.paymentMethod})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. CUSTOM ORDER REQUESTS ================= */}
          {activeTab === 'custom-orders' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Bespoke Custom Requests ({customOrders.length})</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review customer commission submissions, reference photos, budget & quotes</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {customOrders.map((req) => (
                  <div key={req._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '1.8rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span className="badge badge-rose">#{req.requestId}</span>
                          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{req.whatWouldYouLike}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Customer: <strong>{req.fullName}</strong> • Phone: <a href={`https://wa.me/${req.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>{req.phone} (WhatsApp)</a> • Email: {req.email}
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateCustomStatus(req._id, e.target.value, req.adminQuoteAmount)}
                          className="form-control"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.88rem', width: 'auto', fontWeight: 700 }}
                        >
                          <option value="New Request">New Request</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Quote Sent">Quote Sent</option>
                          <option value="In Production">In Production</option>
                          <option value="Completed">Completed</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </div>
                    </div>

                    {/* Request Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.88rem', marginBottom: '1.2rem', backgroundColor: 'var(--bg-cream)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div><strong>Category:</strong> {req.category}</div>
                      <div><strong>Required Date:</strong> {req.requiredDate}</div>
                      <div><strong>Budget Range:</strong> {req.budget}</div>
                      <div><strong>Preferred Size:</strong> {req.preferredSize}</div>
                    </div>

                    <div style={{ marginBottom: '1.2rem', fontSize: '0.92rem' }}>
                      <strong>Customization Notes:</strong>
                      <p style={{ color: 'var(--text-body)', marginTop: '0.2rem', lineHeight: '1.5' }}>{req.customizationDetails}</p>
                    </div>

                    {/* Reference Image Preview */}
                    {req.referenceImage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <strong>Reference Image:</strong>
                        <button
                          onClick={() => setViewCustomOrder(req)}
                          className="btn btn-sm btn-secondary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <Eye size={14} /> View Reference Photo
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. CUSTOMERS ================= */}
          {activeTab === 'customers' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Registered Patrons ({customers.length})</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Customer registry & address records</p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead style={{ backgroundColor: 'var(--bg-cream)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th style={{ padding: '1rem 1.2rem' }}>Name</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Email</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Phone</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Role</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '1rem 1.2rem', fontWeight: 600 }}>{c.name}</td>
                        <td style={{ padding: '1rem 1.2rem' }}>{c.email}</td>
                        <td style={{ padding: '1rem 1.2rem' }}>{c.phone || '-'}</td>
                        <td style={{ padding: '1rem 1.2rem' }}>
                          <span className={`badge ${c.role === 'admin' ? 'badge-gold' : 'badge-lavender'}`}>{c.role}</span>
                        </td>
                        <td style={{ padding: '1rem 1.2rem', color: 'var(--text-muted)' }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 7. REVIEWS ================= */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Customer Reviews Moderation ({reviews.length})</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Moderate customer testimonials</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map((r) => (
                  <div key={r._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <div style={{ display: 'flex', color: '#F59E0B' }}>
                          {[...Array(r.rating || 5)].map((_, i) => (
                            <Star key={i} size={14} fill="#F59E0B" />
                          ))}
                        </div>
                        <strong>{r.name}</strong> {r.city && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({r.city})</span>}
                      </div>
                      <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', marginBottom: '0.4rem' }}>{r.comment}</p>
                      {r.product && <div style={{ fontSize: '0.8rem', color: 'var(--rose-primary)' }}>For: {r.product.name}</div>}
                    </div>

                    <button onClick={() => handleDeleteReview(r._id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }} title="Delete review">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 8. CONTACT MESSAGES ================= */}
          {activeTab === 'messages' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Workshop Messages Inbox ({messages.length})</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Inquiries from website contact form</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {messages.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No messages in inbox</p>
                ) : (
                  messages.map((m) => (
                    <div key={m._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <div>
                          <strong>{m.name}</strong> ({m.email} {m.phone && `• ${m.phone}`})
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Subject: <strong>{m.subject}</strong> • {new Date(m.createdAt).toLocaleString()}</div>
                        </div>
                        <button onClick={() => handleDeleteMessage(m._id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: '1.5' }}>{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Product Add / Edit Modal */}
      {productModalOpen && (
        <div className="modal-backdrop" onClick={() => setProductModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '650px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setProductModalOpen(false)}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
              {editingProduct ? 'Edit Craft Product' : 'Add New Handcrafted Piece'}
            </h3>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input type="text" className="form-control" value={productFormData.name} onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" value={productFormData.category} onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input type="number" className="form-control" value={productFormData.price} onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Strikethrough Price (₹)</label>
                  <input type="number" className="form-control" value={productFormData.originalPrice} onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URLs (comma separated) *</label>
                <input type="text" className="form-control" value={productFormData.images} onChange={(e) => setProductFormData({ ...productFormData, images: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-control" rows={3} value={productFormData.description} onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Dimensions / Size</label>
                  <input type="text" className="form-control" value={productFormData.dimensions} onChange={(e) => setProductFormData({ ...productFormData, dimensions: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Lead Time (Days)</label>
                  <input type="number" className="form-control" value={productFormData.leadTimeDays} onChange={(e) => setProductFormData({ ...productFormData, leadTimeDays: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Stock Quantity</label>
                  <input type="number" className="form-control" value={productFormData.countInStock} onChange={(e) => setProductFormData({ ...productFormData, countInStock: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={productFormData.isFeatured} onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })} />
                  Feature on Homepage
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={productFormData.isBestSeller} onChange={(e) => setProductFormData({ ...productFormData, isBestSeller: e.target.checked })} />
                  Best Seller Tag
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                {editingProduct ? 'Save Changes' : 'Publish Product ✨'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="modal-backdrop" onClick={() => setCategoryModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setCategoryModalOpen(false)}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.2rem' }}>Add Craft Category</h3>
            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input type="text" className="form-control" value={categoryFormData.name} onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="text" className="form-control" value={categoryFormData.image} onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={2} value={categoryFormData.description} onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Create Category</button>
            </form>
          </div>
        </div>
      )}

      {/* Reference Image Viewer Modal */}
      {viewCustomOrder && (
        <div className="modal-backdrop" onClick={() => setViewCustomOrder(null)}>
          <div className="modal-content" style={{ maxWidth: '600px', padding: '2rem', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setViewCustomOrder(null)}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>Reference Image - {viewCustomOrder.whatWouldYouLike}</h3>
            <img src={viewCustomOrder.referenceImage} alt="Reference" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .admin-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
