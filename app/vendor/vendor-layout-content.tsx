// app/vendor/vendor-layout-content.tsx
"use client"

import { useVendorAuthContext } from "@/contexts/vendor-auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { VendorNavbar } from "@/components/vendor-navbar"

// Pages that don't require authentication
const publicPages = ['/vendor/login', '/vendor/register']

export function VendorLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useVendorAuthContext() // Using context now!
  
  // ADDED: Debug log to see context state
  console.log('🔍 VendorLayoutContent Context State:', { isAuthenticated, isLoading })

  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [hasCheckedRedirect, setHasCheckedRedirect] = useState(false)

  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    console.log('🔍 VendorLayout checking:', { 
      isAuthenticated, 
      isLoading, 
      pathname, 
      isPublicPage 
    })

    // Don't do anything while still loading
    if (isLoading) {
      console.log('⏳ VendorLayout: Still loading, waiting...')
      return
    }

    // Prevent multiple redirects
    if (hasCheckedRedirect) {
      console.log('⏭️ VendorLayout: Already checked redirects, skipping...')
      return
    }

    // If authenticated and trying to access public pages, redirect to dashboard
    if (isAuthenticated && isPublicPage) {
      console.log('✅ VendorLayout: Authenticated on public page, redirecting to dashboard')
      setHasCheckedRedirect(true)
      router.push('/vendor/dashboard')
      return
    }

    // If not authenticated and trying to access protected pages, redirect to login
    if (!isAuthenticated && !isPublicPage) {
      console.log('❌ VendorLayout: Not authenticated, redirecting to login')
      setHasCheckedRedirect(true)
      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive",
      })
      router.push('/vendor/login')
      return
    }

    console.log('👍 VendorLayout: All checks passed, rendering content')
    setHasCheckedRedirect(true)
  }, [isAuthenticated, isLoading, router, pathname, isPublicPage, toast, hasCheckedRedirect])

  // Reset redirect check when pathname changes
  useEffect(() => {
    setHasCheckedRedirect(false)
  }, [pathname])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">CC</span>
          </div>
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Allow public pages to render without authentication
  if (isPublicPage && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {children}
      </div>
    )
  }

  // Block protected pages if not authenticated
  if (!isPublicPage && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Render protected pages with navbar if authenticated OR public pages if not authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Navbar only shows on authenticated pages */}
      {!isPublicPage && isAuthenticated && <VendorNavbar />}
      
      {/* Main content */}
      <main className={!isPublicPage ? "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8" : ""}>
        {children}
      </main>
    </div>
  )
}