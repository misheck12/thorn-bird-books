import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Cart from '../models/Cart';
import Book from '../models/Book';
import { formatResponse } from '../utils/helpers';
import { IUser } from '../types';

interface AuthRequest extends Request {
  user?: any; // Using any to avoid type conflicts with Mongoose Document
}

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let cart = await Cart.findOne({ userId: req.user?._id }).populate('items.bookId');

    if (!cart) {
      cart = await Cart.create({ userId: req.user?._id, items: [] });
    }

    res.status(200).json(formatResponse(cart, 'Cart retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
      return;
    }

    const { bookId, quantity } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Book not found',
      });
      return;
    }

    if (!book.isActive) {
      res.status(400).json({
        success: false,
        error: 'Book is not available',
      });
      return;
    }

    if (book.stock < quantity) {
      res.status(400).json({
        success: false,
        error: 'Insufficient stock',
      });
      return;
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.user?._id });
    if (!cart) {
      cart = new Cart({ userId: req.user?._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.bookId.toString() === bookId
    );

    const currentPrice = book.discountPrice || book.price;

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (book.stock < newQuantity) {
        res.status(400).json({
          success: false,
          error: 'Insufficient stock for requested quantity',
        });
        return;
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = currentPrice;
    } else {
      // Add new item
      cart.items.push({
        bookId,
        quantity,
        price: currentPrice,
      });
    }

    await cart.save();
    await cart.populate('items.bookId');

    res.status(200).json(formatResponse(cart, 'Item added to cart successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1',
      });
      return;
    }

    // Check if book exists and has enough stock
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Book not found',
      });
      return;
    }

    if (book.stock < quantity) {
      res.status(400).json({
        success: false,
        error: 'Insufficient stock',
      });
      return;
    }

    const cart = await Cart.findOne({ userId: req.user?._id });
    if (!cart) {
      res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
      return;
    }

    const itemIndex = cart.items.findIndex(
      item => item.bookId.toString() === bookId
    );

    if (itemIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Item not found in cart',
      });
      return;
    }

    // Update item
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = book.discountPrice || book.price;

    await cart.save();
    await cart.populate('items.bookId');

    res.status(200).json(formatResponse(cart, 'Cart item updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookId } = req.params;

    const cart = await Cart.findOne({ userId: req.user?._id });
    if (!cart) {
      res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
      return;
    }

    const itemIndex = cart.items.findIndex(
      item => item.bookId.toString() === bookId
    );

    if (itemIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Item not found in cart',
      });
      return;
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    await cart.save();
    await cart.populate('items.bookId');

    res.status(200).json(formatResponse(cart, 'Item removed from cart successfully'));
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await Cart.findOne({ userId: req.user?._id });
    if (!cart) {
      res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
      return;
    }

    cart.items = [];
    await cart.save();

    res.status(200).json(formatResponse(cart, 'Cart cleared successfully'));
  } catch (error) {
    next(error);
  }
};

export const getCartSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await Cart.findOne({ userId: req.user?._id }).populate('items.bookId');

    if (!cart) {
      res.status(200).json(formatResponse({
        totalItems: 0,
        totalAmount: 0,
        itemCount: 0,
      }, 'Cart summary retrieved successfully'));
      return;
    }

    const summary = {
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
      itemCount: cart.items.length,
    };

    res.status(200).json(formatResponse(summary, 'Cart summary retrieved successfully'));
  } catch (error) {
    next(error);
  }
};