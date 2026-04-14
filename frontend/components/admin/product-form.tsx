"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { X, Plus, Upload, ImageIcon } from "lucide-react"
import type { Product } from "@/lib/products"
import { uploadAdminProductImage } from "@/lib/upload-api"

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => void
  initialData?: Product
  isLoading?: boolean
}

export function ProductForm({ onSubmit, initialData, isLoading = false }: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState("")
  const [imageFieldError, setImageFieldError] = useState("")

  const [formData, setFormData] = useState<Omit<Product, "id">>(
    initialData || {
      name: "",
      price: 0,
      originalPrice: undefined,
      discount: undefined,
      colors: [{ name: "", hex: "#000000" }],
      sizes: ["S", "M", "L", "XL"],
      image: "",
      category: "",
      collection: "",
      description: "",
      isNew: false,
      isBestSeller: false,
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleColorChange = (index: number, field: "name" | "hex", value: string) => {
    const newColors = [...formData.colors]
    newColors[index] = { ...newColors[index], [field]: value }
    setFormData((prev) => ({ ...prev, colors: newColors }))
  }

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", hex: "#000000" }],
    }))
  }

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }))
  }

  const handleSizeChange = (sizes: string[]) => {
    setFormData((prev) => ({ ...prev, sizes }))
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setUploadError("")
    setImageFieldError("")
    setUploading(true)
    setUploadProgress(0)
    try {
      const { image } = await uploadAdminProductImage(file, (p) => setUploadProgress(p))
      setFormData((prev) => ({ ...prev, image }))
      setUploadProgress(100)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
      setUploadProgress(null)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(null), 400)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image.trim()) {
      setImageFieldError("Upload an image or paste an image URL below.")
      return
    }
    setImageFieldError("")
    onSubmit(formData)
  }

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "3XL"]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-[#E8E6E3] p-6">
        <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
            >
              <option value="">Select a category</option>
              <option value="Agbada">Agbada</option>
              <option value="Suits">Suits</option>
              <option value="Casual Wear">Casual Wear</option>
              <option value="Accessories">Accessories</option>
              <option value="Formal">Formal</option>
            </select>
          </div>

          {/* Collection */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Collection *
            </label>
            <select
              name="collection"
              value={formData.collection}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
            >
              <option value="">Select a collection</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Product image: Cloudinary upload or URL */}
        <div className="mt-6 rounded-lg border border-[#E8E6E3] bg-[#F9F8F6] p-6">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
            Product image <span className="text-red-600">*</span>
          </label>
          <p className="text-xs text-[#666666] mb-4">
            Upload a file (JPEG, PNG, WebP — max 5 MB) to your Cloudinary folder, or paste a URL.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            disabled={uploading || isLoading}
            onChange={handleFileSelected}
          />

          <div className="flex flex-wrap items-start gap-4 mb-4">
            <div className="w-24 h-24 rounded-lg border border-[#E8E6E3] bg-white overflow-hidden flex items-center justify-center shrink-0">
              {formData.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-[#CCCCCC]" />
              )}
            </div>
            <div className="flex-1 min-w-[200px] space-y-3">
              <button
                type="button"
                disabled={uploading || isLoading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A3D2E] text-white text-sm font-semibold rounded-lg hover:bg-[#082F23] disabled:opacity-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading…" : "Upload image"}
              </button>
              {uploadProgress != null && (
                <div className="h-2 rounded-full bg-[#E8E6E3] overflow-hidden max-w-md">
                  <div
                    className="h-full bg-[#0A3D2E] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              {uploadError && (
                <p className="text-sm text-red-700">{uploadError}</p>
              )}
              {imageFieldError && (
                <p className="text-sm text-red-700">{imageFieldError}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666666] mb-1.5">Image URL (optional if you uploaded)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={(e) => {
                setImageFieldError("")
                setUploadError("")
                handleChange(e)
              }}
              placeholder="https://… or use upload above"
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20 bg-white"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
            rows={4}
            className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg border border-[#E8E6E3] p-6">
        <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
          Pricing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Price (NGN) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              required
              min="0"
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
            />
          </div>

          {/* Original Price */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Original Price (NGN)
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice || ""}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Discount Text
            </label>
            <input
              type="text"
              name="discount"
              value={formData.discount || ""}
              onChange={handleChange}
              placeholder="e.g., 20% OFF"
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-lg border border-[#E8E6E3] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
            Colors *
          </h3>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            onClick={addColor}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0A3D2E] text-white rounded-lg text-sm font-semibold hover:bg-[#082F23] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Color
          </motion.button>
        </div>

        <div className="space-y-4">
          {formData.colors.map((color, idx) => (
            <div key={idx} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Color Name
                </label>
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => handleColorChange(idx, "name", e.target.value)}
                  placeholder="e.g., Emerald Green"
                  className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                />
              </div>
              <div className="flex gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Hex Color
                  </label>
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
                    className="w-16 h-10 border border-[#E8E6E3] rounded-lg cursor-pointer"
                  />
                </div>
                {formData.colors.length > 1 && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => removeColor(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="bg-white rounded-lg border border-[#E8E6E3] p-6">
        <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
          Available Sizes *
        </h3>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {sizeOptions.map((size) => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.sizes.includes(size)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleSizeChange([...formData.sizes, size])
                  } else {
                    handleSizeChange(formData.sizes.filter((s) => s !== size))
                  }
                }}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="ml-2 text-sm font-medium text-[#1A1A1A]">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Flags */}
      <div className="bg-white rounded-lg border border-[#E8E6E3] p-6">
        <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
          Product Flags
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew || false}
              onChange={handleChange}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="text-sm font-medium text-[#1A1A1A]">Mark as New Arrival</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={formData.isBestSeller || false}
              onChange={handleChange}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="text-sm font-medium text-[#1A1A1A]">Mark as Best Seller</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <motion.button
          type="submit"
          disabled={isLoading || uploading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-[#0A3D2E] text-white py-3 rounded-lg font-semibold hover:bg-[#082F23] disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Saving..." : uploading ? "Uploading…" : initialData ? "Update Product" : "Create Product"}
        </motion.button>
      </div>
    </form>
  )
}
