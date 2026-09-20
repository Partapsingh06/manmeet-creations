import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db.js';
import { seedData } from './seeder.js';
import Product from './models/Product.js';
import User from './models/User.js';

// Safe DNS servers configuration for local development / Node.js
try {
  const dns = await import("node:dns/promises");
  if (dns && typeof dns.setServers === 'function') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
  }
} catch {
  // DNS override fallback
}

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customOrderRoutes from './routes/customOrderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Netlify deployments & local dev
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');
      const allowedOrigins = [
        frontendUrl,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ].filter(Boolean);

      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.netlify.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      // Permissive fallback matching requester origin with credentials support
      return callback(null, true);
    },
    credentials: true,
  })
);

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads folder
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Manmeet Creations',
    tagline: 'Crafting memories with art & love ✨',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect DB & auto-seed if empty
const startServer = async () => {
  try {
    await connectDB();

    // Check if admin user exists, or run seed
    const targetAdminEmail = (process.env.ADMIN_EMAIL || 'kmeet7270@gmail.com').toLowerCase().trim();
    let adminExists = await User.findOne({ email: targetAdminEmail });
    if (!adminExists) {
      const anyAdmin = await User.findOne({ role: 'admin' });
      if (anyAdmin) {
        anyAdmin.email = targetAdminEmail;
        anyAdmin.phone = '+91 6239661708';
        await anyAdmin.save();
        adminExists = anyAdmin;
      }
    }
    const productCount = await Product.countDocuments();

    if (!adminExists || productCount === 0) {
      console.log('🌱 Initializing/refreshing boutique seed data & admin account...');
      await seedData();
    } else {
      console.log(`✨ Database active with ${productCount} handcrafted products and registered admin (${targetAdminEmail}).`);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Manmeet Creations Backend Server running on http://localhost:${PORT}`);
      console.log(`📍 API endpoints active at http://localhost:${PORT}/api/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
