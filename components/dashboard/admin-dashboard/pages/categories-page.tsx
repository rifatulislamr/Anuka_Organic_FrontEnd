'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import {
  deleteCategory,
  fetchCategories,
  updateCategory,
  createCategory,
} from '@/api/categories-api'
import { GetCategory } from '@/utils/type'
import Loader from '@/utils/loader'

const CategoriesPage = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [categories, setCategories] = useState<GetCategory[]>([])
  const [loading, setLoading] = useState(false)

  const [editingCategory, setEditingCategory] = useState<GetCategory | null>(null)
  const [editName, setEditName] = useState('')

  const [newCategoryName, setNewCategoryName] = useState('')
  const [creating, setCreating] = useState(false)

  const getCategories = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchCategories(token)
      setCategories(response.data ?? [])
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return alert('Category name is required!')
    try {
      setCreating(true)
      await createCategory(token, { name: newCategoryName })
      setNewCategoryName('')
      getCategories()
    } catch (err) {
      console.error('Error creating category:', err)
    } finally {
      setCreating(false)
    }
  }

  const handleEditClick = (category: GetCategory) => {
    setEditingCategory(category)
    setEditName(category.name)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    try {
      setLoading(true)
      await updateCategory(token, editingCategory.id, { name: editName })
      setEditingCategory(null)
      setEditName('')
      getCategories()
    } catch (err) {
      console.error('Error updating category:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      setLoading(true)
      await deleteCategory(token, categoryId)
      getCategories()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="p-3 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        Manage Categories
      </h1>

      {/* Create Category */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          onClick={handleCreateCategory}
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Add Category'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <p className="mb-4 text-sm text-gray-500">
          Edit or delete existing categories.
        </p>

        {loading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No categories found.
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-100 rounded-lg overflow-hidden text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase text-xs">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase text-xs">
                      Name
                    </th>
                    <th className="px-6 py-3 text-right text-gray-600 font-medium uppercase text-xs">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{category.id}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          className="px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={() => handleEditClick(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3.5 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800">{category.name}</p>
                    <p className="text-xs text-gray-400">ID: {category.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
                      onClick={() => handleEditClick(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md relative shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Category
            </h2>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setEditingCategory(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                onClick={handleUpdateCategory}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CategoriesPage











