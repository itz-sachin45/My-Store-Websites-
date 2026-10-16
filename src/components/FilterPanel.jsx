import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Rating,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import StarIcon from '@mui/icons-material/Star';

export default function FilterPanel({
  filters,
  categories = [],
  onFilterChange,
  onReset,
  totalCount = 0,
}) {
  const handleCategoryChange = (e) => {
    onFilterChange({ categoryId: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sort: e.target.value });
  };

  const handlePriceChange = (event, newValue) => {
    onFilterChange({
      minPrice: newValue[0],
      maxPrice: newValue[1],
    });
  };

  const handleRatingChange = (event, newRating) => {
    onFilterChange({ minRating: newRating || 0 });
  };

  const formatPriceLabel = (value) => `$${value}`;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        backgroundColor: '#FFFFFF',
        borderRadius: 2.5,
        border: '1px solid #E5E7EB',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Filters
        </Typography>
        <Button
          size="small"
          onClick={onReset}
          startIcon={<FilterAltOffIcon sx={{ fontSize: '0.9rem !important' }} />}
          sx={{
            fontSize: '0.775rem',
            color: 'text.secondary',
            py: 0.25,
            px: 1,
            '&:hover': {
              color: 'error.main',
              backgroundColor: 'rgba(220, 38, 38, 0.04)',
            },
          }}
        >
          Reset
        </Button>
      </Box>

      {/* Sort Order */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
          SORT BY
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={filters.sort || 'newest'}
            onChange={handleSortChange}
            sx={{ borderRadius: 1.5 }}
          >
            <MenuItem value="newest">Newest Arrivals</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Category Dropdown */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
          CATEGORY
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={filters.categoryId || 'all'}
            onChange={handleCategoryChange}
            sx={{ borderRadius: 1.5 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Price Range Slider */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            PRICE RANGE
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
            ${filters.minPrice || 0} - ${filters.maxPrice || 2000}
          </Typography>
        </Box>
        <Slider
          value={[filters.minPrice || 0, filters.maxPrice || 2000]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatPriceLabel}
          min={0}
          max={2000}
          step={25}
          size="small"
          sx={{
            color: '#111111',
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 6px rgba(17, 17, 17, 0.16)',
              },
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            $0
          </Typography>
          <Typography variant="caption" color="text.secondary">
            $2,000+
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Minimum Rating */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            MINIMUM RATING
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {filters.minRating > 0 ? `${filters.minRating} Stars & Up` : 'All Ratings'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating
            name="min-rating-filter"
            value={filters.minRating || 0}
            onChange={handleRatingChange}
            precision={1}
            emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
          />
          {filters.minRating > 0 && (
            <Button
              size="small"
              onClick={() => onFilterChange({ minRating: 0 })}
              sx={{ fontSize: '0.7rem', minWidth: 'auto', p: 0.5 }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      {/* Results Count indicator */}
      <Box
        sx={{
          mt: 3,
          p: 1.5,
          backgroundColor: '#F9FAFB',
          borderRadius: 1.5,
          textAlign: 'center',
          border: '1px solid #E5E7EB',
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          Found <strong>{totalCount}</strong> matching product{totalCount === 1 ? '' : 's'}
        </Typography>
      </Box>
    </Paper>
  );
}
