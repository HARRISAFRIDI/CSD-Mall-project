"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createManualOrder(formData: FormData) {
  const customerName = formData.get("customerName") as string;
  let customerEmail = formData.get("customerEmail") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const orderDateStr = formData.get("orderDate") as string;

  // Generate a dummy email if not provided, since it's unique in the schema
  if (!customerEmail) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    customerEmail = `offline_${randomSuffix}@offline.local`;
  }

  // Find or create customer
  let customer = await prisma.customer.findUnique({
    where: { email: customerEmail },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: customerName || "Offline Customer",
        email: customerEmail,
        phone: customerPhone || "",
      },
    });
  }

  // Parse order items from form data
  // The frontend will send items as JSON in a hidden field, or we can use naming conventions like item_0_id, item_0_qty...
  // Let's assume the frontend sends a JSON string `orderItems` for simplicity
  const orderItemsJson = formData.get("orderItems") as string;
  const items: { productId: string; productName: string; unitPrice: number; quantity: number }[] = JSON.parse(orderItemsJson || "[]");

  if (items.length === 0) {
    throw new Error("Order must have at least one item.");
  }

  // Calculate totals
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.unitPrice * item.quantity;
  }

  // Read manual totals if provided, else use calculated
  const manualSubtotal = formData.get("subtotal");
  const manualTax = formData.get("taxAmount");
  const manualShipping = formData.get("shippingCost");
  const manualDiscount = formData.get("discountAmount");
  const manualTotal = formData.get("total");

  const finalSubtotal = manualSubtotal ? parseFloat(manualSubtotal as string) : subtotal;
  const taxAmount = manualTax ? parseFloat(manualTax as string) : 0;
  const shippingCost = manualShipping ? parseFloat(manualShipping as string) : 0;
  const discountAmount = manualDiscount ? parseFloat(manualDiscount as string) : 0;
  const total = manualTotal ? parseFloat(manualTotal as string) : (finalSubtotal + taxAmount + shippingCost - discountAmount);

  const createdAt = orderDateStr ? new Date(orderDateStr) : new Date();

  // Create Order and OrderItems
  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      subtotal: finalSubtotal,
      taxAmount,
      shippingCost,
      discountAmount,
      total,
      shippingStatus: "DELIVERED", // Default to delivered for manual orders
      paymentStatus: "PAID", // Default to paid
      createdAt,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
      },
    },
  });

  // Update customer total spent
  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      totalSpent: {
        increment: total,
      },
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/customers");
  redirect("/admin/orders");
}
