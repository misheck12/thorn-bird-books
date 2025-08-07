import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[800],
        color: (theme) => theme.palette.grey[300],
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <Typography variant="h6" color="white" gutterBottom>
              Thorn Bird Books
            </Typography>
            <Typography variant="body2">
              Your premier destination for quality books and literary events.
              Discover new worlds through reading.
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <Typography variant="h6" color="white" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/books" color="inherit" display="block">
                Browse Books
              </Link>
              <Link href="/events" color="inherit" display="block">
                Events
              </Link>
              <Link href="/about" color="inherit" display="block">
                About Us
              </Link>
              <Link href="/contact" color="inherit" display="block">
                Contact
              </Link>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <Typography variant="h6" color="white" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2">
              123 Book Street<br />
              Reading City, RC 12345<br />
              Phone: (555) 123-BOOK<br />
              Email: info@thornbirdbooks.com
            </Typography>
          </Box>
        </Box>
        <Box mt={5}>
          <Typography variant="body2" color="textSecondary" align="center">
            {'© '}
            {new Date().getFullYear()}{' '}
            Thorn Bird Books. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;