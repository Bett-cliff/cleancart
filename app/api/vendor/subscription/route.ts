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

    // Get vendor subscription data
    const vendor = await db.collection('vendors').findOne({ _id: vendorId })
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // Get usage statistics
    const productsCount = await db.collection('products').countDocuments({ vendorId })
    const ordersCount = await db.collection('orders').countDocuments({ vendorId })
    const customersCount = await db.collection('users').countDocuments({ 
      'orders.vendorId': vendorId 
    })

    // Calculate usage based on current plan
    const currentPlan = {
      name: vendor.subscription?.plan || "Basic Plan",
      price: vendor.subscription?.price || 0,
      billingCycle: vendor.subscription?.billingCycle || "monthly",
      status: vendor.subscription?.status || "active",
      features: {
        products: vendor.subscription?.limits?.products || 10,
        orders: vendor.subscription?.limits?.orders || 100,
        customers: vendor.subscription?.limits?.customers || 500,
        storage: vendor.subscription?.limits?.storage || "1GB",
        support: vendor.subscription?.limits?.support || "email"
      }
    }

    const usage = {
      products: {
        used: productsCount,
        limit: currentPlan.features.products,
        percentage: Math.round((productsCount / currentPlan.features.products) * 100)
      },
      orders: {
        used: ordersCount,
        limit: currentPlan.features.orders,
        percentage: Math.round((ordersCount / currentPlan.features.orders) * 100)
      },
      customers: {
        used: customersCount,
        limit: currentPlan.features.customers,
        percentage: Math.round((customersCount / currentPlan.features.customers) * 100)
      }
    }

    // Get billing history (mock data for now - would need billing collection)
    const billingHistory = [
      {
        id: 1,
        date: new Date().toISOString(),
        amount: currentPlan.price,
        status: "paid",
        invoice: "INV-001"
      }
    ]

    // Available plans
    const plans = [
      {
        id: "basic",
        name: "Basic Plan",
        price: 0,
        billingCycle: "monthly",
        features: {
          products: 10,
          orders: 100,
          customers: 500,
          storage: "1GB",
          support: "email"
        }
      },
      {
        id: "pro",
        name: "Pro Plan",
        price: 2999,
        billingCycle: "monthly",
        features: {
          products: 100,
          orders: 1000,
          customers: 5000,
          storage: "10GB",
          support: "priority"
        }
      },
      {
        id: "enterprise",
        name: "Enterprise Plan",
        price: 9999,
        billingCycle: "monthly",
        features: {
          products: -1, // unlimited
          orders: -1,
          customers: -1,
          storage: "100GB",
          support: "dedicated"
        }
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        currentPlan,
        usage,
        billingHistory,
        plans
      }
    })

  } catch (error) {
    console.error('Error fetching subscription data:', error)
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
    const { action, planId } = body

    const { db } = await connectToDatabase()

    switch (action) {
      case 'upgrade':
        // Update vendor subscription
        await db.collection('vendors').updateOne(
          { _id: vendorId },
          { 
            $set: { 
              'subscription.plan': planId,
              'subscription.updatedAt': new Date()
            }
          }
        )
        return NextResponse.json({ success: true, message: 'Plan upgraded successfully' })
      
      case 'cancel':
        // Cancel subscription
        await db.collection('vendors').updateOne(
          { _id: vendorId },
          { 
            $set: { 
              'subscription.status': 'cancelled',
              'subscription.cancelledAt': new Date()
            }
          }
        )
        return NextResponse.json({ success: true, message: 'Subscription cancelled' })
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error processing subscription action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

