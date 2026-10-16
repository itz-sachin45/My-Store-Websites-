import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Chip,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MenuIcon from '@mui/icons-material/Menu';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function AdminLayout({ children, title, subtitle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isFirebase } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: <DashboardIcon /> },
    { label: 'Manage Products', path: '/admin/products', icon: <Inventory2Icon /> },
    { label: 'Manage Categories', path: '/admin/categories', icon: <CategoryIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Top Admin AppBar */}
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 64, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                variant="h6"
                component={RouterLink}
                to="/admin"
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  textDecoration: 'none',
                  letterSpacing: '-0.02em',
                }}
              >
                MY STORE <span style={{ fontWeight: 400, color: '#6B7280', fontSize: '0.85rem' }}>ADMIN</span>
              </Typography>

              <Chip
                size="small"
                icon={isFirebase ? <CloudQueueIcon sx={{ fontSize: '0.875rem' }} /> : <CheckCircleOutlineIcon sx={{ fontSize: '0.875rem' }} />}
                label={isFirebase ? 'Firebase Live' : 'Demo Mode'}
                color={isFirebase ? 'secondary' : 'default'}
                variant="outlined"
                sx={{ height: 22, fontSize: '0.7rem', display: { xs: 'none', sm: 'inline-flex' } }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    variant={isActive ? 'contained' : 'text'}
                    color="primary"
                    sx={{
                      px: 2,
                      fontWeight: isActive ? 600 : 500,
                      backgroundColor: isActive ? '#111111' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'text.primary',
                      '&:hover': {
                        backgroundColor: isActive ? '#262626' : '#F3F4F6',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}

              <Divider orientation="vertical" flexItem sx={{ mx: 1.5, height: 28, my: 'auto' }} />

              <Button
                component={RouterLink}
                to="/"
                target="_blank"
                startIcon={<StorefrontIcon />}
                size="small"
                variant="outlined"
                sx={{ borderColor: '#E5E7EB', color: 'text.primary' }}
              >
                View Store
              </Button>

              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                size="small"
                color="error"
                sx={{ ml: 0.5 }}
              >
                Sign Out
              </Button>
            </Box>

            {/* Mobile Actions */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleLogout} size="small" color="error" aria-label="sign out">
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{ sx: { width: 260, p: 2 } }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Admin Panel
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {user?.email || 'admin'}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={handleDrawerToggle}
                selected={location.pathname === item.path}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.primary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 2 }} />
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton component={RouterLink} to="/" onClick={handleDrawerToggle}>
              <ListItemIcon sx={{ minWidth: 40, color: 'text.primary' }}>
                <StorefrontIcon />
              </ListItemIcon>
              <ListItemText primary="View Public Store" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Admin Page Content */}
      <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="admin breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link component={RouterLink} to="/admin" color="text.secondary" underline="hover">
            Admin
          </Link>
          {location.pathname !== '/admin' && (
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
              {title || 'Current Page'}
            </Typography>
          )}
        </Breadcrumbs>

        {/* Page Title & Subtitle */}
        {(title || subtitle) && (
          <Box sx={{ mb: 4 }}>
            {title && (
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {children}
      </Container>
    </Box>
  );
}
