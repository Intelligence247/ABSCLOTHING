"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { useCart } from "@/lib/cart-context"
import { useCustomerAuth } from "@/lib/customer-auth-context"
import { API_BASE_URL, ApiError } from "@/lib/api"
import {
  buildOrderItemsFromCart,
  createOrder,
  fetchGuestOrderSummary,
  LAST_ORDER_STORAGE_KEY,
  uploadOrderReceipt,
  type GuestOrderSummary,
} from "@/lib/order-api"
import { getShippingCostNgn } from "@/lib/pricing"
import { fetchStorePaymentInfo, type StorePaymentInfo } from "@/lib/store-api"

type PlacedOrder = {
  id: string
  totalPrice: number
  shippingPrice: number
  taxPrice: number
  customerName: string
  email: string
}

const paymentStatusLabel = (
  s: GuestOrderSummary["paymentVerificationStatus"],
  isPaid: boolean
) => {
  if (isPaid) return "Payment confirmed"
  if (s === "pending_review") return "Receipt received — awaiting verification"
  if (s === "rejected") return "Receipt needs attention"
  return "Waiting for your transfer receipt"
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, logout: logoutCustomer } = useCustomerAuth()
  const { items, subtotal, clearCart, isHydrated } = useCart()

  const [phase, setPhase] = useState<"details" | "pay">("details")
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null)

  const [customerName, setCustomerName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("Nigeria")
  const [taxPrice, setTaxPrice] = useState("0")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [bankInfo, setBankInfo] = useState<StorePaymentInfo | null>(null)
  const [bankInfoError, setBankInfoError] = useState("")

  const [live, setLive] = useState<GuestOrderSummary | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [uploadOk, setUploadOk] = useState(false)

  const refreshLive = useCallback(async (id: string, em: string) => {
    try {
      const row = await fetchGuestOrderSummary(id, em)
      setLive(row)
    } catch {
      setLive(null)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace(`/account/login?returnTo=${encodeURIComponent("/checkout")}`)
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user || phase !== "details") return
    setEmail(user.email)
    setCustomerName((n) => (n.trim() ? n : user.name))
  }, [user, phase])

  useEffect(() => {
    if (!isHydrated) return

    if (items.length > 0) {
      sessionStorage.removeItem(LAST_ORDER_STORAGE_KEY)
      if (phase === "pay") {
        setPhase("details")
        setPlacedOrder(null)
      }
      return
    }

    const raw = sessionStorage.getItem(LAST_ORDER_STORAGE_KEY)
    if (!raw) {
      router.replace("/cart")
      return
    }
    try {
      const parsed = JSON.parse(raw) as PlacedOrder
      if (parsed?.id && parsed?.email) {
        setPlacedOrder(parsed)
        setPhase("pay")
      } else {
        router.replace("/cart")
      }
    } catch {
      router.replace("/cart")
    }
  }, [isHydrated, items.length, phase, router])

  useEffect(() => {
    let cancelled = false
    fetchStorePaymentInfo()
      .then((info) => {
        if (!cancelled) setBankInfo(info)
      })
      .catch(() => {
        if (!cancelled) {
          setBankInfoError(
            `Could not load bank details from the API (${API_BASE_URL}/api/store/payment-info). ` +
              "Restart the backend and check NEXT_PUBLIC_API_URL."
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (phase !== "pay" || !placedOrder) return
    refreshLive(placedOrder.id, placedOrder.email)
  }, [phase, placedOrder, refreshLive])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)

  const estimatedShipping = getShippingCostNgn(subtotal)
  const taxNum = Math.max(0, Number(taxPrice) || 0)
  const estimatedTotal = subtotal + estimatedShipping + taxNum

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (items.length === 0) return

    setSubmitting(true)
    try {
      const order = await createOrder({
        orderItems: buildOrderItemsFromCart(items),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod: "bank_transfer",
        taxPrice: taxNum,
        customerName,
        email,
      })

      const summary: PlacedOrder = {
        id: order.id,
        totalPrice: order.totalPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        customerName: order.customerName,
        email: order.email,
      }
      sessionStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(summary))
      setPlacedOrder(summary)
      clearCart()
      setPhase("pay")
      setLive(null)
      setFile(null)
      setUploadOk(false)
      setUploadError("")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Checkout failed"
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReceiptUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError("")
    setUploadOk(false)
    if (!placedOrder || !file) {
      setUploadError("Choose a file (image or PDF) first.")
      return
    }
    setUploading(true)
    try {
      await uploadOrderReceipt(placedOrder.id, placedOrder.email, file)
      setUploadOk(true)
      setFile(null)
      await refreshLive(placedOrder.id, placedOrder.email)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Upload failed"
      setUploadError(message)
    } finally {
      setUploading(false)
    }
  }

  const display = live && placedOrder && live.id === placedOrder.id ? live : null
  const canUploadReceipt =
    placedOrder &&
    !display?.isPaid &&
    (display == null || display.paymentVerificationStatus !== "pending_review")

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-background">
        {authLoading ? "Checking your account…" : "Redirecting to sign in…"}
      </div>
    )
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-background">
        Loading…
      </div>
    )
  }

  if (phase === "pay" && placedOrder) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <Navbar />

        <section className="relative h-[34vh] min-h-[250px] bg-[#05120F] flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="checkout-pay-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#checkout-pay-grid)" />
            </svg>
          </div>
          <div className="container mx-auto px-4">
            <p className="text-primary-foreground/90 text-xs font-semibold tracking-widest uppercase mb-2">
              Step 2 of 2
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-serif font-bold text-primary-foreground"
            >
              Pay & upload receipt
            </motion.h1>
            <p className="text-primary-foreground/80 mt-2 text-sm max-w-2xl">
              Transfer the amount below, then upload proof of payment. We verify receipts before shipping.
            </p>
          </div>
          <div className="absolute inset-0 stroke-text text-8xl md:text-9xl font-serif font-bold opacity-10 pointer-events-none flex items-center justify-center">
            CHECKOUT
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-xl space-y-8">
          <div className="rounded-lg border border-border bg-muted/50 p-6 text-left space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Order ID</span>
              <br />
              <span className="font-mono text-base break-all">{placedOrder.id}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Amount to pay</span>
              <br />
              <span className="text-xl font-semibold text-accent">{formatPrice(placedOrder.totalPrice)}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Shipping {formatPrice(placedOrder.shippingPrice)} · Tax {formatPrice(placedOrder.taxPrice)}
            </p>
          </div>

          {display && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                display.isPaid
                  ? "border-green-200 bg-green-50 text-green-900"
                  : display.paymentVerificationStatus === "pending_review"
                    ? "border-blue-200 bg-blue-50 text-blue-900"
                    : display.paymentVerificationStatus === "rejected"
                      ? "border-red-200 bg-red-50 text-red-900"
                      : "border-border bg-card"
              }`}
            >
              <p className="font-semibold">
                {paymentStatusLabel(display.paymentVerificationStatus, display.isPaid)}
              </p>
              {display.paymentVerificationStatus === "rejected" && display.paymentRejectionReason ? (
                <p className="mt-1 text-xs">{display.paymentRejectionReason}</p>
              ) : null}
            </div>
          )}

          {bankInfoError && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {bankInfoError}
            </div>
          )}
          {bankInfo &&
            (bankInfo.bankName || bankInfo.accountNumber || bankInfo.accountName) && (
              <div className="rounded-lg border border-border p-6 space-y-2 text-sm">
                <p className="font-semibold">Transfer to</p>
                {bankInfo.bankName ? <p>Bank: {bankInfo.bankName}</p> : null}
                {bankInfo.accountName ? <p>Account name: {bankInfo.accountName}</p> : null}
                {bankInfo.accountNumber ? (
                  <p className="font-mono text-lg">Account number: {bankInfo.accountNumber}</p>
                ) : null}
                {bankInfo.referenceHint ? (
                  <p className="text-xs text-muted-foreground pt-2 border-t">{bankInfo.referenceHint}</p>
                ) : null}
              </div>
            )}

          {canUploadReceipt && (
            <form onSubmit={handleReceiptUpload} className="space-y-4 rounded-lg border border-border p-6 bg-card">
              <h2 className="text-lg font-serif font-semibold">Upload payment receipt</h2>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP, or PDF (max 8MB). Use the same email as on your order:{" "}
                <span className="font-medium text-foreground">{placedOrder.email}</span>
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm"
              />
              {uploadError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {uploadError}
                </div>
              )}
              {uploadOk && (
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                  Receipt uploaded. We will review it shortly.
                </div>
              )}
              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full bg-primary text-primary-foreground py-3 font-semibold tracking-wide uppercase disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Submit receipt"}
              </button>
            </form>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="inline-flex justify-center items-center bg-primary text-primary-foreground px-8 py-3 font-semibold tracking-widest uppercase text-center"
            >
              Continue shopping
            </Link>
            <Link
              href="/cart"
              className="inline-flex justify-center items-center border border-border px-8 py-3 font-semibold text-sm uppercase text-center hover:border-primary"
            >
              Back to cart
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-background">
        Redirecting…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      <section className="relative h-[36vh] min-h-[260px] bg-[#05120F] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="checkout-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#checkout-grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4">
          <p className="text-primary-foreground/90 text-xs font-semibold tracking-widest uppercase mb-2">
            Step 1 of 2 · Signed in as {user.email}
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground"
          >
            Checkout
          </motion.h1>
          <p className="text-primary-foreground/80 mt-2 text-sm max-w-2xl">
            Next step after you place the order: bank details and receipt upload on this same checkout flow.
          </p>
        </div>
        <div className="absolute inset-0 stroke-text text-8xl md:text-9xl font-serif font-bold opacity-10 pointer-events-none flex items-center justify-center">
          CHECKOUT
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handlePlaceOrder}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl font-serif font-semibold">Shipping & contact</h2>
              <button
                type="button"
                onClick={() => {
                  logoutCustomer()
                  router.push("/account/login?returnTo=/checkout")
                }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Use a different account
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Full name</label>
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 bg-background"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 bg-background"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Street address</label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal code</label>
                <input
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 bg-background"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 bg-background"
                />
              </div>
            </div>

            <h2 className="text-2xl font-serif font-semibold pt-4">Payment</h2>
            <p className="text-sm text-muted-foreground">
              Bank transfer only. After you place the order, this page will show where to pay and a field to upload
              your receipt screenshot or PDF.
            </p>
            {bankInfoError && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {bankInfoError}
              </div>
            )}
            {bankInfo &&
              (bankInfo.bankName || bankInfo.accountNumber || bankInfo.accountName) && (
                <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2 text-sm">
                  <p className="font-semibold text-foreground">You will pay into (also shown in step 2)</p>
                  {bankInfo.bankName ? (
                    <p>
                      <span className="text-muted-foreground">Bank</span>
                      <br />
                      {bankInfo.bankName}
                    </p>
                  ) : null}
                  {bankInfo.accountName ? (
                    <p>
                      <span className="text-muted-foreground">Account name</span>
                      <br />
                      {bankInfo.accountName}
                    </p>
                  ) : null}
                  {bankInfo.accountNumber ? (
                    <p>
                      <span className="text-muted-foreground">Account number</span>
                      <br />
                      <span className="font-mono text-base tracking-wide">{bankInfo.accountNumber}</span>
                    </p>
                  ) : null}
                </div>
              )}
            <div>
              <label className="block text-sm font-medium mb-1">Tax (₦, optional)</label>
              <input
                type="number"
                min={0}
                step={1}
                value={taxPrice}
                onChange={(e) => setTaxPrice(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 bg-background max-w-xs"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-primary-foreground px-8 py-3 font-semibold tracking-wide uppercase disabled:opacity-50"
              >
                {submitting ? "Placing order…" : "Place order & continue to payment"}
              </button>
              <Link
                href="/cart"
                className="inline-flex items-center px-6 py-3 border border-border font-semibold text-sm uppercase hover:border-primary"
              >
                Back to cart
              </Link>
            </div>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-muted p-6 h-fit space-y-4 lg:sticky lg:top-24"
          >
            <h2 className="text-xl font-serif font-semibold">Summary</h2>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""} — server recalculates from live prices.
            </p>
            <div className="space-y-2 text-sm border-b border-border pb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal (estimate)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping (estimate)</span>
                <span>
                  {estimatedShipping === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    formatPrice(estimatedShipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(taxNum)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total (estimate)</span>
              <span className="text-accent">{formatPrice(estimatedTotal)}</span>
            </div>
          </motion.aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}
