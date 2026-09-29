CSD Web Application is a modern full-stack e-commerce platform built with Next.js 16, React 19, TypeScript, and Prisma ORM with SQLite. It features dynamic product browsing, category filtering, cart management, secure user authentication with role-based access control, and a feature-rich admin dashboard for managing orders, inventory, and revenue analytics.

---

# CSD Web Application

## 🚀 Overview

CSD Web is an end-to-end e-commerce web application featuring a seamless customer shopping experience alongside a comprehensive administrative dashboard.

---

## ✨ Features

### 🛍️ Storefront (Customer Facing)
- **Product Catalog**: Browse products with search, category filtering, and sorting.
- **Cart & Checkout**: Interactive cart state management and checkout process.
- **User Authentication**: Secure user registration and login with encrypted session cookies.

### 🛡️ Admin Dashboard (`/admin`)
- **Analytics & Metrics**: Revenue charts, order trends, customer growth, and active inventory tracking.
- **Order Management**: View detailed order summaries, customer info, shipping statuses (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `REFUNDED`), and payment statuses.
- **Manual Order Creation**: Create orders directly through the admin panel.
- **Product & Inventory**: Create, update, draft, or archive products with SKU and inventory tracking.
- **Store Settings**: Manage shipping zones, rates, and promotional discount codes.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Frontend**: [React 19](https://react.dev/), TypeScript, [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Charts**: [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/)
- **Database & ORM**: [SQLite](https://www.sqlite.org/) managed via [Prisma ORM v7](https://www.prisma.io/)
- **Authentication**: `jose` (JWT), `bcryptjs` for password hashing

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js**: v20+ (recommended v22+)
- **npm**: v10+

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Database Setup & Seeding
```bash
# Run migrations
npx prisma migrate dev

# Seed database with sample products, categories, orders, and admin user
npm run db:seed
```

### 4. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Admin Credentials

- **Email**: `admin@csd.com`
- **Password**: `admin123`

---

## 📂 Project Structure

```
├── prisma/
│   ├── schema.prisma       # Prisma DB schema models
│   ├── seed-node.mjs       # Database seed script
│   └── migrations/         # Migration history
├── src/
│   ├── app/
│   │   ├── actions/        # Server actions (auth, products, orders)
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── components/         # UI components & admin charts
│   └── lib/                # Database client & auth utilities
└── dev.db                  # Local SQLite database file
```
