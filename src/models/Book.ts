import mongoose, { Schema, Document } from 'mongoose';
import { Book } from '@/types';

export interface BookDocument extends Omit<Book, '_id'>, Document {}

const BookSchema = new Schema<BookDocument>({
  title: { type: String, required: true, index: true },
  author: { type: String, required: true, index: true },
  isbn: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  genre: { type: String, index: true },
  publisher: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  pages: { type: Number, required: true, min: 1 },
  language: { type: String, required: true, default: 'English' },
  format: { 
    type: String, 
    enum: ['hardcover', 'paperback', 'ebook', 'audiobook'], 
    required: true 
  },
  coverImage: { type: String, required: true },
  images: [{ type: String }],
  inStock: { type: Number, required: true, min: 0, default: 0 },
  rating: { type: Number, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  tags: [{ type: String, index: true }],
  featured: { type: Boolean, default: false, index: true },
  isActive: { type: Boolean, default: true, index: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for search and filtering
BookSchema.index({ title: 'text', author: 'text', description: 'text' });
BookSchema.index({ category: 1, genre: 1 });
BookSchema.index({ price: 1 });
BookSchema.index({ rating: -1 });
BookSchema.index({ featured: 1, isActive: 1 });

// Virtual for review average
BookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookId'
});

export default mongoose.models.Book || mongoose.model<BookDocument>('Book', BookSchema);