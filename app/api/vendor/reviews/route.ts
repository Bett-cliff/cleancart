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

    // Get reviews for vendor's products
    const reviews = await db.collection('reviews').aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $match: {
          'product.vendorId': vendorId
        }
      },
      {
        $project: {
          _id: 1,
          rating: 1,
          title: 1,
          comment: 1,
          status: 1,
          createdAt: 1,
          product: { $arrayElemAt: ['$product', 0] },
          customer: { $arrayElemAt: ['$customer', 0] }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray()

    // Calculate summary statistics
    const summary = {
      averageRating: 0,
      totalReviews: reviews.length,
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0
    }

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      summary.averageRating = Math.round((totalRating / reviews.length) * 10) / 10

      reviews.forEach(review => {
        switch (review.rating) {
          case 5: summary.fiveStar++; break
          case 4: summary.fourStar++; break
          case 3: summary.threeStar++; break
          case 2: summary.twoStar++; break
          case 1: summary.oneStar++; break
        }
      })
    }

    // Transform reviews to match frontend format
    const transformedReviews = reviews.map(review => ({
      id: review._id.toString(),
      customer: {
        name: review.customer?.name || 'Anonymous',
        email: review.customer?.email || '',
        avatar: review.customer?.avatar || ''
      },
      product: {
        name: review.product?.name || 'Unknown Product',
        image: review.product?.images?.[0] || ''
      },
      rating: review.rating,
      title: review.title || '',
      comment: review.comment || '',
      status: review.status || 'published',
      date: review.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        reviews: transformedReviews,
        summary
      }
    })

  } catch (error) {
    console.error('Error fetching reviews:', error)
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
    const { action, reviewId, status } = body

    const { db } = await connectToDatabase()

    switch (action) {
      case 'updateStatus':
        await db.collection('reviews').updateOne(
          { _id: reviewId },
          { $set: { status } }
        )
        return NextResponse.json({ success: true, message: 'Review status updated' })
      
      case 'reply':
        const { reply } = body
        await db.collection('reviews').updateOne(
          { _id: reviewId },
          { $set: { vendorReply: reply, repliedAt: new Date() } }
        )
        return NextResponse.json({ success: true, message: 'Reply added' })
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error processing review action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

