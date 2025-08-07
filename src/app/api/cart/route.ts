import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/utils'

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

    const cart = await prisma.cart.findUnique({
      where: { userId: payload.userId },
      include: {
        items: {
          include: {
            book: true
          }
        }
      }
    })

    if (!cart) {
      // Create cart if it doesn't exist
      const newCart = await prisma.cart.create({
        data: { userId: payload.userId },
        include: {
          items: {
            include: {
              book: true
            }
          }
        }
      })
      return NextResponse.json({
        success: true,
        data: newCart
      })
    }

    return NextResponse.json({
      success: true,
      data: cart
    })

  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

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

    const { bookId, quantity = 1 } = await request.json()

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      )
    }

    // Check if book exists and has sufficient stock
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (book.stockQuantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: payload.userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: payload.userId }
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId: bookId
        }
      }
    })

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity > book.stockQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock for requested quantity' },
          { status: 400 }
        )
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          bookId: bookId,
          quantity: quantity,
          price: book.price
        }
      })
    }

    // Update cart total
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { book: true }
    })

    const totalAmount = cartItems.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0)

    await prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount }
    })

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { book: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCart,
      message: 'Item added to cart'
    })

  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const { itemId, quantity } = await request.json()

    if (!itemId || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid item ID or quantity' },
        { status: 400 }
      )
    }

    // Find cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId: payload.userId }
      },
      include: { book: true, cart: true }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item from cart
      await prisma.cartItem.delete({
        where: { id: itemId }
      })
    } else {
      // Check stock
      if (quantity > cartItem.book.stockQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        )
      }

      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity }
      })
    }

    // Update cart total
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cartItem.cartId },
      include: { book: true }
    })

    const totalAmount = cartItems.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0)

    await prisma.cart.update({
      where: { id: cartItem.cartId },
      data: { totalAmount }
    })

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: { book: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCart,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated'
    })

  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}