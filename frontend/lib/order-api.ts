import { apiFetch } from "@/lib/api"
import type { CartItem } from "@/lib/cart-context"

export type ShippingAddressPayload = {
  address: string
  city: string
  postalCode: string
  country: string
}

export type CreateOrderPayload = {
  orderItems: Array<{
    product: string
    qty: number
    color?: string
    size?: string
  }>
  shippingAddress: ShippingAddressPayload
  /** Storefront always sends `bank_transfer`. */
  paymentMethod: string
  taxPrice: number
  customerName: string
  email: string
}

/** Minimal shape from `POST /api/orders` response */
export type CreatedOrder = {
  id: string
  totalPrice: number
  shippingPrice: number
  taxPrice: number
  customerName: string
  email: string
  status: string
}

export const LAST_ORDER_STORAGE_KEY = "abs_last_placed_order"

export type GuestOrderSummary = {
  id: string
  totalPrice: number
  shippingPrice: number
  taxPrice: number
  customerName: string
  email: string
  isPaid: boolean
  status: string
  paymentMethod: string
  paymentVerificationStatus: "none" | "pending_review" | "verified" | "rejected"
  receiptUrl?: string
  receiptUploadedAt?: string
  paymentRejectionReason?: string
}

export async function fetchGuestOrderSummary(orderId: string, email: string) {
  const q = new URLSearchParams({ email })
  return apiFetch<GuestOrderSummary>(`/api/orders/${orderId}/guest-summary?${q}`)
}

export async function uploadOrderReceipt(orderId: string, email: string, file: File) {
  const form = new FormData()
  form.append("email", email)
  form.append("receipt", file)
  return apiFetch<Record<string, unknown>>(`/api/orders/${orderId}/receipt`, {
    method: "POST",
    body: form,
  })
}

export function buildOrderItemsFromCart(items: CartItem[]) {
  return items.map((item) => ({
    product: item.product.id,
    qty: item.quantity,
    color: item.color,
    size: item.size,
  }))
}

/** Requires customer JWT (`abs_customer_token`) — checkout enforces sign-in before calling. */
export async function createOrder(payload: CreateOrderPayload) {
  return apiFetch<CreatedOrder>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
    useCustomerToken: true,
  })
}
