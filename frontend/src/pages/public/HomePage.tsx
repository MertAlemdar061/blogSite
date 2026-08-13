import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';
import { Link as RouterLink } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { categoriesApi } from '../../api/taxonomy';
import PostCard from '../../components/PostCard';
import { BRAND } from '../../theme';

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 400);
    return () => window.clearTimeout(t);
  }, [search]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', page, debounced],
    queryFn: () => postsApi.list({ page, limit: 9, search: debounced || undefined }),
  });

  return (
    <Container maxWidth="lg">
      {/* ---- Hero ---- */}
      <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 }, pt: { xs: 1, md: 3 } }}>
        <Chip
          icon={<BoltIcon sx={{ fontSize: 16 }} />}
          label="Güncel teknoloji ve gündem"
          size="small"
          sx={{
            mb: 3,
            px: 1,
            color: BRAND.orange,
            bgcolor: alpha(BRAND.orange, 0.12),
            border: `1px solid ${alpha(BRAND.orange, 0.35)}`,
            '& .MuiChip-icon': { color: BRAND.orange },
          }}
        />

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.2rem', sm: '3rem', md: '3.9rem' },
            lineHeight: 1.08,
            mb: 2,
            background: `linear-gradient(180deg, #ffffff 20%, ${alpha('#93c5fd', 0.85)} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Teknoloji ve Gündem
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.15rem' },
            maxWidth: 620,
            mx: 'auto',
          }}
        >
          Güncel haberler, derinlemesine incelemeler ve sektör analizleri.
        </Typography>
      </Box>

      {/* ---- Filtre + arama ---- */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ mb: 4 }}
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {categories?.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              component={RouterLink}
              to={`/kategori/${c.slug}`}
              clickable
              variant="outlined"
            />
          ))}
        </Stack>

        <TextField
          size="small"
          placeholder="Yazılarda ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: { xs: '100%', md: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && <Alert severity="error">Yazılar yüklenirken bir hata oluştu.</Alert>}

      {data && data.items.length === 0 && (
        <Alert severity="info">Henüz yayınlanmış yazı bulunmuyor.</Alert>
      )}

      {data && data.items.length > 0 && (
        <>
          <Grid container spacing={3}>
            {data.items.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>

          {data.meta.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={data.meta.totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
