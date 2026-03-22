"use client"

import { useMemo } from "react"
import { useAdminData } from "@/lib/admin-data-context"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AnalyticsPage() {
  const { orders, products } = useAdminData()

  // Prepare chart data
  const salesData = useMemo(() => {
    const data: Record<string, number> = {}
    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
      })
      data[month] = (data[month] || 0) + order.total
    })
    return Object.entries(data)
      .map(([month, sales]) => ({ month, sales }))
      .slice(-6)
  }, [orders])

  const statusData = useMemo(() => {
    const data: Record<string, number> = {}
    orders.forEach((order) => {
      data[order.status] = (data[order.status] || 0) + 1
    })
    return Object.entries(data).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
  }, [orders])

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {}
    products.forEach((product) => {
      data[product.category] = (data[product.category] || 0) + 1
    })
    return Object.entries(data).map(([name, value]) => ({ name, value }))
  }, [products])

  const COLORS = ["#0A3D2E", "#C5A059", "#05120F", "#1A1A1A", "#E8E6E3"]

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-2">
          Analytics
        </h1>
        <p className="text-[#666666]">Detailed business insights</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <p className="text-[#666666] text-sm font-medium mb-2">Total Revenue</p>
          <p className="text-3xl font-serif font-bold text-[#1A1A1A] mb-2">
            ₦{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
          </p>
          <p className="text-xs text-green-600 font-semibold">
            From {orders.length} orders
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <p className="text-[#666666] text-sm font-medium mb-2">
            Avg Order Value
          </p>
          <p className="text-3xl font-serif font-bold text-[#1A1A1A] mb-2">
            ₦{orders.length > 0 ? Math.floor(
              orders.reduce((sum, o) => sum + o.total, 0) / orders.length
            ).toLocaleString() : "0"}
          </p>
          <p className="text-xs text-[#666666]">Per transaction</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <p className="text-[#666666] text-sm font-medium mb-2">
            Conversion Rate
          </p>
          <p className="text-3xl font-serif font-bold text-[#1A1A1A] mb-2">
            {orders.length > 0 ? "2.4%" : "0%"}
          </p>
          <p className="text-xs text-[#666666]">Estimated</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
            Sales Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E3" />
              <XAxis dataKey="month" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E8E6E3",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#0A3D2E"
                strokeWidth={2}
                dot={{ fill: "#0A3D2E" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
            Order Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Product Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg border border-[#E8E6E3] p-6"
      >
        <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
          Products by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E3" />
            <XAxis dataKey="name" stroke="#666666" />
            <YAxis stroke="#666666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E8E6E3",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" fill="#C5A059" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
