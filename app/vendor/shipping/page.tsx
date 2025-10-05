"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  Truck,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  Navigation,
  Phone,
  Mail,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Shield,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock shipping data
const mockShippingData = {
  overview: {
    totalOrders: 156,
    pendingShipments: 12,
    inTransit: 8,
    delivered: 136,
    deliverySuccessRate: 94.2,
    averageDeliveryTime: "2.3 days"
  },
  shippingZones: [
    {
      id: 1,
      name: "Nairobi Central",
      regions: ["Nairobi CBD", "Westlands", "Kilimani", "Karen", "Langata"],
      deliveryTime: "1-2 days",
      cost: 200,
      freeShippingThreshold: 2000,
      status: "active"
    },
    {
      id: 2,
      name: "Nairobi Outer",
      regions: ["Embakasi", "Kasarani", "Ruiru", "Thika", "Juja"],
      deliveryTime: "2-3 days",
      cost: 350,
      freeShippingThreshold: 3000,
      status: "active"
    },
    {
      id: 3,
      name: "Coastal Region",
      regions: ["Mombasa", "Malindi", "Lamu", "Diani"],
      deliveryTime: "3-5 days",
      cost: 800,
      freeShippingThreshold: 5000,
      status: "active"
    },
    {
      id: 4,
      name: "Western Kenya",
      regions: ["Kisumu", "Kakamega", "Bungoma", "Busia"],
      deliveryTime: "4-6 days",
      cost: 600,
      freeShippingThreshold: 4000,
      status: "inactive"
    }
  ],
  courierPartners: [
    {
      id: 1,
      name: "Sendy",
      logo: "/sendy-logo.png",
      deliveryAreas: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
      costPerKg: 150,
      deliveryTime: "1-3 days",
      rating: 4.5,
      status: "active",
      integration: "connected"
    },
    {
      id: 2,
      name: "G4S Courier",
      logo: "/g4s-logo.png",
      deliveryAreas: ["Nationwide"],
      costPerKg: 200,
      deliveryTime: "2-5 days",
      rating: 4.2,
      status: "active",
      integration: "connected"
    },
    {
      id: 3,
      name: "DHL Kenya",
      logo: "/dhl-logo.png",
      deliveryAreas: ["Nationwide", "International"],
      costPerKg: 500,
      deliveryTime: "1-4 days",
      rating: 4.7,
      status: "active",
      integration: "pending"
    },
    {
      id: 4,
      name: "Posta Kenya",
      logo: "/posta-logo.png",
      deliveryAreas: ["Nationwide"],
      costPerKg: 100,
      deliveryTime: "5-10 days",
      rating: 3.8,
      status: "inactive",
      integration: "not-connected"
    }
  ],
  pendingShipments: [
    {
      id: "SH-001",
      orderId: "ORD-4567",
      customer: "John Kamau",
      destination: "Nairobi CBD",
      courier: "Sendy",
      status: "pending",
      items: 2,
      totalWeight: 2.5,
      shippingCost: 200,
      estimatedDelivery: "2024-06-16",
      createdAt: "2024-06-14"
    },
    {
      id: "SH-002",
      orderId: "ORD-4568",
      customer: "Mary Wanjiku",
      destination: "Kilimani",
      courier: "Sendy",
      status: "pending",
      items: 1,
      totalWeight: 1.2,
      shippingCost: 200,
      estimatedDelivery: "2024-06-16",
      createdAt: "2024-06-14"
    },
    {
      id: "SH-003",
      orderId: "ORD-4569",
      customer: "David Ochieng",
      destination: "Mombasa",
      courier: "G4S Courier",
      status: "pending",
      items: 3,
      totalWeight: 4.1,
      shippingCost: 800,
      estimatedDelivery: "2024-06-18",
      createdAt: "2024-06-14"
    }
  ],
  inTransitShipments: [
    {
      id: "SH-004",
      orderId: "ORD-4564",
      customer: "Sarah Mwangi",
      destination: "Westlands",
      courier: "Sendy",
      status: "in-transit",
      items: 1,
      totalWeight: 1.8,
      shippingCost: 200,
      estimatedDelivery: "2024-06-15",
      currentLocation: "Sorting Facility",
      trackingNumber: "TRK78901234",
      createdAt: "2024-06-13"
    },
    {
      id: "SH-005",
      orderId: "ORD-4565",
      customer: "James Mutiso",
      destination: "Ruiru",
      courier: "G4S Courier",
      status: "in-transit",
      items: 2,
      totalWeight: 3.2,
      shippingCost: 350,
      estimatedDelivery: "2024-06-16",
      currentLocation: "In Transit to Hub",
      trackingNumber: "TRK78901235",
      createdAt: "2024-06-13"
    }
  ],
  deliverySettings: {
    packaging: {
      boxSizes: ["Small", "Medium", "Large", "Custom"],
      defaultPackage: "Medium",
      fragileHandling: true,
      insurance: true
    },
    notifications: {
      emailUpdates: true,
      smsUpdates: false,
      customerNotifications: true,
      lowStockAlerts: true
    },
    returns: {
      returnPolicy: "30 days",
      returnShipping: "customer-pays",
      inspectionPeriod: "2 days",
      restockingFee: 10
    }
  }
}

export default function VendorShippingPage() {
  const { toast } = useToast()
  const [shippingData, setShippingData] = useState(mockShippingData)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const stats = [
    {
      title: "Total Orders",
      value: shippingData.overview.totalOrders.toString(),
      description: "All time shipments",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Shipments",
      value: shippingData.overview.pendingShipments.toString(),
      description: "Ready to ship",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "In Transit",
      value: shippingData.overview.inTransit.toString(),
      description: "On the way",
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Delivered",
      value: shippingData.overview.delivered.toString(),
      description: "Successful deliveries",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Success Rate",
      value: `${shippingData.overview.deliverySuccessRate}%`,
      description: "Delivery performance",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const shipmentStatuses = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in-transit", label: "In Transit" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
      "in-transit": { label: "In Transit", variant: "default" as const, icon: Truck },
      delivered: { label: "Delivered", variant: "default" as const, icon: CheckCircle2 },
      cancelled: { label: "Cancelled", variant: "destructive" as const, icon: XCircle }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "outline" as const, icon: Package }
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getIntegrationBadge = (integration: string) => {
    const integrationConfig = {
      connected: { label: "Connected", variant: "default" as const },
      pending: { label: "Pending", variant: "secondary" as const },
      "not-connected": { label: "Not Connected", variant: "outline" as const }
    }
    const config = integrationConfig[integration as keyof typeof integrationConfig] || { label: integration, variant: "outline" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleCreateShipping = () => {
    toast({
      title: "Create Shipping Label",
      description: "Opening shipping creation form...",
    })
  }

  const handleProcessShipment = (shipmentId: string) => {
    toast({
      title: "Shipment Processed",
      description: `Shipment ${shipmentId} is being prepared for pickup.`,
    })
  }

  const handleTrackShipment = (trackingNumber: string) => {
    toast({
      title: "Tracking Shipment",
      description: `Opening tracking for ${trackingNumber}...`,
    })
  }

  const handleUpdateZone = (zoneId: number, updates: any) => {
    setShippingData(prev => ({
      ...prev,
      shippingZones: prev.shippingZones.map(zone =>
        zone.id === zoneId ? { ...zone, ...updates } : zone
      )
    }))
    
    toast({
      title: "Zone Updated",
      description: "Shipping zone settings have been updated.",
    })
  }

  const handleToggleCourier = (courierId: number, status: string) => {
    setShippingData(prev => ({
      ...prev,
      courierPartners: prev.courierPartners.map(courier =>
        courier.id === courierId ? { ...courier, status } : courier
      )
    }))
    
    toast({
      title: status === "active" ? "Courier Activated" : "Courier Deactivated",
      description: `Courier partner has been ${status === "active" ? "activated" : "deactivated"}.`,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const allShipments = [
    ...shippingData.pendingShipments,
    ...shippingData.inTransitShipments
  ]

  const filteredShipments = allShipments.filter(shipment => {
    const matchesSearch = 
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || shipment.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shipping & Logistics</h1>
            <p className="text-muted-foreground">
              Manage deliveries, shipping zones, and courier partners
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button onClick={handleCreateShipping} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Shipping
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="zones">Shipping Zones</TabsTrigger>
            <TabsTrigger value="couriers">Courier Partners</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Create Shipping</h3>
                  <p className="text-sm text-muted-foreground">New shipment label</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Track Shipment</h3>
                  <p className="text-sm text-muted-foreground">Monitor delivery status</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Manage Zones</h3>
                  <p className="text-sm text-muted-foreground">Shipping areas & costs</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Courier Settings</h3>
                  <p className="text-sm text-muted-foreground">Partner configurations</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Shipments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Pending Shipments
                  </CardTitle>
                  <CardDescription>
                    Orders ready for shipping processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shippingData.pendingShipments.map((shipment) => (
                      <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{shipment.id}</p>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {shipment.customer} • {shipment.destination}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {shipment.items} items • {shipment.totalWeight}kg • {formatCurrency(shipment.shippingCost)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleProcessShipment(shipment.id)}
                          >
                            Process
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* In Transit Shipments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    In Transit
                  </CardTitle>
                  <CardDescription>
                    Shipments currently being delivered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shippingData.inTransitShipments.map((shipment) => (
                      <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{shipment.id}</p>
                            <Badge variant="default">In Transit</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {shipment.customer} • {shipment.destination}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {shipment.currentLocation} • Est. {formatDate(shipment.estimatedDelivery)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTrackShipment(shipment.trackingNumber)}
                          >
                            Track
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Shipments Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>All Shipments</CardTitle>
                    <CardDescription>
                      Complete overview of all shipping activities
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-48">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search shipments..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      className="border rounded-lg px-3 py-2 text-sm"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {shipmentStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Courier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.id}</TableCell>
                        <TableCell>{shipment.customer}</TableCell>
                        <TableCell>{shipment.destination}</TableCell>
                        <TableCell>{shipment.courier}</TableCell>
                        <TableCell>
                          {getStatusBadge(shipment.status)}
                        </TableCell>
                        <TableCell>{formatDate(shipment.estimatedDelivery)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredShipments.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No shipments found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try adjusting your search criteria" : "No shipments match your current filters"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Zones Tab */}
          <TabsContent value="zones" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Shipping Zones</CardTitle>
                    <CardDescription>
                      Configure delivery areas, costs, and timelines
                    </CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Zone
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {shippingData.shippingZones.map((zone) => (
                    <div key={zone.id} className="p-6 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            {zone.name}
                            <Badge variant={zone.status === "active" ? "default" : "outline"}>
                              {zone.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </h3>
                          <p className="text-muted-foreground">
                            Delivery: {zone.deliveryTime} • Cost: {formatCurrency(zone.cost)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={zone.status === "active"}
                            onCheckedChange={(checked) => 
                              handleUpdateZone(zone.id, { status: checked ? "active" : "inactive" })
                            }
                          />
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium">Delivery Time</Label>
                          <p className="text-sm">{zone.deliveryTime}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Shipping Cost</Label>
                          <p className="text-sm">{formatCurrency(zone.cost)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Free Shipping Threshold</Label>
                          <p className="text-sm">{formatCurrency(zone.freeShippingThreshold)}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Covered Regions</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {zone.regions.map((region, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courier Partners Tab */}
          <TabsContent value="couriers" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Courier Partners</CardTitle>
                <CardDescription>
                  Manage your delivery service providers and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {shippingData.courierPartners.map((courier) => (
                    <div key={courier.id} className="flex items-center justify-between p-6 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{courier.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{courier.deliveryTime}</span>
                            <span>•</span>
                            <span>{formatCurrency(courier.costPerKg)}/kg</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3 fill-yellow-400" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              {courier.rating}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {courier.deliveryAreas.map((area, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right space-y-1">
                          {getIntegrationBadge(courier.integration)}
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={courier.status === "active"}
                              onCheckedChange={(checked) => 
                                handleToggleCourier(courier.id, checked ? "active" : "inactive")
                              }
                            />
                            <Label className="text-sm">
                              {courier.status === "active" ? "Active" : "Inactive"}
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {courier.integration === "not-connected" ? (
                            <Button size="sm">
                              Connect
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Packaging Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Packaging Settings</CardTitle>
                  <CardDescription>
                    Configure your packaging preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Package Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingData.deliverySettings.packaging.boxSizes.map((size) => (
                          <SelectItem key={size} value={size.toLowerCase()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fragile Handling</Label>
                      <p className="text-sm text-muted-foreground">Extra care for fragile items</p>
                    </div>
                    <Switch defaultChecked={shippingData.deliverySettings.packaging.fragileHandling} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Shipping Insurance</Label>
                      <p className="text-sm text-muted-foreground">Protect against loss/damage</p>
                    </div>
                    <Switch defaultChecked={shippingData.deliverySettings.packaging.insurance} />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage shipping notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications</p>
                    </div>
                    <Switch defaultChecked={shippingData.deliverySettings.notifications.emailUpdates} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive SMS notifications</p>
                    </div>
                    <Switch defaultChecked={shippingData.deliverySettings.notifications.smsUpdates} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Customer Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify customers automatically</p>
                    </div>
                    <Switch defaultChecked={shippingData.deliverySettings.notifications.customerNotifications} />
                  </div>
                </CardContent>
              </Card>

              {/* Return Policy */}
              <Card>
                <CardHeader>
                  <CardTitle>Return Policy</CardTitle>
                  <CardDescription>
                    Configure return and refund settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Return Period</Label>
                    <Select defaultValue="30-days">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="14-days">14 days</SelectItem>
                        <SelectItem value="30-days">30 days</SelectItem>
                        <SelectItem value="60-days">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Return Shipping</Label>
                    <Select defaultValue="customer-pays">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer-pays">Customer Pays</SelectItem>
                        <SelectItem value="vendor-pays">Vendor Pays</SelectItem>
                        <SelectItem value="free-returns">Free Returns</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Restocking Fee</Label>
                    <Input 
                      type="number" 
                      defaultValue={shippingData.deliverySettings.returns.restockingFee}
                      min="0"
                      max="100"
                    />
                    <p className="text-sm text-muted-foreground">Percentage charged for returns</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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