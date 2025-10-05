"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
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
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

// Mock payout data
const mockPayoutData = {
  overview: {
    balance: 45250,
    pending: 12800,
    totalEarnings: 245800,
    thisMonth: 67800,
    lastMonth: 58900,
    commissionRate: 8.5
  },
  transactions: [
    {
      id: 'TXN-001',
      type: 'payout',
      amount: 25000,
      status: 'completed',
      method: 'mpesa',
      date: '2024-06-15T10:30:00Z',
      description: 'Weekly payout',
      reference: 'MPESA-789456'
    },
    {
      id: 'TXN-002',
      type: 'sale',
      amount: 45000,
      status: 'completed',
      method: 'mpesa',
      date: '2024-06-14T14:20:00Z',
      description: 'Pressure Washer Sale',
      reference: 'ORD-002'
    },
    {
      id: 'TXN-003',
      type: 'sale',
      amount: 2450,
      status: 'completed',
      method: 'card',
      date: '2024-06-14T10:15:00Z',
      description: 'Cleaning Products Sale',
      reference: 'ORD-001'
    },
    {
      id: 'TXN-004',
      type: 'payout',
      amount: 32000,
      status: 'processing',
      method: 'mpesa',
      date: '2024-06-10T09:00:00Z',
      description: 'Weekly payout',
      reference: 'MPESA-123456'
    },
    {
      id: 'TXN-005',
      type: 'sale',
      amount: 3500,
      status: 'completed',
      method: 'mpesa',
      date: '2024-06-08T16:45:00Z',
      description: 'Glass Cleaner Sale',
      reference: 'ORD-003'
    },
    {
      id: 'TXN-006',
      type: 'refund',
      amount: -850,
      status: 'completed',
      method: 'mpesa',
      date: '2024-06-07T11:20:00Z',
      description: 'Order Refund',
      reference: 'REF-001'
    }
  ],
  payoutSchedule: {
    frequency: 'weekly',
    nextPayout: '2024-06-22',
    minimumPayout: 1000,
    method: 'mpesa',
    mpesaTill: '123456'
  },
  earningsChart: [
    { month: 'Jan', earnings: 45000, payouts: 40000 },
    { month: 'Feb', earnings: 52000, payouts: 48000 },
    { month: 'Mar', earnings: 48000, payouts: 45000 },
    { month: 'Apr', earnings: 61000, payouts: 58000 },
    { month: 'May', earnings: 58000, payouts: 52000 },
    { month: 'Jun', earnings: 67800, payouts: 57000 },
  ]
}

export default function VendorPayoutsPage() {
  const { toast } = useToast()
  const [payoutData, setPayoutData] = useState(mockPayoutData)
  const [timeRange, setTimeRange] = useState('30d')
  const [isRequestingPayout, setIsRequestingPayout] = useState(false)

  const stats = [
    {
      title: "Available Balance",
      value: `KSh ${payoutData.overview.balance.toLocaleString()}`,
      description: "Ready for payout",
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Pending Balance",
      value: `KSh ${payoutData.overview.pending.toLocaleString()}`,
      description: "Clearing in 3-5 days",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "This Month",
      value: `KSh ${payoutData.overview.thisMonth.toLocaleString()}`,
      description: "June 2024 earnings",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Earnings",
      value: `KSh ${payoutData.overview.totalEarnings.toLocaleString()}`,
      description: "All-time revenue",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Completed', variant: 'default' as const, icon: CheckCircle2 },
      processing: { label: 'Processing', variant: 'secondary' as const, icon: Clock },
      failed: { label: 'Failed', variant: 'destructive' as const, icon: XCircle },
      pending: { label: 'Pending', variant: 'outline' as const, icon: Clock },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, icon: Clock }
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        <IconComponent className="w-3 h-3" />
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
        description: `Minimum payout amount is KSh ${payoutData.payoutSchedule.minimumPayout.toLocaleString()}`,
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
        description: `KSh ${payoutData.overview.balance.toLocaleString()} is being processed to your M-PESA.`,
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
      <Navbar />

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
                        KSh {payoutData.overview.balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Minimum: KSh 1,000</p>
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
                      Minimum payout amount is KSh {payoutData.payoutSchedule.minimumPayout.toLocaleString()}
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
                          title={`Earnings: KSh ${month.earnings.toLocaleString()}`}
                        />
                        <div 
                          className="w-3/4 bg-blue-500 rounded-t transition-all hover:bg-blue-400 cursor-pointer"
                          style={{ 
                            height: `${(month.payouts / 80000) * 100}%`,
                            minHeight: '20px'
                          }}
                          title={`Payouts: KSh ${month.payouts.toLocaleString()}`}
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
                          {transaction.amount > 0 ? '+' : ''}KSh {Math.abs(transaction.amount).toLocaleString()}
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
                  <span className="font-medium">KSh {payoutData.payoutSchedule.minimumPayout.toLocaleString()}</span>
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