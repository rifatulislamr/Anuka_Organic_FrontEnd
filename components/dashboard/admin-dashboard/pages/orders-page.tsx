'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { GetAllOrdersType, GetProduct } from '@/utils/type'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { fetchOrders, updateOrderStatus } from '@/api/orders-api'
import { fetchProducts } from '@/api/product-api'
import Loader from '@/utils/loader'

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  paid: 'bg-blue-100 text-blue-800 border-blue-300',
  delivered: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
}

const OrdersPage = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [orders, setOrders] = useState<GetAllOrdersType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [products, setProducts] = useState<GetProduct[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7
  const totalPages = Math.ceil(orders.length / rowsPerPage)

  const getOrders = useCallback(async () => {
    try {
      const res = await fetchOrders(token)
      setOrders(res.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  const getProducts = useCallback(async () => {
    if (!token) return
    try {
      const response = await fetchProducts(token)
      setProducts(response.data ?? [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to fetch products')
    }
  }, [token])

  useEffect(() => {
    getOrders()
    getProducts()
  }, [token, getOrders, getProducts])

  const handleEditClick = (orderId: number, currentStatus: string) => {
    setEditingOrderId(orderId)
    setNewStatus(currentStatus)
  }

  const handleSaveClick = async (orderId: number) => {
    if (!token) return
    try {
      await updateOrderStatus(token, orderId, newStatus)
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
      setEditingOrderId(null)
    } catch (err: any) {
      console.error('Failed to update status:', err.message)
      alert('Failed to update status. Please try again.')
    }
  }

  const handleCancelClick = () => setEditingOrderId(null)

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))

  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const getProductName = (id: string | number) => {
    const product = products.find((p) => p.id === id)
    return product ? product.name : 'Unknown Product'
  }

  return (
    <section className="p-3 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        Manage Orders
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500 text-center py-10 text-sm">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-sm">
            No orders found.
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto p-4">
              <table className="min-w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                    <th className="p-3 rounded-l-lg">SL No</th>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3 rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:shadow-sm transition-all`}
                    >
                      <td className="p-3 font-semibold text-gray-800">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="p-3">{order.userName}</td>
                      <td className="p-3">{getProductName(order.productId)}</td>
                      <td className="p-3 text-center">{order.productQuantity}</td>
                      <td className="p-3">
                        {editingOrderId === order.id ? (
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize cursor-pointer border ${
                              statusStyles[newStatus] ??
                              'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${
                              statusStyles[order.status] ??
                              'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="p-3">
                        {editingOrderId === order.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveClick(order.id)}
                              className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs hover:bg-emerald-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelClick}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditClick(order.id, order.status)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Card View */}
            <div className="lg:hidden divide-y divide-gray-100">
              {paginatedOrders.map((order, index) => (
                <div key={order.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.userName}
                      </p>
                      <p className="text-xs text-gray-400">
                        #{(currentPage - 1) * rowsPerPage + index + 1} ·{' '}
                        {getProductName(order.productId)}
                      </p>
                    </div>
                    {editingOrderId === order.id ? (
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize cursor-pointer border ${
                          statusStyles[newStatus] ??
                          'bg-gray-100 text-gray-800 border-gray-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${
                          statusStyles[order.status] ??
                          'bg-gray-100 text-gray-800 border-gray-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Qty: {order.productQuantity}</span>
                    <span className="font-semibold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}{' '}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                    {editingOrderId === order.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveClick(order.id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs hover:bg-emerald-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(order.id, order.status)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center sm:justify-end gap-2 p-4 border-t border-gray-100">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200 transition-colors"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default OrdersPage










// 'use client'

// import React, { useEffect, useState, useCallback } from 'react'
// import { GetAllOrdersType, GetProduct } from '@/utils/type'
// import { useAtom } from 'jotai'
// import { tokenAtom, useInitializeUser } from '@/utils/user'
// import { fetchOrders, updateOrderStatus } from '@/api/orders-api'
// import { fetchProducts } from '@/api/product-api'
// import Loader from '@/utils/loader'

// const OrdersPage = () => {
//   useInitializeUser()
//   const [token] = useAtom(tokenAtom)
//   const [orders, setOrders] = useState<GetAllOrdersType[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
//   const [newStatus, setNewStatus] = useState<string>('')
//   const [products, setProducts] = useState<GetProduct[]>([])

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1)
//   const rowsPerPage = 7
//   const totalPages = Math.ceil(orders.length / rowsPerPage)

//   const getOrders = useCallback(async () => {
//     try {
//       const res = await fetchOrders(token)
//       setOrders(res.data || [])
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }, [token])

//   // ✅ Fetch all products once
//   const getProducts = useCallback(async () => {
//     if (!token) return
//     try {
//       const response = await fetchProducts(token)
//       setProducts(response.data ?? [])
//     } catch (err: any) {
//       console.error(err)
//       setError(err.message || 'Failed to fetch products')
//     }
//   }, [token])

//   useEffect(() => {
//     getOrders()
//     getProducts()
//   }, [token, getOrders, getProducts])

//   const handleEditClick = (orderId: number, currentStatus: string) => {
//     setEditingOrderId(orderId)
//     setNewStatus(currentStatus)
//   }

//   const handleSaveClick = async (orderId: number) => {
//     if (!token) return
//     try {
//       await updateOrderStatus(token, orderId, newStatus)
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === orderId ? { ...order, status: newStatus } : order
//         )
//       )
//       setEditingOrderId(null)
//     } catch (err: any) {
//       console.error('Failed to update status:', err.message)
//       alert('Failed to update status. Please try again.')
//     }
//   }

//   const handleCancelClick = () => {
//     setEditingOrderId(null)
//   }

//   // Pagination handlers
//   const handlePrevPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1))
//   }

//   const handleNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//   }

//   // Slice orders for current page
//   const paginatedOrders = orders.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   )

//   // ✅ Helper to get product name by ID
//   const getProductName = (id: string | number) => {
//     const product = products.find((p) => p.id === id)
//     return product ? product.name : 'Unknown Product'
//   }

//   return (
//     <section className="p-4 md:p-6">
//       <h1 className="text-3xl font-semibold text-gray-800 mb-6">
//         Manage Orders
//       </h1>

//       <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 overflow-x-auto">
//         {loading ? (
//          <Loader />
//         ) : error ? (
//           <p className="text-red-500 text-center py-6">{error}</p>
//         ) : orders.length === 0 ? (
//           <p className="text-gray-500 text-center py-6">No orders found.</p>
//         ) : (
//           <>
//             <table className="min-w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 uppercase text-xs tracking-wider">
//                   <th className="p-3 rounded-l-lg">SL No</th>
//                   <th className="p-3">User Name</th>
//                   <th className="p-3">Product Name</th>
//                   <th className="p-3">Quantity</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">Total Amount</th>
//                   <th className="p-3">Created At</th>
//                   <th className="p-3 rounded-r-lg">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {paginatedOrders.map((order, index) => (
//                   <tr
//                     key={order.id}
//                     className={`${
//                       index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                     } hover:shadow-sm transition-all duration-200 hover:scale-[1.01]`}
//                   >
//                     {/* ✅ Serial Number instead of Order ID */}
//                     <td className="p-3 font-semibold text-gray-800">
//                       {(currentPage - 1) * rowsPerPage + index + 1}
//                     </td>

//                     <td className="p-3">{order.userName}</td>
//                     <td className="p-3">{getProductName(order.productId)}</td>
//                     <td className="p-3 text-center">{order.productQuantity}</td>

//                     <td className="p-3">
//                       {editingOrderId === order.id ? (
//                         <select
//                           value={newStatus}
//                           onChange={(e) => setNewStatus(e.target.value)}
//                           className={`px-3 py-1 rounded-full text-xs font-medium capitalize cursor-pointer border ${
//                             newStatus === 'pending'
//                               ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
//                               : newStatus === 'paid'
//                                 ? 'bg-blue-100 text-blue-800 border-blue-300'
//                                 : newStatus === 'delivered'
//                                   ? 'bg-green-100 text-green-800 border-green-300'
//                                   : newStatus === 'cancelled'
//                                     ? 'bg-red-100 text-red-800 border-red-300'
//                                     : 'bg-gray-100 text-gray-800 border-gray-300'
//                           }`}
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="paid">Paid</option>
//                           <option value="delivered">Delivered</option>
//                           <option value="cancelled">Cancelled</option>
//                         </select>
//                       ) : (
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
//                             order.status === 'pending'
//                               ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
//                               : order.status === 'paid'
//                                 ? 'bg-blue-100 text-blue-800 border border-blue-300'
//                                 : order.status === 'delivered'
//                                   ? 'bg-green-100 text-green-800 border border-green-300'
//                                   : order.status === 'cancelled'
//                                     ? 'bg-red-100 text-red-800 border border-red-300'
//                                     : 'bg-gray-100 text-gray-800 border border-gray-300'
//                           }`}
//                         >
//                           {order.status}
//                         </span>
//                       )}
//                     </td>

//                     <td className="p-3 font-semibold text-gray-900">
//                       ${order.totalAmount.toFixed(2)}
//                     </td>

//                     <td className="p-3 text-gray-500">
//                       {new Date(order.createdAt).toLocaleDateString()} <br />
//                       <span className="text-xs text-gray-400">
//                         {new Date(order.createdAt).toLocaleTimeString()}
//                       </span>
//                     </td>

//                     <td className="p-3">
//                       {editingOrderId === order.id ? (
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleSaveClick(order.id)}
//                             className="px-3 py-1 bg-green-500 text-white rounded-md text-xs"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={handleCancelClick}
//                             className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-xs"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() =>
//                             handleEditClick(order.id, order.status)
//                           }
//                           className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs"
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination Controls */}
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={handlePrevPage}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               <span className="px-3 py-1 text-gray-700">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   )
// }

// export default OrdersPage




