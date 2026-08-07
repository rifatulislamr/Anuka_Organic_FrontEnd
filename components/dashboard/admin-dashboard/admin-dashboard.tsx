'use client'

import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useRouter, useSearchParams } from 'next/navigation'
import { tokenAtom, useInitializeUser } from '@/utils/user'

// Import all page components
import UsersPage from './pages/users-page'
import RolesPage from './pages/roles-page'
import PermissionsPage from './pages/permissions-page'
import CategoriesPage from './pages/categories-page'
import ProductsPage from './pages/products-page'
import OrdersPage from './pages/orders-page'
import PaymentsPage from './pages/payments-page'
import ReviewsPage from './pages/reviews-page'
import CartsPage from './pages/carts-page'
import { Button } from '@/components/ui/button'
import {
  FaUser,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaHome,
  FaBars,
  FaTimes,
} from 'react-icons/fa'

type AdminPage =
  | 'users'
  | 'roles'
  | 'permissions'
  | 'categories'
  | 'products'
  | 'orders'
  | 'payments'
  | 'reviews'
  | 'carts'

const VALID_PAGES: AdminPage[] = [
  'users',
  'roles',
  'permissions',
  'categories',
  'products',
  'orders',
  'payments',
  'reviews',
  'carts',
]

const AdminDashboard = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read initial page from URL, fallback to 'users'
  const pageFromUrl = searchParams.get('page') as AdminPage | null
  const [activePage, setActivePage] = useState<AdminPage>(
    pageFromUrl && VALID_PAGES.includes(pageFromUrl) ? pageFromUrl : 'users'
  )
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

// Keep state in sync if user navigates back/forward or URL changes externally
  useEffect(() => {
    const urlPage = searchParams.get('page') as AdminPage | null
    if (urlPage && VALID_PAGES.includes(urlPage)) {
      setActivePage((prev) => (prev !== urlPage ? urlPage : prev))
    }
  }, [searchParams])

  const handlePageChange = (page: AdminPage) => {
    setActivePage(page)
    setIsSidebarOpen(false)
    router.push(`?page=${page}`, { scroll: false })
  }

  const menuItems: { key: AdminPage; label: string; icon: React.ReactNode }[] =
    [
      { key: 'users', label: 'Users', icon: <FaUser /> },
      { key: 'categories', label: 'Categories', icon: <FaTags /> },
      { key: 'products', label: 'Products', icon: <FaBoxOpen /> },
      { key: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    ]

  const renderPage = () => {
    switch (activePage) {
      case 'users':
        return <UsersPage token={token} />
      case 'roles':
        return <RolesPage />
      case 'permissions':
        return <PermissionsPage />
      case 'categories':
        return <CategoriesPage />
      case 'products':
        return <ProductsPage />
      case 'orders':
        return <OrdersPage />
      case 'payments':
        return <PaymentsPage />
      case 'reviews':
        return <ReviewsPage />
      case 'carts':
        return <CartsPage />
      default:
        return null
    }
  }

  const activeLabel = menuItems.find((item) => item.key === activePage)?.label

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30 shadow-sm">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-700 p-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <FaBars size={18} />
        </button>
        <h2 className="text-sm font-semibold text-gray-800">
          {activeLabel ?? 'Admin Panel'}
        </h2>
        <div className="w-9" />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col fixed top-0 left-0 bottom-0 shadow-xl z-50 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950/40 shadow-md">
          <h2 className="text-lg font-semibold tracking-wide">Admin Panel</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push('/')}
              className="flex items-center gap-1 bg-white text-slate-800 font-medium px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-all text-xs"
            >
              <FaHome size={12} />
              Home
            </Button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-300 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handlePageChange(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                activePage === item.key
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Admin Dashboard
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Built with ❤️ by Rifat</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:p-8 lg:pt-8 overflow-y-auto max-h-screen">
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 sm:p-6 min-h-[80vh]">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
















