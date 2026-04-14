"use client"

import { useState } from "react"
import { useAdminData } from "@/lib/admin-data-context"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, Search, X } from "lucide-react"
import { ProductForm } from "@/components/admin/product-form"
import type { Product } from "@/lib/products"
import { ApiError } from "@/lib/api"

export default function ProductsPage() {
  const {
    products,
    productsLoading,
    productsError,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useAdminData()
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [filterCategory, setFilterCategory] = useState("")
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddProduct = async (productData: Omit<Product, "id">) => {
    setFormError("")
    setSaving(true)
    try {
      await addProduct(productData)
      setShowForm(false)
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed to create product")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateProduct = async (productData: Omit<Product, "id">) => {
    if (!editingProduct) return
    setFormError("")
    setSaving(true)
    try {
      await updateProduct(editingProduct.id, productData)
      setEditingProduct(null)
      setShowForm(false)
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await deleteProduct(id)
    } catch (e) {
      alert(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed to delete product")
    }
  }

  const categories = ["Agbada", "Suits", "Casual Wear", "Accessories", "Formal"]

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-2">
            Products
          </h1>
          <p className="text-[#666666]">Manage your product catalog (synced with the API)</p>
          {productsError && (
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
              <span>{productsError}</span>
              <button
                type="button"
                onClick={() => void refreshProducts()}
                className="font-semibold text-[#0A3D2E] underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setFormError("")
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 bg-[#0A3D2E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#082F23] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-[#E8E6E3] p-6 flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setFormError("")
                    setShowForm(false)
                    setEditingProduct(null)
                  }}
                  className="p-2 hover:bg-[#F9F8F6] rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-[#666666]" />
                </button>
              </div>

              <div className="p-6">
                {formError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {formError}
                  </div>
                )}
                <ProductForm
                  key={editingProduct?.id ?? "new"}
                  onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                  initialData={editingProduct || undefined}
                  isLoading={saving}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#E8E6E3] p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-[#E8E6E3] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F8F6] border-b border-[#E8E6E3]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">
                  Collection
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[#1A1A1A]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {productsLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#666666]">
                    Loading products…
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#666666]">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#E8E6E3] hover:bg-[#F9F8F6] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-[#E8E6E3] rounded-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{product.name}</p>
                          <p className="text-xs text-[#666666]">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#1A1A1A]">{product.category}</td>
                    <td className="px-6 py-4 font-semibold text-[#1A1A1A]">
                      ₦{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[#1A1A1A]">{product.collection}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => {
                            setFormError("")
                            setEditingProduct(product)
                            setShowForm(true)
                          }}
                          className="p-2 text-[#0A3D2E] hover:bg-[#E8E6E3] rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with count */}
        <div className="bg-[#F9F8F6] border-t border-[#E8E6E3] px-6 py-4 text-sm text-[#666666]">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </motion.div>
    </div>
  )
}
