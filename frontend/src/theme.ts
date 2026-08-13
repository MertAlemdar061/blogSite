import { createTheme, alpha } from '@mui/material/styles';

// Marka renkleri (neon vurgular için koyu zeminde parlatıldı)
export const BRAND = {
  blue: '#3b82f6',
  blueDeep: '#1d4ed8',
  orange: '#ff7a1a',
  bg: '#080b14',
  surface: '#0f1420',
  border: 'rgba(148, 163, 184, 0.14)',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: BRAND.blue, dark: BRAND.blueDeep },
    secondary: { main: BRAND.orange },
    background: { default: BRAND.bg, paper: BRAND.surface },
    text: {
      primary: '#e8edf7',
      secondary: 'rgba(226, 232, 240, 0.62)',
    },
    divider: BRAND.border,
  },
  typography: {
    fontFamily:
      '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BRAND.bg,
          backgroundImage: `
            radial-gradient(900px 500px at 12% -8%, ${alpha(BRAND.blue, 0.18)}, transparent 60%),
            radial-gradient(760px 460px at 92% 0%, ${alpha(BRAND.orange, 0.12)}, transparent 55%)
          `,
          backgroundAttachment: 'fixed',
        },
        '::selection': {
          background: alpha(BRAND.blue, 0.35),
        },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-track': { background: BRAND.bg },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(148,163,184,0.25)',
          borderRadius: 8,
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(148,163,184,0.4)',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 10, fontWeight: 600 },
        containedPrimary: {
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueDeep})`,
          boxShadow: `0 6px 20px ${alpha(BRAND.blue, 0.35)}`,
          '&:hover': {
            boxShadow: `0 8px 28px ${alpha(BRAND.blue, 0.5)}`,
          },
        },
        outlined: {
          borderColor: BRAND.border,
          '&:hover': {
            borderColor: alpha(BRAND.blue, 0.6),
            background: alpha(BRAND.blue, 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#111827', 0.55),
          backdropFilter: 'blur(12px)',
          border: `1px solid ${BRAND.border}`,
          boxShadow: 'none',
          transition: 'transform .25s ease, border-color .25s ease, box-shadow .25s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            borderColor: alpha(BRAND.blue, 0.55),
            boxShadow: `0 18px 40px -18px ${alpha(BRAND.blue, 0.65)}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: { borderColor: BRAND.border },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
        outlined: {
          borderColor: BRAND.border,
          '&:hover': {
            borderColor: alpha(BRAND.blue, 0.6),
            background: alpha(BRAND.blue, 0.1),
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0b1220', 0.6),
          '& fieldset': { borderColor: BRAND.border },
          '&:hover fieldset': { borderColor: alpha(BRAND.blue, 0.45) },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: BRAND.border },
        head: { fontWeight: 700, color: 'rgba(226,232,240,0.75)' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          '&.Mui-selected': {
            background: alpha(BRAND.blue, 0.16),
            '&:hover': { background: alpha(BRAND.blue, 0.22) },
          },
        },
      },
    },
  },
});

export default theme;
