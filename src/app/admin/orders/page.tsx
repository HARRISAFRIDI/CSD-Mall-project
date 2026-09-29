import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders" };

const shippingColors: Record<string, string> = {
  PENDING:    "bg-yellow-100 text-yellow-800 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED:    "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED:  "bg-emerald-100 text-emerald-800 border-emerald-200",
  REFUNDED:   "bg-red-100 text-red-800 border-red-200",
  RETURNED:   "bg-red-100 text-red-800 border-red-200",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; payment?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const statusFilter = sp.status ?? "";
  const paymentFilter = sp.payment ?? "";

  const orders = await prisma.order.findMany({
    where: {
      AND: [
        statusFilter  ? { shippingStatus: statusFilter  } : {},
        paymentFilter ? { paymentStatus:  paymentFilter } : {},
        q ? { customer: { name: { contains: q } } } : {},
      ],
    },
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {orders.length} orders · ${totalRevenue.toFixed(2)} total
          </p>
        </div>
        <Link href="/admin/orders/new">
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Add Order
          </button>
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by customer..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select name="status" defaultValue={statusFilter} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All Shipping Status</option>
          {["PENDING","PROCESSING","SHIPPED","DELIVERED","REFUNDED","RETURNED"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select name="payment" defaultValue={paymentFilter} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All Payment Status</option>
          {["PAID","REFUNDED","FAILED"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">Filter</button>
      </form>

      <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Items</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Shipping</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Payment</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{order.customer?.name ?? "Guest Customer"}</p>
                  <p className="text-xs text-muted-foreground">{order.customer?.email ?? "N/A"}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${shippingColors[order.shippingStatus] ?? ""}`}>
                    {order.shippingStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={order.paymentStatus === "PAID" ? "outline" : "destructive"} className="text-xs">
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-semibold">${order.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="text-xs text-primary hover:underline font-medium">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No orders found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
