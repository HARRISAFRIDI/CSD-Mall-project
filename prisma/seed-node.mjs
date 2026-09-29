// Use Node.js built-in sqlite module (Node 22.5+)
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Point to root-level dev.db (where migrations are applied)
const dbPath = resolve(__dirname, "../dev.db");
console.log("DB path:", dbPath);

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL");
// Disable FK checks during seeding to avoid constraint order issues
db.exec("PRAGMA foreign_keys = OFF");

const cuid = () => "c" + randomBytes(11).toString("base64url").slice(0, 23);
const now = new Date();
const d = (mo) => new Date(now.getFullYear(), now.getMonth() - mo, 15).toISOString();
const iso = now.toISOString();

// Apply schema if needed
const tableCount = db.prepare("SELECT COUNT(*) as n FROM sqlite_master WHERE type='table'").get().n;
if (tableCount < 2) {
  console.log("📦 Applying schema...");
  const migPath = resolve(__dirname, "migrations/20260803194319_init/migration.sql");
  const sql = readFileSync(migPath, "utf8");
  db.exec(sql);
  const after = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Tables created:", after.map(r => r.name));
}

console.log("🌱 Seeding...");

// Categories
const cats = [
  { id: cuid(), name: "Electronics",   slug: "electronics",  disc: 5  },
  { id: cuid(), name: "Clothing",      slug: "clothing",     disc: 10 },
  { id: cuid(), name: "Accessories",   slug: "accessories",  disc: 0  },
  { id: cuid(), name: "Home & Living", slug: "home-living",  disc: 15 },
];
const delCat = db.prepare('DELETE FROM "Category" WHERE slug = ?');
const insCat = db.prepare('INSERT INTO "Category" (id, name, slug, discountPercentage, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
for (const c of cats) { delCat.run(c.slug); insCat.run(c.id, c.name, c.slug, c.disc, iso, iso); }
const [elecId, clothId, accId, homeId] = cats.map(c => c.id);

// Products
const prods = [
  { id: cuid(), title: "Wireless Noise-Cancelling Headphones", sku: "ELEC-001", desc: "Premium over-ear headphones with 40-hour battery life and active noise cancellation.", price: 299.99, disc: 15, stock: 45, catId: elecId,  img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
  { id: cuid(), title: "Smart Watch Pro Series",               sku: "ELEC-002", desc: "Feature-rich smartwatch with health tracking, GPS, and 7-day battery life.",          price: 449.99, disc: 0,  stock: 32, catId: elecId,  img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
  { id: cuid(), title: "Mechanical Keyboard TKL",              sku: "ELEC-003", desc: "Tenkeyless mechanical keyboard with Cherry MX switches and RGB backlighting.",        price: 189.99, disc: 5,  stock: 0,  catId: elecId,  img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80" },
  { id: cuid(), title: "Premium Cotton Oxford Shirt",          sku: "CLTH-001", desc: "Classic fit Oxford shirt crafted from 100% premium cotton. Machine washable.",        price: 89.99,  disc: 20, stock: 120,catId: clothId, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80" },
  { id: cuid(), title: "Slim-Fit Chino Pants",                 sku: "CLTH-002", desc: "Modern slim-fit chinos in stretch cotton blend. Versatile casual styling.",           price: 119.99, disc: 0,  stock: 85, catId: clothId, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80" },
  { id: cuid(), title: "Genuine Leather Bifold Wallet",        sku: "ACC-001",  desc: "Slim bifold wallet crafted from full-grain Italian leather. RFID-blocking.",          price: 79.99,  disc: 0,  stock: 60, catId: accId,   img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80" },
  { id: cuid(), title: "Polarized Aviator Sunglasses",         sku: "ACC-002",  desc: "Classic aviator frames with polarized UV400 lenses. Lightweight steel frame.",        price: 149.99, disc: 10, stock: 40, catId: accId,   img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80" },
  { id: cuid(), title: "Ceramic Pour-Over Coffee Set",         sku: "HOME-001", desc: "Handcrafted ceramic pour-over dripper with carafe. Includes premium filters.",        price: 64.99,  disc: 0,  stock: 25, catId: homeId,  img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80" },
];
const delProd = db.prepare('DELETE FROM "Product" WHERE sku = ?');
const insProd = db.prepare('INSERT INTO "Product" (id, title, sku, description, price, discountPercentage, stockQuantity, categoryId, imageUrl, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
for (const p of prods) { delProd.run(p.sku); insProd.run(p.id, p.title, p.sku, p.desc, p.price, p.disc, p.stock, p.catId, p.img, "ACTIVE", iso, iso); }

// Customers
const custs = [
  { id: cuid(), name: "Ahmed Ali",    email: "ahmed.ali@example.com",    phone: "+92-300-1234567", spent: 774.97 },
  { id: cuid(), name: "Sara Khan",    email: "sara.khan@example.com",    phone: "+92-321-7654321", spent: 420.35 },
  { id: cuid(), name: "Omar Sheikh",  email: "omar.sheikh@example.com",  phone: "+92-333-9876543", spent: 328.56 },
  { id: cuid(), name: "Fatima Malik", email: "fatima.malik@example.com", phone: "+92-311-4567890", spent: 196.18 },
  { id: cuid(), name: "Zain Hussain", email: "zain.hussain@example.com", phone: "+92-345-3210987", spent: 215.18 },
];
const delCust = db.prepare('DELETE FROM "Customer" WHERE email = ?');
const insCust = db.prepare('INSERT INTO "Customer" (id, name, email, phone, totalSpent, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
for (const c of custs) { delCust.run(c.email); insCust.run(c.id, c.name, c.email, c.phone, c.spent, iso, iso); }
const [c1, c2, c3, c4, c5] = custs.map(c => c.id);

// Orders
db.prepare('DELETE FROM "OrderItem"').run();
db.prepare('DELETE FROM "Order"').run();

const insOrder = db.prepare('INSERT INTO "Order" (id, customerId, subtotal, taxAmount, shippingCost, discountAmount, total, shippingStatus, paymentStatus, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const insItem  = db.prepare('INSERT INTO "OrderItem" (id, orderId, productId, productName, unitPrice, quantity) VALUES (?, ?, ?, ?, ?, ?)');
const getProd  = (sku) => prods.find(p => p.sku === sku);
const orderDefs = [
  { cId: c1, items: [["ELEC-001",1]], sub: 299.99, tax: 24.00, ship: 9.99,  disc: 0,    total: 333.98, ss: "DELIVERED",  ps: "PAID",     mo: 5 },
  { cId: c1, items: [["ELEC-002",1]], sub: 449.99, tax: 36.00, ship: 0,     disc: 45.0, total: 440.99, ss: "SHIPPED",    ps: "PAID",     mo: 4 },
  { cId: c2, items: [["CLTH-001",2],["CLTH-002",1],["ACC-001",1]], sub: 379.96, tax: 30.40, ship: 9.99, disc: 0, total: 420.35, ss: "PROCESSING", ps: "PAID",  mo: 3 },
  { cId: c3, items: [["ACC-002",1],["HOME-001",1],["ACC-001",1]], sub: 294.97, tax: 23.60, ship: 9.99,  disc: 0, total: 328.56, ss: "PENDING",    ps: "PAID",  mo: 2 },
  { cId: c4, items: [["ELEC-003",1]], sub: 189.99, tax: 15.20, ship: 9.99,  disc: 19.0, total: 196.18, ss: "DELIVERED",  ps: "PAID",     mo: 1 },
  { cId: c5, items: [["ELEC-003",1]], sub: 189.99, tax: 15.20, ship: 9.99,  disc: 0,    total: 215.18, ss: "RETURNED",   ps: "REFUNDED", mo: 0 },
];
for (const o of orderDefs) {
  const orderId = cuid();
  insOrder.run(orderId, o.cId, o.sub, o.tax, o.ship, o.disc, o.total, o.ss, o.ps, d(o.mo), d(o.mo));
  for (const [sku, qty] of o.items) {
    const p = getProd(sku);
    insItem.run(cuid(), orderId, p.id, p.title, p.price, qty);
  }
}

// Store settings
db.prepare('DELETE FROM "StoreSetting" WHERE key = ?').run("store_config");
db.prepare('INSERT INTO "StoreSetting" (id, key, value) VALUES (?, ?, ?)').run(
  cuid(), "store_config",
  JSON.stringify({
    storeName: "CSD", taxRate: 0.08,
    shippingZones: [{ id: "sz-1", region: "Local (City)", cost: 9.99 }, { id: "sz-2", region: "Domestic", cost: 14.99 }, { id: "sz-3", region: "International", cost: 29.99 }],
    promoCodes: [{ id: "pc-1", code: "WELCOME10", discountPercent: 10, active: true }, { id: "pc-2", code: "SAVE20", discountPercent: 20, active: true }, { id: "pc-3", code: "VIP30", discountPercent: 30, active: false }],
  })
);

// Admin user (password: admin123)
db.prepare('DELETE FROM "User" WHERE email = ?').run("admin@csd.com");
db.prepare('INSERT INTO "User" (id, name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
  cuid(), "Admin", "admin@csd.com",
  // bcrypt hash of "admin123" (rounds=10)
  "$2b$10$9XffcxiMGKif2BRMEtcONOhJBbBqckXVMVvP/nZifHwUGTd8MxUSC",
  "ADMIN", iso, iso
);

// Re-enable FK constraints
db.exec("PRAGMA foreign_keys = ON");

console.log("✅ Database seeded successfully!");
console.log("   Admin login: admin@csd.com / admin123");
db.close();
