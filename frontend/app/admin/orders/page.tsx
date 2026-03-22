"use client"

import { useState } from "react"
import { useAdminData } from "@/lib/admin-data-context"
import { motion } from "framer-motion"
import { Trash2, Eye, ChevronDown } from "lucide-react"
import type { Order } from "@/lib/admin-data-context"

export default function OrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useAdminData()
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<Order["status"] | "">("")

  const filteredOrders = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders

  const statusColors: Record<Order["status"], { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
    processing: { bg: "bg-blue-100", text: "text-blue-700", label: "Processing" },
    shipped: { bg: "bg-purple-100", text: "text-purple-700", label: "Shipped" },
    delivered: { bg: "bg-green-100", text: "text-green-700", label: "Delivered" },
    cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
  }

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus)
  }

  const handleDeleteOrder = (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      deleteOrder(id)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-2">
          Orders
        </h1>
        <p className="text-[#666666]">Manage and track customer orders</p>
      </motion.div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-[#E8E6E3] p-6 mb-8">
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          Filter by Status
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Order["status"] | "")}
          className="px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E8E6E3] p-12 text-center">
            <p className="text-[#666666] text-lg">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id
            const statusColor = statusColors[order.status]

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg border border-[#E8E6E3] overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-[#F9F8F6] transition-colors"
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order.id)
                  }
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}
                      >
                        {statusColor.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-[#666666]">
                      <div>
                        <p className="text-xs text-[#999999]">Customer</p>
                        <p className="font-medium text-[#1A1A1A]">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#999999]">Total</p>
                        <p className="font-semibold text-[#1A1A1A]">
                          ₦{order.total.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#999999]">Date</p>
                        <p className="font-medium text-[#1A1A1A]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-6 h-6 text-[#666666]" />
                  </motion.div>
                </div>

                {/* Order Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-[#E8E6E3] p-6 bg-[#F9F8F6]"
                  >
                    {/* Products */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#1A1A1A] mb-4">
                        Items
                      </h4>
                      <div className="space-y-3">
                        {order.products.map((product, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-lg border border-[#E8E6E3]"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-[#1A1A1A]">
                                  {product.productName}
                                </p>
                                <p className="text-sm text-[#666666]">
                                  Qty: {product.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-[#1A1A1A]">
                                ₦{product.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer & Shipping Info */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-[#1A1A1A] mb-2">
                          Customer Info
                        </h4>
                        <p className="text-sm text-[#1A1A1A]">{order.customerName}</p>
                        <p className="text-sm text-[#666666]">{order.email}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1A1A1A] mb-2">
                          Shipping Address
                        </h4>
                        <p className="text-sm text-[#1A1A1A]">{order.shippingAddress}</p>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                        Order Status
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as Order["status"])
                        }
                        className="px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Action */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleDeleteOrder(order.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Order
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )
          })
        )}
      </motion.div>
    </div>
  )
}
