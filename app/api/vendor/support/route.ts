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

    // Get support tickets for this vendor
    const tickets = await db.collection('support_tickets').find({
      vendorId: vendorId
    }).sort({ createdAt: -1 }).toArray()

    // Get knowledge base articles (mock data for now - would need knowledge base collection)
    const knowledgeBase = [
      {
        id: 1,
        title: "How to add products to your store",
        category: "Products",
        content: "Learn how to add and manage products in your vendor dashboard...",
        views: 1250
      },
      {
        id: 2,
        title: "Understanding order management",
        category: "Orders",
        content: "Complete guide to managing customer orders and fulfillment...",
        views: 890
      },
      {
        id: 3,
        title: "Payment and payout settings",
        category: "Payments",
        content: "Configure your payment methods and payout preferences...",
        views: 650
      }
    ]

    // Transform tickets to match frontend format
    const transformedTickets = tickets.map(ticket => ({
      id: ticket._id.toString(),
      customer: {
        name: ticket.customerName || 'Unknown Customer',
        email: ticket.customerEmail || '',
        avatar: ''
      },
      subject: ticket.subject || 'No Subject',
      message: ticket.message || '',
      status: ticket.status || 'open',
      priority: ticket.priority || 'medium',
      category: ticket.category || 'general',
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt || ticket.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        tickets: transformedTickets,
        knowledgeBase
      }
    })

  } catch (error) {
    console.error('Error fetching support data:', error)
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
    const { action, ticketId, reply, status, priority } = body

    const { db } = await connectToDatabase()

    switch (action) {
      case 'reply':
        await db.collection('support_tickets').updateOne(
          { _id: ticketId },
          { 
            $push: { 
              replies: {
                message: reply,
                from: 'vendor',
                createdAt: new Date()
              }
            },
            $set: { updatedAt: new Date() }
          }
        )
        return NextResponse.json({ success: true, message: 'Reply sent' })
      
      case 'updateStatus':
        await db.collection('support_tickets').updateOne(
          { _id: ticketId },
          { 
            $set: { 
              status,
              updatedAt: new Date()
            }
          }
        )
        return NextResponse.json({ success: true, message: 'Status updated' })
      
      case 'updatePriority':
        await db.collection('support_tickets').updateOne(
          { _id: ticketId },
          { 
            $set: { 
              priority,
              updatedAt: new Date()
            }
          }
        )
        return NextResponse.json({ success: true, message: 'Priority updated' })
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error processing support action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

