"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  HelpCircle,
  FileText,
  Video,
  Home,
  ShoppingCart,
  Warehouse,
  Megaphone,
  DollarSign,
  Truck,
  Star,
  Crown,
  Settings,
  Package
} from "lucide-react"

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
    icon: User,
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
    icon: MessageCircle,
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

// Empty support data - will be populated from API
// Empty support data structure
const emptySupportData = {
  tickets: [
    {
      id: "TKT-0012",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com"
      },
      subject: "Order not delivered",
      priority: "high",
      status: "open",
      category: "shipping",
      lastUpdate: "2024-01-20 14:30",
      assignedTo: "You",
      messages: 3
    },
    {
      id: "TKT-0011",
      customer: {
        name: "Mike Otieno",
        email: "mike.o@email.com"
      },
      subject: "Product damaged on arrival",
      priority: "medium",
      status: "in_progress",
      category: "returns",
      lastUpdate: "2024-01-19 11:15",
      assignedTo: "You",
      messages: 5
    },
    {
      id: "TKT-0010",
      customer: {
        name: "Grace Wambui",
        email: "grace.w@email.com"
      },
      subject: "Question about ingredients",
      priority: "low",
      status: "resolved",
      category: "product",
      lastUpdate: "2024-01-18 16:45",
      assignedTo: "Support Team",
      messages: 2
    },
    {
      id: "TKT-0009",
      customer: {
        name: "David Kimani",
        email: "david.k@email.com"
      },
      subject: "Payment issue",
      priority: "high",
      status: "open",
      category: "billing",
      lastUpdate: "2024-01-18 09:20",
      assignedTo: "You",
      messages: 1
    }
  ],
  knowledgeBase: [
    {
      id: 1,
      title: "How to track my order",
      category: "shipping",
      views: 245,
      helpful: 89
    },
    {
      id: 2,
      title: "Return and refund policy",
      category: "returns",
      views: 189,
      helpful: 67
    },
    {
      id: 3,
      title: "Product care instructions",
      category: "product",
      views: 156,
      helpful: 45
    },
    {
      id: 4,
      title: "Payment methods accepted",
      category: "billing",
      views: 98,
      helpful: 32
    }
  ]
}

const priorityConfig = {
  high: { label: "High", color: "bg-red-100 text-red-800 border-red-200" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  low: { label: "Low", color: "bg-green-100 text-green-800 border-green-200" }
}

const statusConfig = {
  open: { label: "Open", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800" },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-800" }
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("tickets")
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [supportData, setSupportData] = useState(emptySupportData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tabs = [
    { id: "tickets", label: "Support Tickets" },
    { id: "knowledge", label: "Knowledge Base" },
    { id: "resources", label: "Resources" }
  ]

  // Fetch support data
  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Get vendor token for authentication
        const token = typeof window !== 'undefined' ? localStorage.getItem('vendor_token') : null
        
        if (!token) {
          setError('No authentication token found')
          setSupportData(emptySupportData)
          return
        }

        const response = await fetch('/api/vendor/support', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch support data')
        }

        const result = await response.json()
        if (result.success && result.data) {
          setSupportData(result.data)
        } else {
          setSupportData(emptySupportData)
        }
      } catch (err) {
        console.error('Error fetching support data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setSupportData(emptySupportData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupportData()
  }, [])

  const statuses = ["all", "open", "in_progress", "resolved", "closed"]
  const priorities = ["all", "high", "medium", "low"]

  const filteredTickets = supportData.tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || ticket.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityBadge = (priority: string) => {
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-1">Help customers and manage support requests</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          onClick={() => setShowNewTicket(true)}
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      {/* Vendor Sections Sub-Navbar - Quick Access */}
      <div className="bg-white rounded-lg border shadow-sm">
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Response Time</p>
                <p className="text-2xl font-bold text-gray-900">2h 15m</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Support Tickets Tab */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tickets, customers, or subjects..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Status Filter */}
                <div className="sm:w-48">
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === "all" ? "All Status" : statusConfig[status as keyof typeof statusConfig]?.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="sm:w-48">
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority === "all" ? "All Priority" : priorityConfig[priority as keyof typeof priorityConfig]?.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>
                {filteredTickets.length} tickets found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>#{ticket.id}</span>
                          <span>•</span>
                          <span>{ticket.customer.name}</span>
                          <span>•</span>
                          <span>{ticket.category}</span>
                          <span>•</span>
                          <span>{ticket.messages} messages</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Last update: {ticket.lastUpdate} • Assigned to: {ticket.assignedTo}
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedStatus !== "all" || selectedPriority !== "all" 
                      ? "Try adjusting your search or filters"
                      : "No support tickets yet"
                    }
                  </p>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setShowNewTicket(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Ticket
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === "knowledge" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Help articles for common customer questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supportData.knowledgeBase.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="capitalize">{article.category}</span>
                            <span>•</span>
                            <span>{article.views} views</span>
                            <span>•</span>
                            <span>{article.helpful} found helpful</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Create Article */}
              <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Help Article</h3>
                <p className="text-gray-600 mb-4">
                  Add new articles to help customers find answers quickly
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Step-by-step guides for common tasks</p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-sm text-gray-600">Comprehensive guides and API docs</p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-sm text-gray-600">Frequently asked questions</p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600">support@cleancart.com</p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600">+254 700 123 456</p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">24/7 customer support</p>
          </Card>
        </div>
      )}
    </div>
  )
}