import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Rating,
  Chip,
  Breadcrumbs,
  Link,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Layout from '../components/layout/Layout';
import { productService, formatUrl } from '../services/productService';
import { categoryService } from '../services/categoryService';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const item = await productService.getById(id);
        if (!item) {
          setError('Product not found');
        } else {
          setProduct(item);
          if (item.categoryId) {
            const cat = await categoryService.getById(item.categoryId);
            setCategory(cat);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const fallbackImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80';

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 12, textAlign: 'center' }}>
          <CircularProgress size={44} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading product details...
          </Typography>
        </Container>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
            Product Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The product you requested does not exist or may have been removed.
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
          >
            Back to All Products
          </Button>
        </Container>
      </Layout>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price || 0);

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link component={RouterLink} to="/" color="text.secondary" underline="hover">
            Home
          </Link>
          <Link component={RouterLink} to="/products" color="text.secondary" underline="hover">
            Products
          </Link>
          {category && (
            <Link
              component={RouterLink}
              to={`/products?category=${category.id}`}
              color="text.secondary"
              underline="hover"
            >
              {category.name}
            </Link>
          )}
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            {product.title}
          </Typography>
        </Breadcrumbs>

        {/* Back Link */}
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          size="small"
          sx={{ color: 'text.secondary', mb: 3 }}
        >
          Back
        </Button>

        {/* Main Details Grid */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Left Column: Hero Product Image */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                position: 'relative',
              }}
            >
              {product.isPopular && (
                <Chip
                  label="Community Favorite"
                  color="secondary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 2,
                    fontWeight: 700,
                  }}
                />
              )}
              <Box
                component="img"
                src={product.imageUrl || fallbackImage}
                alt={product.title}
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 560,
                  objectFit: 'contain',
                  display: 'block',
                  backgroundColor: '#FFFFFF',
                  p: { xs: 2, sm: 4 },
                }}
              />
            </Paper>
          </Grid>

          {/* Right Column: Title, Rating, Price, Description, Buy Now CTA */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Category Tag */}
              {category && (
                <Chip
                  component={RouterLink}
                  to={`/products?category=${category.id}`}
                  label={category.name}
                  size="small"
                  clickable
                  variant="outlined"
                  sx={{
                    alignSelf: 'flex-start',
                    mb: 1.5,
                    fontWeight: 600,
                    borderColor: '#E5E7EB',
                  }}
                />
              )}

              {/* H1 Title */}
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  letterSpacing: '-0.025em',
                  fontSize: { xs: '1.75rem', sm: '2.25rem' },
                  lineHeight: 1.25,
                  mb: 2,
                }}
              >
                {product.title}
              </Typography>

              {/* Rating Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Rating
                  value={Number(product.rating || 0)}
                  precision={0.1}
                  readOnly
                  emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {Number(product.rating || 0).toFixed(1)} / 5.0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  (Verified Customer Score)
                </Typography>
              </Box>

              {/* Price Display */}
              <Box sx={{ mb: 4, p: 2, backgroundColor: '#FFFFFF', borderRadius: 2, border: '1px solid #E5E7EB' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                  Affiliate Merchant Price
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    mt: 0.5,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {formattedPrice}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Pricing and availability subject to change on partner site.
                </Typography>
              </Box>

              {/* BUY NOW BUTTON - ONLY CTA ON THE PAGE PER PRD §5.3 */}
              <Box sx={{ mb: 4 }}>
                <Button
                  component="a"
                  href={formatUrl(product.affiliateLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  endIcon={<OpenInNewIcon />}
                  onClick={(e) => {
                    const url = formatUrl(product.affiliateLink);
                    if (url) {
                      window.open(url, '_blank', 'noopener,noreferrer');
                      e.preventDefault();
                    }
                  }}
                  sx={{
                    py: 1.8,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 2,
                    backgroundColor: '#16A34A',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
                    '&:hover': {
                      backgroundColor: '#15803D',
                    },
                  }}
                >
                  Buy Now on Partner Site
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  Opens official seller page in a new window. No checkout or cart on My Store.
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Product Description */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  About This Item
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    whiteSpace: 'pre-line',
                    lineHeight: 1.7,
                  }}
                >
                  {product.description || 'No detailed description provided.'}
                </Typography>
              </Box>

              {/* Security & Authenticity Guarantee Badges */}
              <Box sx={{ mt: 'auto', p: 2, backgroundColor: '#F9FAFB', borderRadius: 2, border: '1px solid #E5E7EB' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <VerifiedIcon sx={{ fontSize: '1.1rem', color: 'secondary.main' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Direct Merchant Guarantee
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  You are redirected directly to the verified seller or manufacturer storefront. All
                  warranty, returns, and payment security policies are provided by the official merchant.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
