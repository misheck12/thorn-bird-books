import { Request, Response } from 'express';
import Stripe from 'stripe';
import { sendEmail } from '../utils/emailSender';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'zmw', paymentMethod, paymentDetails, orderDetails } = req.body;

    // Validate required fields
    if (!amount || !paymentMethod || !paymentDetails) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required payment information' 
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment amount' 
      });
    }

    if (paymentMethod === 'card') {
      // Card payment via Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        payment_method: paymentDetails.paymentMethodId,
        confirm: true,
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        metadata: {
          orderId: orderDetails?.orderId || '',
          customerEmail: orderDetails?.customerEmail || '',
        },
      });

      // Send confirmation email
      if (orderDetails?.customerEmail) {
        await sendEmail(
          orderDetails.customerEmail,
          'Payment Confirmation - Thorn Bird Books',
          `Thank you for your payment of ${amount} ${currency.toUpperCase()}. Your payment has been processed successfully.`,
          `<h2>Payment Confirmation</h2>
           <p>Thank you for your payment of <strong>${amount} ${currency.toUpperCase()}</strong>.</p>
           <p>Your payment has been processed successfully.</p>
           <p>Order ID: ${orderDetails.orderId}</p>
           <p>Payment ID: ${paymentIntent.id}</p>`
        );
      }

      return res.status(200).json({ 
        success: true, 
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency
        }
      });
    } else if (paymentMethod === 'mobile_money') {
      const { provider, phoneNumber } = paymentDetails;

      if (!phoneNumber) {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone number is required for mobile money payments' 
        });
      }

      // Mock mobile money integrations - in production, replace with actual API calls
      const supportedProviders = ['airtel', 'mtn', 'zamtel'];
      if (!supportedProviders.includes(provider)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Unsupported mobile money provider' 
        });
      }

      // Simulate mobile money payment processing
      const paymentReference = `MM${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      // Send confirmation email
      if (orderDetails?.customerEmail) {
        await sendEmail(
          orderDetails.customerEmail,
          'Mobile Money Payment Confirmation - Thorn Bird Books',
          `Your ${provider.toUpperCase()} Mobile Money payment of ${amount} ${currency.toUpperCase()} has been processed successfully.`,
          `<h2>Mobile Money Payment Confirmation</h2>
           <p>Your <strong>${provider.toUpperCase()}</strong> Mobile Money payment of <strong>${amount} ${currency.toUpperCase()}</strong> has been processed successfully.</p>
           <p>Phone Number: ${phoneNumber}</p>
           <p>Order ID: ${orderDetails.orderId}</p>
           <p>Payment Reference: ${paymentReference}</p>`
        );
      }

      return res.status(200).json({
        success: true,
        message: `${provider.toUpperCase()} Mobile Money payment successful`,
        paymentReference,
        phoneNumber,
        amount,
        currency
      });
    } else if (paymentMethod === 'bank_transfer') {
      const { accountNumber, bankName } = paymentDetails;

      if (!accountNumber || !bankName) {
        return res.status(400).json({ 
          success: false, 
          message: 'Account number and bank name are required for bank transfers' 
        });
      }

      // Mock bank transfer - in production, integrate with banking APIs
      const transferReference = `BT${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

      // Send confirmation email
      if (orderDetails?.customerEmail) {
        await sendEmail(
          orderDetails.customerEmail,
          'Bank Transfer Confirmation - Thorn Bird Books',
          `Your bank transfer payment of ${amount} ${currency.toUpperCase()} has been initiated successfully.`,
          `<h2>Bank Transfer Confirmation</h2>
           <p>Your bank transfer payment of <strong>${amount} ${currency.toUpperCase()}</strong> has been initiated successfully.</p>
           <p>Bank: ${bankName}</p>
           <p>Account: ${accountNumber}</p>
           <p>Order ID: ${orderDetails.orderId}</p>
           <p>Transfer Reference: ${transferReference}</p>
           <p><em>Please allow 1-3 business days for processing.</em></p>`
        );
      }

      return res.status(200).json({
        success: true,
        message: `Bank transfer initiated successfully`,
        transferReference,
        bankName,
        amount,
        currency
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment method. Supported methods: card, mobile_money, bank_transfer' 
      });
    }
  } catch (error: any) {
    console.error('Payment processing error:', error);
    
    // Handle Stripe-specific errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message || 'Card payment failed' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed. Please try again.' 
    });
  }
};

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'zmw', orderId } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid payment amount' 
      });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        orderId: orderId || '',
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create payment intent' 
    });
  }
};

export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      res.status(400).json({ 
        success: false, 
        message: 'Payment intent ID is required' 
      });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      success: true,
      payment: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      }
    });
  } catch (error: any) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve payment status' 
    });
  }
};
