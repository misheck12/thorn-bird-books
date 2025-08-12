import React from 'react';
import { Box, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { theme } from '../../theme';
import ResponsiveHeader from './ResponsiveHeader';
import Footer from './Footer';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'background.default'
          }}
        >
          {/* Header */}
          <ResponsiveHeader />

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: isMobile ? 1 : 2,
              pb: isMobile ? 10 : 4, // Extra bottom padding on mobile for FAB
              minHeight: 'calc(100vh - 64px)', // Account for header height
              // Ensure content doesn't go under mobile browser UI
              paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 80px)' : undefined
            }}
          >
            {children}
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default ResponsiveLayout;