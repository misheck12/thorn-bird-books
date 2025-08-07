import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const userId = paymentIntent.metadata.userId
    
    if (!userId) {
      console.error('No userId in payment intent metadata')
      return
    }

    // Find the order by payment intent ID
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: paymentIntent.id },
      include: {
        user: true,
        items: {
          include: {
            book: true,
          }
        }
      }
    })

    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id)
      return
    }

    // Update order status to paid
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' }
    })

    // Update book stock quantities
    for (const item of order.items) {
      await prisma.book.update({
        where: { id: item.bookId },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      })
    }

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: order.userId
        }
      }
    })

    await prisma.cart.update({
      where: { userId: order.userId },
      data: { totalAmount: 0 }
    })

    // Send order confirmation email
    await sendEmail({
      to: order.user.email,
      template: 'order-confirmation',
      data: {
        orderNumber: order.id,
        orderDate: order.createdAt,
        totalAmount: order.totalAmount,
        items: order.items,
        shippingAddress: order.shippingAddress,
      }
    })

    console.log('Payment success handled for order:', order.id)

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: paymentIntent.id }
    })

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' }
      })
    }

    console.log('Payment failure handled for payment intent:', paymentIntent.id)

  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: paymentIntent.id }
    })

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' }
      })
    }

    console.log('Payment cancellation handled for payment intent:', paymentIntent.id)

  } catch (error) {
    console.error('Error handling payment cancellation:', error)
  }
}