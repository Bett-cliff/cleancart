// components/navbar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, Menu, Store, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useVendorAuth } from "@/hooks/use-vendor-auth"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout, vendor } = useVendorAuth()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    // Optional: redirect to home page after logout
    window.location.href = '/'
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo skeleton */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-bold">CleanCart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            {/* Admin Link */}
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search products..." className="pl-10 w-full" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Vendor Links - Now using real authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/vendor/dashboard">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Store className="w-4 h-4 mr-2" />
                    {vendor?.businessName || 'Vendor Dashboard'}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/vendor/register">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Become a Vendor
                  </Button>
                </Link>
                <Link href="/vendor/login">
                  <Button variant="ghost" size="sm">
                    Vendor Login
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Customer Actions */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                0
              </span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/marketplace" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/categories" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {/* Admin Link for Mobile */}
              <Link 
                href="/admin" 
                className="text-sm font-medium hover:text-primary transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="w-3 h-3 mr-2" />
                Admin Panel
              </Link>
              
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search products..." className="pl-10 w-full" />
              </div>

              {/* Mobile Vendor Actions - Now using real authentication */}
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Vendor Portal</h4>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link href="/vendor/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Store className="w-4 h-4 mr-2" />
                        {vendor?.businessName || 'Vendor Dashboard'}
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/vendor/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Become a Vendor
                      </Button>
                    </Link>
                    <Link href="/vendor/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Vendor Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Customer Actions */}
              <div className="flex space-x-2 pt-2 border-t">
                <Button variant="ghost" className="flex-1 relative">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    0
                  </span>
                </Button>
                <Button variant="ghost" className="flex-1">
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}