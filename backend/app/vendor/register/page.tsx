"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Building, Phone, MapPin, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function VendorRegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    phone: "",
    address: "",
    description: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextareaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      console.log('📝 Calling vendor registration API...');
      
      const response = await fetch('http://localhost:5000/api/auth/vendor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          email: formData.businessEmail,
          phone: formData.phone,
          address: formData.address,
          businessDescription: formData.description,
          password: formData.password,
          businessType: 'cleaning'
        }),
      })

      const result = await response.json()
      
      if (response.ok) {
        console.log('✅ Vendor registered successfully:', result)
        toast({
          title: "Application Submitted Successfully!",
          description: "We'll review your application and contact you soon. You'll receive an email when your account is approved.",
        })
        
        // Reset form
        setFormData({
          businessName: "",
          businessEmail: "",
          phone: "",
          address: "",
          description: "",
          password: "",
          confirmPassword: ""
        })
        
        setTimeout(() => {
          router.push("/vendor/login")
        }, 3000)
      } else {
        console.error('❌ Registration failed:', result.error)
        toast({
          title: "Registration Failed",
          description: result.error || "An error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Registration error:', error)
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
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CC</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">CleanCart</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Become a Vendor</h1>
          <p className="text-gray-600">Join Kenya's premier eco-friendly marketplace</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between">
              <Link href="/vendor/login">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Button>
              </Link>
              <div className="flex-1 text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Vendor Application</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Fill out your business information to get started
                </CardDescription>
              </div>
              <div className="w-20"></div> {/* Spacer for balance */}
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                    Business Name *
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessName"
                      name="businessName"
                      placeholder="Your business name"
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Business Email */}
                <div className="space-y-2">
                  <Label htmlFor="businessEmail" className="text-sm font-medium text-gray-700">
                    Business Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      placeholder="business@email.com"
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+254 700 000000"
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Business Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Business Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      placeholder="Nairobi, Kenya"
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your business and the cleaning products/services you offer..."
                  rows={3}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Create a password (min. 6 characters)"
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
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
                    Submitting Application...
                  </div>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link 
                  href="/vendor/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">i</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your application will be reviewed by our team. 
                    You'll receive an email notification once your vendor account is approved. 
                    This process usually takes 1-2 business days.
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