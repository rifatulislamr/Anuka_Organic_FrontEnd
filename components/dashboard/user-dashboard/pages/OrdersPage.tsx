'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { fetchOrdersByUsers } from '@/api/orders-api'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { GetAllOrdersType, GetProduct } from '@/utils/type'
import { fetchProducts } from '@/api/product-api'
import Loader from '@/utils/loader'

const statusStyles: Record<string, string> = {
  delivered: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-red-50 text-red-700',
}

const OrdersPage = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)

  const [orders, setOrders] = useState<GetAllOrdersType[]>([])
  const [products, setProducts] = useState<GetProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const loadOrders = useCallback(async () => {
    if (!token || !userData?.userId) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetchOrdersByUsers(token)
      if (!res || !res.data || res.data.length === 0) {
        setError('No orders found.')
        setOrders([])
        return
      }
      setOrders(res.data)
    } catch (err: any) {
      console.error(err)
      if (err?.status === 401 || err?.status === 403) {
        setError('Unauthorized. Please log in again.')
      } else {
        setError('Failed to fetch orders.')
      }
    } finally {
      setLoading(false)
    }
  }, [token, userData?.userId])

  useEffect(() => {
    if (token && userData?.userId) {
      Promise.all([getProducts(), loadOrders()])
    }
  }, [token, userData?.userId, getProducts, loadOrders])

  const getProductName = (id: string | number) => {
    const product = products.find((p) => p.id === id)
    return product ? product.name : 'Unknown Product'
  }

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
        My Orders
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-10">
            <Loader />
          </div>
        ) : error ? (
          <p className="text-gray-500 text-center py-10 text-sm">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-sm">
            No orders found.
          </p>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {orders.map((order, index) => (
                <div key={order.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400">
                          #{index + 1}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                            statusStyles[order.status?.toLowerCase()] ??
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-medium text-gray-800">
                        {getProductName(order.productId)}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-400">Quantity: </span>
                      <span className="font-medium text-gray-800">
                        {order.productQuantity}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400">Total: </span>
                      <span className="font-semibold text-gray-900">
                        ৳{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-4">SL</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order, index) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-500">{index + 1}</td>
                      <td className="p-4 text-gray-800 font-medium">
                        {getProductName(order.productId)}
                      </td>
                      <td className="p-4 text-gray-600">{order.productQuantity}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            statusStyles[order.status?.toLowerCase()] ??
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-gray-900">
                        ৳{order.totalAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrdersPage



















