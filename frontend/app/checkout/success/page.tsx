"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { ApiError } from "@/lib/api"
import {
  fetchGuestOrderSummary,
  LAST_ORDER_STORAGE_KEY,
  uploadOrderReceipt,
  type GuestOrderSummary,
} from "@/lib/order-api"
import { fetchStorePaymentInfo, type StorePaymentInfo } from "@/lib/store-api"

type StoredSummary = {
  id: string
  totalPrice: number
  shippingPrice: number
  taxPrice: number
  customerName: string
  email: string
}

const paymentStatusLabel = (s: GuestOrderSummary["paymentVerificationStatus"], isPaid: boolean) => {
  if (isPaid) return "Payment confirmed"
  if (s === "pending_review") return "Receipt received — awaiting verification"
  if (s === "rejected") return "Receipt needs attention"
  return "Waiting for your transfer receipt"
}

export default function CheckoutSuccessPage() {
  const [summary, setSummary] = useState<StoredSummary | null>(null)
  const [live, setLive] = useState<GuestOrderSummary | null>(null)
  const [bankInfo, setBankInfo] = useState<StorePaymentInfo | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [uploadOk, setUploadOk] = useState(false)

  const refreshLive = useCallback(async (id: string, email: string) => {
    try {
      const row = await fetchGuestOrderSummary(id, email)
      setLive(row)
    } catch {
      setLive(null)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = sessionStorage.getItem(LAST_ORDER_STORAGE_KEY)
    if (!raw) {
      setSummary(null)
      return
    }
    try {
      const parsed = JSON.parse(raw) as StoredSummary
      setSummary(parsed)
      refreshLive(parsed.id, parsed.email)
    } catch {
      setSummary(null)
    }
  }, [refreshLive])

  useEffect(() => {
    fetchStorePaymentInfo()
      .then(setBankInfo)
      .catch(() => setBankInfo(null))
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError("")
    setUploadOk(false)
    if (!summary || !file) {
      setUploadError("Choose a file (image or PDF) first.")
      return
    }
    setUploading(true)
    try {
      await uploadOrderReceipt(summary.id, summary.email, file)
      setUploadOk(true)
      setFile(null)
      await refreshLive(summary.id, summary.email)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Upload failed"
      setUploadError(message)
    } finally {
      setUploading(false)
    }
  }

  const display = live && summary && live.id === summary.id ? live : null

  const canUploadReceipt =
    summary &&
    !display?.isPaid &&
    (display == null || display.paymentVerificationStatus !== "pending_review")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 text-center"
        >
          <div>
            <h1 className="text-4xl font-serif font-bold">Order placed</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Transfer the total below, then upload your receipt. We will verify payment before dispatch.
            </p>
          </div>

          {summary ? (
            <>
              <div className="rounded-lg border border-border bg-muted/50 p-6 text-left space-y-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Order ID</span>
                  <br />
                  <span className="font-mono text-base break-all">{summary.id}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Email</span>
                  <br />
                  <span className="font-medium text-foreground">{summary.email}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Customer</span>
                  <br />
                  {summary.customerName}
                </p>
                <p className="text-lg font-semibold pt-2 border-t border-border">
                  Amount to pay{" "}
                  <span className="text-accent">{formatPrice(summary.totalPrice)}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Shipping {formatPrice(summary.shippingPrice)} · Tax {formatPrice(summary.taxPrice)}
                </p>
              </div>

              {display && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm text-left ${
                    display.isPaid
                      ? "border-green-200 bg-green-50 text-green-900"
                      : display.paymentVerificationStatus === "pending_review"
                        ? "border-blue-200 bg-blue-50 text-blue-900"
                        : display.paymentVerificationStatus === "rejected"
                          ? "border-red-200 bg-red-50 text-red-900"
                          : "border-border bg-background"
                  }`}
                >
                  <p className="font-semibold">
                    {paymentStatusLabel(display.paymentVerificationStatus, display.isPaid)}
                  </p>
                  {display.paymentVerificationStatus === "rejected" && display.paymentRejectionReason ? (
                    <p className="mt-1 text-xs">{display.paymentRejectionReason}</p>
                  ) : null}
                  {display.receiptUrl && !display.isPaid ? (
                    <a
                      href={display.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs underline"
                    >
                      View uploaded receipt
                    </a>
                  ) : null}
                </div>
              )}

              {bankInfo &&
                (bankInfo.bankName || bankInfo.accountNumber || bankInfo.accountName) && (
                  <div className="rounded-lg border border-border p-6 text-left space-y-2 text-sm">
                    <p className="font-semibold">Pay into</p>
                    {bankInfo.bankName ? <p>Bank: {bankInfo.bankName}</p> : null}
                    {bankInfo.accountName ? <p>Name: {bankInfo.accountName}</p> : null}
                    {bankInfo.accountNumber ? (
                      <p className="font-mono text-base">Account: {bankInfo.accountNumber}</p>
                    ) : null}
                    {bankInfo.referenceHint ? (
                      <p className="text-xs text-muted-foreground pt-2">{bankInfo.referenceHint}</p>
                    ) : null}
                  </div>
                )}

              {canUploadReceipt && (
                <form onSubmit={handleUpload} className="space-y-4 text-left">
                  <h2 className="text-lg font-serif font-semibold text-center">Upload payment receipt</h2>
                  <p className="text-xs text-muted-foreground text-center">
                    PNG, JPG, WebP, or PDF — max 8MB. Use the same email you used at checkout.
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
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Order details are not available in this session. If you placed an order, use the link from your
              confirmation email or contact the store with your order ID.
            </p>
          )}

          <Link
            href="/shop"
            className="inline-block bg-primary text-primary-foreground px-10 py-3 font-semibold tracking-widest uppercase hover:bg-primary/90"
          >
            Continue shopping
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
