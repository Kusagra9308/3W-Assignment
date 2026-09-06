import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b1426',
      paper: '#131b2e',
    },
    primary: {
      main: '#2563eb', // TaskPlanet Blue
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#eab308', // TaskPlanet Gold / Star Yellow
      light: '#fde047',
      dark: '#ca8a04',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      disabled: '#64748b',
    },
    divider: '#1f2d4d',
    action: {
      hover: 'rgba(255, 255, 255, 0.05)',
      selected: 'rgba(37, 99, 235, 0.15)',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#131b2e',
          borderColor: '#1f2d4d',
          borderWidth: 1,
          borderStyle: 'solid',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.25)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '8px 20px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 20,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#0f172a',
            '& fieldset': {
              borderColor: '#1f2d4d',
            },
            '&:hover fieldset': {
              borderColor: '#3b82f6',
            },
          },
        },
      },
    },
  },
});

export default theme;
