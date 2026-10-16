import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import { formatUrl } from '../services/productService';

export default function ProductCard({ product, categoryName = '' }) {
  if (!product) return null;

  const fallbackImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price || 0);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: 2.5,
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
          borderColor: '#D1D5DB',
        },
      }}
    >
      {/* Popular Badge if applicable */}
      {product.isPopular && (
        <Chip
          label="Popular"
          size="small"
          color="secondary"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1,
            fontWeight: 700,
            fontSize: '0.675rem',
            height: 22,
          }}
        />
      )}

      {/* Card Image linking to details */}
      <Box
        component={RouterLink}
        to={`/products/${product.id}`}
        sx={{
          display: 'block',
          position: 'relative',
          paddingTop: '75%', // 4:3 aspect ratio
          backgroundColor: '#F3F4F6',
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          image={product.imageUrl || fallbackImage}
          alt={product.title}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
            '&:hover': {
              transform: 'scale(1.04)',
            },
          }}
        />
      </Box>

      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
        {/* Category Label */}
        {categoryName && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              fontSize: '0.7rem',
              display: 'block',
              mb: 0.5,
            }}
          >
            {categoryName}
          </Typography>
        )}

        {/* Title */}
        <Typography
          variant="subtitle1"
          component={RouterLink}
          to={`/products/${product.id}`}
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            textDecoration: 'none',
            lineHeight: 1.35,
            fontSize: '0.925rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7em',
            mb: 1,
            '&:hover': {
              color: 'secondary.main',
            },
          }}
        >
          {product.title}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
          <Rating
            value={Number(product.rating || 0)}
            precision={0.1}
            size="small"
            readOnly
            emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
          />
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            {Number(product.rating || 0).toFixed(1)}
          </Typography>
        </Box>

        {/* Price */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: '1.125rem',
            letterSpacing: '-0.02em',
          }}
        >
          {formattedPrice}
        </Typography>
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          component={RouterLink}
          to={`/products/${product.id}`}
          variant="outlined"
          fullWidth
          size="small"
          sx={{
            fontSize: '0.8rem',
            py: 0.8,
            borderColor: '#E5E7EB',
            color: 'text.primary',
            '&:hover': {
              borderColor: '#111111',
              backgroundColor: '#F9FAFB',
            },
          }}
        >
          Details
        </Button>

        <Button
          component="a"
          href={formatUrl(product.affiliateLink)}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          color="secondary"
          fullWidth
          size="small"
          endIcon={<OpenInNewIcon sx={{ fontSize: '0.9rem !important' }} />}
          onClick={(e) => {
            e.stopPropagation();
            const url = formatUrl(product.affiliateLink);
            if (url) {
              window.open(url, '_blank', 'noopener,noreferrer');
              e.preventDefault();
            }
          }}
          sx={{
            fontSize: '0.8rem',
            py: 0.8,
            fontWeight: 600,
            backgroundColor: '#16A34A',
            '&:hover': {
              backgroundColor: '#15803D',
            },
          }}
        >
          Buy Now
        </Button>
      </CardActions>
    </Card>
  );
}
