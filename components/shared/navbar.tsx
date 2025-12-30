'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react'
import Link from 'next/link'

import { fetchProducts } from '@/api/product-api'
import { useAtom } from 'jotai'
import { tokenAtom } from '@/utils/user'
import { GetCategory, GetProduct } from '@/utils/type'
import { fetchCategories } from '@/api/categories-api'

interface NavbarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredProducts: any[]
  isLoggedIn: boolean
  currentUser: string
  setIsLoginOpen: (open: boolean) => void
  setIsRegisterOpen: (open: boolean) => void
  handleLogout: () => void
  setIsCartOpen: (open: boolean) => void
  getTotalItems: () => number
  roleId: number | null
  onCategoryClick?: (categoryId: number) => void
  onProductClick?: (productId: number) => void
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  filteredProducts,
  isLoggedIn,
  currentUser,
  setIsLoginOpen,
  setIsRegisterOpen,
  handleLogout,
  setIsCartOpen,
  getTotalItems,
  roleId,
  onCategoryClick,
  onProductClick,
}: NavbarProps) {
  const [isBrowseOpen, setIsBrowseOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<GetCategory[]>([])
  const [products, setProducts] = useState<GetProduct[]>([])
  const [categorySubmenus, setCategorySubmenus] = useState<
    Record<string, { id: number; name: string; count: number }[]>
  >({})
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [token] = useAtom(tokenAtom)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      // if (!token) return
      try {
        const [catRes, prodRes] = await Promise.all([
          fetchCategories(token),
          fetchProducts(token),
        ])

        if (catRes?.data) setCategories(catRes.data)
        if (prodRes?.data) setProducts(prodRes.data)

        // Group products by category
        if (catRes?.data && prodRes?.data) {
          const categoryMap: Record<
            string,
            { id: number; name: string; count: number }[]
          > = {}

          catRes.data.forEach((cat: GetCategory) => {
            const subProducts =
              prodRes.data?.filter(
                (p: GetProduct) => p.categoryId === cat.id
              ) || []

            categoryMap[cat.name] = subProducts.map((sp: GetProduct) => ({
              id: sp.id,
              name: sp.name,
              count: sp.stock || 0,
            }))
          })

          setCategorySubmenus(categoryMap)
        }
      } catch (error) {
        console.error('Failed to load categories/products:', error)
      }
    }

    loadData()
  }, [token])

  const handleCategoryClick = (categoryId: number) => {
    setIsBrowseOpen(false)
    setHoveredCategory(null)
    setIsMobileMenuOpen(false)
    setExpandedCategory(null)
    if (onCategoryClick) {
      onCategoryClick(categoryId)
    }
  }

  const handleSubProductClick = (productId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setIsBrowseOpen(false)
    setHoveredCategory(null)
    setIsMobileMenuOpen(false)
    setExpandedCategory(null)
    if (onProductClick) {
      onProductClick(productId)
    }
  }

  const toggleMobileCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName)
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700 hover:text-green-600 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Logo and Browse Categories (Desktop) */}
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <Image
                    src="/logo.jpg"
                    alt="Anuka Logo"
                    width={120}
                    height={100}
                    className="object-contain rounded-full"
                  />
                </div>
              </Link>

              {/* Desktop Browse Categories */}
              <div className="relative hidden lg:block">
                <button
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium transition-colors px-3 py-2"
                  onMouseEnter={() => setIsBrowseOpen(true)}
                >
                  <span className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Browse Categories
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Main Categories Dropdown */}
                {isBrowseOpen && (
                  <div
                    className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    onMouseLeave={() => {
                      setIsBrowseOpen(false)
                      setHoveredCategory(null)
                    }}
                  >
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="relative"
                        onMouseEnter={() => setHoveredCategory(category.name)}
                      >
                        <div
                          className="flex items-center justify-between px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          <span className="text-gray-700 hover:text-green-600 font-medium">
                            {category.name}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-2 sm:mx-8 hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for organic products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {searchQuery && (
                  <>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5 rounded-full" />
                    </button>
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1 p-2 text-sm text-gray-600">
                      Found {filteredProducts.length} products matching{' '}
                      {searchQuery}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 hover:bg-green-50 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200"
                    onMouseEnter={() => setOpen(true)}
                  >
                    <User className="w-5 h-5" />
                    {isLoggedIn && (
                      <span className="hidden md:block text-sm font-medium">
                        Hi, {currentUser}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 p-2 bg-white border border-gray-200 rounded-lg shadow-lg"
                  align="end"
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                >
                  {!isLoggedIn ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => setIsLoginOpen(true)}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Log In</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setIsRegisterOpen(true)}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Register</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 border-b border-gray-100 mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          Welcome back!
                        </p>
                        <p className="text-xs text-gray-600">{currentUser}</p>
                      </div>

                      {roleId === 1 && (
                        <DropdownMenuItem
                          onClick={() => router.push('/admin-dashboard')}
                          className="flex items-center space-x-2 px-3 py-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">Admin Dashboard</span>
                        </DropdownMenuItem>
                      )}

                      {roleId === 2 && (
                        <DropdownMenuItem
                          onClick={() => router.push('/user-dashboard')}
                          className="flex items-center space-x-2 px-3 py-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                        >
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">My Dashboard</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-red-50 rounded-md cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="text-red-700">Logout</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-green-600"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="sm:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {searchQuery && (
                <>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1 p-2 text-sm text-gray-600 z-50">
                    Found {filteredProducts.length} products
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {categories.map((category) => (
            <div key={category.id} className="border-b border-gray-100">
              <div
                className="flex items-center justify-between px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors"
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="text-gray-700 font-medium">
                  {category.name}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
