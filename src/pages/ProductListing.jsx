import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Chip,
} from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChips';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { categories } = useCategories();

  // Read initial query params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialSearch = searchParams.get('search') || '';

  const {
    products,
    totalCount,
    loading,
    loadingMore,
    hasMore,
    filters,
    updateFilters,
    loadMore,
  } = useProducts({
    categoryId: initialCategory,
    sort: initialSort,
    search: initialSearch,
    minPrice: 0,
    maxPrice: 2000,
    minRating: 0,
    pageSize: 12,
  });

  // Sync state with URL search params when they change
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    const sortFromUrl = searchParams.get('sort') || 'newest';
    const searchFromUrl = searchParams.get('search') || '';

    updateFilters({
      categoryId: categoryFromUrl,
      sort: sortFromUrl,
      search: searchFromUrl,
    });
  }, [searchParams]);

  // Update URL params when category or sort changes
  const handleFilterUpdate = (newFilters) => {
    updateFilters(newFilters);
    const newParams = new URLSearchParams(searchParams);

    if (newFilters.categoryId !== undefined) {
      if (newFilters.categoryId === 'all') {
        newParams.delete('category');
      } else {
        newParams.set('category', newFilters.categoryId);
      }
    }
    if (newFilters.sort !== undefined) {
      newParams.set('sort', newFilters.sort);
    }
    if (newFilters.search !== undefined) {
      if (!newFilters.search) {
        newParams.delete('search');
      } else {
        newParams.set('search', newFilters.search);
      }
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    updateFilters({
      categoryId: 'all',
      sort: 'newest',
      search: '',
      minPrice: 0,
      maxPrice: 2000,
      minRating: 0,
    });
  };

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  const currentCategoryName =
    filters.categoryId === 'all'
      ? 'All Products'
      : categoryMap[filters.categoryId] || 'Category';

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link component={RouterLink} to="/" color="text.secondary" underline="hover">
            Home
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            {currentCategoryName}
          </Typography>
        </Breadcrumbs>

        {/* Page Heading */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              {currentCategoryName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Showing {products.length} of {totalCount} curated product{totalCount === 1 ? '' : 's'}
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ width: { xs: '100%', md: 380 } }}>
            <SearchBar
              value={filters.search}
              onChange={(value) => handleFilterUpdate({ search: value })}
              placeholder="Search products by title..."
              size="small"
            />
          </Box>
        </Box>

        {/* Category Chips Bar for quick horizontal filter selection */}
        <CategoryChips
          categories={categories}
          selectedCategory={filters.categoryId}
          onSelect={(catId) => handleFilterUpdate({ categoryId: catId })}
          sx={{ mb: 3 }}
        />

        {/* Mobile Filter Button */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setMobileFilterOpen(true)}
            sx={{ borderColor: '#E5E7EB', color: 'text.primary', py: 1 }}
          >
            Filters & Sorting ({totalCount})
          </Button>
        </Box>

        {/* Main Content: Left Filter Sidebar + Right Product Grid */}
        <Grid container spacing={3.5}>
          {/* Desktop Filter Panel */}
          <Grid item xs={12} md={3.5} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 90 }}>
              <FilterPanel
                filters={filters}
                categories={categories}
                onFilterChange={handleFilterUpdate}
                onReset={handleResetFilters}
                totalCount={totalCount}
              />
            </Box>
          </Grid>

          {/* Product Grid Area */}
          <Grid item xs={12} md={8.5} lg={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                <CircularProgress size={44} thickness={4} sx={{ color: 'primary.main' }} />
              </Box>
            ) : products.length === 0 ? (
              /* Empty State - Minimal placeholder, NO emojis per PRD §5.2 */
              <Box
                sx={{
                  textAlign: 'center',
                  py: 10,
                  px: 3,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 3,
                  border: '1px solid #E5E7EB',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mx: 'auto', mb: 3 }}>
                  We could not find any products matching your current filters or search term. Try adjusting your search or clearing active filters.
                </Typography>
                <Button variant="outlined" color="primary" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </Box>
            ) : (
              <>
                {/* Responsive Product Grid: 2 columns mobile -> 3-4 desktop */}
                <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                  {products.map((product) => (
                    <Grid item key={product.id} xs={6} sm={6} md={4} lg={3}>
                      <ProductCard
                        product={product}
                        categoryName={categoryMap[product.categoryId] || ''}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Load More Pagination */}
                {hasMore && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={loadMore}
                      disabled={loadingMore}
                      sx={{ px: 4, py: 1.25 }}
                    >
                      {loadingMore ? 'Loading more products...' : 'Load More Products'}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '85vh',
            p: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Filter & Sort Products
          </Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <FilterPanel
          filters={filters}
          categories={categories}
          onFilterChange={(newFilters) => {
            handleFilterUpdate(newFilters);
          }}
          onReset={() => {
            handleResetFilters();
            setMobileFilterOpen(false);
          }}
          totalCount={totalCount}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => setMobileFilterOpen(false)}
          sx={{ mt: 2 }}
        >
          View Results ({totalCount})
        </Button>
      </Drawer>
    </Layout>
  );
}
