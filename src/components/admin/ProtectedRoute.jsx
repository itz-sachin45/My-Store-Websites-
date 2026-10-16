import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} thickness={4} sx={{ color: 'primary.main' }} />
        <Typography variant="body2" color="text.secondary">
          Verifying administrator credentials...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and preserve the attempted URL to redirect back after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
