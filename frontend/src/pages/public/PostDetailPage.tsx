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
  alpha,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { postsApi } from '../../api/posts';
import RichTextContent from '../../components/RichTextContent';
import { formatDate, readingTime } from '../../utils/format';
import { BRAND } from '../../theme';

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
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
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Tüm yazılar
      </Button>

      {post.category && (
        <Chip
          label={post.category.name}
          component={RouterLink}
          to={`/kategori/${post.category.slug}`}
          clickable
          sx={{
            mb: 2.5,
            color: '#fff',
            bgcolor: alpha(BRAND.blue, 0.85),
          }}
        />
      )}

      <Typography
        variant="h3"
        sx={{
          fontSize: { xs: '1.9rem', md: '2.8rem' },
          lineHeight: 1.15,
          mb: 3,
        }}
      >
        {post.title}
      </Typography>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          mb: 4,
          p: 1.5,
          borderRadius: 3,
          border: `1px solid ${BRAND.border}`,
          bgcolor: alpha('#111827', 0.45),
        }}
      >
        <Avatar
          src={post.author?.avatarUrl || undefined}
          sx={{
            background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.orange})`,
            fontWeight: 700,
          }}
        >
          {post.author?.name?.charAt(0)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {post.author?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(post.publishedAt)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ pr: 1 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {readingTime(post.content)} dk
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <VisibilityIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {post.viewCount}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {post.coverImage && (
        <Box
          component="img"
          src={post.coverImage}
          alt={post.title}
          sx={{
            width: '100%',
            borderRadius: 4,
            mb: 4,
            maxHeight: 440,
            objectFit: 'cover',
            border: `1px solid ${BRAND.border}`,
          }}
        />
      )}

      <Divider sx={{ mb: 4 }} />

      <RichTextContent html={post.content} />

      {post.tags.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 6 }}>
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
