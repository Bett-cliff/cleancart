"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Building, Phone, MapPin, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useVendorStore } from "@/contexts/vendor-context"

export default function VendorRegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { addVendor, getVendorByEmail } = useVendorStore()
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

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Check if vendor already exists
    const existingVendor = getVendorByEmail(formData.businessEmail)
    if (existingVendor) {
      toast({
        title: "Email already registered",
        description: "This email is already associated with a vendor account.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Register the vendor
      addVendor({
        email: formData.businessEmail,
        businessName: formData.businessName,
        phone: formData.phone,
        address: formData.address,
        description: formData.description
      })

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and contact you soon. You'll receive an email when your account is approved.",
      })
      
      setTimeout(() => {
        router.push("/vendor/login")
      }, 2000)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={40} height={40} className="w-10 h-10" />
            <span className="text-2xl font-bold text-gray-900">CleanCart</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Become a Vendor</h1>
          <p className="text-gray-600">Join Kenya's premier eco-friendly marketplace</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link href="/vendor/login">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Button>
              </Link>
            </div>
            <CardTitle className="text-2xl">Vendor Application</CardTitle>
            <CardDescription>
              Fill out your business information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessName"
                      name="businessName"
                      placeholder="Your business name"
                      className="pl-10"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      placeholder="business@email.com"
                      className="pl-10"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+254 700 000000"
                      className="pl-10"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      placeholder="Nairobi, Kenya"
                      className="pl-10"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your business and products..."
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Application...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/vendor/login" className="text-blue-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}