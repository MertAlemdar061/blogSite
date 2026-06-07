import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import type { Post } from '../types';
import { formatDate, readingTime } from '../utils/format';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={RouterLink}
        to={`/yazi/${post.slug}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardMedia
          component="img"
          height="180"
          image={post.coverImage || FALLBACK_IMAGE}
          alt={post.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          {post.category && (
            <Chip
              label={post.category.name}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          )}
          <Typography variant="h6" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {post.excerpt}
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              {post.author?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.publishedAt)} · {readingTime(post.content)} dk
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
