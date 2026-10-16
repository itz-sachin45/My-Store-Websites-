import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import CategoryIcon, { AVAILABLE_CATEGORY_ICONS } from '../common/CategoryIcon';

export default function CategoryForm({
  open,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const [name, setName] = useState('');
  const [iconKey, setIconKey] = useState('Devices');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setIconKey(initialData.iconKey || 'Devices');
    } else {
      setName('');
      setIconKey('Devices');
    }
    setError('');
  }, [initialData, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        iconKey: iconKey || 'Category',
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    }
  };

  const isEditing = Boolean(initialData?.id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2.5 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {isEditing ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>

        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            autoFocus
            label="Category Name"
            fullWidth
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Mechanical Keyboards, Studio Audio, Ergonomics"
          />

          <FormControl fullWidth>
            <InputLabel id="category-icon-select-label">Category Icon (Material UI)</InputLabel>
            <Select
              labelId="category-icon-select-label"
              value={iconKey}
              label="Category Icon (Material UI)"
              onChange={(e) => setIconKey(e.target.value)}
              renderValue={(selected) => {
                const found = AVAILABLE_CATEGORY_ICONS.find((i) => i.key === selected);
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CategoryIcon iconKey={selected} />
                    <Typography variant="body2">{found ? found.label : selected}</Typography>
                  </Box>
                );
              }}
            >
              {AVAILABLE_CATEGORY_ICONS.map((item) => (
                <MenuItem key={item.key} value={item.key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <item.Icon sx={{ fontSize: '1.25rem', color: 'text.secondary' }} />
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Live Preview of Category Badge */}
          <Box sx={{ p: 2, backgroundColor: '#F9FAFB', borderRadius: 2, border: '1px solid #E5E7EB' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>
              CHIP PREVIEW
            </Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, backgroundColor: '#111111', color: '#FFFFFF', borderRadius: 1.5 }}>
              <CategoryIcon iconKey={iconKey} sx={{ color: '#FFFFFF', fontSize: '1.1rem' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {name || 'Category Name'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ px: 3 }}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
