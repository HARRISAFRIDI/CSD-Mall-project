import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  activeProducts: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    allOrders,
    thisMonthOrders,
    lastMonthOrders,
    totalCustomers,
    thisMonthCustomers,
    lastMonthCustomers,
    activeProducts,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.customer.count(),
    prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.customer.count({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
    }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
  ]);

  const thisRev = thisMonthOrders._sum.total ?? 0;
  const lastRev = lastMonthOrders._sum.total ?? 1;
  const revenueChange = ((thisRev - lastRev) / lastRev) * 100;

  const thisOrders = thisMonthOrders._count ?? 0;
  const lastOrders = lastMonthOrders._count ?? 1;
  const ordersChange = ((thisOrders - lastOrders) / lastOrders) * 100;

  const lastCust = lastMonthCustomers === 0 ? 1 : lastMonthCustomers;
  const customersChange = ((thisMonthCustomers - lastMonthCustomers) / lastCust) * 100;

  return {
    totalRevenue: allOrders._sum.total ?? 0,
    revenueChange,
    totalOrders: await prisma.order.count(),
    ordersChange,
    totalCustomers,
    customersChange,
    activeProducts,
  };
}

export async function getRevenueData(): Promise<RevenueDataPoint[]> {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d);
  }

  const results = await Promise.all(
    months.map(async (start) => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      const agg = await prisma.order.aggregate({
        where: { createdAt: { gte: start, lte: end } },
        _sum: { total: true },
        _count: true,
      });
      return {
        month: start.toLocaleString("default", { month: "short" }),
        revenue: agg._sum.total ?? 0,
        orders: agg._count ?? 0,
      };
    })
  );
  return results;
}

export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
  const orders = await prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });
  return orders.map((o) => ({
    id: o.id,
    customerName: o.customer?.name ?? "Guest Customer",
    total: o.total,
    status: o.shippingStatus,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt,
  }));
}
