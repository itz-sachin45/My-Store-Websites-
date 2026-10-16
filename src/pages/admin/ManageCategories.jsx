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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryForm from '../../components/admin/CategoryForm';
import CategoryIcon from '../../components/common/CategoryIcon';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [productCountForCat, setProductCountForCat] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'info' });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to load categories', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleFormSubmit = async (categoryData) => {
    if (editingCategory) {
      await categoryService.update(editingCategory.id, categoryData);
      setMessage({ text: `Category "${categoryData.name}" updated successfully.`, severity: 'success' });
    } else {
      await categoryService.create(categoryData);
      setMessage({ text: `Category "${categoryData.name}" created successfully.`, severity: 'success' });
    }
    await loadCategories();
  };

  const handlePromptDelete = async (category) => {
    setCategoryToDelete(category);
    try {
      const count = await productService.countByCategory(category.id);
      setProductCountForCat(count);
    } catch {
      setProductCountForCat(0);
    }
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await categoryService.delete(categoryToDelete.id);
      setMessage({ text: `Category "${categoryToDelete.name}" deleted.`, severity: 'success' });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      await loadCategories();
    } catch (err) {
      setMessage({ text: err.message || 'Failed to delete category.', severity: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetDemoData = async () => {
    categoryService.resetDemo();
    await loadCategories();
    setMessage({ text: 'Categories reset to initial demo set.', severity: 'info' });
  };

  return (
    <AdminLayout
      title="Manage Categories"
      subtitle="Organize product catalog categories and configure icon representations."
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

      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Total Categories: <strong>{categories.length}</strong>
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={handleResetDemoData}
            sx={{ borderColor: '#E5E7EB' }}
          >
            Reset Demo Defaults
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {/* Categories Table */}
      <Paper elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #E5E7EB', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={36} thickness={4} />
          </Box>
        ) : categories.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No categories found in database.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenCreate}>
              Create Your First Category
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: 80 }}>Icon</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>MUI Icon Identifier</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category ID</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, width: 140 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1.5,
                          backgroundColor: '#F3F4F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#111111',
                        }}
                      >
                        <CategoryIcon iconKey={cat.iconKey} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cat.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={cat.iconKey || 'Category'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {cat.id}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(cat)}
                        aria-label="edit category"
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handlePromptDelete(cat)}
                        aria-label="delete category"
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

      {/* Create / Edit Form Modal */}
      <CategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Category Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to delete <strong>"{categoryToDelete?.name}"</strong>?
          </DialogContentText>
          {productCountForCat > 0 && (
            <Alert severity="warning">
              This category is currently referenced by <strong>{productCountForCat}</strong> product(s).
              Deleting it will leave those products without a valid category link until re-assigned.
            </Alert>
          )}
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
            {isDeleting ? 'Deleting...' : 'Delete Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
