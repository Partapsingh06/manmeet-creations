# ✨ Manmeet Creations - Luxury Handmade Art & Craft Boutique

> **“Crafting memories with art & love ✨”**

A full-stack e-commerce and bespoke commissions web application for **Manmeet Creations**, an artisan studio specializing in handmade embroidery hoops, ocean wave resin art, hand-painted fabrics, charcoal portraits, customized gifts, and bespoke milestone keepsakes.

---

## 🌸 Visual Identity & Design System

- **Color Palette**: Warm Ivory & Cream (`#FAF7F2`, `#FFFDF9`), Delicate Rose Blush (`#D47376`, `#FDF1F0`), Soft Mauve & Lavender (`#8E7C93`, `#F4EFF6`), Warm Gold Accents (`#C59A4E`), Deep Espresso Charcoal (`#201A18`).
- **Typography**: Editorial Serif headings (*Playfair Display*, *Cormorant Garamond*) paired with clean modern body (*Plus Jakarta Sans*).
- **Aesthetics**: Glassmorphic headers, floating boutique badges, smooth hover animations, responsive masonry gallery, and celebratory confetti effects.

---

## 🚀 Key Features

### 🛍️ E-Commerce & Catalog
- **24+ Handcrafted Masterpieces**: Pre-seeded catalog across 8 categories with detailed descriptions, materials, dimensions, and craft photography.
- **Dynamic Search & Filtering**: Live search, category filter pills, interactive price slider, and sorting (Newest, Price: Low-High, Price: High-Low, Top Rated).
- **Quick View Modal**: Instant product preview with customization notes and quantity picker without leaving the catalog.
- **Product Details Page**: Multi-angle photo gallery, dimensions, lead time, customer reviews list, verified review submission form, and related items.
- **Floating WhatsApp Enquiry**: Dynamic WhatsApp chat launcher with prefilled product and customization messages.

### ✨ Bespoke Custom Orders
- Dedicated Commission Request Studio (`/custom-orders`).
- Multi-field intake form: Category, Headline, Customization details, Preferred size, Budget range, Required date, and Reference photo upload preview.
- Stores directly in MongoDB and displays in the Admin Dashboard with reference photos.

### 🛒 Cart, Checkout & Order Tracking
- **Slide-Out Cart Drawer & Full Cart Page**: Quantity management, free shipping progress bar, and promo coupon engine (`ARTLOVE10`, `WELCOME50`).
- **Secure Checkout**: Multi-step delivery address intake, Cash on Delivery (COD), and simulated UPI / Online QR payment gateway.
- **Order Confirmation & Tracking**: Generated unique Order ID (e.g. `MC-2026-XXXX`), status stepper (`Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`), itemization, and WhatsApp tracking link.

### 👑 Full Admin Dashboard (`/admin`)
- **KPI Metrics**: Total Revenue, Total Orders, Pending Dispatch, Custom Requests count, Active Catalog count, and Patrons count.
- **Product Management**: Full CRUD modal with image URLs, categories, dimensions, lead times, and featured flags.
- **Order Management**: Order status updater (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Custom Inquiries Review**: Inspect customer reference images, budgets, target dates, and update quotes/statuses.
- **Category & Message Management**: Manage craft collections and website contact inquiries.
- **Review Moderation**: Moderate and delete customer reviews.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **👑 Admin** | `kmeet7270@gmail.com` | `Admin@1234` |
| **🛍️ Demo Customer** | `customer@gmail.com` | `Customer@1234` |

*(Quick 1-click login buttons are also available directly on the Login page!)*

---

## 🛠️ Technology Stack

- **Frontend**: React 18/19, Vite, React Router DOM v6, Lucide React Icons, Canvas Confetti, Vanilla CSS Design System.
- **Backend**: Node.js, Express.js, Mongoose ODM, JWT Authentication, BcryptJS, Multer, Morgan.
- **Database**: MongoDB (with zero-config embedded `mongodb-memory-server` fallback for instant out-of-the-box execution).

---

## 📦 Setup & Running Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Start Backend Server
```bash
cd backend
npm install
npm run start
```
*The backend automatically starts on `http://localhost:5000` and auto-seeds the 24 products, admin account, categories, and reviews.*

### 3. Start Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
*The frontend starts on `http://localhost:5173`.*

---

## 🌐 API Routes Summary

- `POST /api/auth/register` - Register customer
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Current logged-in user profile
- `GET /api/products` - Filtered & sorted product catalog
- `GET /api/products/featured` - Homepage best sellers
- `GET /api/products/:idOrSlug` - Product details with reviews & related items
- `POST /api/products` - Admin create product
- `PUT /api/products/:id` - Admin update product
- `DELETE /api/products/:id` - Admin delete product
- `GET /api/categories` - Categories list with dynamic product counts
- `POST /api/orders` - Place order & update inventory
- `GET /api/orders/myorders` - Customer order history
- `GET /api/orders/:id` - Order invoice & tracking details
- `POST /api/custom-orders` - Submit bespoke commission request
- `GET /api/custom-orders` - Admin view all custom requests
- `POST /api/contact` - Submit contact message
- `GET /api/admin/stats` - Admin dashboard KPIs and analytics

---

## 📄 License
Copyright © Manmeet Creations. Handcrafted with love in India.
