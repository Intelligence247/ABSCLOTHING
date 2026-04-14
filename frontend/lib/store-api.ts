import { apiFetch } from "@/lib/api"

export type StorePaymentInfo = {
  bankName: string
  accountName: string
  accountNumber: string
  referenceHint: string
}

export function fetchStorePaymentInfo() {
  return apiFetch<StorePaymentInfo>("/api/store/payment-info")
}
