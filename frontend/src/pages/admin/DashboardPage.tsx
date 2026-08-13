import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  CircularProgress,
  alpha,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DraftsIcon from '@mui/icons-material/Drafts';
import AddIcon from '@mui/icons-material/Add';
import { postsApi } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../theme';

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: `1px solid ${BRAND.border}`,
        bgcolor: alpha('#111827', 0.5),
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color .25s ease, transform .25s ease',
        '&:hover': { borderColor: alpha(color, 0.5), transform: 'translateY(-3px)' },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -40,
          right: -40,
          width: 130,
          height: 130,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(color, 0.28)}, transparent 70%)`,
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 3,
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.55)})`,
            boxShadow: `0 8px 20px -8px ${color}`,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: postsApi.adminList,
  });

  const published = posts?.filter((p) => p.status === 'PUBLISHED').length ?? 0;
  const drafts = posts?.filter((p) => p.status === 'DRAFT').length ?? 0;
  const totalViews = posts?.reduce((acc, p) => acc + p.viewCount, 0) ?? 0;

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4">Hoş geldin, {user?.name} 👋</Typography>
          <Typography color="text.secondary">İçerik panelinize genel bakış.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/admin/posts/new"
        >
          Yeni Yazı
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<ArticleIcon />}
              label="Yayınlanan yazı"
              value={published}
              color={BRAND.blue}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<DraftsIcon />}
              label="Taslak"
              value={drafts}
              color={BRAND.orange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<VisibilityIcon />}
              label="Toplam görüntülenme"
              value={totalViews}
              color="#22c55e"
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
