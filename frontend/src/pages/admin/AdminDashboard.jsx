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
  Inbox,
  LogOut,
  AlertTriangle,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { apiRequest, getImageUrl } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { SingleImageUploader, MultiImageUploader } from '../../components/ImageUploader';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
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

  // Search and filter states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [categorySearch, setCategorySearch] = useState('');

  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Handmade Embroidery',
    price: '',
    originalPrice: '',
    description: '',
    images: [],
    materials: '',
    dimensions: '',
    leadTimeDays: 3,
    isCustomizable: true,
    isFeatured: false,
    isBestSeller: false,
    countInStock: 10,
    inStock: true,
    tags: '',
  });

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    image: '',
    iconName: 'Sparkles',
    isFeatured: true,
  });

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: null, // 'product' | 'category'
    item: null,
    warning: '',
    loading: false,
  });

  // Quick Image Change Modal State
  const [quickImageModal, setQuickImageModal] = useState({
    open: false,
    type: null, // 'product' | 'category'
    item: null,
    image: '',
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
      if (prodsRes.success) setProducts(prodsRes.products || []);
      if (catsRes.success) setCategories(catsRes.categories || []);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (customRes.success) setCustomOrders(customRes.customOrders || []);
      if (usersRes.success) setCustomers(usersRes.users || []);
      if (reviewsRes.success) setReviews(reviewsRes.reviews || []);
      if (msgsRes.success) setMessages(msgsRes.messages || []);
    } catch (err) {
      console.error('Error loading admin stats:', err.message);
      addToast(err.message || 'Failed to load some dashboard data', 'error');
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
      const prodImages = Array.isArray(prod.images) ? prod.images : prod.images ? [prod.images] : [];
      setProductFormData({
        name: prod.name || '',
        category: prod.category || (categories[0]?.name || 'Handmade Embroidery'),
        price: prod.price !== undefined ? prod.price : '',
        originalPrice: prod.originalPrice || prod.price || '',
        description: prod.description || '',
        images: prodImages,
        materials: Array.isArray(prod.materials) ? prod.materials.join(', ') : prod.materials || '',
        dimensions: prod.dimensions || '',
        leadTimeDays: prod.leadTimeDays || 3,
        isCustomizable: prod.isCustomizable !== undefined ? prod.isCustomizable : true,
        isFeatured: prod.isFeatured || false,
        isBestSeller: prod.isBestSeller || false,
        countInStock: prod.countInStock !== undefined ? prod.countInStock : 10,
        inStock: prod.inStock !== undefined ? prod.inStock : true,
        tags: Array.isArray(prod.tags) ? prod.tags.join(', ') : prod.tags || '',
      });
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        category: categories.length > 0 ? categories[0].name : 'Handmade Embroidery',
        price: '',
        originalPrice: '',
        description: '',
        images: [],
        materials: 'Premium Threads, Fabric, Timber Frame',
        dimensions: '8 x 8 inches',
        leadTimeDays: 3,
        isCustomizable: true,
        isFeatured: false,
        isBestSeller: false,
        countInStock: 10,
        inStock: true,
        tags: 'handmade, personalized, gift',
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormData.images || productFormData.images.length === 0) {
      addToast('Please upload at least one image for the product', 'error');
      return;
    }

    try {
      const payload = {
        ...productFormData,
        price: Number(productFormData.price),
        originalPrice: Number(productFormData.originalPrice || productFormData.price),
        countInStock: Number(productFormData.countInStock || 0),
        leadTimeDays: Number(productFormData.leadTimeDays || 3),
        images: productFormData.images,
        featuredImage: productFormData.images[0] || '',
        materials: typeof productFormData.materials === 'string'
          ? productFormData.materials.split(',').map((m) => m.trim()).filter(Boolean)
          : productFormData.materials,
        tags: typeof productFormData.tags === 'string'
          ? productFormData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : productFormData.tags,
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
          addToast('Product published to collection! ✨', 'success');
        }
      }
      setProductModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    }
  };

  const openDeleteProductModal = (product) => {
    setDeleteModal({
      open: true,
      type: 'product',
      item: product,
      warning: `Are you sure you want to remove "${product.name}" from your boutique catalog? This action cannot be undone.`,
      loading: false,
    });
  };

  const confirmDeleteProduct = async () => {
    if (!deleteModal.item) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      const data = await apiRequest(`/products/${deleteModal.item._id}`, { method: 'DELETE' });
      if (data.success) {
        setProducts(products.filter((p) => p._id !== deleteModal.item._id));
        addToast(`Product "${deleteModal.item.name}" deleted`, 'info');
        setDeleteModal({ open: false, type: null, item: null, warning: '', loading: false });
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // --- Category CRUD Handlers ---
  const handleOpenCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        iconName: category.iconName || 'Sparkles',
        isFeatured: category.isFeatured !== undefined ? category.isFeatured : true,
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({
        name: '',
        description: '',
        image: '',
        iconName: 'Sparkles',
        isFeatured: true,
      });
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormData.image) {
      addToast('Please upload a category cover image', 'error');
      return;
    }

    try {
      if (editingCategory) {
        const data = await apiRequest(`/categories/${editingCategory._id}`, {
          method: 'PUT',
          body: JSON.stringify(categoryFormData),
        });
        if (data.success) {
          setCategories(categories.map((c) => (c._id === editingCategory._id ? data.category : c)));
          // Also update product categories in local state if name changed
          if (editingCategory.name !== categoryFormData.name) {
            setProducts(products.map(p => p.category === editingCategory.name ? { ...p, category: categoryFormData.name } : p));
          }
          addToast('Category updated successfully! ✨', 'success');
          setCategoryModalOpen(false);
        }
      } else {
        const data = await apiRequest('/categories', {
          method: 'POST',
          body: JSON.stringify(categoryFormData),
        });
        if (data.success) {
          setCategories([...categories, data.category]);
          addToast('Category created successfully! ✨', 'success');
          setCategoryModalOpen(false);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to save category', 'error');
    }
  };

  const openDeleteCategoryModal = (category) => {
    const linkedCount = products.filter(
      (p) => p.category?.toLowerCase() === category.name?.toLowerCase()
    ).length;

    let warning = `Are you sure you want to delete category "${category.name}"?`;
    if (linkedCount > 0) {
      warning = `Warning: ${linkedCount} active product(s) are linked to "${category.name}". If you delete this category, these products will be safely reassigned to "Handmade Crafts" so they remain visible on your store.`;
    }

    setDeleteModal({
      open: true,
      type: 'category',
      item: category,
      warning,
      loading: false,
    });
  };

  const confirmDeleteCategory = async () => {
    if (!deleteModal.item) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      const data = await apiRequest(`/categories/${deleteModal.item._id}?force=true`, {
        method: 'DELETE',
      });
      if (data.success) {
        setCategories(categories.filter((c) => c._id !== deleteModal.item._id));
        // Refresh products list to show reassigned categories
        const prodsRes = await apiRequest('/products').catch(() => null);
        if (prodsRes?.success) setProducts(prodsRes.products);

        addToast(data.message || `Category "${deleteModal.item.name}" deleted`, 'info');
        setDeleteModal({ open: false, type: null, item: null, warning: '', loading: false });
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete category', 'error');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // --- Quick Image Change Handler ---
  const handleOpenQuickImageModal = (item, type) => {
    const currentImg = type === 'product'
      ? (Array.isArray(item.images) && item.images[0]) || item.featuredImage || ''
      : item.image || '';
    setQuickImageModal({
      open: true,
      type,
      item,
      image: currentImg,
    });
  };

  const handleSaveQuickImage = async () => {
    if (!quickImageModal.image) {
      addToast('Please upload or select an image', 'error');
      return;
    }

    const { type, item, image } = quickImageModal;
    try {
      if (type === 'category') {
        const data = await apiRequest(`/categories/${item._id}`, {
          method: 'PUT',
          body: JSON.stringify({ image }),
        });
        if (data.success) {
          setCategories(categories.map((c) => (c._id === item._id ? data.category : c)));
          addToast('Category image updated! ✨', 'success');
        }
      } else if (type === 'product') {
        const existingImages = Array.isArray(item.images) ? [...item.images] : [];
        if (!existingImages.includes(image)) {
          existingImages[0] = image;
        }
        const data = await apiRequest(`/products/${item._id}`, {
          method: 'PUT',
          body: JSON.stringify({ images: existingImages, featuredImage: image }),
        });
        if (data.success) {
          setProducts(products.map((p) => (p._id === item._id ? data.product : p)));
          addToast('Product photo updated! ✨', 'success');
        }
      }
      setQuickImageModal({ open: false, type: null, item: null, image: '' });
    } catch (err) {
      addToast(err.message || 'Failed to update image', 'error');
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

  // Filtered Products List
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch.trim() === '' ||
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'All' ||
      p.category?.toLowerCase() === productCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Filtered Categories List
  const filteredCategories = categories.filter((c) => {
    return (
      categorySearch.trim() === '' ||
      c.name?.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.description?.toLowerCase().includes(categorySearch.toLowerCase())
    );
  });

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
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
          <button
            onClick={logout}
            className="btn btn-sm btn-secondary"
            style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', color: '#dc3545', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
            title="Logout of Admin Panel"
          >
            <LogOut size={14} /> Logout
          </button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Products Management</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Manage your handcrafted catalog ({products.length} total products)
                  </p>
                </div>
                <button onClick={() => handleOpenProductModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={18} /> Add New Product
                </button>
              </div>

              {/* Filters Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  backgroundColor: '#FFFFFF',
                  padding: '1rem 1.2rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
                  <Search size={18} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search products by title or tag..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', backgroundColor: 'transparent' }}
                  />
                  {productSearch && (
                    <button onClick={() => setProductSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Filter size={16} color="var(--text-muted)" />
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="form-control"
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
                  >
                    <option value="All">All Categories ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                {filteredProducts.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Package size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                    <p style={{ fontSize: '1rem', fontWeight: 600 }}>No products matched your criteria</p>
                    <button onClick={() => { setProductSearch(''); setProductCategoryFilter('All'); }} className="btn btn-sm btn-secondary" style={{ marginTop: '0.8rem' }}>
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', minWidth: '750px' }}>
                      <thead style={{ backgroundColor: 'var(--bg-cream)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <tr>
                          <th style={{ padding: '1rem 1.2rem', width: '80px' }}>Photo</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Product Name</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Category</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Price</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Stock</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Featured</th>
                          <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((p) => {
                          const primaryImg = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.featuredImage || p.image);
                          const totalImages = Array.isArray(p.images) ? p.images.length : (p.featuredImage || p.image ? 1 : 0);
                          return (
                            <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                              
                              {/* Photo with Change Photo Action */}
                              <td style={{ padding: '0.8rem 1.2rem' }}>
                                <div
                                  style={{
                                    position: 'relative',
                                    width: '54px',
                                    height: '54px',
                                    borderRadius: 'var(--radius-sm)',
                                    overflow: 'hidden',
                                    backgroundColor: 'var(--bg-subtle)',
                                    border: '1px solid var(--border-light)',
                                    boxShadow: 'var(--shadow-sm)',
                                  }}
                                >
                                  <img
                                    src={getImageUrl(primaryImg)}
                                    alt={p.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=150&q=80';
                                    }}
                                  />
                                  <button
                                    onClick={() => handleOpenQuickImageModal(p, 'product')}
                                    title="Upload / Change Photo"
                                    style={{
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      background: 'rgba(0,0,0,0.65)',
                                      color: '#FFF',
                                      border: 'none',
                                      fontSize: '0.62rem',
                                      padding: '2px 0',
                                      textAlign: 'center',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '2px',
                                    }}
                                  >
                                    <Upload size={9} /> Edit
                                  </button>
                                </div>
                              </td>

                              {/* Title & Dimension */}
                              <td style={{ padding: '0.8rem 1.2rem' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                  {p.dimensions ? `${p.dimensions} • ` : ''}{totalImages} image(s)
                                </div>
                              </td>

                              {/* Category */}
                              <td style={{ padding: '0.8rem 1.2rem' }}>
                                <span className="badge badge-lavender">{p.category}</span>
                              </td>

                              {/* Price & Discount */}
                              <td style={{ padding: '0.8rem 1.2rem' }}>
                                <div style={{ fontWeight: 700 }}>₹{Number(p.price || 0).toLocaleString('en-IN')}</div>
                                {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                    ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                                  </div>
                                )}
                              </td>

                              {/* Stock */}
                              <td style={{ padding: '0.8rem 1.2rem' }}>
                                <span className={`badge ${p.inStock ? 'badge-success' : 'badge-rose'}`}>
                                  {p.inStock ? `${p.countInStock !== undefined ? p.countInStock : 10} in stock` : 'Out of Stock'}
                                </span>
                              </td>

                              {/* Featured status */}
                              <td style={{ padding: '0.8rem 1.2rem' }}>
                                {p.isFeatured ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--gold-dark)', fontSize: '0.8rem', fontWeight: 600 }}>
                                    <Sparkles size={14} /> Featured
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Standard</span>
                                )}
                              </td>

                              {/* Action buttons */}
                              <td style={{ padding: '0.8rem 1.2rem', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                                  <button
                                    onClick={() => handleOpenProductModal(p)}
                                    className="btn btn-sm btn-secondary"
                                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                                    title="Edit Product Details & Images"
                                  >
                                    <Edit2 size={13} /> Edit
                                  </button>

                                  <button
                                    onClick={() => openDeleteProductModal(p)}
                                    className="btn btn-sm"
                                    style={{
                                      padding: '0.35rem 0.65rem',
                                      fontSize: '0.8rem',
                                      color: '#dc3545',
                                      backgroundColor: '#FFF1F0',
                                      border: '1px solid #FFCCC7',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.3rem',
                                      cursor: 'pointer',
                                    }}
                                    title="Delete Product"
                                  >
                                    <Trash2 size={13} /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 3. CATEGORIES MANAGEMENT ================= */}
          {activeTab === 'categories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Categories Management</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Manage craft collections, mediums & homepage category photos ({categories.length} categories)
                  </p>
                </div>
                <button onClick={() => handleOpenCategoryModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={18} /> Add New Category
                </button>
              </div>

              {/* Category Search */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  backgroundColor: '#FFFFFF',
                  padding: '0.8rem 1.2rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  marginBottom: '1.5rem',
                }}
              >
                <Search size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', backgroundColor: 'transparent' }}
                />
                {categorySearch && (
                  <button onClick={() => setCategorySearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Categories Grid */}
              <div className="grid-3" style={{ gap: '1.5rem' }}>
                {filteredCategories.map((cat) => {
                  const linkedCount = products.filter(
                    (p) => p.category?.toLowerCase() === cat.name?.toLowerCase()
                  ).length;

                  return (
                    <div
                      key={cat._id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Category Image with Quick Change Overlay */}
                      <div style={{ position: 'relative', width: '100%', height: '170px', overflow: 'hidden', backgroundColor: 'var(--bg-cream)' }}>
                        <img
                          src={getImageUrl(cat.image)}
                          alt={cat.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        
                        {/* Quick Change Image Button */}
                        <button
                          onClick={() => handleOpenQuickImageModal(cat, 'category')}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.35rem 0.7rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            boxShadow: 'var(--shadow-sm)',
                          }}
                          title="Upload new image for this category"
                        >
                          <Upload size={13} color="var(--rose-primary)" /> Change Image
                        </button>

                        <div
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '10px',
                            backgroundColor: 'rgba(32, 26, 24, 0.75)',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600,
                          }}
                        >
                          {linkedCount} linked piece(s)
                        </div>
                      </div>

                      {/* Content & Details */}
                      <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                              {cat.name}
                            </h3>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '1rem', lineHeight: '1.5' }}>
                            {cat.description || 'Artisan handcrafted collection made with signature mediums.'}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '1px solid var(--border-light)',
                            paddingTop: '0.9rem',
                            marginTop: '0.5rem',
                          }}
                        >
                          <a
                            href={`/shop?category=${encodeURIComponent(cat.name)}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '0.8rem', color: 'var(--rose-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}
                          >
                            View Products <ChevronRight size={14} />
                          </a>

                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleOpenCategoryModal(cat)}
                              className="btn btn-sm btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                              title="Edit Category"
                            >
                              <Edit2 size={13} /> Edit
                            </button>

                            <button
                              onClick={() => openDeleteCategoryModal(cat)}
                              className="btn btn-sm"
                              style={{
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.8rem',
                                color: '#dc3545',
                                backgroundColor: '#FFF1F0',
                                border: '1px solid #FFCCC7',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                cursor: 'pointer',
                              }}
                              title="Delete Category"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                          <img src={getImageUrl(item.image)} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
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

      {/* ================= PRODUCT ADD / EDIT MODAL ================= */}
      {productModalOpen && (
        <div className="modal-backdrop" onClick={() => setProductModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '720px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setProductModalOpen(false)}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              {editingProduct ? 'Edit Craft Product' : 'Add New Handcrafted Piece'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Upload photos directly from your device and configure product details.
            </p>

            <form onSubmit={handleSaveProduct}>
              {/* Product Title */}
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Vintage Floral Embroidery Hoop"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  required
                />
              </div>

              {/* Direct Multi-Image Uploader */}
              <MultiImageUploader
                images={productFormData.images}
                onChange={(newImages) => setProductFormData({ ...productFormData, images: newImages })}
                label="Product Photos (Primary photo shown on catalog & cards)"
                required
              />

              {/* Category, Price, Original Price */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="1299"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Strikethrough Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="1699"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Artisan description, needlework details, story..."
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  required
                />
              </div>

              {/* Materials, Dimensions, Lead Time */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Dimensions / Size</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="8 inch diameter"
                    value={productFormData.dimensions}
                    onChange={(e) => setProductFormData({ ...productFormData, dimensions: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Materials Used</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Linen, DMC Floss, Beechwood"
                    value={productFormData.materials}
                    onChange={(e) => setProductFormData({ ...productFormData, materials: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lead Time (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={productFormData.leadTimeDays}
                    onChange={(e) => setProductFormData({ ...productFormData, leadTimeDays: e.target.value })}
                  />
                </div>
              </div>

              {/* Stock count & Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={productFormData.countInStock}
                    onChange={(e) => setProductFormData({ ...productFormData, countInStock: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Search Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="embroidery, wedding, gift"
                    value={productFormData.tags}
                    onChange={(e) => setProductFormData({ ...productFormData, tags: e.target.value })}
                  />
                </div>
              </div>

              {/* Checkbox Toggles */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem', padding: '0.8rem', backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-md)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.inStock}
                    onChange={(e) => setProductFormData({ ...productFormData, inStock: e.target.checked })}
                  />
                  In Stock & Available
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isFeatured}
                    onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                  />
                  Feature on Homepage
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isBestSeller}
                    onChange={(e) => setProductFormData({ ...productFormData, isBestSeller: e.target.checked })}
                  />
                  Best Seller Badge
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isCustomizable}
                    onChange={(e) => setProductFormData({ ...productFormData, isCustomizable: e.target.checked })}
                  />
                  Allows Personalization
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.8rem' }}>
                {editingProduct ? 'Save Changes ✨' : 'Publish Product ✨'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= CATEGORY ADD / EDIT MODAL ================= */}
      {categoryModalOpen && (
        <div className="modal-backdrop" onClick={() => setCategoryModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '540px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setCategoryModalOpen(false)}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              {editingCategory ? 'Edit Craft Category' : 'Add Craft Category'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Category images appear on the homepage explore section and category collections.
            </p>

            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Resin Art & Clocks"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  required
                />
              </div>

              {/* Direct Single Image Uploader */}
              <SingleImageUploader
                value={categoryFormData.image}
                onChange={(imgUrl) => setCategoryFormData({ ...categoryFormData, image: imgUrl })}
                label="Category Cover Photo"
                recommendedSize="4:3 landscape or 1:1 square (e.g. 800x600px)"
                required
              />

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Brief description of this craft category..."
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon Medium</label>
                <select
                  className="form-control"
                  value={categoryFormData.iconName}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, iconName: e.target.value })}
                >
                  <option value="Sparkles">Sparkles (General Craft)</option>
                  <option value="Scissors">Scissors (Embroidery / Needlework)</option>
                  <option value="Palette">Palette (Fabric / Painting)</option>
                  <option value="Gem">Gem (Resin / Luxury Glass)</option>
                  <option value="Gift">Gift (Hampers / Custom Presents)</option>
                  <option value="Layers">Layers (Portraits / Mixed Media)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.8rem' }}>
                {editingCategory ? 'Update Category ✨' : 'Create Category ✨'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= QUICK IMAGE CHANGE MODAL ================= */}
      {quickImageModal.open && (
        <div className="modal-backdrop" onClick={() => setQuickImageModal({ open: false, type: null, item: null, image: '' })}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setQuickImageModal({ open: false, type: null, item: null, image: '' })}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              Change Photo - {quickImageModal.item?.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Upload a new photo from your gallery or computer. The new image will update immediately.
            </p>

            <SingleImageUploader
              value={quickImageModal.image}
              onChange={(imgUrl) => setQuickImageModal((prev) => ({ ...prev, image: imgUrl }))}
              label="Selected Photo"
              required
            />

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
              <button
                type="button"
                onClick={() => setQuickImageModal({ open: false, type: null, item: null, image: '' })}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickImage}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Save Photo ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteModal.open && (
        <div className="modal-backdrop" onClick={() => !deleteModal.loading && setDeleteModal({ open: false, type: null, item: null, warning: '', loading: false })}>
          <div className="modal-content" style={{ maxWidth: '460px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', color: '#dc3545' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFF1F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={22} color="#dc3545" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>
                Confirm Deletion
              </h3>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              {deleteModal.warning}
            </p>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                type="button"
                disabled={deleteModal.loading}
                onClick={() => setDeleteModal({ open: false, type: null, item: null, warning: '', loading: false })}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteModal.loading}
                onClick={deleteModal.type === 'product' ? confirmDeleteProduct : confirmDeleteCategory}
                className="btn"
                style={{
                  flex: 1,
                  backgroundColor: '#dc3545',
                  color: '#FFF',
                  border: 'none',
                  cursor: deleteModal.loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                {deleteModal.loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
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
            <img src={getImageUrl(viewCustomOrder.referenceImage)} alt="Reference" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
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
