import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Layout from '../components/layout/Layout';
import CategoryChips from '../components/CategoryChips';
import ProductScrollSection from '../components/ProductScrollSection';
import { useCategories } from '../hooks/useCategories';
import { productService } from '../services/productService';

export default function Home() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [sections, setSections] = useState({
    newProducts: [],
    mostPopular: [],
    allProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        const data = await productService.getHomeSections();
        setSections(data);
      } catch (err) {
        console.error('Failed to load homepage sections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  // Map categoryId to category name for quick badge display on cards
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  return (
    <Layout>
      {/* Hero Banner - Minimalist, modern typography, zero emojis */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          py: { xs: 6, md: 9 },
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ maxWidth: 840, mx: 'auto', textAlign: 'center' }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'secondary.main',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                display: 'block',
                mb: 1.5,
              }}
            >
              Curated Product Showcase
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '-0.035em',
                lineHeight: 1.15,
                mb: 2.5,
              }}
            >
              Exceptional gear and everyday essentials.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.6,
                mb: 4,
                maxWidth: 680,
                mx: 'auto',
              }}
            >
              Discover handpicked electronics, ergonomic workstation equipment, audio gear, and
              curated accessories with verified vendor links.
            </Typography>

            {/* Quick CTAs */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/products"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 3.5, py: 1.4, fontSize: '0.95rem' }}
              >
                Browse Catalog
              </Button>

              <Button
                component={RouterLink}
                to="/products?sort=popular"
                variant="outlined"
                color="primary"
                size="large"
                sx={{ px: 3.5, py: 1.4, fontSize: '0.95rem' }}
              >
                View Top Rated
              </Button>
            </Box>

            {/* Trust Badges */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 3, md: 6 },
                mt: 6,
                pt: 4,
                borderTop: '1px solid #F3F4F6',
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedIcon sx={{ fontSize: '1.1rem', color: 'secondary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Hand-Curated Items
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldOutlinedIcon sx={{ fontSize: '1.1rem', color: 'secondary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Direct Merchant Links
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingOutlinedIcon sx={{ fontSize: '1.1rem', color: 'secondary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  No Middleman Markup
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Category Chips Bar */}
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'text.secondary',
            display: 'block',
            mb: 0.5,
          }}
        >
          Explore by Category
        </Typography>
        <CategoryChips
          categories={categories}
          selectedCategory=""
          onSelect={(catId) => {
            if (catId === 'all') {
              navigate('/products');
            } else {
              navigate(`/products?category=${catId}`);
            }
          }}
        />
      </Container>

      {/* Main Catalog Showcase Sections */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={40} thickness={4} sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <>
            {/* Section 1: New Products */}
            <ProductScrollSection
              title="New Arrivals"
              subtitle="Recently added products and latest releases."
              products={sections.newProducts}
              viewAllLink="/products?sort=new"
              categoryMap={categoryMap}
              emptyMessage="No new products found."
            />

            <Divider sx={{ my: 2 }} />

            {/* Section 2: Most Popular */}
            <ProductScrollSection
              title="Most Popular"
              subtitle="Top rated gear and community favorites."
              products={sections.mostPopular}
              viewAllLink="/products?sort=popular"
              categoryMap={categoryMap}
              emptyMessage="No popular products found."
            />

            <Divider sx={{ my: 2 }} />

            {/* Section 3: All Products */}
            <ProductScrollSection
              title="Featured Collection"
              subtitle="A curated glimpse from across our complete catalog."
              products={sections.allProducts}
              viewAllLink="/products"
              categoryMap={categoryMap}
              emptyMessage="No products available."
            />
          </>
        )}
      </Container>
    </Layout>
  );
}
