import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Autocomplete,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Skeleton,
  Rating
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Book as BookIcon
} from '@mui/icons-material';
import axios from 'axios';

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  format: string;
  stock: number;
  imageUrl?: string;
  description?: string;
}

interface SearchFilters {
  search: string;
  category: string;
  author: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  format: string;
  inStock: boolean;
  sort: string;
  order: 'asc' | 'desc';
}

interface BookSearchProps {
  onResults?: (books: Book[], total: number) => void;
  showFilters?: boolean;
  compact?: boolean;
}

const AdvancedBookSearch: React.FC<BookSearchProps> = ({ 
  onResults, 
  showFilters = true, 
  compact = false 
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: '',
    author: '',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    format: '',
    inStock: false,
    sort: 'title',
    order: 'asc'
  });

  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Fetch categories and authors for filters
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoriesRes, authorsRes] = await Promise.all([
          axios.get('/api/books/categories'),
          axios.get('/api/books/authors')
        ]);
        
        setCategories(categoriesRes.data.data || []);
        setAuthors(authorsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    
    fetchFilterData();
  }, []);

  // Debounced search
  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search.length >= 2) {
        handleSearch();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== 0 && value !== false) {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`/api/books?${params.toString()}`);
      const searchResults = response.data.data || [];
      
      setBooks(searchResults);
      
      if (onResults) {
        onResults(searchResults, response.data.pagination?.total || 0);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Search failed');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      author: '',
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      format: '',
      inStock: false,
      sort: 'title',
      order: 'asc'
    });
    setBooks([]);
  };

  const handleSearchInputChange = async (value: string) => {
    handleFilterChange('search', value);
    
    // Generate search suggestions
    if (value.length >= 2) {
      try {
        const response = await axios.get(`/api/books/search?q=${value}&limit=5`);
        const suggestions = response.data.data
          ?.map((book: Book) => book.title)
          .slice(0, 5) || [];
        setSearchSuggestions(suggestions);
      } catch (error) {
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  if (compact) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
        <Autocomplete
          freeSolo
          options={searchSuggestions}
          value={filters.search}
          onInputChange={(_, value) => handleSearchInputChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              placeholder="Search books, authors, or categories..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      color={showAdvancedFilters ? 'primary' : 'default'}
                    >
                      <FilterIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        
        {showAdvancedFilters && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sort}
                    label="Sort By"
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="price">Price</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="createdAt">Newest</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BookIcon /> Advanced Book Search
        </Typography>
        
        {/* Main Search */}
        <Autocomplete
          freeSolo
          options={searchSuggestions}
          value={filters.search}
          onInputChange={(_, value) => handleSearchInputChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              placeholder="Search books, authors, or categories..."
              sx={{ mb: 2 }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: filters.search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleFilterChange('search', '')}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}
        />

        {showFilters && (
          <>
            <Divider sx={{ my: 2 }} />
            
            {/* Quick Filters */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Quick Filters:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="Fiction"
                  clickable
                  color={filters.category === 'Fiction' ? 'primary' : 'default'}
                  onClick={() => handleFilterChange('category', filters.category === 'Fiction' ? '' : 'Fiction')}
                />
                <Chip
                  label="Non-Fiction"
                  clickable
                  color={filters.category === 'Non-Fiction' ? 'primary' : 'default'}
                  onClick={() => handleFilterChange('category', filters.category === 'Non-Fiction' ? '' : 'Non-Fiction')}
                />
                <Chip
                  label="Under $20"
                  clickable
                  color={filters.maxPrice === 20 ? 'primary' : 'default'}
                  onClick={() => handleFilterChange('maxPrice', filters.maxPrice === 20 ? 1000 : 20)}
                />
                <Chip
                  label="In Stock"
                  clickable
                  color={filters.inStock ? 'primary' : 'default'}
                  onClick={() => handleFilterChange('inStock', !filters.inStock)}
                />
                <Chip
                  label="4+ Stars"
                  clickable
                  color={filters.rating === 4 ? 'primary' : 'default'}
                  onClick={() => handleFilterChange('rating', filters.rating === 4 ? 0 : 4)}
                />
              </Box>
            </Box>

            {/* Advanced Filters */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={authors}
                  value={filters.author}
                  onChange={(_, value) => handleFilterChange('author', value || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Author" fullWidth />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={filters.format}
                    label="Format"
                    onChange={(e) => handleFilterChange('format', e.target.value)}
                  >
                    <MenuItem value="">All Formats</MenuItem>
                    <MenuItem value="hardcover">Hardcover</MenuItem>
                    <MenuItem value="paperback">Paperback</MenuItem>
                    <MenuItem value="ebook">E-book</MenuItem>
                    <MenuItem value="audiobook">Audiobook</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sort}
                    label="Sort By"
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="price">Price</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="createdAt">Newest</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>
                  Price Range: ${filters.minPrice} - ${filters.maxPrice}
                </Typography>
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onChange={(_, value) => {
                    const [min, max] = value as number[];
                    handleFilterChange('minPrice', min);
                    handleFilterChange('maxPrice', max);
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 250, label: '$250' },
                    { value: 500, label: '$500' },
                    { value: 1000, label: '$1000+' }
                  ]}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>
                  Minimum Rating
                </Typography>
                <Rating
                  value={filters.rating}
                  onChange={(_, value) => handleFilterChange('rating', value || 0)}
                  precision={1}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    />
                  }
                  label="In Stock Only"
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Books'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        {books.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Results ({books.length} found)
            </Typography>
            <Grid container spacing={2}>
              {books.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book._id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" noWrap>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        by {book.author}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {book.category} • {book.format}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating value={book.rating} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({book.rating})
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        ${book.price.toFixed(2)}
                      </Typography>
                      {book.stock > 0 ? (
                        <Chip label="In Stock" color="success" size="small" />
                      ) : (
                        <Chip label="Out of Stock" color="error" size="small" />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {loading && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedBookSearch;