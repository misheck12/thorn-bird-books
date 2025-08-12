import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZMW');
  const [message, setMessage] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/payments/pay', {
        amount: parseInt(amount, 10),
        currency,
        paymentMethod,
        paymentDetails,
      });
      setMessage(response.data.message || 'Payment successful!');
    } catch (error) {
      setMessage((error as any).response?.data?.message || 'Payment failed.');
    }
  };

  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div>
            <label>Card Payment ID:</label>
            <input
              type="text"
              onChange={(e) => setPaymentDetails({ paymentMethodId: e.target.value })}
              required
            />
          </div>
        );
      case 'mobile_money':
        return (
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              onChange={(e) => setPaymentDetails({ phoneNumber: e.target.value })}
              required
            />
          </div>
        );
      case 'bank_transfer':
        return (
          <div>
            <label>Account Number:</label>
            <input
              type="text"
              onChange={(e) => setPaymentDetails({ accountNumber: e.target.value })}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <h2>Make a Payment</h2>

      <label>Amount:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <label>Currency:</label>
      <input
        type="text"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        required
      />

      <label>Payment Method:</label>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="card">Card</option>
        <option value="mobile_money">Mobile Money</option>
        <option value="bank_transfer">Bank Transfer</option>
      </select>

      {renderPaymentFields()}

      <button type="submit">Pay</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default PaymentForm;
