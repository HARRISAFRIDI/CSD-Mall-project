import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Package, User, CreditCard, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Details" };

const shippingColors: Record<string, string> = {
  PENDING:    "bg-yellow-100 text-yellow-800 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED:    "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED:  "bg-emerald-100 text-emerald-800 border-emerald-200",
  REFUNDED:   "bg-red-100 text-red-800 border-red-200",
  RETURNED:   "bg-red-100 text-red-800 border-red-200",
};

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-muted-foreground" />
              Order Items
            </h2>
            
            <div className="space-y-4 divide-y divide-border/50">
              {order.items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product?.imageUrl || "/api/placeholder/100/100"} 
                      alt={item.productName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">${item.unitPrice.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-border/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${order.taxAmount.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount</span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/50">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
              Customer
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{order.customer?.name ?? "Guest Customer"}</p>
              <p className="text-muted-foreground">{order.customer?.email ?? "N/A"}</p>
              {order.customer?.phone && <p className="text-muted-foreground">{order.customer.phone}</p>}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-muted-foreground" />
              Shipping Status
            </h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${shippingColors[order.shippingStatus] ?? ""}`}>
              {order.shippingStatus}
            </span>
          </div>

          <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Payment Status
            </h2>
            <Badge variant={order.paymentStatus === "PAID" ? "outline" : "destructive"} className="text-sm px-3 py-1">
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
