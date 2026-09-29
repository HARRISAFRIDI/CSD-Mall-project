import { getDashboardStats, getRevenueData, getRecentOrders } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RevenueChart, OrdersChart } from "@/components/admin/Charts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  prefix = "",
  suffix = "",
}: {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  prefix?: string;
  suffix?: string;
}) {
  const isPositive = change >= 0;
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-foreground">
          {prefix}{typeof value === "number" && title.toLowerCase().includes("revenue")
            ? value.toFixed(2)
            : value.toLocaleString()}{suffix}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={`text-xs font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}{change.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

const shippingBadgeVariant: Record<string, string> = {
  PENDING: "secondary",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "outline",
  REFUNDED: "destructive",
  RETURNED: "destructive",
};

const shippingBadgeColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REFUNDED: "bg-red-100 text-red-800 border-red-200",
  RETURNED: "bg-red-100 text-red-800 border-red-200",
};

export default async function AdminDashboardPage() {
  const [stats, revenueData, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRevenueData(),
    getRecentOrders(5),
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.revenueChange}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          change={stats.customersChange}
          icon={Users}
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          change={0}
          icon={Package}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Order Volume</CardTitle>
            <CardDescription>Orders by month</CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersChart data={revenueData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          <CardDescription>Latest 5 orders from your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Order ID</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Payment</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-2 font-mono text-xs text-muted-foreground">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3 px-2 font-medium">{order.customerName}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${shippingBadgeColor[order.status] ?? ""}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Badge
                        variant={order.paymentStatus === "PAID" ? "outline" : "destructive"}
                        className="text-xs"
                      >
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No orders yet. Seed your database to see sample data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
