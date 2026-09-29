import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  discountPercentage: z.coerce
    .number()
    .min(0)
    .max(100, "Discount must be between 0-100"),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  discountPercentage: z.coerce
    .number()
    .min(0)
    .max(100, "Discount must be between 0-100"),
});

export const promoCodeSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .toUpperCase(),
  discountPercent: z.coerce
    .number()
    .min(1)
    .max(100, "Discount must be between 1-100"),
  active: z.boolean().default(true),
});

export const shippingZoneSchema = z.object({
  region: z.string().min(2, "Region must be at least 2 characters"),
  cost: z.coerce.number().min(0, "Shipping cost cannot be negative"),
});

export const orderStatusSchema = z.object({
  shippingStatus: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "REFUNDED",
    "RETURNED",
  ]),
  paymentStatus: z.enum(["PAID", "REFUNDED", "FAILED"]),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type PromoCodeFormData = z.infer<typeof promoCodeSchema>;
export type ShippingZoneFormData = z.infer<typeof shippingZoneSchema>;
export type OrderStatusFormData = z.infer<typeof orderStatusSchema>;
