"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, ArrowLeft, Building } from "lucide-react"
import Link from "next/link"

export default function VendorLoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('🔐 Calling vendor login API...');
      
      const response = await fetch('http://localhost:5000/api/auth/vendor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      const result = await response.json()
      
      if (response.ok) {
        console.log('✅ Vendor login successful:', result)
        
        // Store token and vendor data in localStorage
        if (result.token) {
          localStorage.setItem('vendorToken', result.token)
          localStorage.setItem('vendorData', JSON.stringify(result.vendor))
        }

        toast({
          title: "Login Successful!",
          description: `Welcome back, ${result.vendor.businessName || 'Vendor'}!`,
        })
        
        // Redirect to vendor dashboard
        setTimeout(() => {
          router.push("/vendor/dashboard")
        }, 1000)
      } else {
        console.error('❌ Login failed:', result.error)
        toast({
          title: "Login Failed",
          description: result.error || "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      toast({
        title: "Connection Error",
        description: "Cannot connect to server. Please check if the backend is running and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CC</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">CleanCart</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Portal</h1>
          <p className="text-gray-600">Sign in to your vendor account</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back Home
                </Button>
              </Link>
              <div className="flex-1 text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Vendor Login</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Access your vendor dashboard
                </CardDescription>
              </div>
              <div className="w-20"></div> {/* Spacer for balance */}
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Business Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="business@email.com"
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>

            {/* Registration Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have a vendor account?{" "}
                <Link 
                  href="/vendor/register" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Apply here
                </Link>
              </p>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Building className="w-5 h-5 text-blue-500 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Only approved vendors can access the dashboard. 
                    If your account is pending approval, you'll be able to login once approved.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}