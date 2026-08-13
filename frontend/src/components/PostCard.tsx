import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  Chip,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { Post } from '../types';
import { formatDate, readingTime } from '../utils/format';
import { BRAND } from '../theme';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardActionArea
        component={RouterLink}
        to={`/yazi/${post.slug}`}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          '&:hover .cover': { transform: 'scale(1.06)' },
        }}
      >
        {/* Kapak görseli + degrade örtü */}
        <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
          <Box
            className="cover"
            component="img"
            src={post.coverImage || FALLBACK_IMAGE}
            alt={post.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform .5s ease',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to top, ${alpha('#0b1020', 0.95)} 0%, ${alpha(
                '#0b1020',
                0.15,
              )} 60%, transparent 100%)`,
            }}
          />
          {post.category && (
            <Chip
              label={post.category.name}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: alpha(BRAND.blue, 0.85),
                color: '#fff',
                backdropFilter: 'blur(6px)',
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: '1.08rem',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
            sx={{ pt: 1.5, borderTop: `1px solid ${BRAND.border}` }}
          >
            <Typography variant="caption" sx={{ color: BRAND.orange, fontWeight: 600 }}>
              {post.author?.name}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(post.publishedAt)} · {readingTime(post.content)} dk
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
