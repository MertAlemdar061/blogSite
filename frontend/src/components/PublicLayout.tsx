import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  Typography,
  Stack,
  alpha,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../theme';
import Logo from './Logo';

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha('#080b14', 0.72),
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${BRAND.border}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2, minHeight: { xs: 64, md: 72 } }}>
            <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', flexGrow: 1 }}>
              <Logo />
            </Box>

            <Button component={RouterLink} to="/" color="inherit" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              Anasayfa
            </Button>

            {user ? (
              <Button variant="contained" onClick={() => navigate('/admin')}>
                Panel
              </Button>
            ) : (
              <Button variant="outlined" onClick={() => navigate('/login')}>
                Giriş
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: `1px solid ${BRAND.border}`,
          py: 4,
          mt: 8,
          bgcolor: alpha('#0b1020', 0.6),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Logo size="small" />
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Tech Gündem. Tüm hakları saklıdır.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teknoloji ve gündem, tek çatı altında.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
