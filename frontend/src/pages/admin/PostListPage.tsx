import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { postsApi } from '../../api/posts';
import { formatDate } from '../../utils/format';

export default function PostListPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: postsApi.adminList,
  });

  const removeMutation = useMutation({
    mutationFn: postsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`"${title}" yazısını silmek istediğinize emin misiniz?`)) {
      removeMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Yazılar</Typography>
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
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Başlık</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell align="right">Görüntülenme</TableCell>
                <TableCell align="right">İşlem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    Henüz yazı yok. İlk yazınızı oluşturun.
                  </TableCell>
                </TableRow>
              )}
              {posts?.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{post.title}</TableCell>
                  <TableCell>{post.category?.name ?? '—'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={post.status === 'PUBLISHED' ? 'Yayında' : 'Taslak'}
                      color={post.status === 'PUBLISHED' ? 'success' : 'default'}
                      variant={post.status === 'PUBLISHED' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>{formatDate(post.publishedAt ?? post.createdAt)}</TableCell>
                  <TableCell align="right">{post.viewCount}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(post.id, post.title)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
