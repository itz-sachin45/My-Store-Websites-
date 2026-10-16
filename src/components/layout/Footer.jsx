import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        mt: 'auto',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.02em' }}>
              MY STORE
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mb: 2 }}>
              A curated catalog of premium products, modern essentials, and workspace technology.
              We hand-select products and link directly to trusted partner merchants.
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                p: 1.5,
                borderRadius: 1,
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                lineHeight: 1.6,
              }}
            >
              Affiliate Disclosure: When you click on product links and purchase items through our
              store, we may receive an affiliate commission from our retail partners at no
              additional cost to you.
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Link component={RouterLink} to="/" color="text.secondary" underline="hover" variant="body2">
                Home
              </Link>
              <Link component={RouterLink} to="/products" color="text.secondary" underline="hover" variant="body2">
                All Products
              </Link>
              <Link component={RouterLink} to="/products?sort=popular" color="text.secondary" underline="hover" variant="body2">
                Most Popular
              </Link>
              <Link component={RouterLink} to="/products?sort=new" color="text.secondary" underline="hover" variant="body2">
                New Arrivals
              </Link>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Link component={RouterLink} to="/products?category=cat-electronics" color="text.secondary" underline="hover" variant="body2">
                Electronics
              </Link>
              <Link component={RouterLink} to="/products?category=cat-home" color="text.secondary" underline="hover" variant="body2">
                Home & Setup
              </Link>
              <Link component={RouterLink} to="/products?category=cat-fashion" color="text.secondary" underline="hover" variant="body2">
                Apparel & Carry
              </Link>
              <Link component={RouterLink} to="/products?category=cat-kitchen" color="text.secondary" underline="hover" variant="body2">
                Kitchen & Coffee
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
              Management
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Link component={RouterLink} to="/admin" color="text.secondary" underline="hover" variant="body2">
                Admin Panel
              </Link>
              <Link component={RouterLink} to="/admin/login" color="text.secondary" underline="hover" variant="body2">
                Admin Sign In
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            &copy; 2026 My Store. All rights reserved. Built with React, Vite, and Material UI.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Static build optimized for cPanel deployment
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
