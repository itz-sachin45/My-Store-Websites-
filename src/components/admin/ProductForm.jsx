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
  Rating,
  FormControlLabel,
  Switch,
  Alert,
  Grid,
  CardMedia,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import StarIcon from '@mui/icons-material/Star';
import { productService, isValidUrl, formatUrl } from '../../services/productService';

export default function ProductForm({
  open,
  onClose,
  onSubmit,
  categories = [],
  initialData = null,
  isSubmitting = false,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState(4.5);
  const [categoryId, setCategoryId] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      setRating(initialData.rating !== undefined ? Number(initialData.rating) : 4.5);
      setCategoryId(initialData.categoryId || (categories[0]?.id || ''));
      setAffiliateLink(initialData.affiliateLink || '');
      setImageUrl(initialData.imageUrl || '');
      setImagePreview(initialData.imageUrl || '');
      setIsPopular(Boolean(initialData.isPopular));
      setImageFile(null);
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setRating(4.5);
      setCategoryId(categories[0]?.id || '');
      setAffiliateLink('');
      setImageUrl('');
      setImagePreview('');
      setIsPopular(false);
      setImageFile(null);
    }
    setError('');
  }, [initialData, open, categories]);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5 MB');
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Product title is required.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Please provide a valid price of 0 or greater.');
      return;
    }

    if (!categoryId) {
      setError('Please select a valid category.');
      return;
    }

    const formattedAffiliateLink = formatUrl(affiliateLink.trim());
    if (!formattedAffiliateLink || !isValidUrl(formattedAffiliateLink)) {
      setError('Please provide a valid affiliate URL (e.g. https://amazon.com/... or amazon.com/...)');
      return;
    }

    try {
      let finalImageUrl = imageUrl.trim();

      // If a file was selected, upload it first
      if (imageFile) {
        setUploadingImage(true);
        const uploadedUrl = await productService.uploadImage(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
        setUploadingImage(false);
      }

      // Default placeholder if no image provided
      if (!finalImageUrl) {
        finalImageUrl =
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
      }

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        rating: Number(rating),
        categoryId,
        affiliateLink: formattedAffiliateLink,
        imageUrl: finalImageUrl,
        isPopular,
      });

      onClose();
    } catch (err) {
      setUploadingImage(false);
      setError(err.message || 'Failed to save product.');
    }
  };

  const isEditing = Boolean(initialData?.id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2.5 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>

        {uploadingImage && <LinearProgress color="secondary" />}

        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2.5}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                label="Product Title"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="product-category-label">Category</InputLabel>
                <Select
                  labelId="product-category-label"
                  value={categoryId}
                  label="Category"
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price (USD)"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                fullWidth
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 299.99"
              />
            </Grid>

            {/* Rating */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ border: '1px solid #E5E7EB', borderRadius: 2, p: 1.75 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  RATING (0.0 - 5.0)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Rating
                    value={rating}
                    precision={0.1}
                    onChange={(event, newValue) => setRating(newValue || 0)}
                    emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {rating.toFixed(1)} / 5.0
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Popular Switch */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ border: '1px solid #E5E7EB', borderRadius: 2, p: 1.5, height: '100%', display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Mark as Popular
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Highlight in "Most Popular" homepage showcase
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Grid>

            {/* Affiliate Buy Now Link */}
            <Grid item xs={12}>
              <TextField
                label="Affiliate Buy Now Link (URL)"
                fullWidth
                required
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                placeholder="https://amazon.com/dp/B0XXXXXX?tag=yourtag-20"
                helperText="Shoppers clicking 'Buy Now' will be redirected to this external URL in a new tab."
                InputProps={{
                  startAdornment: <LinkIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
            </Grid>

            {/* Product Image Selection & Upload */}
            <Grid item xs={12} sm={8}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Product Image (Upload or Web URL)
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ py: 1.25, borderStyle: 'dashed' }}
                >
                  {imageFile ? `Selected: ${imageFile.name}` : 'Upload Image (Storage)'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                </Button>

                <TextField
                  label="Or enter Image URL"
                  size="small"
                  fullWidth
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </Box>
            </Grid>

            {/* Image Preview Thumbnail */}
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>
                IMAGE PREVIEW
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 120,
                  borderRadius: 2,
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {imagePreview ? (
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setImagePreview('')}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No image chosen
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Product Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive product specifications, features, and key highlights..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" disabled={isSubmitting || uploadingImage}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || uploadingImage}
            sx={{ px: 3 }}
          >
            {isSubmitting || uploadingImage ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
