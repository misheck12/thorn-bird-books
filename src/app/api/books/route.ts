import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const format = searchParams.get('format');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const featured = searchParams.get('featured');

    // Build filter object
    const filter: Record<string, unknown> = { isActive: true };

    if (category) filter.category = category;
    if (genre) filter.genre = genre;
    if (format) filter.format = format;
    if (featured === 'true') filter.featured = true;

    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      filter.price = priceFilter;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortObj: Record<string, 1 | -1 | { $meta: string }> = {};
    if (search) {
      sortObj.score = { $meta: 'textScore' };
    }
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find(filter)
        .select('-__v')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        books,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const bookData = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'author', 'isbn', 'description', 'price', 'category', 'publisher', 'publishedDate', 'pages', 'format', 'coverImage'];
    
    for (const field of requiredFields) {
      if (!bookData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const book = new Book(bookData);
    await book.save();

    return NextResponse.json(
      { success: true, data: book },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Error creating book:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Book with this ISBN already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}