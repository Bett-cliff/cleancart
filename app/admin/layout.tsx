"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

// Simple admin check - in real app, you'd have proper admin authentication
const isAdmin = () => {
  return localStorage.getItem('isAdmin') === 'true' || 
         process.env.NODE_ENV === 'development' // Auto-admin in development
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = () => {
      const adminStatus = isAdmin()
      setIsAdminUser(adminStatus)
      setIsLoading(false)

      if (!adminStatus) {
        // For demo purposes, auto-set as admin
        localStorage.setItem('isAdmin', 'true')
        setIsAdminUser(true)
        // In real app, you'd redirect to login:
        // router.push('/admin/login')
      }
    }

    checkAdmin()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Vendor Management</p>
            </div>
            <div className="flex gap-4">
              <a href="/admin" className="text-sm font-medium hover:text-primary">
                Dashboard
              </a>
              <a href="/admin/vendors" className="text-sm font-medium hover:text-primary">
                Vendors
              </a>
              <a href="/" className="text-sm font-medium hover:text-primary">
                Back to Site
              </a>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}