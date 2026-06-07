import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h1" sx={{ fontSize: '5rem', color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Aradığınız sayfa bulunamadı.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/">
          Anasayfaya dön
        </Button>
      </Box>
    </Container>
  );
}
