import React, { useRef } from 'react';
import { Box, Chip, IconButton, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppsIcon from '@mui/icons-material/Apps';
import CategoryIcon from './common/CategoryIcon';

export default function CategoryChips({
  categories = [],
  selectedCategory = 'all',
  onSelect = null,
  showAllOption = true,
  sx = {},
}) {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleChipClick = (catId) => {
    if (onSelect) {
      onSelect(catId);
    } else {
      if (catId === 'all') {
        navigate('/products');
      } else {
        navigate(`/products?category=${catId}`);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', my: 2, ...sx }}>
      {/* Scroll Left Button */}
      <IconButton
        onClick={() => handleScroll('left')}
        size="small"
        aria-label="scroll categories left"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'absolute',
          left: -12,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          '&:hover': {
            backgroundColor: '#F3F4F6',
          },
        }}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>

      {/* Horizontal Scrollable Row */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          gap: 1.25,
          overflowX: 'auto',
          py: 1,
          px: { xs: 1, md: 2 },
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // Chrome/Safari
          },
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {showAllOption && (
          <Chip
            label="All Categories"
            icon={<AppsIcon sx={{ fontSize: '1.1rem !important' }} />}
            clickable
            onClick={() => handleChipClick('all')}
            variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
            sx={{
              px: 1.5,
              py: 2.25,
              borderRadius: 6,
              fontWeight: selectedCategory === 'all' ? 700 : 500,
              backgroundColor: selectedCategory === 'all' ? '#111111' : '#FFFFFF',
              color: selectedCategory === 'all' ? '#FFFFFF' : 'text.primary',
              borderColor: selectedCategory === 'all' ? '#111111' : '#E5E7EB',
              '& .MuiChip-icon': {
                color: selectedCategory === 'all' ? '#FFFFFF' : 'text.primary',
              },
              '&:hover': {
                backgroundColor: selectedCategory === 'all' ? '#262626' : '#F3F4F6',
              },
              transition: 'all 0.15s ease',
            }}
          />
        )}

        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Chip
              key={category.id}
              label={category.name}
              icon={<CategoryIcon iconKey={category.iconKey} sx={{ fontSize: '1.1rem !important' }} />}
              clickable
              onClick={() => handleChipClick(category.id)}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                px: 1.5,
                py: 2.25,
                borderRadius: 6,
                fontWeight: isSelected ? 700 : 500,
                backgroundColor: isSelected ? '#111111' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : 'text.primary',
                borderColor: isSelected ? '#111111' : '#E5E7EB',
                whiteSpace: 'nowrap',
                '& .MuiChip-icon': {
                  color: isSelected ? '#FFFFFF' : 'text.primary',
                },
                '&:hover': {
                  backgroundColor: isSelected ? '#262626' : '#F3F4F6',
                },
                transition: 'all 0.15s ease',
              }}
            />
          );
        })}
      </Box>

      {/* Scroll Right Button */}
      <IconButton
        onClick={() => handleScroll('right')}
        size="small"
        aria-label="scroll categories right"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'absolute',
          right: -12,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          '&:hover': {
            backgroundColor: '#F3F4F6',
          },
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
