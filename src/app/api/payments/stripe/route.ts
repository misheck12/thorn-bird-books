import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { verifyToken } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookie or header
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

    const { amount, currency = 'usd', metadata = {} } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: payload.userId,
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve payment intent status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return NextResponse.json({
      success: true,
      data: {
        status: paymentIntent.status,
        paymentIntent,
      }
    })

  } catch (error) {
    console.error('Payment intent retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve payment intent' },
      { status: 500 }
    )
  }
}