import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const vendorId = decoded.vendorId

    if (!vendorId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get campaigns (mock data for now - would need campaigns collection)
    const campaigns = [
      {
        id: 1,
        name: "Summer Sale 2024",
        type: "discount",
        status: "active",
        audience: "all_customers",
        budget: 5000,
        spent: 3200,
        impressions: 12500,
        clicks: 850,
        conversions: 45,
        startDate: "2024-01-15",
        endDate: "2024-02-15"
      }
    ]

    // Get coupons (mock data for now - would need coupons collection)
    const coupons = [
      {
        id: 1,
        code: "SUMMER20",
        discount: 20,
        type: "percentage",
        uses: 45,
        maxUses: 100,
        status: "active"
      }
    ]

    // Get email campaigns (mock data for now - would need email campaigns collection)
    const emailCampaigns = [
      {
        id: 1,
        name: "Welcome Series",
        subject: "Welcome to our store!",
        status: "active",
        recipients: 1250,
        opens: 890,
        clicks: 234,
        unsubscribes: 12
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        campaigns,
        coupons,
        emailCampaigns
      }
    })

  } catch (error) {
    console.error('Error fetching marketing data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const vendorId = decoded.vendorId

    if (!vendorId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    const { db } = await connectToDatabase()

    switch (action) {
      case 'createCampaign':
        // Create new campaign logic here
        return NextResponse.json({ success: true, message: 'Campaign created successfully' })
      
      case 'createCoupon':
        // Create new coupon logic here
        return NextResponse.json({ success: true, message: 'Coupon created successfully' })
      
      case 'sendEmail':
        // Send email campaign logic here
        return NextResponse.json({ success: true, message: 'Email sent successfully' })
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error processing marketing action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

