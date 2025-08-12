import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Grid,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  CreditCard,
  Phone,
  AccountBalance,
  Payment as PaymentIcon
} from '@mui/icons-material';
import axios from 'axios';

interface PaymentDetails {
  paymentMethodId?: string;
  phoneNumber?: string;
  provider?: string;
  accountNumber?: string;
  bankName?: string;
}

interface OrderDetails {
  orderId: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface PaymentFormProps {
  amount: number;
  orderDetails?: OrderDetails;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  orderDetails, 
  onSuccess, 
  onError 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const [currency] = useState('ZMW');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/payments/process', {
        amount,
        currency: currency.toLowerCase(),
        paymentMethod,
        paymentDetails,
        orderDetails
      });

      setMessage(response.data.message || 'Payment processed successfully!');
      setMessageType('success');
      
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentDetails = (field: string, value: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCard /> Card Payment
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              This is a demo. Use test card: 4242 4242 4242 4242
            </Alert>
            <TextField
              fullWidth
              label="Card Number"
              placeholder="4242 4242 4242 4242"
              onChange={(e) => updatePaymentDetails('cardNumber', e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry (MM/YY)"
                  placeholder="12/25"
                  onChange={(e) => updatePaymentDetails('expiry', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVC"
                  placeholder="123"
                  onChange={(e) => updatePaymentDetails('cvc', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 'mobile_money':
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone /> Mobile Money
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Provider</InputLabel>
              <Select
                value={paymentDetails.provider || ''}
                label="Provider"
                onChange={(e) => updatePaymentDetails('provider', e.target.value)}
                required
              >
                <MenuItem value="airtel">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Airtel Money" color="error" size="small" />
                  </Box>
                </MenuItem>
                <MenuItem value="mtn">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="MTN Mobile Money" color="warning" size="small" />
                  </Box>
                </MenuItem>
                <MenuItem value="zamtel">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Zamtel Kwacha" color="primary" size="small" />
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="0977123456"
              onChange={(e) => updatePaymentDetails('phoneNumber', e.target.value)}
              required
              helperText="Enter your mobile money registered phone number"
            />
          </Box>
        );

      case 'bank_transfer':
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalance /> Bank Transfer
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Bank transfers may take 1-3 business days to process
            </Alert>
            <TextField
              fullWidth
              label="Bank Name"
              onChange={(e) => updatePaymentDetails('bankName', e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Account Number"
              onChange={(e) => updatePaymentDetails('accountNumber', e.target.value)}
              required
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaymentIcon /> Payment Details
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary">
            Total Amount: {currency} {amount.toFixed(2)}
          </Typography>
          {orderDetails && (
            <Typography variant="body2" color="text.secondary">
              Order ID: {orderDetails.orderId}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handlePayment}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="card">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCard /> Credit/Debit Card
                </Box>
              </MenuItem>
              <MenuItem value="mobile_money">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone /> Mobile Money
                </Box>
              </MenuItem>
              <MenuItem value="bank_transfer">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance /> Bank Transfer
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {renderPaymentFields()}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              `Pay ${currency} ${amount.toFixed(2)}`
            )}
          </Button>

          {message && (
            <Alert severity={messageType} sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
