"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Settings,
  Crown,
  Users,
  Home,
  Truck,
  Star,
  MessageSquare,
  Plus,
  Menu
} from "lucide-react"
import { useVendorAuth } from "@/context/vendor-auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Primary navigation - only essential items
const primaryNavigation = [
  {
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: Home,
    description: "Business overview"
  },
  {
    name: "Analytics",
    href: "/vendor/analytics",
    icon: BarChart3,
    description: "Sales insights"
  }
]

export function VendorNavbar() {
  const pathname = usePathname()
  const { vendor } = useVendorAuth()

  const isActive = (href: string) => pathname === href

  return (
    <div className="bg-white border-b border-green-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/vendor/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">CleanCart Vendor</h1>
                <p className="text-xs text-gray-600">{vendor?.businessName || 'Vendor Dashboard'}</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center mx-4">
            {/* Primary Navigation - Only Dashboard and Analytics */}
            {primaryNavigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 ${
                      active 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Quick Actions - Right Side */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <Link href="/vendor/products/add">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link href="/vendor/products/add">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {primaryNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        href={item.href} 
                        className={`flex items-center gap-2 cursor-pointer ${
                          active ? 'bg-green-50 text-green-700' : ''
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}