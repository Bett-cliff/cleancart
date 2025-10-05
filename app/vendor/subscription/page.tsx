"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  CheckCircle2,
  Crown,
  Star,
  Zap,
  CreditCard,
  Calendar,
  Download,
  ArrowRight,
  CrownIcon as CrownIconLucide,
  Sparkles,
  Shield,
  BarChart3,
  Users,
  Package,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

// Mock subscription data
const mockSubscriptionData = {
  currentPlan: {
    id: 'pro',
    name: 'Pro Plan',
    price: 2500,
    billingCycle: 'monthly',
    status: 'active',
    currentPeriodStart: '2024-06-01',
    currentPeriodEnd: '2024-07-01',
    features: [
      'Up to 100 products',
      'Advanced analytics',
      'Priority support',
      'Marketing tools',
      'Bulk upload'
    ],
    limits: {
      products: 100,
      storage: '10GB',
      staffAccounts: 3,
      analytics: true,
      support: 'priority'
    }
  },
  plans: [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      description: 'Perfect for getting started',
      popular: false,
      features: [
        'Up to 10 products',
        'Basic storefront',
        'M-PESA payments',
        'Email support',
        'Basic analytics'
      ],
      limits: {
        products: 10,
        storage: '1GB',
        staffAccounts: 1,
        analytics: false,
        support: 'email'
      },
      buttonText: 'Current Plan',
      highlighted: false
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 1000,
      description: 'For growing businesses',
      popular: false,
      features: [
        'Up to 50 products',
        'Advanced storefront',
        'Bulk product upload',
        'Email & chat support',
        'Sales analytics'
      ],
      limits: {
        products: 50,
        storage: '5GB',
        staffAccounts: 2,
        analytics: true,
        support: 'chat'
      },
      buttonText: 'Upgrade',
      highlighted: false
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 2500,
      description: 'Most popular for serious sellers',
      popular: true,
      features: [
        'Up to 100 products',
        'Advanced analytics',
        'Priority support',
        'Marketing tools',
        'Bulk upload',
        'API access'
      ],
      limits: {
        products: 100,
        storage: '10GB',
        staffAccounts: 3,
        analytics: true,
        support: 'priority'
      },
      buttonText: 'Current Plan',
      highlighted: true
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 5000,
      description: 'Everything you need to scale',
      popular: false,
      features: [
        'Unlimited products',
        'Advanced analytics & reports',
        '24/7 phone support',
        'Custom branding',
        'API access',
        'Dedicated account manager'
      ],
      limits: {
        products: 9999,
        storage: '50GB',
        staffAccounts: 10,
        analytics: true,
        support: 'phone'
      },
      buttonText: 'Upgrade',
      highlighted: false
    }
  ],
  billingHistory: [
    {
      id: 'INV-001',
      date: '2024-06-01',
      plan: 'Pro Plan',
      amount: 2500,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'INV-002',
      date: '2024-05-01',
      plan: 'Pro Plan',
      amount: 2500,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'INV-003',
      date: '2024-04-01',
      plan: 'Basic Plan',
      amount: 1000,
      status: 'paid',
      downloadUrl: '#'
    }
  ],
  usage: {
    products: {
      used: 24,
      limit: 100,
      percentage: 24
    },
    storage: {
      used: 2.1,
      limit: 10,
      percentage: 21
    },
    staffAccounts: {
      used: 1,
      limit: 3,
      percentage: 33
    }
  }
}

export default function VendorSubscriptionPage() {
  const { toast } = useToast()
  const [subscription, setSubscription] = useState(mockSubscriptionData)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async (planId: string) => {
    if (planId === subscription.currentPlan.id) {
      toast({
        title: "Already on this plan",
        description: "You are already subscribed to this plan.",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const selectedPlan = subscription.plans.find(p => p.id === planId)
      setSubscription(prev => ({
        ...prev,
        currentPlan: {
          ...selectedPlan!,
          status: 'active',
          currentPeriodStart: new Date().toISOString().split('T')[0],
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }))

      toast({
        title: "Plan Updated!",
        description: `You have successfully upgraded to the ${selectedPlan?.name}.`,
      })
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.")) {
      return
    }

    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubscription(prev => ({
        ...prev,
        currentPlan: {
          ...prev.currentPlan,
          status: 'cancelled'
        }
      }))

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of the billing period.",
      })
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilRenewal = () => {
    const endDate = new Date(subscription.currentPlan.currentPeriodEnd)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
            <p className="text-muted-foreground">
              Manage your subscription plan and billing
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Invoices
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan Card */}
            <Card className="relative">
              {subscription.currentPlan.status === 'active' && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Active Plan
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {subscription.currentPlan.name}
                  {subscription.currentPlan.popular && (
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  {subscription.currentPlan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {/* Plan Details */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        KSh {subscription.currentPlan.price.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Billed {subscription.currentPlan.billingCycle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Renews in {getDaysUntilRenewal()} days</p>
                      <p className="text-sm text-muted-foreground">
                        Next billing: {formatDate(subscription.currentPlan.currentPeriodEnd)}
                      </p>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {subscription.usage.products.used}/{subscription.usage.products.limit}
                      </p>
                      <p className="text-sm text-muted-foreground">Products</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${subscription.usage.products.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {subscription.usage.storage.used}GB/{subscription.usage.storage.limit}GB
                      </p>
                      <p className="text-sm text-muted-foreground">Storage</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${subscription.usage.storage.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {subscription.usage.staffAccounts.used}/{subscription.usage.staffAccounts.limit}
                      </p>
                      <p className="text-sm text-muted-foreground">Staff Accounts</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${subscription.usage.staffAccounts.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isProcessing || subscription.currentPlan.id === 'free'}
                    >
                      Cancel Subscription
                    </Button>
                    <Button variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Update Payment Method
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Plans */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {subscription.plans
                  .filter(plan => plan.id !== subscription.currentPlan.id)
                  .map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative hover:shadow-lg transition-shadow ${
                      plan.highlighted ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-yellow-500 text-yellow-950 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                        {plan.id === 'premium' && <Crown className="w-5 h-5 text-yellow-500" />}
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">
                            KSh {plan.price.toLocaleString()}
                            <span className="text-sm font-normal text-muted-foreground">/month</span>
                          </p>
                        </div>

                        <div className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button 
                          className="w-full"
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isProcessing}
                          variant={plan.highlighted ? "default" : "outline"}
                        >
                          {plan.buttonText}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  Your recent invoices and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscription.billingHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{invoice.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(invoice.date)} • {invoice.plan}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">KSh {invoice.amount.toLocaleString()}</p>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Invoices
                </Button>
              </CardContent>
            </Card>

            {/* Plan Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Comparison</CardTitle>
                <CardDescription>
                  Compare features across all plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Products</span>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">10</span>
                      <span className="text-muted-foreground">50</span>
                      <span className="font-bold">100</span>
                      <span className="text-primary">Unlimited</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storage</span>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">1GB</span>
                      <span className="text-muted-foreground">5GB</span>
                      <span className="font-bold">10GB</span>
                      <span className="text-primary">50GB</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Support</span>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-muted-foreground">Chat</span>
                      <span className="font-bold">Priority</span>
                      <span className="text-primary">24/7 Phone</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Analytics</span>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Basic</span>
                      <span className="text-muted-foreground">Standard</span>
                      <span className="font-bold">Advanced</span>
                      <span className="text-primary">Premium</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Usage Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold">CleanCart</span>
              </div>
              <p className="text-muted-foreground">Kenya's premier eco-friendly cleaning supplies marketplace</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Household Cleaners</div>
                <div>Industrial Equipment</div>
                <div>Eco-Friendly Products</div>
                <div>Waste Management</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Vendors</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Become a Vendor</div>
                <div>Vendor Dashboard</div>
                <div>Pricing Plans</div>
                <div>Support</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>About Us</div>
                <div>Contact</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CleanCart. All rights reserved. Built for a cleaner Kenya.</p>
          </div>
        </div>
      </footer>

      {/* Floating Help Desk Widget */}
      <HelpDesk />
    </div>
  )
}