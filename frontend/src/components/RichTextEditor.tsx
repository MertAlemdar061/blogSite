import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { Box, Divider, ToggleButton, Stack, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import TitleIcon from '@mui/icons-material/Title';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

function Toolbar({ editor }: { editor: Editor }) {
  const addLink = () => {
    const url = window.prompt('Bağlantı adresi (URL):');
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    const url = window.prompt('Görsel adresi (URL):');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <Stack
      direction="row"
      spacing={0.5}
      flexWrap="wrap"
      useFlexGap
      sx={{ p: 1, borderBottom: '1px solid #eaecef' }}
    >
      <Tooltip title="Kalın">
        <ToggleButton
          size="small"
          value="bold"
          selected={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBoldIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="İtalik">
        <ToggleButton
          size="small"
          value="italic"
          selected={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalicIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Başlık 2">
        <ToggleButton
          size="small"
          value="h2"
          selected={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <TitleIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Madde listesi">
        <ToggleButton
          size="small"
          value="ul"
          selected={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Numaralı liste">
        <ToggleButton
          size="small"
          value="ol"
          selected={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumberedIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Alıntı">
        <ToggleButton
          size="small"
          value="quote"
          selected={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FormatQuoteIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Kod bloğu">
        <ToggleButton
          size="small"
          value="code"
          selected={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Bağlantı ekle">
        <ToggleButton size="small" value="link" selected={editor.isActive('link')} onClick={addLink}>
          <LinkIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Görsel ekle">
        <ToggleButton size="small" value="image" onClick={addImage}>
          <ImageIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Geri al">
        <ToggleButton size="small" value="undo" onClick={() => editor.chain().focus().undo().run()}>
          <UndoIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Yinele">
        <ToggleButton size="small" value="redo" onClick={() => editor.chain().focus().redo().run()}>
          <RedoIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
    </Stack>
  );
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Yazınızı buraya yazın...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Dışarıdan gelen değer değişirse (örn. düzenleme yüklenince) senkronize et
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  return (
    <Box sx={{ border: '1px solid #eaecef', borderRadius: 2, bgcolor: 'background.paper' }}>
      <Toolbar editor={editor} />
      <Box
        sx={{
          p: 2,
          minHeight: 320,
          '& .ProseMirror': { outline: 'none', minHeight: 300, lineHeight: 1.7 },
          '& .ProseMirror p.is-editor-empty:first-of-type::before': {
            content: 'attr(data-placeholder)',
            color: '#9aa0a6',
            float: 'left',
            height: 0,
            pointerEvents: 'none',
          },
          '& .ProseMirror h2': { fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' },
          '& .ProseMirror pre': {
            background: '#0d1117',
            color: '#e6edf3',
            padding: '1rem',
            borderRadius: 8,
            overflowX: 'auto',
          },
          '& .ProseMirror blockquote': {
            borderLeft: '4px solid #1565c0',
            paddingLeft: '1rem',
            color: '#5f6368',
            fontStyle: 'italic',
          },
          '& .ProseMirror img': { maxWidth: '100%', borderRadius: 8 },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
