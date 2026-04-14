"use client"

import { useState } from "react"
import { useAdminData } from "@/lib/admin-data-context"
import { ApiError } from "@/lib/api"
import {
  adminConfirmBankPaymentApi,
  adminDeleteOrderApi,
  adminRejectBankPaymentApi,
  adminUpdateOrderStatusApi,
  type FulfillmentStatus,
} from "@/lib/admin-orders-api"
import { motion } from "framer-motion"
import { Trash2, ChevronDown, ExternalLink } from "lucide-react"

const paymentVerifyLabel = {
  none: "No receipt yet",
  pending_review: "Receipt uploaded — review",
  verified: "Payment verified",
  rejected: "Receipt rejected",
} as const

export default function OrdersPage() {
  const { orders, ordersLoading, ordersError, refreshOrders } = useAdminData()
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<FulfillmentStatus | "">("")
  const [actionBusyId, setActionBusyId] = useState<string | null>(null)

  const filteredOrders = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders

  const statusColors: Record<FulfillmentStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
    processing: { bg: "bg-blue-100", text: "text-blue-700", label: "Processing" },
    shipped: { bg: "bg-purple-100", text: "text-purple-700", label: "Shipped" },
    delivered: { bg: "bg-green-100", text: "text-green-700", label: "Delivered" },
    cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
  }

  const handleStatusChange = async (orderId: string, newStatus: FulfillmentStatus) => {
    setActionBusyId(orderId)
    try {
      await adminUpdateOrderStatusApi(orderId, newStatus)
      await refreshOrders()
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not update status")
    } finally {
      setActionBusyId(null)
    }
  }

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return
    setActionBusyId(id)
    try {
      await adminDeleteOrderApi(id)
      await refreshOrders()
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not delete order")
    } finally {
      setActionBusyId(null)
    }
  }

  const handleConfirmPayment = async (orderId: string) => {
    if (
      !confirm(
        "Mark this payment as verified? The order will be marked paid and moved to Processing if it was still Pending."
      )
    ) {
      return
    }
    setActionBusyId(orderId)
    try {
      await adminConfirmBankPaymentApi(orderId)
      await refreshOrders()
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not confirm payment")
    } finally {
      setActionBusyId(null)
    }
  }

  const handleRejectPayment = async (orderId: string) => {
    const reason = window.prompt(
      "Optional note for the customer (they will see this on their order page). Leave blank for none."
    )
    if (reason === null) return
    setActionBusyId(orderId)
    try {
      await adminRejectBankPaymentApi(orderId, reason)
      await refreshOrders()
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not reject payment")
    } finally {
      setActionBusyId(null)
    }
  }

  if (ordersLoading && orders.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <p className="text-[#666666]">Loading orders…</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-2">Orders</h1>
        <p className="text-[#666666]">
          Bank transfer orders: review uploaded receipts, then confirm or reject payment.
        </p>
        <button
          type="button"
          onClick={() => void refreshOrders()}
          className="mt-4 text-sm font-semibold text-[#0A3D2E] underline"
        >
          Refresh
        </button>
      </motion.div>

      {ordersError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {ordersError}
          <button
            type="button"
            onClick={() => void refreshOrders()}
            className="ml-3 font-semibold text-[#0A3D2E] underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#E8E6E3] p-6 mb-8">
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Filter by fulfillment status</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FulfillmentStatus | "")}
          className="px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
        >
          <option value="">All orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E8E6E3] p-12 text-center">
            <p className="text-[#666666] text-lg">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id
            const statusColor = statusColors[order.status]
            const busy = actionBusyId === order.id
            const pv = order.paymentVerificationStatus

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg border border-[#E8E6E3] overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-[#F9F8F6] transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                      <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}
                      >
                        {statusColor.label}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.isPaid ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E6E3] text-[#333333]">
                        {paymentVerifyLabel[pv]}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-[#666666]">
                      <div>
                        <p className="text-xs text-[#999999]">Customer</p>
                        <p className="font-medium text-[#1A1A1A]">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#999999]">Total</p>
                        <p className="font-semibold text-[#1A1A1A]">₦{order.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#999999]">Date</p>
                        <p className="font-medium text-[#1A1A1A]">
                          {order.createdAt ? order.createdAt.toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-6 h-6 text-[#666666]" />
                  </motion.div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-[#E8E6E3] p-6 bg-[#F9F8F6]"
                  >
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#1A1A1A] mb-4">Items</h4>
                      <div className="space-y-3">
                        {order.products.map((product, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-[#E8E6E3]">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-[#1A1A1A]">{product.productName}</p>
                                <p className="text-sm text-[#666666]">Qty: {product.quantity}</p>
                              </div>
                              <p className="font-semibold text-[#1A1A1A]">
                                ₦{(product.price * product.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-[#1A1A1A] mb-2">Customer</h4>
                        <p className="text-sm text-[#1A1A1A]">{order.customerName}</p>
                        <p className="text-sm text-[#666666]">{order.email}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1A1A1A] mb-2">Shipping</h4>
                        <p className="text-sm text-[#1A1A1A]">{order.shippingAddress || "—"}</p>
                      </div>
                    </div>

                    <div className="mb-6 rounded-lg border border-[#E8E6E3] bg-white p-4 space-y-2 text-sm">
                      <h4 className="font-semibold text-[#1A1A1A]">Bank transfer</h4>
                      <p className="text-[#666666]">
                        Method: <span className="text-[#1A1A1A]">{order.paymentMethod || "—"}</span>
                      </p>
                      <p className="text-[#666666]">
                        Verification:{" "}
                        <span className="font-medium text-[#1A1A1A]">{paymentVerifyLabel[pv]}</span>
                      </p>
                      {order.receiptUrl ? (
                        <a
                          href={order.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#0A3D2E] font-semibold underline"
                        >
                          Open receipt <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <p className="text-xs text-[#999999]">No receipt file yet.</p>
                      )}
                      {pv === "rejected" && order.paymentRejectionReason ? (
                        <p className="text-xs text-red-700 border-t border-[#E8E6E3] pt-2 mt-2">
                          Customer note: {order.paymentRejectionReason}
                        </p>
                      ) : null}

                      {order.paymentMethod === "bank_transfer" &&
                        !order.isPaid &&
                        pv === "pending_review" &&
                        order.receiptUrl && (
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-[#E8E6E3] mt-3">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleConfirmPayment(order.id)}
                              className="px-4 py-2 bg-[#0A3D2E] text-white text-xs font-semibold rounded-lg hover:bg-[#082F23] disabled:opacity-50"
                            >
                              Confirm payment
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleRejectPayment(order.id)}
                              className="px-4 py-2 border border-red-300 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-50 disabled:opacity-50"
                            >
                              Reject receipt
                            </button>
                          </div>
                        )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                        Fulfillment status
                      </label>
                      <select
                        value={order.status}
                        disabled={busy}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as FulfillmentStatus)}
                        className="px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20 disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      disabled={busy}
                      onClick={() => handleDeleteOrder(order.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete order
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
