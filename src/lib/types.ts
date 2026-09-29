export type ShippingStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "REFUNDED"
  | "RETURNED";
export type PaymentStatus = "PAID" | "REFUNDED" | "FAILED";
export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  discountPercentage: number;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  description: string;
  price: number;
  discountPercentage: number;
  stockQuantity: number;
  categoryId: string;
  category?: Category;
  imageUrl: string;
  status: ProductStatus;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customer?: Customer;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  shippingStatus: ShippingStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
}

export interface ShippingZone {
  id: string;
  region: string;
  cost: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  taxRate: number;
  shippingZones: ShippingZone[];
  promoCodes: PromoCode[];
}

// Cart types (client-side)
export interface CartItem {
  product: Product;
  quantity: number;
}
