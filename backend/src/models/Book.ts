import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from '../types';

interface IBookDocument extends IBook, Document {}

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - isbn
 *         - price
 *         - stock
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated book ID
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Book author
 *         isbn:
 *           type: string
 *           description: International Standard Book Number
 *         description:
 *           type: string
 *           description: Book description
 *         category:
 *           type: string
 *           description: Book category
 *         price:
 *           type: number
 *           description: Book price
 *         discountPrice:
 *           type: number
 *           description: Discounted price if applicable
 *         stock:
 *           type: number
 *           description: Available stock quantity
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         publisher:
 *           type: string
 *           description: Book publisher
 *         publishedDate:
 *           type: string
 *           format: date
 *         language:
 *           type: string
 *           default: English
 *         pages:
 *           type: number
 *         format:
 *           type: string
 *           enum: [hardcover, paperback, ebook, audiobook]
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           default: 0
 *         reviewCount:
 *           type: number
 *           default: 0
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         isFeatured:
 *           type: boolean
 *           default: false
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const bookSchema = new Schema<IBookDocument>({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters'],
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    match: [/^(?:\d{9}[\dX]|\d{13})$/, 'Please enter a valid ISBN'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(this: IBookDocument, value: number) {
        return !value || value < this.price;
      },
      message: 'Discount price must be less than regular price',
    },
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  images: [{
    type: String,
    required: true,
  }],
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true,
  },
  publishedDate: {
    type: Date,
    required: [true, 'Published date is required'],
  },
  language: {
    type: String,
    default: 'English',
    trim: true,
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1'],
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook', 'audiobook'],
    required: [true, 'Format is required'],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    min: 0,
    default: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ rating: -1 });
bookSchema.index({ isFeatured: 1 });
bookSchema.index({ isActive: 1 });
bookSchema.index({ createdAt: -1 });

// Virtual for current price (considering discount)
bookSchema.virtual('currentPrice').get(function(this: IBookDocument) {
  return this.discountPrice || this.price;
});

// Virtual for discount percentage
bookSchema.virtual('discountPercentage').get(function(this: IBookDocument) {
  if (!this.discountPrice) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

export default mongoose.model<IBookDocument>('Book', bookSchema);