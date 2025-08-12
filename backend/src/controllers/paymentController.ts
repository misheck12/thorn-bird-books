import { Request, Response } from 'express';
import Stripe from 'stripe';
import { sendEmail } from '../utils/emailSender';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil', // Updated to match the expected type
});

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency, paymentMethod, paymentDetails } = req.body;

    if (paymentMethod === 'card') {
      // Card payment via Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentDetails.paymentMethodId,
        confirm: true,
      });
      return res.status(200).json({ success: true, paymentIntent });
    } else if (paymentMethod === 'mobile_money') {
      const { provider, phoneNumber } = paymentDetails;

      if (provider === 'airtel') {
        // Airtel Money integration
        // Replace with actual API call to Airtel Money
        await sendEmail(
          phoneNumber + '@example.com',
          'Payment Confirmation',
          `Your Airtel Money payment of ${amount} ${currency} was successful.`
        );
        return res.status(200).json({
          success: true,
          message: `Airtel Money payment successful for ${phoneNumber}`,
        });
      } else if (provider === 'mtn') {
        // MTN Mobile Money integration
        // Replace with actual API call to MTN Mobile Money
        await sendEmail(
          phoneNumber + '@example.com',
          'Payment Confirmation',
          `Your MTN Mobile Money payment of ${amount} ${currency} was successful.`
        );
        return res.status(200).json({
          success: true,
          message: `MTN Mobile Money payment successful for ${phoneNumber}`,
        });
      } else if (provider === 'zamtel') {
        // Zamtel Kwacha integration
        // Replace with actual API call to Zamtel Kwacha
        await sendEmail(
          phoneNumber + '@example.com',
          'Payment Confirmation',
          `Your Zamtel Kwacha payment of ${amount} ${currency} was successful.`
        );
        return res.status(200).json({
          success: true,
          message: `Zamtel Kwacha payment successful for ${phoneNumber}`,
        });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid mobile money provider' });
      }
    } else if (paymentMethod === 'bank_transfer') {
      // Bank transfer logic
      // Simulate a successful bank transfer
      return res.status(200).json({
        success: true,
        message: `Bank transfer successful for account ${paymentDetails.accountNumber}`,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }

  // Ensure all code paths return a response
  return res.status(500).json({ success: false, message: 'Unhandled payment method' });
};
