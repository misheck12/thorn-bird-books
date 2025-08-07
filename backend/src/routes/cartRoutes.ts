import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
} from '../controllers/cartController';
import { protect } from '../middleware/auth';
import { validateCartItem } from '../middleware/validation';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

// All cart routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           bookId:
 *                             $ref: '#/components/schemas/Book'
 *                           quantity:
 *                             type: number
 *                           price:
 *                             type: number
 *                     totalAmount:
 *                       type: number
 *                     totalItems:
 *                       type: number
 */
router.get('/', getCart);

/**
 * @swagger
 * /api/cart/summary:
 *   get:
 *     tags: [Cart]
 *     summary: Get cart summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart summary retrieved successfully
 */
router.get('/summary', getCartSummary);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - quantity
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: Book ID to add to cart
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 description: Quantity to add
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Book not found
 */
router.post('/add', validateCartItem, addToCart);

/**
 * @swagger
 * /api/cart/update/{bookId}:
 *   put:
 *     tags: [Cart]
 *     summary: Update cart item quantity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid quantity or insufficient stock
 *       404:
 *         description: Item not found in cart
 */
router.put('/update/:bookId', updateCartItem);

/**
 * @swagger
 * /api/cart/remove/{bookId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID to remove
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Item not found in cart
 */
router.delete('/remove/:bookId', removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear all items from cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Cart not found
 */
router.delete('/clear', clearCart);

export default router;