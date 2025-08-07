import { body, ValidationChain } from 'express-validator';

export const validateRegister: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const validateBook: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Book title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ max: 100 })
    .withMessage('Author name cannot exceed 100 characters'),
  body('isbn')
    .trim()
    .notEmpty()
    .withMessage('ISBN is required')
    .matches(/^(?:\d{9}[\dX]|\d{13})$/)
    .withMessage('Please enter a valid ISBN'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('publisher')
    .trim()
    .notEmpty()
    .withMessage('Publisher is required'),
  body('publishedDate')
    .isISO8601()
    .withMessage('Please provide a valid published date'),
  body('pages')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Pages must be a positive integer'),
  body('format')
    .isIn(['hardcover', 'paperback', 'ebook', 'audiobook'])
    .withMessage('Format must be one of: hardcover, paperback, ebook, audiobook'),
];

export const validateEvent: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('type')
    .isIn(['book_signing', 'reading', 'workshop', 'discussion', 'launch'])
    .withMessage('Invalid event type'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please enter a valid start time format (HH:MM)'),
  body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please enter a valid end time format (HH:MM)'),
  body('location.name')
    .trim()
    .notEmpty()
    .withMessage('Location name is required'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Location address is required'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('Location city is required'),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('Location state is required'),
  body('location.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Location zip code is required'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('organizer')
    .trim()
    .notEmpty()
    .withMessage('Organizer is required'),
];

export const validateCartItem: ValidationChain[] = [
  body('bookId')
    .isMongoId()
    .withMessage('Invalid book ID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];