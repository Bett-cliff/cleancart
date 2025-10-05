"use client"

import { useVendorAuth } from "@/hooks/use-vendor-auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

// Pages that don't require authentication
const publicPages = ['/vendor/login', '/vendor/register']

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = useVendorAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    // If already authenticated and trying to access login/register, redirect to dashboard
    if (!auth.isLoading && auth.isAuthenticated && isPublicPage) {
      console.log('Already authenticated, redirecting to dashboard from:', pathname)
      router.push('/vendor/dashboard')
      return
    }

    // Only redirect to login if not on a public page and not authenticated
    if (!auth.isLoading && !auth.isAuthenticated && !isPublicPage) {
      console.log('Not authenticated, redirecting to login from:', pathname)
      router.push('/vendor/login')
      return
    }
  }, [auth.isAuthenticated, auth.isLoading, router, pathname, isPublicPage])

  // Show loading state
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Allow public pages to render without authentication
  if (isPublicPage) {
    return <>{children}</>
  }

  // Block protected pages if not authenticated
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Render protected pages if authenticated
  return <>{children}</>
}