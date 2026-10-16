import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StarIcon from '@mui/icons-material/Star';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';
import { productService, formatUrl } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'info' });

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await categoryService.getAll();
      setCategories(cats);

      const prodResult = await productService.getProducts({
        categoryId: selectedCategory,
        search,
        pageSize: 100,
      });
      setProducts(prodResult.products);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to load products list', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, search]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormSubmit = async (productData) => {
    if (editingProduct) {
      await productService.update(editingProduct.id, productData);
      setMessage({ text: `Product "${productData.title}" updated successfully.`, severity: 'success' });
    } else {
      await productService.create(productData);
      setMessage({ text: `Product "${productData.title}" added to catalog.`, severity: 'success' });
    }
    await loadData();
  };

  const handlePromptDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.delete(productToDelete.id);
      setMessage({ text: `Product "${productToDelete.title}" deleted.`, severity: 'success' });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      await loadData();
    } catch (err) {
      setMessage({ text: err.message || 'Failed to delete product.', severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetDemoData = async () => {
    productService.resetDemo();
    await loadData();
    setMessage({ text: 'Product catalog reset to initial demo set.', severity: 'info' });
  };

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  return (
    <AdminLayout
      title="Manage Products"
      subtitle="Create, update, and manage affiliate products, photos, and partner links."
    >
      {message.text && (
        <Alert
          severity={message.severity}
          onClose={() => setMessage({ text: '', severity: 'info' })}
          sx={{ mb: 3 }}
        >
          {message.text}
        </Alert>
      )}

      {/* Control Bar: Search, Category Filter, Actions */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 2.5, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexGrow: 1, gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: '100%', sm: 260 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="admin-category-filter-label">Filter Category</InputLabel>
              <Select
                labelId="admin-category-filter-label"
                value={selectedCategory}
                label="Filter Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleResetDemoData}
              sx={{ borderColor: '#E5E7EB' }}
            >
              Reset Demo
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Products Table */}
      <Paper elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #E5E7EB', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={36} thickness={4} />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No products found matching your search criteria.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenCreate}>
              Add First Product
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: 70 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Affiliate Link</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, width: 130 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Box
                        component="img"
                        src={p.imageUrl}
                        alt=""
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1.5,
                          objectFit: 'cover',
                          backgroundColor: '#F3F4F6',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 280 }}>
                        {p.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={categoryMap[p.categoryId] || 'Uncategorized'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      ${Number(p.price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating
                          value={Number(p.rating || 0)}
                          precision={0.1}
                          size="small"
                          readOnly
                          emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {Number(p.rating || 0).toFixed(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {p.isPopular ? (
                        <Chip label="Popular" size="small" color="secondary" sx={{ fontWeight: 600, height: 22 }} />
                      ) : (
                        <Chip label="Standard" size="small" variant="outlined" sx={{ height: 22 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        component="a"
                        href={formatUrl(p.affiliateLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        variant="outlined"
                        endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          const targetUrl = formatUrl(p.affiliateLink);
                          if (targetUrl) {
                            window.open(targetUrl, '_blank', 'noopener,noreferrer');
                          }
                          e.preventDefault();
                        }}
                        sx={{
                          fontSize: '0.75rem',
                          py: 0.3,
                          px: 1.25,
                          borderRadius: 1.5,
                          borderColor: '#E5E7EB',
                          color: 'text.primary',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#111111',
                            backgroundColor: '#F3F4F6',
                          },
                        }}
                      >
                        Visit
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(p)}
                        aria-label="edit product"
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handlePromptDelete(p)}
                        aria-label="delete product"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Product Form Modal */}
      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        categories={categories}
        initialData={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Product Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>"{productToDelete?.title}"</strong>?
            This will permanently remove it from your public affiliate catalog.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
