import express from 'express';
import { processPayment, createPaymentIntent, getPaymentStatus } from '../controllers/paymentController';

const router = express.Router();

// Route to create a payment intent (for Stripe payments)
router.post('/create-intent', createPaymentIntent);

// Route to handle payment processing
router.post('/process', processPayment);

// Route to get payment status
router.get('/status/:paymentIntentId', getPaymentStatus);

export default router;
