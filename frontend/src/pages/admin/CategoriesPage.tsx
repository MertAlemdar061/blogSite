import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { categoriesApi } from '../../api/taxonomy';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      setDescription('');
    },
    onError: () => setError('Kategori eklenemedi. Aynı isimde bir kategori olabilir.'),
  });

  const removeMutation = useMutation({
    mutationFn: categoriesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return;
    createMutation.mutate({ name, description: description || undefined });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Kategoriler
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }} elevation={0} component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Yeni Kategori
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField
                label="Ad"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Açıklama"
                fullWidth
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={createMutation.isPending}
              >
                Ekle
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }} elevation={0}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {categories?.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Henüz kategori yok." />
                  </ListItem>
                )}
                {categories?.map((c) => (
                  <ListItem
                    key={c.id}
                    divider
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => {
                          if (window.confirm(`"${c.name}" silinsin mi?`)) {
                            removeMutation.mutate(c.id);
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <span>{c.name}</span>
                          <Chip label={`${c._count?.posts ?? 0} yazı`} size="small" />
                        </Stack>
                      }
                      secondary={c.description}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
