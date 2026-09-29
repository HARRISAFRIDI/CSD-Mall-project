"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { RevenueDataPoint } from "@/lib/data";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.65 0.18 52)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="oklch(0.65 0.18 52)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 260)" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "oklch(0.5 0.02 260)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "oklch(0.5 0.02 260)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
          contentStyle={{
            background: "oklch(0.14 0.02 260)",
            border: "1px solid oklch(0.22 0.02 260)",
            borderRadius: "8px",
            color: "oklch(0.9 0.01 260)",
            fontSize: 13,
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="oklch(0.65 0.18 52)"
          strokeWidth={2.5}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OrdersChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 260)" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "oklch(0.5 0.02 260)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "oklch(0.5 0.02 260)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: any) => [value, "Orders"]}
          contentStyle={{
            background: "oklch(0.14 0.02 260)",
            border: "1px solid oklch(0.22 0.02 260)",
            borderRadius: "8px",
            color: "oklch(0.9 0.01 260)",
            fontSize: 13,
          }}
        />
        <Bar
          dataKey="orders"
          fill="oklch(0.55 0.15 200)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
