import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#111111',
      light: '#2c2c2c',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#16A34A', // Refined forest emerald green accent
      light: '#22C55E',
      dark: '#15803D',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626', // Clean red for alerts, discounts, deletes
      light: '#EF4444',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#16A34A',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111111',
      secondary: '#4B5563',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.25,
      color: '#111111',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: '#111111',
    },
    h3: {
      fontSize: '1.35rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.35,
      color: '#111111',
    },
    h4: {
      fontSize: '1.15rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#111111',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#111111',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#111111',
    },
    body1: {
      fontSize: '0.975rem',
      lineHeight: 1.6,
      color: '#1F2937',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#4B5563',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          padding: '8px 18px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#111111',
          '&:hover': {
            backgroundColor: '#262626',
          },
        },
        containedSecondary: {
          backgroundColor: '#16A34A',
          '&:hover': {
            backgroundColor: '#15803D',
          },
        },
        outlined: {
          borderColor: '#E5E7EB',
          color: '#111111',
          '&:hover': {
            borderColor: '#111111',
            backgroundColor: 'rgba(17, 17, 17, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
            borderColor: '#D1D5DB',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.8125rem',
        },
        filled: {
          backgroundColor: '#F3F4F6',
          color: '#111111',
          '&:hover': {
            backgroundColor: '#E5E7EB',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9CA3AF',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#111111',
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#111111',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
