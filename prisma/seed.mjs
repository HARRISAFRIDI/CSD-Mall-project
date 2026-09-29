// Seed using Prisma db seed via prisma.config.ts — which handles the adapter
// Run with: npx prisma db seed
// Or directly: node prisma/seed.mjs

import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { PrismaClient } = await import(join(__dirname, "../src/generated/prisma/client.js"));

const sqlite = new Database(join(__dirname, "dev.db"));
const adapter = new PrismaBetterSQLite3(sqlite);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log("🌱 Seeding database...");

  const electronics = await prisma.category.upsert({ where: { slug: "electronics" }, update: {}, create: { name: "Electronics", slug: "electronics", discountPercentage: 5 } });
  const clothing = await prisma.category.upsert({ where: { slug: "clothing" }, update: {}, create: { name: "Clothing", slug: "clothing", discountPercentage: 10 } });
  const accessories = await prisma.category.upsert({ where: { slug: "accessories" }, update: {}, create: { name: "Accessories", slug: "accessories", discountPercentage: 0 } });
  const homeLiving = await prisma.category.upsert({ where: { slug: "home-living" }, update: {}, create: { name: "Home & Living", slug: "home-living", discountPercentage: 15 } });

  const p1 = await prisma.product.upsert({ where: { sku: "ELEC-001" }, update: {}, create: { title: "Wireless Noise-Cancelling Headphones", sku: "ELEC-001", description: "Premium over-ear headphones with 40-hour battery life.", price: 299.99, discountPercentage: 15, stockQuantity: 45, categoryId: electronics.id, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", status: "ACTIVE" } });
  const p2 = await prisma.product.upsert({ where: { sku: "ELEC-002" }, update: {}, create: { title: "Smart Watch Pro Series", sku: "ELEC-002", description: "Feature-rich smartwatch with health tracking.", price: 449.99, discountPercentage: 0, stockQuantity: 32, categoryId: electronics.id, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", status: "ACTIVE" } });
  const p3 = await prisma.product.upsert({ where: { sku: "CLTH-001" }, update: {}, create: { title: "Premium Cotton Oxford Shirt", sku: "CLTH-001", description: "Classic fit Oxford shirt from 100% premium cotton.", price: 89.99, discountPercentage: 20, stockQuantity: 120, categoryId: clothing.id, imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80", status: "ACTIVE" } });
  const p4 = await prisma.product.upsert({ where: { sku: "CLTH-002" }, update: {}, create: { title: "Slim-Fit Chino Pants", sku: "CLTH-002", description: "Modern slim-fit chinos in stretch cotton blend.", price: 119.99, discountPercentage: 0, stockQuantity: 85, categoryId: clothing.id, imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80", status: "ACTIVE" } });
  const p5 = await prisma.product.upsert({ where: { sku: "ACC-001" }, update: {}, create: { title: "Genuine Leather Bifold Wallet", sku: "ACC-001", description: "Slim bifold wallet from full-grain Italian leather.", price: 79.99, discountPercentage: 0, stockQuantity: 60, categoryId: accessories.id, imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80", status: "ACTIVE" } });
  const p6 = await prisma.product.upsert({ where: { sku: "ACC-002" }, update: {}, create: { title: "Polarized Aviator Sunglasses", sku: "ACC-002", description: "Classic aviator frames with polarized UV400 lenses.", price: 149.99, discountPercentage: 10, stockQuantity: 40, categoryId: accessories.id, imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", status: "ACTIVE" } });
  const p7 = await prisma.product.upsert({ where: { sku: "HOME-001" }, update: {}, create: { title: "Ceramic Pour-Over Coffee Set", sku: "HOME-001", description: "Handcrafted ceramic pour-over dripper with carafe.", price: 64.99, discountPercentage: 0, stockQuantity: 25, categoryId: homeLiving.id, imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", status: "ACTIVE" } });
  const p8 = await prisma.product.upsert({ where: { sku: "ELEC-003" }, update: {}, create: { title: "Mechanical Keyboard TKL", sku: "ELEC-003", description: "TKL mechanical keyboard with Cherry MX switches and RGB.", price: 189.99, discountPercentage: 5, stockQuantity: 0, categoryId: electronics.id, imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80", status: "ACTIVE" } });

  const c1 = await prisma.customer.upsert({ where: { email: "ahmed.ali@example.com" }, update: {}, create: { name: "Ahmed Ali", email: "ahmed.ali@example.com", phone: "+92-300-1234567", totalSpent: 0 } });
  const c2 = await prisma.customer.upsert({ where: { email: "sara.khan@example.com" }, update: {}, create: { name: "Sara Khan", email: "sara.khan@example.com", phone: "+92-321-7654321", totalSpent: 0 } });
  const c3 = await prisma.customer.upsert({ where: { email: "omar.sheikh@example.com" }, update: {}, create: { name: "Omar Sheikh", email: "omar.sheikh@example.com", phone: "+92-333-9876543", totalSpent: 0 } });
  const c4 = await prisma.customer.upsert({ where: { email: "fatima.malik@example.com" }, update: {}, create: { name: "Fatima Malik", email: "fatima.malik@example.com", phone: "+92-311-4567890", totalSpent: 0 } });
  const c5 = await prisma.customer.upsert({ where: { email: "zain.hussain@example.com" }, update: {}, create: { name: "Zain Hussain", email: "zain.hussain@example.com", phone: "+92-345-3210987", totalSpent: 0 } });

  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    const now = new Date();
    const makeDate = (mOffset) => new Date(now.getFullYear(), now.getMonth() - mOffset, 15);
    await prisma.order.create({ data: { customerId: c1.id, subtotal: 299.99, taxAmount: 24.0, shippingCost: 9.99, discountAmount: 0, total: 333.98, shippingStatus: "DELIVERED", paymentStatus: "PAID", createdAt: makeDate(5), items: { create: [{ productId: p1.id, productName: p1.title, unitPrice: p1.price, quantity: 1 }] } } });
    await prisma.order.create({ data: { customerId: c1.id, subtotal: 449.99, taxAmount: 36.0, shippingCost: 0, discountAmount: 45.0, total: 440.99, shippingStatus: "SHIPPED", paymentStatus: "PAID", createdAt: makeDate(4), items: { create: [{ productId: p2.id, productName: p2.title, unitPrice: p2.price, quantity: 1 }] } } });
    await prisma.order.create({ data: { customerId: c2.id, subtotal: 379.96, taxAmount: 30.4, shippingCost: 9.99, discountAmount: 0, total: 420.35, shippingStatus: "PROCESSING", paymentStatus: "PAID", createdAt: makeDate(3), items: { create: [{ productId: p3.id, productName: p3.title, unitPrice: p3.price, quantity: 2 }, { productId: p4.id, productName: p4.title, unitPrice: p4.price, quantity: 1 }, { productId: p5.id, productName: p5.title, unitPrice: p5.price, quantity: 1 }] } } });
    await prisma.order.create({ data: { customerId: c3.id, subtotal: 294.97, taxAmount: 23.6, shippingCost: 9.99, discountAmount: 0, total: 328.56, shippingStatus: "PENDING", paymentStatus: "PAID", createdAt: makeDate(2), items: { create: [{ productId: p6.id, productName: p6.title, unitPrice: p6.price, quantity: 1 }, { productId: p7.id, productName: p7.title, unitPrice: p7.price, quantity: 1 }, { productId: p5.id, productName: p5.title, unitPrice: p5.price, quantity: 1 }] } } });
    await prisma.order.create({ data: { customerId: c4.id, subtotal: 189.99, taxAmount: 15.2, shippingCost: 9.99, discountAmount: 19.0, total: 196.18, shippingStatus: "DELIVERED", paymentStatus: "PAID", createdAt: makeDate(1), items: { create: [{ productId: p8.id, productName: p8.title, unitPrice: p8.price, quantity: 1 }] } } });
    await prisma.order.create({ data: { customerId: c5.id, subtotal: 189.99, taxAmount: 15.2, shippingCost: 9.99, discountAmount: 0, total: 215.18, shippingStatus: "RETURNED", paymentStatus: "REFUNDED", createdAt: makeDate(0), items: { create: [{ productId: p8.id, productName: p8.title, unitPrice: p8.price, quantity: 1 }] } } });
  }

  await prisma.storeSetting.upsert({ where: { key: "store_config" }, update: {}, create: { key: "store_config", value: JSON.stringify({ storeName: "CSD", taxRate: 0.08, shippingZones: [{ id: "sz-1", region: "Local (City)", cost: 9.99 }, { id: "sz-2", region: "Domestic", cost: 14.99 }, { id: "sz-3", region: "International", cost: 29.99 }], promoCodes: [{ id: "pc-1", code: "WELCOME10", discountPercent: 10, active: true }, { id: "pc-2", code: "SAVE20", discountPercent: 20, active: true }, { id: "pc-3", code: "VIP30", discountPercent: 30, active: false }] }) } });

  await prisma.customer.update({ where: { id: c1.id }, data: { totalSpent: 774.97 } });
  await prisma.customer.update({ where: { id: c2.id }, data: { totalSpent: 420.35 } });
  await prisma.customer.update({ where: { id: c3.id }, data: { totalSpent: 328.56 } });
  await prisma.customer.update({ where: { id: c4.id }, data: { totalSpent: 196.18 } });
  await prisma.customer.update({ where: { id: c5.id }, data: { totalSpent: 215.18 } });

  console.log("✅ Seeding complete!");
}

seed().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
