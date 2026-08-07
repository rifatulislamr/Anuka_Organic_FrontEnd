'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { GetCart } from '@/utils/type'
import { Button } from '@/components/ui/button'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Loader from '@/utils/loader'

const CartsPage = () => {
  const [carts, setCarts] = useState<GetCart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCarts = useCallback(() => {
    try {
      setLoading(true)
      setError(null)

      const guestCart = localStorage.getItem('guestCart')
      if (guestCart) {
        const parsedCart: GetCart[] = JSON.parse(guestCart)
        setCarts(parsedCart)
      } else {
        setCarts([])
      }
    } catch (err) {
      console.error('Failed to load carts:', err)
      setError('Failed to load carts.')
    } finally {
      setLoading(false)
    }
  }, [])

  const saveCarts = useCallback((updatedCarts: GetCart[]) => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(updatedCarts))
      setCarts(updatedCarts)
    } catch (err) {
      console.error('Failed to save carts:', err)
      setError('Failed to update cart.')
    }
  }, [])

  const handleDecrease = useCallback(
    (productId: number) => {
      const cartItem = carts.find((item) => item.productId === productId)
      if (!cartItem) return

      let updatedCarts: GetCart[]
      const newQuantity = cartItem.quantity - 1

      if (newQuantity <= 0) {
        updatedCarts = carts.filter((item) => item.productId !== productId)
      } else {
        updatedCarts = carts.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }

      saveCarts(updatedCarts)
    },
    [carts, saveCarts]
  )

  const handleIncrease = useCallback(
    (productId: number) => {
      const updatedCarts = carts.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )

      saveCarts(updatedCarts)
    },
    [carts, saveCarts]
  )

  useEffect(() => {
    loadCarts()
  }, [loadCarts])

  const getImageSrc = (url?: string) =>
    url?.startsWith('http') ? url : `https://anukabd.com/api/uploads/${url}`

  const totalAmount = carts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm sm:text-base text-red-500">{error}</p>
  }

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
        My Cart
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {carts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-4">
            <ShoppingCart className="text-gray-300 mb-3" size={40} />
            <p className="text-sm sm:text-base text-gray-500">
              Your cart is empty.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {carts.map((item, index) => (
                <div key={item.cartId || index} className="p-4 flex gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                    <Image
                      src={getImageSrc(item.url)}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-700 font-semibold mt-1">
                      ৳{item.price * item.quantity}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 border-gray-200"
                        onClick={() => handleDecrease(item.productId)}
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <span className="text-sm sm:text-base font-medium min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 border-gray-200"
                        onClick={() => handleIncrease(item.productId)}
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 flex justify-between items-center bg-gray-50">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-base font-semibold text-gray-900">
                  ৳{totalAmount}
                </span>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-4 w-14">#</th>
                    <th className="p-4">Image</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Added On</th>
                    <th className="p-4 text-center">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {carts.map((item, index) => (
                    <tr key={item.cartId || index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-500">{index + 1}</td>
                      <td className="p-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-gray-100">
                          <Image
                            src={getImageSrc(item.url)}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-800">{item.name}</td>
                      <td className="p-4 font-semibold text-gray-900">
                        ৳{item.price * item.quantity}
                      </td>
                      <td className="p-4 text-gray-500 text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-200 hover:bg-gray-100"
                            onClick={() => handleDecrease(item.productId)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-base font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-200 hover:bg-gray-100"
                            onClick={() => handleIncrease(item.productId)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="p-4 text-right font-medium text-gray-600">
                      Total
                    </td>
                    <td colSpan={3} className="p-4 font-semibold text-gray-900">
                      ৳{totalAmount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartsPage









