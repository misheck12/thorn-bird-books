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
  Fab,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
  Stack,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Close as CloseIcon,
  ViewModule,
  ViewList,
  Tune as TuneIcon
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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
      <Box mb={3}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: 'bold' }}
        >
          Books
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover your next great read from our extensive collection
        </Typography>
      </Box>

      {/* Mobile Quick Search Bar */}
      {isMobile && (
        <Box mb={2}>
          <TextField
            fullWidth
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleFilterChange('search', searchQuery);
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              endAdornment: (
                <IconButton onClick={() => setFiltersOpen(true)} size="small">
                  <TuneIcon />
                </IconButton>
              ),
              sx: {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }
            }}
          />
        </Box>
      )}

      {/* Desktop Filters */}
      {!isMobile && (
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
      )}

      {/* Mobile Active Filters */}
      {isMobile && (filters.search || filters.category) && (
        <Box mb={2}>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {filters.search && (
              <Chip
                label={`"${filters.search}"`}
                onDelete={() => handleFilterChange('search', '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.category && (
              <Chip
                label={filters.category}
                onDelete={() => handleFilterChange('category', '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}

      {/* Results Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={2}
        sx={{ 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}
      >
        {booksData && (
          <Typography variant="body2" color="text.secondary">
            Showing {booksData.books.length} of {booksData.pagination?.total || 0} books
          </Typography>
        )}
        
        {/* View Mode Toggle for larger screens */}
        {!isMobile && (
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
              size="small"
            >
              <ViewModule />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
              size="small"
            >
              <ViewList />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Books Grid */}
      <Grid container spacing={isMobile ? 2 : 3}>
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 12 }).map((_, index) => (
            <Grid xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={isMobile ? 200 : 250} />
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
            <Grid xs={12} sm={6} md={viewMode === 'list' ? 12 : 4} lg={viewMode === 'list' ? 12 : 3} key={book._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: viewMode === 'list' && !isMobile ? 'row' : 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height={isMobile ? "200" : viewMode === 'list' ? "160" : "250"}
                  image={book.images?.[0] || '/placeholder-book.jpg'}
                  alt={book.title}
                  sx={{ 
                    objectFit: 'cover',
                    width: viewMode === 'list' && !isMobile ? 120 : '100%',
                    flexShrink: 0
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: 1,
                  minWidth: 0 // Prevents text overflow in flex containers
                }}>
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      component="h2" 
                      gutterBottom 
                      sx={{
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3
                      }}
                    >
                      {book.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ mb: 1 }}
                    >
                      by {book.author}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Rating 
                        value={book.rating} 
                        precision={0.5} 
                        size={isMobile ? "small" : "small"} 
                        readOnly 
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({book.reviewCount})
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography 
                        variant={isMobile ? "h6" : "h6"} 
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                      >
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

                    <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
                      <Chip
                        label={book.format}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      {book.category && (
                        <Chip
                          label={book.category}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>

                    {book.stock <= 5 && book.stock > 0 && (
                      <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'medium' }}>
                        Only {book.stock} left in stock
                      </Typography>
                    )}

                    {book.stock === 0 && (
                      <Typography variant="body2" color="error.main" sx={{ fontWeight: 'medium' }}>
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
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        py: isMobile ? 1.5 : 1
                      }}
                    >
                      {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </CardActions>
                </Box>
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
            size={isMobile ? "medium" : "large"}
            showFirstButton={!isMobile}
            showLastButton={!isMobile}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
          />
        </Box>
      )}

      {/* Mobile Filters Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onOpen={() => setFiltersOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            height: '85vh',
            borderRadius: '16px 16px 0 0',
          }
        }}
      >
        <AppBar 
          position="static" 
          color="transparent" 
          elevation={0}
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bold' }}>
              Filters & Sort
            </Typography>
            <IconButton onClick={() => setFiltersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Stack spacing={3}>
            {/* Search */}
            <TextField
              fullWidth
              label="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleFilterChange('search', searchQuery);
                }
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />

            <Divider />

            {/* Category Filter */}
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

            {/* Sort Options */}
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Sort By
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sort Field</InputLabel>
                <Select
                  value={filters.sort || 'title'}
                  label="Sort Field"
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="publishedDate">Publication Date</MenuItem>
                </Select>
              </FormControl>
              
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
            </Box>

            <Divider />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={clearFilters}
                disabled={!filters.search && !filters.category}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  if (searchQuery !== filters.search) {
                    handleFilterChange('search', searchQuery);
                  }
                  setFiltersOpen(false);
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Stack>
        </Box>
      </SwipeableDrawer>

      {/* Floating Action Button for Mobile Filters */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filters"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
          onClick={() => setFiltersOpen(true)}
        >
          <TuneIcon />
        </Fab>
      )}
    </Container>
  );
};

export default Books;