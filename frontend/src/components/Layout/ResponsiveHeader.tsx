import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  InputBase,
  styled,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse,
  Avatar
} from '@mui/material';
import {
  ShoppingCart,
  Search as SearchIcon,
  AccountCircle,
  Menu as MenuIcon,
  Close as CloseIcon,
  Home,
  Info,
  Business,
  Book,
  Event,
  Article,
  ContactMail,
  ExpandLess,
  ExpandMore,
  Person,
  Settings,
  Logout
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    textDecoration: 'none',
  }
}));

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const ResponsiveHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Mock user state - in real app, this would come from auth context
  const user = { name: 'John Doe', email: 'john@example.com', avatar: null };
  const cartItemCount = 3; // Mock cart count

  const navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: <Home /> },
    { path: '/about', label: 'About', icon: <Info /> },
    { 
      path: '/services', 
      label: 'Services', 
      icon: <Business />,
      children: [
        { path: '/services/publishing', label: 'Publishing', icon: <Article /> },
        { path: '/services/editing', label: 'Editing', icon: <Article /> },
        { path: '/services/consulting', label: 'Consulting', icon: <Business /> }
      ]
    },
    { path: '/books', label: 'Bookstore', icon: <Book /> },
    { path: '/events', label: 'Events', icon: <Event /> },
    { path: '/blog', label: 'Blog', icon: <Article /> },
    { path: '/contact', label: 'Contact', icon: <ContactMail /> }
  ];

  const userMenuItems = [
    { label: 'Profile', icon: <Person />, path: '/profile' },
    { label: 'Orders', icon: <ShoppingCart />, path: '/orders' },
    { label: 'Settings', icon: <Settings />, path: '/settings' },
    { label: 'Logout', icon: <Logout />, action: 'logout' }
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  const handleUserMenuClick = (item: any) => {
    if (item.action === 'logout') {
      // Handle logout
      console.log('Logout clicked');
    } else {
      navigate(item.path);
    }
    setUserMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  const MobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          backgroundColor: theme.palette.background.default
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box 
            component={Link} 
            to="/" 
            onClick={handleMobileMenuToggle}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                textDecoration: 'none',
              }
            }}
          >
            <Avatar sx={{ bgcolor: '#eab308', mr: 1, width: 32, height: 32 }}>
              TB
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Thorn Bird Books
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Publishing Excellence
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleMobileMenuToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <List>
          {navItems.map((item) => (
            <Box key={item.path}>
              <ListItemButton
                component={item.children ? 'div' : Link}
                to={item.children ? undefined : item.path}
                onClick={item.children ? 
                  () => setServicesMenuOpen(!servicesMenuOpen) : 
                  handleMobileMenuToggle
                }
                selected={isActivePath(item.path)}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.children && (servicesMenuOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              
              {item.children && (
                <Collapse in={servicesMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((subItem) => (
                      <ListItemButton
                        key={subItem.path}
                        component={Link}
                        to={subItem.path}
                        onClick={handleMobileMenuToggle}
                        selected={isActivePath(subItem.path)}
                        sx={{ pl: 4, borderRadius: 1, ml: 2, mr: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 35 }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={subItem.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        {/* User section in mobile menu */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ px: 2, mb: 1 }}>
            Account
          </Typography>
          <List>
            {userMenuItems.map((item) => (
              <ListItemButton
                key={item.label}
                onClick={() => handleUserMenuClick(item)}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: 'white', 
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: isMobile ? 1 : 0, 
              mr: { md: 4 },
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                textDecoration: 'none',
              }
            }}
          >
            <Avatar sx={{ bgcolor: '#eab308', mr: 1, width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}>
              TB
            </Avatar>
            {!isMobile && (
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  Thorn Bird Books
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Publishing Excellence
                </Typography>
              </Box>
            )}
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    mx: 1,
                    color: isActivePath(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActivePath(item.path) ? 'bold' : 'normal',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Search Bar */}
          {!isMobile && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <form onSubmit={handleSearch}>
                <StyledInputBase
                  placeholder="Search books…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </form>
            </Search>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Mobile search button */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => navigate('/search')}
                size="small"
              >
                <SearchIcon />
              </IconButton>
            )}

            {/* Cart */}
            <IconButton
              color="inherit"
              component={Link}
              to="/cart"
              size={isMobile ? "small" : "medium"}
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* User Menu */}
            {!isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                size="medium"
              >
                {user.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Search Bar */}
        {isMobile && (
          <Box sx={{ px: 2, pb: 1 }}>
            <form onSubmit={handleSearch}>
              <Search sx={{ width: '100%', mr: 0 }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search books…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  sx={{ width: '100%' }}
                />
              </Search>
            </form>
          </Box>
        )}
      </AppBar>

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Desktop User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={userMenuOpen && !isMobile}
        onClose={() => setUserMenuOpen(false)}
        onClick={() => setUserMenuOpen(false)}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Divider />
        {userMenuItems.map((item) => (
          <MenuItem key={item.label} onClick={() => handleUserMenuClick(item)}>
            <ListItemIcon sx={{ minWidth: 35 }}>
              {item.icon}
            </ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ResponsiveHeader;