import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Create base theme
let theme = createTheme({
  palette: {
    primary: {
      main: '#eab308', // Yellow - warm, welcoming, creative
      light: '#fcd34d',
      dark: '#ca8a04',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#22c55e', // Green - growth, freshness, harmony
      light: '#4ade80',
      dark: '#15803d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    // Enhanced button components for mobile
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '1rem',
          lineHeight: 1.5,
          // Minimum touch target size for mobile accessibility
          minHeight: 44,
          minWidth: 44,
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1.1rem',
          minHeight: 48,
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.875rem',
          minHeight: 36,
        },
      },
    },
    // Enhanced fab for mobile
    MuiFab: {
      styleOverrides: {
        root: {
          // Ensure proper touch target size
          width: 56,
          height: 56,
        },
        sizeSmall: {
          width: 44,
          height: 44,
        },
        sizeMedium: {
          width: 56,
          height: 56,
        },
      },
    },
    // Enhanced icon buttons for mobile
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Minimum touch target size
          minWidth: 44,
          minHeight: 44,
          padding: 8,
        },
        sizeSmall: {
          minWidth: 36,
          minHeight: 36,
          padding: 6,
        },
        sizeLarge: {
          minWidth: 52,
          minHeight: 52,
          padding: 12,
        },
      },
    },
    // Enhanced text fields for mobile
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            minHeight: 48, // Better touch target
          },
        },
      },
    },
    // Enhanced cards with better mobile spacing
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    // Enhanced list items for better mobile interaction
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 48,
          '&:hover': {
            backgroundColor: alpha('#eab308', 0.08),
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#eab308', 0.12),
            '&:hover': {
              backgroundColor: alpha('#eab308', 0.16),
            },
          },
        },
      },
    },
    // Enhanced chips for mobile
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          height: 36, // Better touch target
        },
        sizeSmall: {
          height: 28,
        },
      },
    },
    // Enhanced drawer for mobile
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '16px 16px 0 0',
        },
      },
    },
    // Enhanced app bar
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    // Enhanced toolbar with proper spacing
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
          '@media (max-width: 600px)': {
            minHeight: 56,
            paddingLeft: 8,
            paddingRight: 8,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme, {
  breakpoints: ['sm', 'md', 'lg'],
  factor: 2.5,
});

// Add custom mobile-specific styles
theme.components = {
  ...theme.components,
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        // Prevent zoom on input focus in iOS
        fontSize: '16px',
        '@media (max-width: 600px)': {
          fontSize: '16px',
        },
      },
      body: {
        // Smooth scrolling
        scrollBehavior: 'smooth',
        // Prevent horizontal scrolling on mobile
        overflowX: 'hidden',
        // Better touch scrolling on iOS
        WebkitOverflowScrolling: 'touch',
        // Disable text selection where not needed
        userSelect: 'none',
        // Re-enable text selection for text content
        '& p, & h1, & h2, & h3, & h4, & h5, & h6, & span, & div[role="article"]': {
          userSelect: 'text',
        },
      },
      // Custom scrollbar styles
      '*::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '*::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
      },
      '*::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '4px',
        '&:hover': {
          background: '#a8a8a8',
        },
      },
      // Focus styles for accessibility
      '*:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
      },
      // Mobile-specific touch improvements
      '@media (max-width: 600px)': {
        // Improve tap highlighting
        '*': {
          WebkitTapHighlightColor: 'transparent',
        },
        // Prevent zoom on form inputs
        'input, select, textarea': {
          fontSize: '16px !important',
        },
        // Better spacing for mobile
        '.MuiContainer-root': {
          paddingLeft: '16px',
          paddingRight: '16px',
        },
      },
    },
  },
};

export { theme };
export default theme;