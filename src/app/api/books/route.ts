import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import mockBooks from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
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

    let books = [...mockBooks];

    // Apply filters
    if (category) {
      books = books.filter(book => book.category === category);
    }
    if (genre) {
      books = books.filter(book => book.genre === genre);
    }
    if (format) {
      books = books.filter(book => book.format === format);
    }
    if (featured === 'true') {
      books = books.filter(book => book.featured);
    }
    if (minPrice) {
      books = books.filter(book => book.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      books = books.filter(book => book.price <= parseFloat(maxPrice));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.description.toLowerCase().includes(searchLower) ||
        book.isbn.includes(search)
      );
    }

    // Apply sorting
    books.sort((a, b) => {
      let aVal, bVal;
      switch (sort) {
        case 'title':
          aVal = a.title;
          bVal = b.title;
          break;
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'rating':
          aVal = a.rating || 0;
          bVal = b.rating || 0;
          break;
        default:
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }
      return order === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });

    // Apply pagination
    const total = books.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedBooks = books.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: {
        books: paginatedBooks,
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