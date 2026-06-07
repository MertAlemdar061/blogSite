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
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DraftsIcon from '@mui/icons-material/Drafts';
import AddIcon from '@mui/icons-material/Add';
import { postsApi } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Paper sx={{ p: 3 }} elevation={0}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: '#fff',
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <StatCard icon={<ArticleIcon />} label="Yayınlanan yazı" value={published} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard icon={<DraftsIcon />} label="Taslak" value={drafts} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard icon={<VisibilityIcon />} label="Toplam görüntülenme" value={totalViews} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
