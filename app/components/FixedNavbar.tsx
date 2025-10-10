"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  ShoppingCart,
  Users,
  Menu,
  Leaf,
  Home,
  ShoppingBag,
  Package,
  Flame,
  TrendingUp,
  User,
  LogOut,
  Settings,
  Heart
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Suppliers", href: "/suppliers", icon: Users },
  { name: "Categories", href: "/categories", icon: Package },
  { name: "Deals", href: "/deals", icon: Flame },
  { name: "Sell", href: "/sell", icon: TrendingUp }
]

interface FixedNavbarProps {
  cartItemsCount: number;
}

export default function FixedNavbar({ cartItemsCount }: FixedNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`)
      // Implement actual search logic here
    }
  }

  return (
    <>
      {/* Fixed Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-lg' 
          : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isScrolled ? 'bg-emerald-600' : 'bg-white/20'
              }`}>
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-xl ${
                isScrolled ? 'text-emerald-600' : 'text-white'
              }`}>
                EcoClean
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1 transition-colors ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-emerald-600' 
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Search Bar (Desktop) */}
              <div className="hidden lg:block">
                <form onSubmit={handleSearch} className="relative">
                  <Search className={`absolute left-3 top-2.5 h-4 w-4 ${
                    isScrolled ? 'text-gray-400' : 'text-white/70'
                  }`} />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 text-sm border-0 focus:ring-2 focus:ring-emerald-300 rounded-full ${
                      isScrolled 
                        ? 'bg-gray-100 text-gray-900 placeholder-gray-500' 
                        : 'bg-white/10 text-white placeholder-white/70 backdrop-blur-sm'
                    }`}
                  />
                </form>
              </div>

              {/* Cart */}
              <Link href="/cart">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`relative ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center ${
                      isScrolled 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white text-emerald-600'
                    }`}>
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`${
                    isScrolled 
                      ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`${
                    isScrolled 
                      ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50' 
                      : 'text-white hover:bg-white/20'
                  }`}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="w-5 h-5" />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className={`absolute right-0 top-12 w-48 rounded-lg shadow-lg border ${
                    isScrolled 
                      ? 'bg-white border-gray-200' 
                      : 'bg-emerald-600 border-emerald-500'
                  }`}>
                    <div className="p-2">
                      <div className={`px-3 py-2 text-sm ${
                        isScrolled ? 'text-gray-700' : 'text-white'
                      }`}>
                        Welcome, User!
                      </div>
                      <div className="border-t border-gray-200/50 my-1"></div>
                      <Link href="/profile">
                        <button className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          isScrolled 
                            ? 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600' 
                            : 'text-white hover:bg-white/20'
                        }`}>
                          <User className="w-4 h-4 inline mr-2" />
                          My Profile
                        </button>
                      </Link>
                      <Link href="/orders">
                        <button className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          isScrolled 
                            ? 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600' 
                            : 'text-white hover:bg-white/20'
                        }`}>
                          <Package className="w-4 h-4 inline mr-2" />
                          My Orders
                        </button>
                      </Link>
                      <Link href="/settings">
                        <button className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          isScrolled 
                            ? 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600' 
                            : 'text-white hover:bg-white/20'
                        }`}>
                          <Settings className="w-4 h-4 inline mr-2" />
                          Settings
                        </button>
                      </Link>
                      <div className="border-t border-gray-200/50 my-1"></div>
                      <button className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        isScrolled 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-red-200 hover:bg-red-500/20'
                      }`}>
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon"
                className={`md:hidden ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50' 
                    : 'text-white hover:bg-white/20'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className={`absolute left-3 top-2.5 h-4 w-4 ${
                isScrolled ? 'text-gray-400' : 'text-white/70'
              }`} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 text-sm border-0 focus:ring-2 focus:ring-emerald-300 rounded-full ${
                  isScrolled 
                    ? 'bg-gray-100 text-gray-900 placeholder-gray-500' 
                    : 'bg-white/10 text-white placeholder-white/70 backdrop-blur-sm'
                }`}
              />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t ${
            isScrolled ? 'border-emerald-100 bg-white' : 'border-white/20 bg-emerald-600'
          }`}>
            <div className="container mx-auto px-4 py-3">
              <div className="grid grid-cols-2 gap-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                        isScrolled 
                          ? 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600' 
                          : 'text-white hover:bg-white/20'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
              
              {/* Mobile User Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <div className="flex items-center justify-around">
                  <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-xs">Cart ({cartItemsCount})</span>
                    </Button>
                  </Link>
                  <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">Wishlist</span>
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="text-xs">Profile</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>
      
      {/* Overlay for mobile menu and user menu */}
      {(isMobileMenuOpen || isUserMenuOpen) && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden" 
          onClick={() => {
            setIsMobileMenuOpen(false)
            setIsUserMenuOpen(false)
          }} 
        />
      )}
    </>
  )
}