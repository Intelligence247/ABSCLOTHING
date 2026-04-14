import { apiFetch } from "@/lib/api"

export type FulfillmentStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export type PaymentVerificationStatus = "none" | "pending_review" | "verified" | "rejected"

export type AdminOrderListItem = {
  id: string
  customerName: string
  email: string
  total: number
  status: FulfillmentStatus
  createdAt: string
  shippingAddress: string
  products: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  isPaid: boolean
  paymentMethod: string
  paymentVerificationStatus: PaymentVerificationStatus
  receiptUrl?: string
  paymentRejectionReason?: string
}

type ApiOrderItem = {
  name: string
  qty: number
  price: number
  product?: string | { _id?: string }
  color?: string
  size?: string
}

type ApiOrder = {
  id: string
  customerName: string
  email: string
  orderItems: ApiOrderItem[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  totalPrice: number
  status: FulfillmentStatus
  createdAt: string
  isPaid?: boolean
  paymentMethod?: string
  paymentVerificationStatus?: PaymentVerificationStatus
  receiptUrl?: string
  paymentRejectionReason?: string
}

const productIdFromItem = (item: ApiOrderItem) => {
  const p = item.product
  if (typeof p === "string") return p
  if (p && typeof p === "object" && p._id) return String(p._id)
  return ""
}

const normalizePv = (raw: unknown): PaymentVerificationStatus => {
  const s = String(raw ?? "none")
  if (s === "none" || s === "pending_review" || s === "verified" || s === "rejected") return s
  return "none"
}

export function mapApiOrderToListItem(o: ApiOrder): AdminOrderListItem {
  const addr = o.shippingAddress
  const shippingAddress = addr
    ? [addr.address, addr.city, addr.postalCode, addr.country].filter(Boolean).join(", ")
    : ""

  return {
    id: o.id,
    customerName: o.customerName,
    email: o.email,
    total: o.totalPrice,
    status: o.status,
    createdAt: o.createdAt,
    shippingAddress,
    products: (o.orderItems || []).map((item) => ({
      productId: productIdFromItem(item),
      productName: item.name,
      quantity: item.qty,
      price: item.price,
    })),
    isPaid: Boolean(o.isPaid),
    paymentMethod: o.paymentMethod ?? "",
    paymentVerificationStatus: normalizePv(o.paymentVerificationStatus),
    receiptUrl: o.receiptUrl,
    paymentRejectionReason: o.paymentRejectionReason,
  }
}

export async function fetchAdminOrdersFromApi(): Promise<AdminOrderListItem[]> {
  const rows = await apiFetch<ApiOrder[]>("/api/orders", { auth: true })
  return rows.map(mapApiOrderToListItem)
}

export async function adminUpdateOrderStatusApi(id: string, status: FulfillmentStatus) {
  return apiFetch<ApiOrder>(`/api/orders/${id}/status`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify({ status }),
  })
}

export async function adminDeleteOrderApi(id: string) {
  return apiFetch<{ message: string }>(`/api/orders/${id}`, {
    method: "DELETE",
    auth: true,
  })
}

export async function adminConfirmBankPaymentApi(id: string) {
  return apiFetch<ApiOrder>(`/api/orders/${id}/payment-verify`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify({ action: "confirm" }),
  })
}

export async function adminRejectBankPaymentApi(id: string, reason?: string) {
  return apiFetch<ApiOrder>(`/api/orders/${id}/payment-verify`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify({ action: "reject", reason: reason ?? "" }),
  })
}
