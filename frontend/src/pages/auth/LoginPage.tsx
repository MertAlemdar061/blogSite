import { useState, type FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  alpha,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../theme';
import Logo from '../../components/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        backgroundImage: `
          radial-gradient(800px 400px at 50% -10%, ${alpha(BRAND.blue, 0.25)}, transparent 60%),
          radial-gradient(600px 380px at 90% 100%, ${alpha(BRAND.orange, 0.12)}, transparent 60%)
        `,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
            <Logo />
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: `1px solid ${BRAND.border}`,
            bgcolor: alpha('#111827', 0.6),
            backdropFilter: 'blur(16px)',
          }}
        >
          <Typography variant="h5" align="center" sx={{ mb: 0.5 }}>
            Yönetim Paneli
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Devam etmek için giriş yapın
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="E-posta"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Şifre"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.2 }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            <Link component={RouterLink} to="/" color="text.secondary" underline="hover">
              ← Siteye dön
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
