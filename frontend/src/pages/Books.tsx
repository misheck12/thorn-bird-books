import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  Pagination,
  Paper,
  Skeleton,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { bookService } from '../services/books';
import { useCartStore, useAuthStore } from '../store';
import { Book, BookFilters } from '../types';
import { toast } from 'react-toastify';

const Books: React.FC = () => {
  const [filters, setFilters] = useState<BookFilters>({
    page: 1,
    limit: 12,
    sort: 'title',
    order: 'asc',
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);

  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // Fetch books with current filters
  const {
    data: booksData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['books', filters],
    queryFn: () => bookService.getAllBooks(filters),
  });

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await bookService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    const fetchAuthors = async () => {
      try {
        const authorsData = await bookService.getAuthors();
        setAuthors(authorsData);
      } catch (error) {
        console.error('Failed to fetch authors:', error);
      }
    };

    fetchCategories();
    fetchAuthors();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: event.target.value,
      page: 1,
    });
  };

  const handleFilterChange = (filterName: keyof BookFilters, value: any) => {
    setFilters({
      ...filters,
      [filterName]: value,
      page: 1,
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  const handleAddToCart = async (book: Book) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(book._id);
      toast.success(`${book.title} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item to cart');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sort: 'title',
      order: 'asc',
    });
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load books. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Books
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover your next great read from our extensive collection
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              label="Search books..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>

          {/* Category Filter */}
          <Grid xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category || ''}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort */}
          <Grid xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sort || 'title'}
                label="Sort By"
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="publishedDate">Publication Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Order */}
          <Grid xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select
                value={filters.order || 'asc'}
                label="Order"
                onChange={(e) => handleFilterChange('order', e.target.value as 'asc' | 'desc')}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters */}
          <Grid xs={12} md={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={clearFilters}
              disabled={!filters.search && !filters.category}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        {/* Active Filters */}
        {(filters.search || filters.category) && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Active Filters:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {filters.search && (
                <Chip
                  label={`Search: "${filters.search}"`}
                  onDelete={() => handleFilterChange('search', '')}
                  size="small"
                />
              )}
              {filters.category && (
                <Chip
                  label={`Category: ${filters.category}`}
                  onDelete={() => handleFilterChange('category', '')}
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Results Info */}
      {booksData && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Showing {booksData.books.length} of {booksData.pagination?.total || 0} books
          </Typography>
        </Box>
      )}

      {/* Books Grid */}
      <Grid container spacing={3}>
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 12 }).map((_, index) => (
            <Grid xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={250} />
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : booksData?.books.length === 0 ? (
          <Grid xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No books found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search terms
              </Typography>
            </Paper>
          </Grid>
        ) : (
          booksData?.books.map((book) => (
            <Grid xs={12} sm={6} md={4} lg={3} key={book._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={book.images?.[0] || '/placeholder-book.jpg'}
                  alt={book.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Rating value={book.rating} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({book.reviewCount})
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="h6" color="primary">
                      {formatPrice(book.price)}
                    </Typography>
                    {book.discountPrice && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {formatPrice(book.discountPrice)}
                      </Typography>
                    )}
                  </Box>

                  <Chip
                    label={book.format}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />

                  {book.stock <= 5 && book.stock > 0 && (
                    <Typography variant="body2" color="warning.main">
                      Only {book.stock} left in stock
                    </Typography>
                  )}

                  {book.stock === 0 && (
                    <Typography variant="body2" color="error.main">
                      Out of Stock
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<CartIcon />}
                    onClick={() => handleAddToCart(book)}
                    disabled={book.stock === 0}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      {booksData?.pagination && booksData.pagination.pages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={booksData.pagination.pages}
            page={filters.page || 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default Books;