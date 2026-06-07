import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { postsApi } from '../../api/posts';
import PostCard from '../../components/PostCard';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const isTag = location.pathname.startsWith('/etiket');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [slug, isTag]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', isTag ? 'tag' : 'category', slug, page],
    queryFn: () =>
      postsApi.list({
        page,
        limit: 9,
        ...(isTag ? { tag: slug } : { category: slug }),
      }),
    enabled: !!slug,
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" color="text.secondary">
          {isTag ? 'Etiket' : 'Kategori'}
        </Typography>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
          {isTag ? `#${slug}` : slug}
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && <Alert severity="error">İçerik yüklenemedi.</Alert>}

      {data && data.items.length === 0 && (
        <Alert severity="info">Bu başlıkta henüz yazı yok.</Alert>
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
