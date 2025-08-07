import express from 'express';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Placeholder routes - these would be implemented with admin functionality
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin routes - To be implemented',
  });
});

export default router;