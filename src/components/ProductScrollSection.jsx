import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Container,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProductCard from './ProductCard';

export default function ProductScrollSection({
  title,
  subtitle = '',
  products = [],
  viewAllLink = '/products',
  categoryMap = {},
  emptyMessage = 'No products available in this section.',
}) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) {
    return (
      <Box sx={{ my: 4, py: 3, textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: 2, border: '1px solid #E5E7EB' }}>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ my: { xs: 4, md: 6 } }}>
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mb: 2.5,
          px: { xs: 0.5, sm: 0 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.25rem', sm: '1.45rem' },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Scroll Navigation Buttons for Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            <IconButton
              onClick={() => handleScroll('left')}
              size="small"
              aria-label={`Scroll ${title} left`}
              sx={{
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                '&:hover': { backgroundColor: '#F3F4F6' },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => handleScroll('right')}
              size="small"
              aria-label={`Scroll ${title} right`}
              sx={{
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                '&:hover': { backgroundColor: '#F3F4F6' },
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* View All Button */}
          <Button
            component={RouterLink}
            to={viewAllLink}
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: '0.9rem !important' }} />}
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'secondary.main',
              },
            }}
          >
            View All
          </Button>
        </Box>
      </Box>

      {/* Horizontal Scroll Row */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: { xs: 2, sm: 2.5 },
          overflowX: 'auto',
          pb: 2,
          pt: 0.5,
          px: { xs: 0.5, sm: 0 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {products.map((product) => (
          <Box
            key={product.id}
            sx={{
              flex: '0 0 auto',
              width: {
                xs: '240px',
                sm: '260px',
                md: '280px',
              },
            }}
          >
            <ProductCard
              product={product}
              categoryName={categoryMap[product.categoryId] || ''}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
