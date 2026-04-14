"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Save, Bell, Lock, Palette, Landmark } from "lucide-react"
import { API_BASE_URL, ApiError, getAuthToken } from "@/lib/api"
import { useAdmin } from "@/lib/admin-context"
import {
  fetchAdminPaymentSettings,
  updateAdminPaymentSettings,
} from "@/lib/admin-store-api"
import type { StorePaymentInfo } from "@/lib/store-api"

export default function SettingsPage() {
  const { isAuthenticated, isLoading: adminBootstrapping } = useAdmin()

  const [formData, setFormData] = useState({
    storeName: "ABS Clothing",
    storeEmail: "admin@absclothing.com",
    storePhone: "08087891756",
    businessAddress: "Tanke ilorin Kwara state",
    currency: "NGN",
    taxRate: "0",
    shippingCost: "1000",
    freeShippingThreshold: "100000",
  })

  const [notifications, setNotifications] = useState({
    orderEmails: true,
    lowStockAlerts: true,
    customerEmails: true,
    systemUpdates: false,
  })

  const [saved, setSaved] = useState(false)

  const [bankForm, setBankForm] = useState<StorePaymentInfo>({
    bankName: "",
    accountName: "",
    accountNumber: "",
    referenceHint: "",
  })
  const [effectiveBank, setEffectiveBank] = useState<StorePaymentInfo | null>(null)
  const [adminPassword, setAdminPassword] = useState("")
  const [bankLoading, setBankLoading] = useState(true)
  const [bankSaving, setBankSaving] = useState(false)
  const [bankError, setBankError] = useState("")
  const [bankSaved, setBankSaved] = useState(false)

  useEffect(() => {
    if (adminBootstrapping) return

    if (!isAuthenticated) {
      setBankLoading(false)
      setBankError("You must be signed in as an admin to load bank settings.")
      return
    }

    if (typeof window !== "undefined" && !getAuthToken()) {
      setBankLoading(false)
      setBankError(
        "No JWT in this browser (key abs_admin_token). Sign out and sign in again at /admin/login."
      )
      return
    }

    let cancelled = false
    setBankLoading(true)
    setBankError("")

    fetchAdminPaymentSettings()
      .then((data) => {
        if (cancelled) return
        setBankForm({ ...data.stored })
        setEffectiveBank(data.effective)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError) {
          const hint =
            err.status === 401
              ? " Try signing out and back in. If you changed JWT_SECRET in .env, old tokens are invalid."
              : err.status === 404
                ? ` No route at ${API_BASE_URL}/api/store/admin/payment-settings — restart the backend from the latest code.`
                : ""
          setBankError(`${err.message} (HTTP ${err.status})${hint}`)
        } else if (err instanceof TypeError) {
          setBankError(
            `Network error reaching ${API_BASE_URL}. Check NEXT_PUBLIC_API_URL in frontend/.env and that the API is running.`
          )
        } else {
          setBankError(err instanceof Error ? err.message : "Could not load bank settings.")
        }
      })
      .finally(() => {
        if (!cancelled) setBankLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, adminBootstrapping])

  const handleBankFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBankForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBankSave = async () => {
    setBankError("")
    setBankSaved(false)
    if (!adminPassword.trim()) {
      setBankError("Enter your current admin password to save bank details.")
      return
    }
    setBankSaving(true)
    try {
      const res = await updateAdminPaymentSettings({
        password: adminPassword,
        bankName: bankForm.bankName,
        accountName: bankForm.accountName,
        accountNumber: bankForm.accountNumber,
        referenceHint: bankForm.referenceHint,
      })
      setBankForm({ ...res.stored })
      setEffectiveBank(res.effective)
      setAdminPassword("")
      setBankSaved(true)
      setTimeout(() => setBankSaved(false), 4000)
    } catch (err) {
      setBankError(err instanceof ApiError ? err.message : "Could not save bank settings.")
    } finally {
      setBankSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-2">
          Settings
        </h1>
        <p className="text-[#666666]">Manage your store configuration</p>
      </motion.div>

      {/* Success Message */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm font-semibold"
        >
          Settings saved successfully!
        </motion.div>
      )}

      {/* Bank transfer — own section (not inside mock store form) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-[#E8E6E3] p-8 mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Landmark className="w-6 h-6 text-[#0A3D2E]" />
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Bank transfer (checkout)</h2>
        </div>
        <p className="text-sm text-[#666666] mb-6">
          Shown on the storefront checkout and order success page. Leave a field empty to fall back to the same
          variable in <span className="font-mono text-xs">backend/.env</span> (e.g.{" "}
          <span className="font-mono text-xs">BANK_ACCOUNT_NUMBER</span>).
        </p>

        {bankLoading ? (
          <p className="text-sm text-[#666666]">Loading bank settings…</p>
        ) : (
          <div className="space-y-6">
            {bankSaved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 font-medium">
                Bank details saved.
              </div>
            )}
            {bankError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">{bankError}</div>
            )}

            {effectiveBank && (
              <div className="rounded-lg border border-[#E8E6E3] bg-[#F9F8F6] p-4 text-sm">
                <p className="font-semibold text-[#1A1A1A] mb-2">Customer preview (merged)</p>
                <p className="text-[#666666]">
                  Bank: <span className="text-[#1A1A1A]">{effectiveBank.bankName || "—"}</span>
                </p>
                <p className="text-[#666666]">
                  Name: <span className="text-[#1A1A1A]">{effectiveBank.accountName || "—"}</span>
                </p>
                <p className="text-[#666666]">
                  Account:{" "}
                  <span className="font-mono text-[#1A1A1A]">{effectiveBank.accountNumber || "—"}</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Bank name</label>
                <input
                  type="text"
                  name="bankName"
                  value={bankForm.bankName}
                  onChange={handleBankFieldChange}
                  className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Account name</label>
                <input
                  type="text"
                  name="accountName"
                  value={bankForm.accountName}
                  onChange={handleBankFieldChange}
                  className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                  autoComplete="off"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Account number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankForm.accountNumber}
                  onChange={handleBankFieldChange}
                  className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg font-mono focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                  autoComplete="off"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Payment reference hint (optional)
                </label>
                <textarea
                  name="referenceHint"
                  value={bankForm.referenceHint}
                  onChange={handleBankFieldChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20 text-sm"
                  placeholder="Shown to customers under bank details"
                />
              </div>
            </div>

            <div className="border-t border-[#E8E6E3] pt-6">
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0A3D2E]" />
                Current admin password
              </label>
              <p className="text-xs text-[#666666] mb-2">
                Required every time you save these bank fields (not stored).
              </p>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                autoComplete="current-password"
                placeholder="Your login password"
              />
            </div>

            <button
              type="button"
              disabled={bankSaving}
              onClick={handleBankSave}
              className="inline-flex items-center gap-2 bg-[#0A3D2E] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#082F23] disabled:opacity-50"
            >
              {bankSaving ? "Saving…" : "Save bank details"}
            </button>
          </div>
        )}
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-[#0A3D2E]" />
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">
              Store Information
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Store Email
                </label>
                <input
                  type="email"
                  name="storeEmail"
                  value={formData.storeEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Store Phone
                </label>
                <input
                  type="tel"
                  name="storePhone"
                  value={formData.storePhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                >
                  <option value="NGN">Nigerian Naira (NGN)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Business Address
              </label>
              <input
                type="text"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
              />
            </div>
          </div>
        </motion.div>

        {/* Pricing Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-8"
        >
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-6">
            Pricing & Shipping
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Standard Shipping Cost (NGN)
              </label>
              <input
                type="number"
                name="shippingCost"
                value={formData.shippingCost}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Free Shipping Threshold (NGN)
              </label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={formData.freeShippingThreshold}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
              />
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-[#0A3D2E]" />
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="orderEmails"
                checked={notifications.orderEmails}
                onChange={handleNotificationChange}
                className="w-5 h-5 cursor-pointer"
              />
              <div>
                <p className="font-medium text-[#1A1A1A]">Order Notifications</p>
                <p className="text-xs text-[#666666]">
                  Get notified when new orders are placed
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="lowStockAlerts"
                checked={notifications.lowStockAlerts}
                onChange={handleNotificationChange}
                className="w-5 h-5 cursor-pointer"
              />
              <div>
                <p className="font-medium text-[#1A1A1A]">Low Stock Alerts</p>
                <p className="text-xs text-[#666666]">
                  Receive alerts when products are running low
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="customerEmails"
                checked={notifications.customerEmails}
                onChange={handleNotificationChange}
                className="w-5 h-5 cursor-pointer"
              />
              <div>
                <p className="font-medium text-[#1A1A1A]">Customer Messages</p>
                <p className="text-xs text-[#666666]">
                  Get notified of customer inquiries
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="systemUpdates"
                checked={notifications.systemUpdates}
                onChange={handleNotificationChange}
                className="w-5 h-5 cursor-pointer"
              />
              <div>
                <p className="font-medium text-[#1A1A1A]">System Updates</p>
                <p className="text-xs text-[#666666]">
                  Receive system updates and announcements
                </p>
              </div>
            </label>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-[#0A3D2E] text-white py-3 rounded-lg font-semibold hover:bg-[#082F23] transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </motion.button>
      </form>
    </div>
  )
}
