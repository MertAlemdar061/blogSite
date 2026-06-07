import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  Typography,
  Link,
  Stack,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid #eaecef', backdropFilter: 'blur(8px)' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 800, flexGrow: 1 }}
            >
              Tech <span style={{ color: '#ff6f00' }}>Gündem</span>
            </Typography>
            <Button component={RouterLink} to="/" color="inherit">
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

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{ borderTop: '1px solid #eaecef', py: 4, mt: 6, bgcolor: 'background.paper' }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Tech Gündem. Tüm hakları saklıdır.
            </Typography>
            <Link component={RouterLink} to="/" variant="body2" color="text.secondary">
              Teknoloji ve gündem, tek çatı altında.
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
