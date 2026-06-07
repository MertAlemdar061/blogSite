import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { postsApi } from '../../api/posts';
import RichTextContent from '../../components/RichTextContent';
import { formatDate, readingTime } from '../../utils/format';

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !post) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mb: 2 }}>
          Yazı bulunamadı.
        </Alert>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>
          Anasayfaya dön
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        color="inherit"
      >
        Tüm yazılar
      </Button>

      {post.category && (
        <Chip
          label={post.category.name}
          color="primary"
          component={RouterLink}
          to={`/kategori/${post.category.slug}`}
          clickable
          sx={{ mb: 2 }}
        />
      )}

      <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.6rem' }, mb: 2 }}>
        {post.title}
      </Typography>

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Avatar src={post.author?.avatarUrl || undefined}>
          {post.author?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle2">{post.author?.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(post.publishedAt)} · {readingTime(post.content)} dakika okuma ·{' '}
            {post.viewCount} görüntülenme
          </Typography>
        </Box>
      </Stack>

      {post.coverImage && (
        <Box
          component="img"
          src={post.coverImage}
          alt={post.title}
          sx={{ width: '100%', borderRadius: 3, mb: 3, maxHeight: 420, objectFit: 'cover' }}
        />
      )}

      <Divider sx={{ mb: 3 }} />

      <RichTextContent html={post.content} />

      {post.tags.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 5 }}>
          {post.tags.map((tag) => (
            <Chip
              key={tag.id}
              label={`#${tag.name}`}
              size="small"
              component={RouterLink}
              to={`/etiket/${tag.slug}`}
              clickable
              variant="outlined"
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
