import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ViewListIcon from '@mui/icons-material/ViewList';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isFirebase } = useAdminAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <StorefrontIcon /> },
    { label: 'All Products', path: '/products', icon: <ViewListIcon /> },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, justifyContent: 'space-between' }}>
          {/* Brand Name - Text ONLY, NO logo icon/image per PRD §5.1 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                textDecoration: 'none',
                letterSpacing: '-0.03em',
                fontSize: { xs: '1.25rem', sm: '1.45rem' },
                userSelect: 'none',
                '&:hover': {
                  color: 'primary.light',
                },
              }}
            >
              MY STORE
            </Typography>

            {/* Mode badge: Live Firebase vs Demo Mode */}
            <Chip
              size="small"
              icon={isFirebase ? <CloudQueueIcon sx={{ fontSize: '0.875rem' }} /> : <CheckCircleOutlineIcon sx={{ fontSize: '0.875rem' }} />}
              label={isFirebase ? 'Firebase Live' : 'Demo Mode'}
              variant="outlined"
              color={isFirebase ? 'secondary' : 'default'}
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            />
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  variant={isActive ? 'contained' : 'text'}
                  color="primary"
                  sx={{
                    px: 2,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#FFFFFF' : 'text.primary',
                    backgroundColor: isActive ? '#111111' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive ? '#262626' : '#F3F4F6',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}

            {/* Admin Panel Link */}
            <Button
              component={RouterLink}
              to={isAuthenticated ? '/admin' : '/admin/login'}
              variant="outlined"
              startIcon={<AdminPanelSettingsIcon />}
              sx={{
                ml: 1,
                borderColor: '#E5E7EB',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#111111',
                  backgroundColor: '#F3F4F6',
                },
              }}
            >
              {isAuthenticated ? 'Admin Panel' : 'Admin Login'}
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <Button
              component={RouterLink}
              to={isAuthenticated ? '/admin' : '/admin/login'}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem', py: 0.5, px: 1.25 }}
            >
              {isAuthenticated ? 'Admin' : 'Login'}
            </Button>
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: { width: 280, p: 2 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            MY STORE
          </Typography>
          <IconButton onClick={handleDrawerToggle} size="small" aria-label="close navigation drawer">
            <CloseIcon />
          </IconButton>
        </Box>

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
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding sx={{ mt: 2 }}>
            <ListItemButton
              component={RouterLink}
              to={isAuthenticated ? '/admin' : '/admin/login'}
              onClick={handleDrawerToggle}
              selected={location.pathname.startsWith('/admin')}
              sx={{ borderRadius: 1, border: '1px solid #E5E7EB' }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.primary' }}>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
}
