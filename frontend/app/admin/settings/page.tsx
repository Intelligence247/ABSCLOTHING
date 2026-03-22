"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Bell, Lock, Palette } from "lucide-react"

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    storeName: "ABS Clothing",
    storeEmail: "admin@absclothing.com",
    storePhone: "08087891756",
    businessAddress: "2 Mogaji Compound, Tanke Iledu, Kwara State",
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
