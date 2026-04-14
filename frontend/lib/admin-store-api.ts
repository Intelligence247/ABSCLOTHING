import { apiFetch } from "@/lib/api"
import type { StorePaymentInfo } from "@/lib/store-api"

export type AdminPaymentSettingsResponse = {
  stored: StorePaymentInfo
  effective: StorePaymentInfo
}

export function fetchAdminPaymentSettings() {
  return apiFetch<AdminPaymentSettingsResponse>("/api/store/admin/payment-settings", {
    auth: true,
  })
}

export type UpdateAdminPaymentPayload = {
  password: string
  bankName: string
  accountName: string
  accountNumber: string
  referenceHint: string
}

export function updateAdminPaymentSettings(payload: UpdateAdminPaymentPayload) {
  return apiFetch<{ message: string; stored: StorePaymentInfo; effective: StorePaymentInfo }>(
    "/api/store/admin/payment-settings",
    {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }
  )
}
