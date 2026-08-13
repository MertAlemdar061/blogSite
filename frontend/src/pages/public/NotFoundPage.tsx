import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, Button, alpha } from '@mui/material';
import { BRAND } from '../../theme';

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '5rem', md: '7rem' },
            fontWeight: 900,
            lineHeight: 1,
            background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.orange})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 1.5 }}>
          Aradığınız sayfa bulunamadı.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Bağlantı taşınmış ya da hiç var olmamış olabilir.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/"
          sx={{ boxShadow: `0 8px 30px -8px ${alpha(BRAND.blue, 0.8)}` }}
        >
          Anasayfaya dön
        </Button>
      </Box>
    </Container>
  );
}
