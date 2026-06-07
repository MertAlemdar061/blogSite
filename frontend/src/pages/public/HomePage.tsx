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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { categoriesApi } from '../../api/taxonomy';
import PostCard from '../../components/PostCard';

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
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 1 }}>
          Teknoloji ve Gündem
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          Güncel haberler, derinlemesine incelemeler ve sektör analizleri.
        </Typography>
      </Box>

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
          sx={{ minWidth: { xs: '100%', md: 280 } }}
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination
                count={data.meta.totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
