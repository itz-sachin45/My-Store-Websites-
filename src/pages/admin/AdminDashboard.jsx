import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Rating,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';
import CategoryForm from '../../components/admin/CategoryForm';
import { productService, formatUrl } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    popularCount: 0,
    avgRating: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await categoryService.getAll();
      setCategories(cats);

      const prodResult = await productService.getProducts({ pageSize: 50 });
      const prods = prodResult.products;

      const popular = prods.filter((p) => p.isPopular).length;
      const totalRatings = prods.reduce((sum, p) => sum + Number(p.rating || 0), 0);
      const avg = prods.length > 0 ? (totalRatings / prods.length).toFixed(1) : '0.0';

      setStats({
        totalProducts: prodResult.totalCount,
        totalCategories: cats.length,
        popularCount: popular,
        avgRating: avg,
      });

      setRecentProducts(prods.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (productData) => {
    await productService.create(productData);
    await loadData();
  };

  const handleCreateCategory = async (categoryData) => {
    await categoryService.create(categoryData);
    await loadData();
  };

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  return (
    <AdminLayout
      title="Storefront Overview"
      subtitle="Manage your catalog, affiliate product links, and category hierarchy."
    >
      {/* Quick Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setProductFormOpen(true)}
          sx={{ px: 2.5 }}
        >
          Add New Product
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCategoryFormOpen(true)}
          sx={{ px: 2.5 }}
        >
          Add New Category
        </Button>
      </Box>

      {/* KPI Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em' }}>
                TOTAL PRODUCTS
              </Typography>
              <Inventory2Icon sx={{ color: 'primary.main', fontSize: '1.25rem' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
              {stats.totalProducts}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Active in storefront
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em' }}>
                CATEGORIES
              </Typography>
              <CategoryIcon sx={{ color: 'secondary.main', fontSize: '1.25rem' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
              {stats.totalCategories}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Taxonomy groups
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em' }}>
                POPULAR PICKS
              </Typography>
              <StarIcon sx={{ color: '#F59E0B', fontSize: '1.25rem' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
              {stats.popularCount}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Featured on homepage
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em' }}>
                AVG RATING
              </Typography>
              <StarIcon sx={{ color: 'secondary.main', fontSize: '1.25rem' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
              {stats.avgRating}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Overall score out of 5.0
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Navigation Quick Links Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            component={RouterLink}
            to="/admin/products"
            sx={{
              p: 3,
              borderRadius: 2.5,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'text.primary',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#111111',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#F3F4F6',
                  color: '#111111',
                  display: 'flex',
                }}
              >
                <Inventory2Icon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Manage Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add, edit, upload product photos, and configure affiliate URLs.
                </Typography>
              </Box>
            </Box>
            <ArrowForwardIcon sx={{ color: 'text.secondary' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            component={RouterLink}
            to="/admin/categories"
            sx={{
              p: 3,
              borderRadius: 2.5,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'text.primary',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#111111',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#F3F4F6',
                  color: '#111111',
                  display: 'flex',
                }}
              >
                <CategoryIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Manage Categories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure department taxonomy, names, and Material UI icon identifiers.
                </Typography>
              </Box>
            </Box>
            <ArrowForwardIcon sx={{ color: 'text.secondary' }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Products Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Recently Added Products
          </Typography>
          <Button
            component={RouterLink}
            to="/admin/products"
            endIcon={<ArrowForwardIcon sx={{ fontSize: '0.9rem !important' }} />}
            size="small"
          >
            View All
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} thickness={4} />
          </Box>
        ) : recentProducts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            No products created yet. Click "Add New Product" to start building your catalog.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Affiliate Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentProducts.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          component="img"
                          src={p.imageUrl}
                          alt=""
                          sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover', backgroundColor: '#F3F4F6' }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {p.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={categoryMap[p.categoryId] || 'Unknown'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>${Number(p.price || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating value={Number(p.rating || 0)} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {Number(p.rating || 0).toFixed(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        component="a"
                        href={formatUrl(p.affiliateLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        endIcon={<OpenInNewIcon sx={{ fontSize: '0.85rem !important' }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          const targetUrl = formatUrl(p.affiliateLink);
                          if (targetUrl) {
                            window.open(targetUrl, '_blank', 'noopener,noreferrer');
                          }
                          e.preventDefault();
                        }}
                        sx={{ fontSize: '0.75rem', py: 0.25 }}
                      >
                        Test Link
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialogs */}
      <ProductForm
        open={productFormOpen}
        onClose={() => setProductFormOpen(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
      />

      <CategoryForm
        open={categoryFormOpen}
        onClose={() => setCategoryFormOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </AdminLayout>
  );
}
