'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useAtom } from 'jotai'
import { GetCategory, GetProduct } from '@/utils/type'
import {
  createProduct,
  CreateProductForm,
  fetchProducts,
} from '@/api/product-api'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { fetchCategories } from '@/api/categories-api'
import Loader from '@/utils/loader'

type ProductFormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

const ProductsPage = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [products, setProducts] = useState<GetProduct[]>([])
  const [categories, setCategories] = useState<GetCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CreateProductForm>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    isActive: true,
  })
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const getProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchProducts(token)
      setProducts(response.data ?? [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [token])

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
    getProducts()
    getCategories()
  }, [token, getProducts, getCategories])

  const handleInputChange = (e: React.ChangeEvent<ProductFormElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stock' || name === 'categoryId'
          ? Number(value)
          : value,
    }))
    if (name === 'categoryId' && Number(value) !== 0) {
      setCategoryError(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (!formData.categoryId || formData.categoryId === 0) {
      setCategoryError('Category is required')
      return
    }

    try {
      setCreating(true)
      setFormError(null)
      await createProduct(token, formData)
      setShowForm(false)
      setPreview(null)
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: 0,
        isActive: true,
      })
      getProducts()
    } catch (err: any) {
      setFormError(err.message || 'Failed to create product')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    )
  }
  if (error) return <p className="text-red-500 p-6">{error}</p>

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getCategoryName = (id: number) => {
    const category = categories.find((c) => c.id === id)
    return category ? category.name : 'Unknown'
  }

  return (
    <section className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Manage Products
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-14 h-14 relative rounded-lg overflow-hidden border border-gray-100">
                      <Image
                        src={product.url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[220px] truncate">
                    {product.description}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    ৳{product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {getCategoryName(product.categoryId)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {paginatedProducts.map((product, index) => (
            <div key={product.id} className="p-4 flex gap-3">
              <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                <Image
                  src={product.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-800 truncate">
                    {product.name}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    #{(currentPage - 1) * itemsPerPage + index + 1}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-gray-800 text-sm">
                    ৳{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-gray-100 text-gray-700 text-[11px] rounded-full">
                  {getCategoryName(product.categoryId)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-100">
          <label className="text-sm text-gray-600 flex items-center gap-2">
            Items per page:
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-600">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md relative max-h-[95vh] overflow-y-auto shadow-xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Create Product
            </h2>
            {formError && (
              <p className="text-red-500 text-sm mb-3">{formError}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="price" className="block mb-1 text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="stock" className="block mb-1 text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="categoryId" className="block mb-1 text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    categoryError ? 'border-red-400' : 'border-gray-200'
                  }`}
                >
                  <option value={0}>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categoryError && (
                  <p className="text-red-500 text-xs mt-1">{categoryError}</p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700 file:text-xs"
                />
              </div>

              {preview && (
                <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setPreview(null)
                    setCategoryError(null)
                  }}
                  className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductsPage

// 'use client'

// import React, { useCallback, useEffect, useState } from 'react'
// import Image from 'next/image'
// import { useAtom } from 'jotai'
// import { GetCategory, GetProduct } from '@/utils/type'
// import {
//   createProduct,
//   CreateProductForm,
//   fetchProducts,
// } from '@/api/product-api'
// import { tokenAtom, useInitializeUser } from '@/utils/user'
// import { fetchCategories } from '@/api/categories-api'
// import Loader from '@/utils/loader'

// const ProductsPage = () => {
//   useInitializeUser()
//   const [token] = useAtom(tokenAtom)
//   const [products, setProducts] = useState<GetProduct[]>([])
//   const [categories, setCategories] = useState<GetCategory[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const [showForm, setShowForm] = useState(false)
//   const [formData, setFormData] = useState<CreateProductForm>({
//     name: '',
//     description: '',
//     price: 0,
//     stock: 0,
//     categoryId: 0,
//     isActive: true,
//   })
//   const [creating, setCreating] = useState(false)
//   const [formError, setFormError] = useState<string | null>(null)
//   const [categoryError, setCategoryError] = useState<string | null>(null)
//   const [preview, setPreview] = useState<string | null>(null)

//   const [search, setSearch] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage, setItemsPerPage] = useState(5)

//   // Fetch products
//   const getProducts = useCallback(async () => {
//     try {
//       setLoading(true)
//       const response = await fetchProducts(token)
//       setProducts(response.data ?? [])
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch products')
//     } finally {
//       setLoading(false)
//     }
//   }, [token])

//   // Fetch categories
//   const getCategories = useCallback(async () => {
//     try {
//       setLoading(true)
//       const response = await fetchCategories(token)
//       setCategories(response.data ?? [])
//     } catch (err: any) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }, [token])

//   useEffect(() => {
//     getProducts()
//     getCategories()
//   }, [token, getProducts, getCategories])

//   // Input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === 'price' || name === 'stock' || name === 'categoryId'
//           ? Number(value)
//           : value,
//     }))
//     if (name === 'categoryId' && Number(value) !== 0) {
//       setCategoryError(null)
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setFormData((prev) => ({ ...prev, image: file }))
//       setPreview(URL.createObjectURL(file))
//     }
//   }

//   // Submit product
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!token) return

//     // ✅ Category validation
//     if (!formData.categoryId || formData.categoryId === 0) {
//       setCategoryError('Category is required')
//       return
//     }

//     try {
//       setCreating(true)
//       setFormError(null)
//       await createProduct(token, formData)
//       setShowForm(false)
//       setPreview(null)
//       setFormData({
//         name: '',
//         description: '',
//         price: 0,
//         stock: 0,
//         categoryId: 0,
//         isActive: true,
//       })
//       getProducts()
//     } catch (err: any) {
//       setFormError(err.message || 'Failed to create product')
//     } finally {
//       setCreating(false)
//     }
//   }

//   if (loading) return 
//    <div className="flex items-center justify-center min-h-screen">
//         <Loader />
//       </div>
//   if (error) return <p className="text-red-500">{error}</p>

//   // Filtered & paginated products
//   const filteredProducts = products.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   )
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   const getCategoryName = (id: number) => {
//     const category = categories.find((c) => c.id === id)
//     return category ? category.name : 'Unknown'
//   }

//   return (
//     <section className="p-4">
//       <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
//         <h1 className="text-2xl font-semibold">Manage Products</h1>
//         <div className="flex gap-2 flex-wrap">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value)
//               setCurrentPage(1)
//             }}
//             className="border px-3 py-2 rounded"
//           />
//           <button
//             onClick={() => setShowForm(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Add Product
//           </button>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 border">No</th>
//               <th className="px-4 py-2 border">Image</th>
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Description</th>
//               <th className="px-4 py-2 border">Price</th>
//               <th className="px-4 py-2 border">Stock</th>
//               <th className="px-4 py-2 border">Category</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedProducts.map((product, index) => (
//               <tr key={product.id} className="text-center border-b">
//                 <td className="px-4 py-2 border">
//                   {(currentPage - 1) * itemsPerPage + index + 1}
//                 </td>
//                 <td className="px-4 py-2 border">
//                   <div className="w-20 h-20 relative mx-auto">
//                     <Image
//                       src={product.url}
//                       alt={product.name}
//                       fill
//                       className="object-cover rounded"
//                     />
//                   </div>
//                 </td>
//                 <td className="px-4 py-2 border">{product.name}</td>
//                 <td className="px-4 py-2 border">{product.description}</td>
//                 <td className="px-4 py-2 border">
//                   ৳{product.price.toFixed(2)}
//                 </td>
//                 <td className="px-4 py-2 border">{product.stock}</td>
//                 <td className="px-4 py-2 border">
//                   {getCategoryName(product.categoryId)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
//         <div>
//           <label>
//             Items per page:{' '}
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value))
//                 setCurrentPage(1)
//               }}
//               className="border px-2 py-1 rounded"
//             >
//               {[5, 10, 20, 50].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="px-3 py-1 border rounded">
//             {currentPage} / {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Popup Form */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded w-full max-w-md relative h-[95vh] overflow-y-auto">
//             <button
//               onClick={() => setShowForm(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-semibold mb-4">Create Product</h2>
//             {formError && <p className="text-red-500 mb-2">{formError}</p>}
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div>
//                 <label htmlFor="name" className="block mb-1 font-medium">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full border px-3 py-2 rounded"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="description" className="block mb-1 font-medium">
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full border px-3 py-2 rounded"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="price" className="block mb-1 font-medium">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   id="price"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full border px-3 py-2 rounded"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="stock" className="block mb-1 font-medium">
//                   Stock
//                 </label>
//                 <input
//                   type="number"
//                   id="stock"
//                   name="stock"
//                   value={formData.stock}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full border px-3 py-2 rounded"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="categoryId" className="block mb-1 font-medium">
//                   Category
//                 </label>
//                 <select
//                   id="categoryId"
//                   name="categoryId"
//                   value={formData.categoryId}
//                   onChange={handleInputChange}
//                   required
//                   className={`w-full border px-3 py-2 rounded ${
//                     categoryError ? 'border-red-500' : ''
//                   }`}
//                 >
//                   <option value={0}>Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//                 {categoryError && (
//                   <p className="text-red-500 text-sm mt-1">{categoryError}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="image" className="block mb-1 font-medium">
//                   Product Image
//                 </label>
//                 <input
//                   type="file"
//                   id="image"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   required
//                   className="w-full border px-3 py-2 rounded"
//                 />
//               </div>

//               {preview && (
//                 <div className="w-32 h-32 relative mt-2">
//                   <Image
//                     src={preview}
//                     alt="Preview"
//                     fill
//                     className="object-cover rounded"
//                   />
//                 </div>
//               )}

//               <div className="flex justify-end gap-2 mt-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false)
//                     setPreview(null)
//                     setCategoryError(null)
//                   }}
//                   className="px-4 py-2 border rounded hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={creating}
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 >
//                   {creating ? 'Creating...' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </section>
//   )
// }

// export default ProductsPage
