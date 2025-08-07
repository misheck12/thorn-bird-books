import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          books: [],
          suggestions: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0,
        }
      })
    }

    // Full-text search with ranking
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
    
    // Build complex search query
    const searchConditions = searchTerms.map(term => ({
      OR: [
        { title: { contains: term, mode: 'insensitive' } },
        { author: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
        { publisher: { contains: term, mode: 'insensitive' } },
      ]
    }))

    const where = {
      AND: searchConditions
    }

    // Execute search with ranking
    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: [
          { rating: 'desc' },
          { reviewCount: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.book.count({ where })
    ])

    // Get search suggestions for autocomplete
    const suggestions = await getSearchSuggestions(query)

    // Get facets for filtering
    const facets = await getSearchFacets(where)

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        books,
        suggestions,
        facets,
        totalCount,
        currentPage: page,
        totalPages,
        hasMore: page < totalPages,
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}

async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    const suggestions: string[] = []
    
    // Get title suggestions
    const titleSuggestions = await prisma.book.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: { title: true },
      take: 5,
      orderBy: { rating: 'desc' }
    })

    // Get author suggestions
    const authorSuggestions = await prisma.book.findMany({
      where: {
        author: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: { author: true },
      take: 5,
      orderBy: { rating: 'desc' }
    })

    // Get category suggestions
    const categorySuggestions = await prisma.book.findMany({
      where: {
        category: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: { category: true },
      take: 5,
      orderBy: { rating: 'desc' }
    })

    suggestions.push(
      ...titleSuggestions.map(b => b.title),
      ...authorSuggestions.map(b => b.author),
      ...categorySuggestions.map(b => b.category)
    )

    // Remove duplicates and return top 10
    return [...new Set(suggestions)].slice(0, 10)

  } catch (error) {
    console.error('Error getting suggestions:', error)
    return []
  }
}

async function getSearchFacets(where: Record<string, unknown>) {
  try {
    const [categories, authors, formats, languages, priceRanges] = await Promise.all([
      // Categories
      prisma.book.groupBy({
        by: ['category'],
        where,
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
        take: 10
      }),
      
      // Authors
      prisma.book.groupBy({
        by: ['author'],
        where,
        _count: { author: true },
        orderBy: { _count: { author: 'desc' } },
        take: 10
      }),
      
      // Formats
      prisma.book.groupBy({
        by: ['format'],
        where,
        _count: { format: true },
        orderBy: { _count: { format: 'desc' } }
      }),
      
      // Languages
      prisma.book.groupBy({
        by: ['language'],
        where,
        _count: { language: true },
        orderBy: { _count: { language: 'desc' } },
        take: 10
      }),
      
      // Price ranges
      prisma.book.aggregate({
        where,
        _min: { price: true },
        _max: { price: true },
        _avg: { price: true }
      })
    ])

    return {
      categories: categories.map(c => ({
        value: c.category,
        count: c._count.category
      })),
      authors: authors.map(a => ({
        value: a.author,
        count: a._count.author
      })),
      formats: formats.map(f => ({
        value: f.format,
        count: f._count.format
      })),
      languages: languages.map(l => ({
        value: l.language,
        count: l._count.language
      })),
      priceRange: {
        min: priceRanges._min.price || 0,
        max: priceRanges._max.price || 0,
        avg: priceRanges._avg.price || 0
      }
    }

  } catch (error) {
    console.error('Error getting facets:', error)
    return {
      categories: [],
      authors: [],
      formats: [],
      languages: [],
      priceRange: { min: 0, max: 0, avg: 0 }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, filters, sort } = await request.json()
    
    // Log search analytics
    // In a real implementation, you'd want to store this in a separate analytics table
    console.log('Search performed:', {
      query,
      filters,
      sort,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Search logged'
    })

  } catch (error) {
    console.error('Search logging error:', error)
    return NextResponse.json(
      { error: 'Failed to log search' },
      { status: 500 }
    )
  }
}