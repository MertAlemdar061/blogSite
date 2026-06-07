import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Stack,
  Autocomplete,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { postsApi } from '../../api/posts';
import { categoriesApi, tagsApi } from '../../api/taxonomy';
import RichTextEditor from '../../components/RichTextEditor';
import type { Tag } from '../../types';

export default function PostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });
  const { data: tags } = useQuery({ queryKey: ['tags'], queryFn: tagsApi.list });

  const { data: existing, isLoading: loadingPost } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: () => postsApi.adminGet(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setExcerpt(existing.excerpt ?? '');
      setCoverImage(existing.coverImage ?? '');
      setContent(existing.content);
      setCategoryId(existing.category?.id ?? '');
      setSelectedTags(existing.tags as Tag[]);
      setPublished(existing.status === 'PUBLISHED');
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Yeni etiketleri oluştur, hepsinin id'sini topla
      const tagIds: string[] = [];
      for (const tag of selectedTags) {
        if (tag.id.startsWith('new:')) {
          const created = await tagsApi.create({ name: tag.name });
          tagIds.push(created.id);
        } else {
          tagIds.push(tag.id);
        }
      }

      const payload = {
        title,
        content,
        excerpt: excerpt || undefined,
        coverImage: coverImage || undefined,
        status: (published ? 'PUBLISHED' : 'DRAFT') as 'PUBLISHED' | 'DRAFT',
        categoryId: categoryId || undefined,
        tagIds,
      };

      return isEdit ? postsApi.update(id!, payload) : postsApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      navigate('/admin/posts');
    },
    onError: () => setError('Kaydetme sırasında bir hata oluştu. Alanları kontrol edin.'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Başlık ve içerik zorunludur.');
      return;
    }
    saveMutation.mutate();
  };

  if (isEdit && loadingPost) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">{isEdit ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</Typography>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <TextField
              label="Başlık"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Özet"
              fullWidth
              multiline
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              helperText="Kart ve liste görünümünde gösterilir."
            />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                İçerik
              </Typography>
              <RichTextEditor value={content} onChange={setContent} />
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }} elevation={0}>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                }
                label={published ? 'Yayında' : 'Taslak'}
              />
              <TextField
                select
                label="Kategori"
                fullWidth
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Kategorisiz</em>
                </MenuItem>
                {categories?.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                multiple
                freeSolo
                options={tags ?? []}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option.name
                }
                value={selectedTags}
                onChange={(_, value) => {
                  const normalized: Tag[] = value.map((v) =>
                    typeof v === 'string'
                      ? { id: `new:${v}`, name: v, slug: v }
                      : v,
                  );
                  setSelectedTags(normalized);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...rest } = getTagProps({ index });
                    return <Chip key={key} label={option.name} size="small" {...rest} />;
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Etiketler" placeholder="Etiket ekle" />
                )}
              />

              <TextField
                label="Kapak görseli (URL)"
                fullWidth
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
              {coverImage && (
                <Box
                  component="img"
                  src={coverImage}
                  alt="Önizleme"
                  sx={{ width: '100%', borderRadius: 2, maxHeight: 160, objectFit: 'cover' }}
                />
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
