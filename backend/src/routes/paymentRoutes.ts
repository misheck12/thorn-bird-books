import express from 'express';
import { processPayment } from '../controllers/paymentController';

const router = express.Router();

// Route to handle payment
router.post('/pay', processPayment);

export default router;
