import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Filters
    const category = searchParams.get('category')
    const author = searchParams.get('author')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const format = searchParams.get('format')
    const language = searchParams.get('language')
    const inStock = searchParams.get('inStock')
    const search = searchParams.get('search')

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: Record<string, unknown> = {}

    if (category) where.category = category
    if (author) where.author = { contains: author, mode: 'insensitive' }
    if (format) where.format = format.toUpperCase()
    if (language) where.language = language
    if (inStock === 'true') where.stockQuantity = { gt: 0 }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as { gte?: number }).gte = parseFloat(minPrice)
      if (maxPrice) (where.price as { lte?: number }).lte = parseFloat(maxPrice)
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build orderBy clause
    const orderBy: Record<string, string> = {}
    if (sortBy === 'price') {
      orderBy.price = sortOrder
    } else if (sortBy === 'title') {
      orderBy.title = sortOrder
    } else if (sortBy === 'rating') {
      orderBy.rating = sortOrder
    } else if (sortBy === 'publishedDate') {
      orderBy.publishedDate = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }

    // Get books and total count
    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.book.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasMore: page < totalPages,
        }
      }
    })

  } catch (error) {
    console.error('Books fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}