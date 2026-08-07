'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from './pages/Sidebar'
import CartsPage from './pages/CartsPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import { getUserByIdApi } from '@/api/users-api'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { Users } from '@/utils/type'
import Loader from '@/utils/loader'
import { Menu, X } from 'lucide-react'

// ✅ User type
export type User = {
  userId: number
  username: string
  email: string
  password: string
  active: boolean
  roleId: number | null
  roleName?: string | null
  fullName: string | null
  phone: string | null
  street: string | null
  city: string | null
  state: string | null
  country: string | null
  postalCode: string | null
  isPasswordResetRequired: boolean
  createdAt: string
  updatedAt: string
  role?: {
    roleId: number
    roleName: string
    rolePermissions: {
      roleId: number
      permissionId: number
      permission: { id: number; name: string }
    }[]
  } | null
}

type PageKey = 'profile' | 'orders' | 'carts'
const VALID_PAGES: PageKey[] = ['profile', 'orders', 'carts']

const UserDashboard = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read initial tab from URL (?page=orders), fallback to 'profile' — same pattern as AdminDashboard
  const pageFromUrl = searchParams.get('page') as PageKey | null
  const [activePage, setActivePage] = useState<PageKey>(
    pageFromUrl && VALID_PAGES.includes(pageFromUrl) ? pageFromUrl : 'profile'
  )
  const [user, setUser] = useState<Users | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Keep state in sync if user navigates back/forward or URL changes externally
  useEffect(() => {
    const urlPage = searchParams.get('page') as PageKey | null
    if (urlPage && VALID_PAGES.includes(urlPage)) {
      setActivePage((prev) => (prev !== urlPage ? urlPage : prev))
    }
  }, [searchParams])

  const fetchUser = useCallback(async () => {
    if (!userData?.userId || !token) {
      // Token/user not loaded yet (useInitializeUser still resolving) — keep
      // showing the loader instead of flashing a "please log in" error.
      // This will re-run automatically once token/userData become available
      // (they're in the deps array below).
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await getUserByIdApi(token, userData.userId)
      if (response?.data) {
        setUser(response.data)
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load user data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [token, userData?.userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleUserUpdate = (updatedUser: Users) => {
    setUser(updatedUser)
  }

  const handlePageChange = (page: PageKey) => {
    setActivePage(page)
    setIsMobileMenuOpen(false)
    router.push(`?page=${page}`, { scroll: false })
  }

  const pageTitles: Record<PageKey, string> = {
    profile: 'My Profile',
    orders: 'My Orders',
    carts: 'My Cart',
  }

  const renderPage = () => {
    if (loading) {
      return <Loader />
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <p className="text-red-700 text-center mb-4 text-sm sm:text-base">
              {error}
            </p>
            <button
              onClick={fetchUser}
              className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    switch (activePage) {
      case 'profile':
        return (
          <ProfilePage
            user={user}
            onUserUpdate={handleUserUpdate}
            onRefresh={fetchUser}
          />
        )
      case 'orders':
        return <OrdersPage />
      case 'carts':
        return <CartsPage />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40 shadow-sm">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h2 className="text-sm font-semibold text-gray-800">
          {pageTitles[activePage]}
        </h2>
        <div className="w-9" />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - fixed width, fixed position, like admin dashboard */}
      <aside
        className={`
          w-64 fixed top-0 left-0 bottom-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <Sidebar
          activePage={activePage}
          setActivePage={handlePageChange}
          onHome={() => router.push('/')}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 w-full min-h-screen">
        <div className="p-3 sm:p-6 lg:p-8 pt-16 lg:pt-8 overflow-y-auto max-h-screen">
          <div className="w-full">{renderPage()}</div>
        </div>
      </main>
    </div>
  )
}

export default UserDashboard
