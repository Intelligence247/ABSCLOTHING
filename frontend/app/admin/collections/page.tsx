"use client"

import { useState } from "react"
import { useAdminData } from "@/lib/admin-data-context"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, X } from "lucide-react"
import type { Collection } from "@/lib/admin-data-context"
import { ApiError } from "@/lib/api"

export default function CollectionsPage() {
  const {
    collections,
    collectionsLoading,
    collectionsError,
    refreshCollections,
    products,
    addCollection,
    updateCollection,
    deleteCollection,
  } = useAdminData()
  const [showForm, setShowForm] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [formData, setFormData] = useState<Omit<Collection, "id" | "createdAt">>({
    name: "",
    description: "",
    heroImage: "",
    productIds: [],
  })
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      heroImage: "",
      productIds: [],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setSaving(true)
    try {
      if (editingCollection) {
        await updateCollection(editingCollection.id, formData)
        setEditingCollection(null)
      } else {
        await addCollection(formData)
      }
      setShowForm(false)
      resetForm()
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not save collection"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (collection: Collection) => {
    setFormError("")
    setEditingCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description,
      heroImage: collection.heroImage,
      productIds: [...collection.productIds],
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return
    try {
      await deleteCollection(id)
    } catch (e) {
      alert(
        e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed to delete"
      )
    }
  }

  const handleCloseForm = () => {
    setFormError("")
    setShowForm(false)
    setEditingCollection(null)
    resetForm()
  }

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
            Collections
          </h1>
          <p className="text-[#666666]">Manage product collections (synced with the API)</p>
          {collectionsError && (
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
              <span>{collectionsError}</span>
              <button
                type="button"
                onClick={() => void refreshCollections()}
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
            setEditingCollection(null)
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center gap-2 bg-[#0A3D2E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#082F23] transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Collection
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
                  {editingCollection ? "Edit Collection" : "Create New Collection"}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-[#F9F8F6] rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-[#666666]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {formError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {formError}
                  </div>
                )}
                {/* Collection Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Men's Formal"
                    required
                    className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe this collection..."
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                  />
                </div>

                {/* Hero Image */}
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Hero Image URL *
                  </label>
                  <input
                    type="url"
                    name="heroImage"
                    value={formData.heroImage}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    required
                    className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#0A3D2E] focus:ring-2 focus:ring-[#0A3D2E]/20"
                  />
                </div>

                {/* Products */}
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-4">
                    Add Products to Collection
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {products.length === 0 ? (
                      <p className="text-[#666666] text-sm">No products available</p>
                    ) : (
                      products.map((product) => (
                        <label
                          key={product.id}
                          className="flex items-center gap-3 p-3 border border-[#E8E6E3] rounded-lg hover:bg-[#F9F8F6] cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.productIds.includes(product.id)}
                            onChange={() => handleProductToggle(product.id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-[#1A1A1A] text-sm">
                              {product.name}
                            </p>
                            <p className="text-xs text-[#666666]">
                              ₦{product.price.toLocaleString()}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4 border-t border-[#E8E6E3]">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    disabled={saving}
                    className="flex-1 px-6 py-2 border border-[#E8E6E3] rounded-lg font-semibold text-[#1A1A1A] hover:bg-[#F9F8F6] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.02 }}
                    whileTap={{ scale: saving ? 1 : 0.98 }}
                    className="flex-1 bg-[#0A3D2E] text-white py-2 rounded-lg font-semibold hover:bg-[#082F23] transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving…" : editingCollection ? "Update" : "Create"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collections Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {collectionsLoading ? (
          <div className="col-span-full bg-white rounded-lg border border-[#E8E6E3] p-12 text-center text-[#666666]">
            Loading collections…
          </div>
        ) : collections.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-[#E8E6E3] p-12 text-center">
            <p className="text-[#666666] text-lg">No collections yet</p>
            <p className="text-[#999999] text-sm mt-2">
              Create your first collection to get started
            </p>
          </div>
        ) : (
          collections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg border border-[#E8E6E3] overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Hero Image */}
              <div className="w-full h-48 bg-[#E8E6E3] overflow-hidden">
                <img
                  src={collection.heroImage}
                  alt={collection.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-2">
                  {collection.name}
                </h3>
                <p className="text-[#666666] text-sm mb-4 line-clamp-2">
                  {collection.description}
                </p>
                <p className="text-xs text-[#999999] mb-4">
                  {collection.productIds.length} products in this collection
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleEdit(collection)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#0A3D2E] text-[#0A3D2E] rounded-lg hover:bg-[#0A3D2E] hover:text-white transition-colors font-semibold text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDelete(collection.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
