import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookService } from '../services/books';
import { Book } from '../types';

const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const currentPrice = book.discountPrice || book.price;
  const hasDiscount = book.discountPrice && book.discountPrice < book.price;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={book.images[0] || '/placeholder-book.jpg'}
        alt={book.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          by {book.author}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {book.description.substring(0, 100)}...
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Typography variant="h6" color="primary">
            ${currentPrice.toFixed(2)}
          </Typography>
          {hasDiscount && (
            <Typography
              variant="body2"
              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
            >
              ${book.price.toFixed(2)}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Chip
            label={book.format}
            size="small"
            variant="outlined"
          />
          <Button
            component={Link}
            to={`/books/${book._id}`}
            variant="contained"
            size="small"
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const BookSection: React.FC<{ title: string; books: Book[]; loading: boolean }> = ({
  title,
  books,
  loading,
}) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h4" component="h2" gutterBottom>
      {title}
    </Typography>
    {loading ? (
      <Typography>Loading...</Typography>
    ) : (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {books.map((book) => (
          <Box key={book._id} sx={{ width: { xs: '100%', sm: '300px', md: '250px', lg: '200px' } }}>
            <BookCard book={book} />
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

const Home: React.FC = () => {
  const { data: featuredBooks = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-books'],
    queryFn: () => bookService.getFeaturedBooks(6),
  });

  const { data: newArrivals = [], isLoading: newArrivalsLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => bookService.getNewArrivals(6),
  });

  const { data: bestSellers = [], isLoading: bestSellersLoading } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: () => bookService.getBestSellers(6),
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(/hero-books.jpg)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            p: { xs: 3, md: 6 },
            pr: { md: 0 },
          }}
        >
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            Welcome to Thorn Bird Books
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Discover your next great read from our carefully curated collection
            of books spanning all genres and interests.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/books"
            sx={{ mt: 2 }}
          >
            Browse Books
          </Button>
        </Box>
      </Paper>

      {/* Featured Books */}
      <BookSection
        title="Featured Books"
        books={featuredBooks}
        loading={featuredLoading}
      />

      {/* New Arrivals */}
      <BookSection
        title="New Arrivals"
        books={newArrivals}
        loading={newArrivalsLoading}
      />

      {/* Best Sellers */}
      <BookSection
        title="Best Sellers"
        books={bestSellers}
        loading={bestSellersLoading}
      />
    </Container>
  );
};

export default Home;