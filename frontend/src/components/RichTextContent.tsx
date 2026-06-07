import { Box } from '@mui/material';

/** Yayınlanmış yazının TipTap HTML içeriğini güvenli tipografiyle gösterir. */
export default function RichTextContent({ html }: { html: string }) {
  return (
    <Box
      sx={{
        '& h2': { mt: 4, mb: 1.5, fontWeight: 700, fontSize: '1.6rem' },
        '& h3': { mt: 3, mb: 1, fontWeight: 700, fontSize: '1.3rem' },
        '& p': { mb: 2, lineHeight: 1.8, fontSize: '1.05rem' },
        '& a': { color: 'primary.main' },
        '& img': { maxWidth: '100%', borderRadius: 2, my: 2 },
        '& ul, & ol': { mb: 2, pl: 3, lineHeight: 1.8 },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2,
          my: 2,
          color: 'text.secondary',
          fontStyle: 'italic',
        },
        '& pre': {
          bgcolor: '#0d1117',
          color: '#e6edf3',
          p: 2,
          borderRadius: 2,
          overflowX: 'auto',
          fontSize: '0.9rem',
        },
        '& code': { fontFamily: 'monospace' },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
