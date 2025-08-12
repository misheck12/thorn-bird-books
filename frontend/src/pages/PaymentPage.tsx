import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PaymentForm from '../components/PaymentForm';

const PaymentPage = () => {
  // Mock order data - in real app, this would come from cart/order context
  const mockOrderDetails = {
    orderId: 'ORD-' + Date.now(),
    customerEmail: 'customer@example.com',
    items: [
      {
        name: 'Sample Book',
        quantity: 1,
        price: 25.99
      }
    ]
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Complete Your Payment
      </Typography>
      <Box sx={{ mt: 4 }}>
        <PaymentForm 
          amount={25.99}
          orderDetails={mockOrderDetails}
          onSuccess={(result) => {
            console.log('Payment successful:', result);
            // Redirect to success page
          }}
          onError={(error) => {
            console.error('Payment error:', error);
          }}
        />
      </Box>
    </Container>
  );
};

export default PaymentPage;