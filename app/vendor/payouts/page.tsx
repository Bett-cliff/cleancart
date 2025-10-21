"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  RefreshCw,
  Banknote,
  Smartphone,
  Home,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Megaphone,
  Crown,
  MessageSquare,
  Settings,
  Truck,
  Star
} from "lucide-react"
import { useState } from "react"

// Empty payout data structure
const emptyPayoutData = {
  overview: {
    balance: 0,
    pending: 0,
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    commissionRate: 0
  },
  transactions: [],
  payoutSchedule: {
    frequency: 'weekly',
    nextPayout: null,
    minimumPayout: 1000,
    method: 'mpesa',
    mpesaTill: null
  },
  earningsChart: []
}

// All the vendor sections for the sub-navbar
const vendorSections = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    href: "/vendor/dashboard",
    description: "Business overview"
  },
  {
    id: "products",
    name: "Products",
    icon: Package,
    href: "/vendor/products",
    description: "Manage your products"
  },
  {
    id: "orders",
    name: "Orders",
    icon: ShoppingCart,
    href: "/vendor/orders",
    description: "Customer orders"
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: Warehouse,
    href: "/vendor/inventory",
    description: "Stock management"
  },
  {
    id: "customers",
    name: "Customers",
    icon: Users,
    href: "/vendor/customers",
    description: "Customer database"
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: Megaphone,
    href: "/vendor/marketing",
    description: "Promotions & campaigns"
  },
  {
    id: "payouts",
    name: "Payouts",
    icon: DollarSign,
    href: "/vendor/payouts",
    description: "Earnings & payments"
  },
  {
    id: "shipping",
    name: "Shipping",
    icon: Truck,
    href: "/vendor/shipping",
    description: "Delivery & logistics"
  },
  {
    id: "reviews",
    name: "Reviews",
    icon: Star,
    href: "/vendor/reviews",
    description: "Customer feedback"
  },
  {
    id: "subscription",
    name: "Subscription",
    icon: Crown,
    href: "/vendor/subscription",
    description: "Plan & billing"
  },
  {
    id: "support",
    name: "Support",
    icon: MessageSquare,
    href: "/vendor/support",
    description: "Help & support"
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    href: "/vendor/settings",
    description: "Account settings"
  }
]

// Simple bar chart component for revenue visualization
const RevenueChart = ({ data }: { data: { month: string; revenue: number }[] }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <div className="w-full h-48 flex items-end justify-between gap-2 pt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-muted-foreground mb-1">{item.month}</div>
          <div
            className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-sm transition-all hover:from-blue-400 hover:to-blue-500 cursor-pointer"
            style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
            title={`${item.month}: KES ${item.revenue.toLocaleString()}`}
          />
        </div>
      ))}
    </div>
  );
};

// Progress bar for stock levels
const StockProgress = ({ stock, lowStockThreshold = 10 }: { stock: number; lowStockThreshold?: number }) => {
  const percentage = Math.min((stock / 50) * 100, 100); // Assuming 50 is max stock for visualization
  const isLow = stock <= lowStockThreshold;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${
          isLow ? 'bg-red-500' : 'bg-green-500'
        } transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default function VendorPayoutsPage() {
  const { toast } = useToast()
  const [payoutData, setPayoutData] = useState(emptyPayoutData)
  const [timeRange, setTimeRange] = useState('30d')
  const [isRequestingPayout, setIsRequestingPayout] = useState(false)

  const stats = [
    {
      title: "Available Balance",
      value: `KES ${payoutData.overview.balance.toLocaleString()}`,
      description: "Ready for payout",
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Pending Balance",
      value: `KES ${payoutData.overview.pending.toLocaleString()}`,
      description: "Clearing in 3-5 days",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "This Month",
      value: `KES ${payoutData.overview.thisMonth.toLocaleString()}`,
      description: "June 2024 earnings",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Earnings",
      value: `KES ${payoutData.overview.totalEarnings.toLocaleString()}`,
      description: "All-time revenue",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Completed', variant: 'default' as const, icon: CheckCircle2, color: "text-green-600" },
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock, color: "text-yellow-600" },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle, color: "text-red-600" }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "outline" as const, color: "text-gray-600" }
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        <IconComponent className={`w-3 h-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getTransactionIcon = (type: string) => {
    const iconConfig = {
      payout: { icon: ArrowUpRight, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      sale: { icon: ArrowDownLeft, color: 'text-green-600', bgColor: 'bg-green-50' },
      refund: { icon: RefreshCw, color: 'text-red-600', bgColor: 'bg-red-50' }
    }
    const config = iconConfig[type as keyof typeof iconConfig] || { icon: DollarSign, color: 'text-gray-600', bgColor: 'bg-gray-50' }
    const IconComponent = config.icon
    return (
      <div className={`p-2 rounded-lg ${config.bgColor}`}>
        <IconComponent className={`w-4 h-4 ${config.color}`} />
      </div>
    )
  }

  const getMethodBadge = (method: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {method === 'mpesa' ? (
          <span className="flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            M-PESA
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Card
          </span>
        )}
      </Badge>
    )
  }

  const handleRequestPayout = async () => {
    if (payoutData.overview.balance < payoutData.payoutSchedule.minimumPayout) {
      toast({
        title: "Minimum Payout Not Met",
        description: `Minimum payout amount is KES ${payoutData.payoutSchedule.minimumPayout.toLocaleString()}`,
        variant: "destructive",
      })
      return
    }

    setIsRequestingPayout(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Update balance and add transaction
      const newTransaction = {
        id: `TXN-${Date.now()}`,
        type: 'payout',
        amount: -payoutData.overview.balance,
        status: 'processing',
        method: 'mpesa',
        date: new Date().toISOString(),
        description: 'Manual payout request',
        reference: `MPESA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }

      setPayoutData(prev => ({
        ...prev,
        overview: {
          ...prev.overview,
          balance: 0,
          pending: prev.overview.pending + prev.overview.balance
        },
        transactions: [newTransaction, ...prev.transactions]
      }))

      toast({
        title: "Payout Requested!",
        description: `KES ${payoutData.overview.balance.toLocaleString()} is being processed to your M-PESA.`,
      })
    } catch (error) {
      toast({
        title: "Payout Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsRequestingPayout(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredTransactions = payoutData.transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    const now = new Date()
    let daysAgo = 30
    
    switch (timeRange) {
      case '7d': daysAgo = 7; break
      case '30d': daysAgo = 30; break
      case '90d': daysAgo = 90; break
      case '1y': daysAgo = 365; break
    }
    
    const startDate = new Date(now.setDate(now.getDate() - daysAgo))
    return transactionDate >= startDate
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Payment & Payouts</h1>
            <p className="text-muted-foreground">
              Manage your earnings and payment methods
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Vendor Sections Sub-Navbar - ADDED THIS SECTION */}
        <div className="bg-white rounded-lg border shadow-sm mb-8">
          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-medium text-gray-900">Quick Access</h3>
            <p className="text-xs text-gray-600">Navigate to different vendor sections</p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {vendorSections.map((section) => {
                const Icon = section.icon
                return (
                  <a key={section.id} href={section.href}>
                    <Button
                      variant="outline"
                      className="w-full h-auto p-3 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-green-600" />
                      <span className="text-xs font-medium text-gray-900">{section.name}</span>
                    </Button>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payout Action Card */}
            <Card>
              <CardHeader>
                <CardTitle>Request Payout</CardTitle>
                <CardDescription>
                  Transfer your available balance to your M-PESA account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div>
                      <p className="font-semibold">Available for Payout</p>
                      <p className="text-2xl font-bold text-primary">
                        KES {payoutData.overview.balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Minimum: KES 1,000</p>
                      <p className="text-sm text-muted-foreground">Next auto-payout: {formatDate(payoutData.payoutSchedule.nextPayout)}</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <span>Payout Method</span>
                      <Badge variant="default" className="flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        M-PESA: {payoutData.payoutSchedule.mpesaTill}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Commission Rate</span>
                      <span className="font-semibold">{payoutData.overview.commissionRate}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Processing Time</span>
                      <span className="text-sm text-muted-foreground">1-2 business days</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleRequestPayout}
                    disabled={isRequestingPayout || payoutData.overview.balance < payoutData.payoutSchedule.minimumPayout}
                    className="w-full"
                    size="lg"
                  >
                    {isRequestingPayout ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing Payout...
                      </>
                    ) : (
                      <>
                        <Banknote className="w-4 h-4 mr-2" />
                        Request Payout
                      </>
                    )}
                  </Button>

                  {payoutData.overview.balance < payoutData.payoutSchedule.minimumPayout && (
                    <p className="text-sm text-center text-muted-foreground">
                      Minimum payout amount is KES {payoutData.payoutSchedule.minimumPayout.toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Earnings Overview</CardTitle>
                    <CardDescription>
                      Your sales and payout trends over time
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded-lg px-3 py-1 text-sm"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {payoutData.earningsChart.map((month) => (
                    <div key={month.month} className="flex flex-col items-center flex-1">
                      <div className="flex items-end gap-1 w-full justify-center">
                        <div 
                          className="w-3/4 bg-primary rounded-t transition-all hover:bg-primary/80 cursor-pointer"
                          style={{ 
                            height: `${(month.earnings / 80000) * 100}%`,
                            minHeight: '20px'
                          }}
                          title={`Earnings: KES ${month.earnings.toLocaleString()}`}
                        />
                        <div 
                          className="w-3/4 bg-blue-500 rounded-t transition-all hover:bg-blue-400 cursor-pointer"
                          style={{ 
                            height: `${(month.payouts / 80000) * 100}%`,
                            minHeight: '20px'
                          }}
                          title={`Payouts: KES ${month.payouts.toLocaleString()}`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground mt-2">
                        {month.month}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span className="text-sm text-muted-foreground">Earnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-muted-foreground">Payouts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Recent sales, payouts, and refunds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(transaction.date)} • {formatTime(transaction.date)}
                            </span>
                            {getMethodBadge(transaction.method)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Ref: {transaction.reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}KES {Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions found for the selected period</p>
                  </div>
                )}

                <Button variant="outline" className="w-full mt-4">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payout Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Payout Schedule</CardTitle>
                <CardDescription>
                  How and when you get paid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Frequency</span>
                  <Badge variant="outline" className="capitalize">
                    {payoutData.payoutSchedule.frequency}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next Payout</span>
                  <span className="font-medium">{formatDate(payoutData.payoutSchedule.nextPayout)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Minimum Amount</span>
                  <span className="font-medium">KES {payoutData.payoutSchedule.minimumPayout.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Processing Time</span>
                  <span className="text-sm text-muted-foreground">1-2 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  How customers pay you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Smartphone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">M-PESA</p>
                      <p className="text-xs text-muted-foreground">Primary method</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-xs text-muted-foreground">Visa, MasterCard</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <Button variant="outline" className="w-full">
                  Manage Payment Methods
                </Button>
              </CardContent>
            </Card>

            {/* Commission Info */}
            <Card>
              <CardHeader>
                <CardTitle>Commission & Fees</CardTitle>
                <CardDescription>
                  Understand your earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Platform Commission</span>
                  <span className="font-medium">{payoutData.overview.commissionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>M-PESA Payout Fee</span>
                  <span className="font-medium">1.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank Transfer Fee</span>
                  <span className="font-medium">2%</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Your Earnings</span>
                    <span>~96.5% of sales</span>
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
                  <Eye className="w-4 h-4 mr-2" />
                  View Payout Policy
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Tax Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Update Bank Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}