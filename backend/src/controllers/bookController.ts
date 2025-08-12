import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Book from '../models/Book';
import { formatResponse, getPagination, getPaginationData } from '../utils/helpers';
import { BookFilters } from '../types';

export const getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      category,
      author,
      minPrice,
      maxPrice,
      rating,
      format,
      search,
      inStock
    }: BookFilters = req.query;

    // Build filter object
    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (author) filter.author = new RegExp(author, 'i');
    if (format) filter.format = format;
    if (inStock === true) filter.stock = { $gt: 0 };

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) filter.rating = { $gte: Number(rating) };

    // Search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const { offset, limit: limitNum } = getPagination(Number(page), Number(limit));

    // Sort object
    const sortObj: any = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Execute query
    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort(sortObj)
        .skip(offset)
        .limit(limitNum),
      Book.countDocuments(filter)
    ]);

    const pagination = getPaginationData(total, Number(page), Number(limit));

    res.status(200).json({
      success: true,
      data: books,
      pagination,
      message: 'Books retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Book not found',
      });
      return;
    }

    res.status(200).json(formatResponse(book, 'Book retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getBooksByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { offset, limit: limitNum } = getPagination(Number(page), Number(limit));

    const [books, total] = await Promise.all([
      Book.find({ category, isActive: true })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limitNum),
      Book.countDocuments({ category, isActive: true })
    ]);

    const pagination = getPaginationData(total, Number(page), Number(limit));

    res.status(200).json({
      success: true,
      data: books,
      pagination,
      message: `Books in ${category} category retrieved successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 6 } = req.query;

    const books = await Book.find({ isFeatured: true, isActive: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json(formatResponse(books, 'Featured books retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getNewArrivals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 6 } = req.query;

    const books = await Book.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json(formatResponse(books, 'New arrivals retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getBestSellers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 6 } = req.query;

    const books = await Book.find({ isActive: true })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(Number(limit));

    res.status(200).json(formatResponse(books, 'Best sellers retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const searchBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
      return;
    }

    const { offset, limit: limitNum } = getPagination(Number(page), Number(limit));

    const searchFilter = {
      $and: [
        { isActive: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { author: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q as string, 'i')] } }
          ]
        }
      ]
    };

    const [books, total] = await Promise.all([
      Book.find(searchFilter)
        .sort({ rating: -1, createdAt: -1 })
        .skip(offset)
        .limit(limitNum),
      Book.countDocuments(searchFilter)
    ]);

    const pagination = getPaginationData(total, Number(page), Number(limit));

    res.status(200).json({
      success: true,
      data: books,
      pagination,
      message: `Search results for "${q}"`,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Book.distinct('category', { isActive: true });
    
    res.status(200).json(formatResponse(categories, 'Categories retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAuthors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authors = await Book.distinct('author', { isActive: true });
    
    res.status(200).json(formatResponse(authors, 'Authors retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { title, author, category, minPrice, maxPrice } = req.query;

    const query: any = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (category) query.category = category;
    if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice as string) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice as string) };

    const books = await Book.find(query);
    res.status(200).json({ success: true, books });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};