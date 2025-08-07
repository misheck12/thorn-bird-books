import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { verifyToken } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { shippingAddress, paymentMethod } = await request.json()

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Shipping address and payment method are required' },
        { status: 400 }
      )
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: payload.userId },
      include: {
        items: {
          include: { book: true }
        }
      }
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Verify stock availability
    for (const item of cart.items) {
      if (item.book.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.book.title}` },
          { status: 400 }
        )
      }
    }

    // Create payment intent first
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cart.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: payload.userId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: payload.userId,
        totalAmount: cart.totalAmount,
        status: 'PENDING',
        shippingAddress,
        paymentMethod,
        paymentIntentId: paymentIntent.id,
        items: {
          create: cart.items.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: {
        items: {
          include: { book: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        order,
        clientSecret: paymentIntent.client_secret,
      },
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { userId: payload.userId },
        include: {
          items: {
            include: { book: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.order.count({
        where: { userId: payload.userId }
      })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasMore: page < totalPages,
        }
      }
    })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}