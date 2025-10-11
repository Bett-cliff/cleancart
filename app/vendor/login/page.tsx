// app/vendor/login/page.tsx
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
import { useVendorAuthContext } from "@/contexts/vendor-auth-context"

export default function VendorLoginPage() {
  const { login, isLoading } = useVendorAuthContext()
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${result.vendor?.businessName || 'Vendor'}!`,
      })
      
      // Add a small delay to ensure state is updated, then hard redirect
      console.log('🚀 Login successful, forcing redirect to dashboard...')
      setTimeout(() => {
        window.location.href = '/vendor/dashboard' // Hard redirect
      }, 100)
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid email or password",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
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
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
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
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
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
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
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
                  className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  Apply here
                </Link>
              </p>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Building className="w-5 h-5 text-green-500 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
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