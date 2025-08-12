import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Fab,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Book as BookIcon,
  Star,
  AttachMoney,
  Category
} from '@mui/icons-material';
import AdvancedBookSearch from './AdvancedBookSearch';

interface MobileSearchPageProps {
  defaultQuery?: string;
}

const MobileSearchPage: React.FC<MobileSearchPageProps> = ({ defaultQuery = '' }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches] = useState([
    'Fiction Books',
    'Stephen King',
    'Mystery novels',
    'Programming books',
    'Self help'
  ]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const popularCategories = [
    { name: 'Fiction', icon: '📚', color: '#f87171' },
    { name: 'Non-Fiction', icon: '📖', color: '#60a5fa' },
    { name: 'Mystery', icon: '🔍', color: '#a78bfa' },
    { name: 'Romance', icon: '💕', color: '#fb7185' },
    { name: 'Sci-Fi', icon: '🚀', color: '#34d399' },
    { name: 'Biography', icon: '👤', color: '#fbbf24' }
  ];

  const trendingBooks = [
    { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', rating: 4.5, price: 15.99 },
    { title: 'Where the Crawdads Sing', author: 'Delia Owens', rating: 4.3, price: 14.99 },
    { title: 'The Silent Patient', author: 'Alex Michaelides', rating: 4.2, price: 13.99 }
  ];

  const handleSearchSubmit = (query: string) => {
    // Implement search logic
    console.log('Searching for:', query);
    setSearchOpen(false);
  };

  if (!isMobile) {
    // Desktop view - use the advanced search component
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <AdvancedBookSearch onResults={(books, total) => setSearchResults(books)} />
      </Container>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Main search interface */}
      <Container maxWidth="sm" sx={{ px: 2, py: 2 }}>
        {/* Quick search bar */}
        <Card 
          sx={{ 
            mb: 3, 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="What are you looking for?"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchOpen(true)} size="small">
                      <FilterIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Popular Categories
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            {popularCategories.map((category) => (
              <Card 
                key={category.name}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:active': { transform: 'scale(0.95)' },
                  border: `1px solid ${alpha(category.color, 0.3)}`,
                  background: `linear-gradient(135deg, ${alpha(category.color, 0.1)} 0%, ${alpha(category.color, 0.05)} 100%)`
                }}
                onClick={() => handleSearchSubmit(category.name)}
              >
                <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                  <Typography variant="h4" sx={{ mb: 0.5 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Trending Books */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            📈 Trending Now
          </Typography>
          <List sx={{ p: 0 }}>
            {trendingBooks.map((book, index) => (
              <Card key={index} sx={{ mb: 1 }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <BookIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {book.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          by {book.author}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <Star sx={{ fontSize: 16, color: '#fbbf24', mr: 0.5 }} />
                            <Typography variant="caption">{book.rating}</Typography>
                          </Box>
                          <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            ${book.price}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </Card>
            ))}
          </List>
        </Box>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              🕒 Recent Searches
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {recentSearches.map((search, index) => (
                <Chip
                  key={index}
                  label={search}
                  onClick={() => handleSearchSubmit(search)}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2)
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Container>

      {/* Advanced Search Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpen={() => setSearchOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            height: '90vh',
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
              Advanced Search
            </Typography>
            <IconButton onClick={() => setSearchOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <AdvancedBookSearch 
            compact={true}
            onResults={(books, total) => {
              setSearchResults(books);
              setSearchOpen(false);
            }}
          />
        </Box>
      </SwipeableDrawer>

      {/* Floating Action Button for Quick Search */}
      <Fab
        color="primary"
        aria-label="search"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
        onClick={() => setSearchOpen(true)}
      >
        <SearchIcon />
      </Fab>
    </Box>
  );
};

export default MobileSearchPage;