import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, isAuthenticated, loading, isFirebase } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to /admin or requested route
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@mystore.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              textDecoration: 'none',
              letterSpacing: '-0.03em',
            }}
          >
            MY STORE
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Storefront Administration Portal
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Admin Sign In
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Protected management access
              </Typography>
            </Box>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <Box
            sx={{
              mb: 3,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isFirebase ? (
                <CloudQueueIcon sx={{ fontSize: '1rem', color: 'secondary.main' }} />
              ) : (
                <CheckCircleOutlineIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              )}
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {isFirebase ? 'Firebase Auth Mode' : 'Local Demo Auth Mode'}
              </Typography>
            </Box>
            {!isFirebase && (
              <Button
                size="small"
                variant="text"
                onClick={handleFillDemoCredentials}
                sx={{ fontSize: '0.7rem', py: 0.25, px: 0.75 }}
              >
                Auto-fill Demo
              </Button>
            )}
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Admin Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@mystore.com"
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={submitting}
                sx={{ py: 1.4, mt: 1 }}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<StorefrontIcon />}
              size="small"
              sx={{ color: 'text.secondary', fontSize: '0.825rem' }}
            >
              Return to Public Storefront
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
