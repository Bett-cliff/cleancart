"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('vendorToken')
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to access this page",
          variant: "destructive",
        })
        router.push('/vendor/login')
        return
      }

      try {
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/auth/vendor/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Token verification failed')
        }
        
        // Token is valid, allow access
      } catch (error) {
        console.error('Auth verification failed:', error)
        localStorage.removeItem('vendorToken')
        localStorage.removeItem('vendorData')
        
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive",
        })
        router.push('/vendor/login')
      }
    }

    checkAuth()
  }, [router, toast])

  // Show loading while checking auth
  const token = localStorage.getItem('vendorToken')
  if (!token) {
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

  return <>{children}</>
}