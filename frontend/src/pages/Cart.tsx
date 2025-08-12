import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  Button,
  Paper,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useCartStore } from '../store';
import { Book, CartItem } from '../types';
import { toast } from 'react-toastify';

const Cart: React.FC = () => {
  const {
    cart,
    isLoading,
    itemCount,
    totalAmount,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (bookId: string, currentQuantity: number, increment: boolean) => {
    try {
      const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
      if (newQuantity <= 0) {
        await removeFromCart(bookId);
        toast.success('Item removed from cart');
      } else {
        await updateCartItem(bookId, newQuantity);
        toast.success('Cart updated');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (bookId: string) => {
    try {
      await removeFromCart(bookId);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getBookData = (item: CartItem): Book | null => {
    if (typeof item.bookId === 'string') {
      return null; // Need to populate book data
    }
    return item.bookId as Book;
  };

  if (isLoading) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Typography>Loading cart...</Typography>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Looks like you haven't added any books to your cart yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/books"
          >
            Browse Books
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Chip
          label={`${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Items in your cart
            </Typography>
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearCart}
              size="small"
            >
              Clear Cart
            </Button>
          </Box>

          {cart.items.map((item) => {
            const book = getBookData(item);
            return (
              <Card key={typeof item.bookId === 'string' ? item.bookId : item.bookId._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Book Image */}
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        image={book?.images?.[0] || '/placeholder-book.jpg'}
                        alt={book?.title || 'Book'}
                        sx={{
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </Grid>

                    {/* Book Details */}
                    <Grid item xs={12} sm={5}>
                      <Typography variant="h6" gutterBottom>
                        {book?.title || 'Book Title'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        by {book?.author || 'Unknown Author'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book?.format || 'Paperback'} • {book?.pages || 'N/A'} pages
                      </Typography>
                    </Grid>

                    {/* Quantity Controls */}
                    <Grid item xs={12} sm={2}>
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(
                            typeof item.bookId === 'string' ? item.bookId : item.bookId._id,
                            item.quantity,
                            false
                          )}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ mx: 2, minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(
                            typeof item.bookId === 'string' ? item.bookId : item.bookId._id,
                            item.quantity,
                            true
                          )}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>

                    {/* Price and Actions */}
                    <Grid item xs={12} sm={2}>
                      <Box textAlign="center">
                        <Typography variant="h6" color="primary">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(item.price)} each
                        </Typography>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveItem(
                            typeof item.bookId === 'string' ? item.bookId : item.bookId._id
                          )}
                          sx={{ mt: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2">
                Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})
              </Typography>
              <Typography variant="body2">
                {formatPrice(totalAmount)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2">
                Shipping
              </Typography>
              <Typography variant="body2" color="success.main">
                FREE
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2">
                Tax
              </Typography>
              <Typography variant="body2">
                Calculated at checkout
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">
                Total
              </Typography>
              <Typography variant="h6" color="primary">
                {formatPrice(totalAmount)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mb: 2 }}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outlined"
              fullWidth
              href="/books"
            >
              Continue Shopping
            </Button>

            <Alert severity="info" sx={{ mt: 2 }}>
              Free shipping on all orders over $25
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;