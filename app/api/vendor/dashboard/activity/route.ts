// app/api/vendor/dashboard/activity/route.ts
import { NextRequest, NextResponse } from 'next/server'

const mockActivity = [
  {
    id: "1",
    type: "order" as const,
    message: "New order #ORD-0012 received",
    time: "5 minutes ago",
    amount: 4250,
    status: "success" as const
  },
  {
    id: "2",
    type: "product" as const,
    message: "Product 'Organic Soap' is low in stock",
    time: "1 hour ago",
    amount: null,
    status: "warning" as const
  },
  {
    id: "3",
    type: "customer" as const,
    message: "New customer registration - Sarah M.",
    time: "2 hours ago",
    amount: null,
    status: "info" as const
  },
  {
    id: "4",
    type: "order" as const,
    message: "Order #ORD-0011 marked as delivered",
    time: "3 hours ago",
    amount: 8750,
    status: "success" as const
  },
  {
    id: "5",
    type: "review" as const,
    message: "New 5-star review received",
    time: "4 hours ago",
    amount: null,
    status: "success" as const
  }
]

async function authenticateVendor(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) return null
  
  try {
    const vendor = { id: '1', name: 'Demo Vendor', storeId: 'store-123' }
    return vendor
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const vendor = await authenticateVendor(request)
    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const limitedActivity = mockActivity.slice(0, limit)

    return NextResponse.json(limitedActivity)

  } catch (error) {
    console.error('Activity API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}