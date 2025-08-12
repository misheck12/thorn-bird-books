import express from 'express';
import {
  getAllBooks,
  getBookById,
  getBooksByCategory,
  getFeaturedBooks,
  getNewArrivals,
  getBestSellers,
  searchBooks,
  getCategories,
  getAuthors,
  getBooks,
} from '../controllers/bookController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management and browsing
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     tags: [Books]
 *     summary: Get all books with filtering and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [hardcover, paperback, ebook, audiobook]
 *         description: Filter by format
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search query
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 */
router.get('/', getBooks);

/**
 * @swagger
 * /api/books/featured:
 *   get:
 *     tags: [Books]
 *     summary: Get featured books
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of featured books to return
 *     responses:
 *       200:
 *         description: Featured books retrieved successfully
 */
router.get('/featured', getFeaturedBooks);

/**
 * @swagger
 * /api/books/new-arrivals:
 *   get:
 *     tags: [Books]
 *     summary: Get new arrival books
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: New arrivals retrieved successfully
 */
router.get('/new-arrivals', getNewArrivals);

/**
 * @swagger
 * /api/books/best-sellers:
 *   get:
 *     tags: [Books]
 *     summary: Get best selling books
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Best sellers retrieved successfully
 */
router.get('/best-sellers', getBestSellers);

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     tags: [Books]
 *     summary: Search books
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Search query is required
 */
router.get('/search', searchBooks);

/**
 * @swagger
 * /api/books/categories:
 *   get:
 *     tags: [Books]
 *     summary: Get all book categories
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/books/authors:
 *   get:
 *     tags: [Books]
 *     summary: Get all authors
 *     responses:
 *       200:
 *         description: Authors retrieved successfully
 */
router.get('/authors', getAuthors);

/**
 * @swagger
 * /api/books/category/{category}:
 *   get:
 *     tags: [Books]
 *     summary: Get books by category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Book category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Books in category retrieved successfully
 */
router.get('/category/:category', getBooksByCategory);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *                 message:
 *                   type: string
 *       404:
 *         description: Book not found
 */
router.get('/:id', getBookById);

export default router;