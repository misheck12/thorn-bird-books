import mongoose, { Schema, Document } from 'mongoose';
import { ICart, ICartItem } from '../types';

interface ICartDocument extends ICart, Document {
  calculateTotals(): void;
}

const cartItemSchema = new Schema<ICartItem>({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
}, { _id: false });

const cartSchema = new Schema<ICartDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Total amount cannot be negative'],
  },
  totalItems: {
    type: Number,
    default: 0,
    min: [0, 'Total items cannot be negative'],
  },
}, {
  timestamps: true,
});

// Calculate totals before saving
cartSchema.methods.calculateTotals = function(this: ICartDocument) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

cartSchema.pre('save', function(this: ICartDocument, next) {
  this.calculateTotals();
  next();
});

export default mongoose.model<ICartDocument>('Cart', cartSchema);