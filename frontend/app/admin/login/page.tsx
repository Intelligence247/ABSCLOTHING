"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAdmin } from "@/lib/admin-context"
import { Mail, Lock, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading } = useAdmin()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/admin/dashboard")
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#05120F] via-[#0A3D2E] to-[#05120F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/admin/dashboard")
      } else {
        setError("Invalid admin credentials, or this account is not an administrator.")
      }
    } catch {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05120F] via-[#0A3D2E] to-[#05120F] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block"
            >
              <div className="w-14 h-14 bg-[#0A3D2E] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-serif text-2xl font-bold">A</span>
              </div>
            </motion.div>
            <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-2">
              ABS Admin
            </h1>
            <p className="text-[#666666] text-sm">
              Access the admin dashboard
            </p>
          </div>

          {/* Demo Credentials Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6"
          >
            <p className="text-xs text-blue-800 mb-1 font-semibold">Sign in with your API admin user</p>
            <p className="text-xs text-blue-700">
              After <span className="font-mono">npm run seed</span>, default is{" "}
              <span className="font-mono">admin@absclothing.local</span> / <span className="font-mono">Admin123!</span>
              (override with <span className="font-mono">SEED_ADMIN_*</span> in backend <span className="font-mono">.env</span>).
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A3D2E]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@absclothing.local"
                  className="w-full pl-10 pr-4 py-3 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A3D2E]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0A3D2E] text-white py-3 rounded-lg font-semibold hover:bg-[#082F23] disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <p className="text-sm text-center text-[#666666] mt-6">
            Need an account?{" "}
            <Link href="/admin/register" className="text-[#0A3D2E] font-semibold hover:underline">
              Register with server secret
            </Link>
          </p>

          <p className="text-xs text-[#666666] text-center mt-4">
            Sign in uses <span className="font-mono">POST /api/users/login</span> with an{" "}
            <span className="font-mono">isAdmin</span> user.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
