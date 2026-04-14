"use client"

import { useAdminData } from "@/lib/admin-data-context"
import { motion } from "framer-motion"
import { Package, ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const chartData = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 221 },
  { name: "Mar", sales: 2000, orders: 229 },
  { name: "Apr", sales: 2780, orders: 200 },
  { name: "May", sales: 1890, orders: 229 },
  { name: "Jun", sales: 2390, orders: 200 },
]

export default function AdminDashboard() {
  const {
    getTotalRevenue,
    getTotalOrders,
    getTotalProducts,
    orders,
    contactMessages,
  } = useAdminData()

  const stats = [
    {
      label: "Total Products",
      value: getTotalProducts(),
      icon: Package,
      color: "bg-emerald-50",
      iconColor: "text-[#0A3D2E]",
    },
    {
      label: "Total Orders",
      value: getTotalOrders(),
      icon: ShoppingCart,
      color: "bg-amber-50",
      iconColor: "text-[#C5A059]",
    },
    {
      label: "Total Revenue",
      value: `₦${getTotalRevenue().toLocaleString()}`,
      icon: DollarSign,
      color: "bg-stone-50",
      iconColor: "text-[#666666]",
    },
    {
      label: "Customers",
      value: new Set(orders.map((o) => o.email)).size,
      icon: Users,
      color: "bg-slate-50",
      iconColor: "text-[#1A1A1A]",
    },
    {
      label: "Unread Messages",
      value: contactMessages.filter((m) => m.status === "new").length,
      icon: Users,
      color: "bg-rose-50",
      iconColor: "text-rose-700",
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-2">
          Dashboard
        </h1>
        <p className="text-[#666666]">
          Welcome back! Here's your business overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg border border-[#E8E6E3] p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-[#666666] font-medium mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-serif font-bold text-[#1A1A1A]">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className={`${stat.iconColor} w-6 h-6`} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12% from last month</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <h2 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
            Sales Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#0A3D2E"
                strokeWidth={2}
                dot={{ fill: "#0A3D2E", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <h2 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
            Orders Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
              <Legend />
              <Bar dataKey="orders" fill="#C5A059" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border border-[#E8E6E3] p-6"
      >
        <h2 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E6E3]">
                <th className="text-left py-3 px-4 font-semibold text-[#1A1A1A]">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#1A1A1A]">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#1A1A1A]">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#1A1A1A]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-[#E8E6E3]">
                  <td className="py-3 px-4 text-[#666666]">{order.id}</td>
                  <td className="py-3 px-4 text-[#666666]">{order.customerName}</td>
                  <td className="py-3 px-4 font-semibold text-[#1A1A1A]">
                    ₦{order.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  )
}
