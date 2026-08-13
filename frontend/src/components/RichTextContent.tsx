import { Box, alpha } from '@mui/material';
import { BRAND } from '../theme';

/** Yayınlanmış yazının TipTap HTML içeriğini okunaklı tipografiyle gösterir. */
export default function RichTextContent({ html }: { html: string }) {
  return (
    <Box
      sx={{
        color: 'rgba(226, 232, 240, 0.88)',
        fontSize: '1.08rem',
        '& h2': {
          mt: 5,
          mb: 2,
          fontWeight: 800,
          fontSize: '1.7rem',
          letterSpacing: '-0.02em',
          color: '#fff',
        },
        '& h3': { mt: 4, mb: 1.5, fontWeight: 700, fontSize: '1.35rem', color: '#fff' },
        '& p': { mb: 2.5, lineHeight: 1.85 },
        '& a': {
          color: BRAND.blue,
          textDecoration: 'none',
          borderBottom: `1px solid ${alpha(BRAND.blue, 0.4)}`,
          '&:hover': { borderBottomColor: BRAND.blue },
        },
        '& img': {
          maxWidth: '100%',
          borderRadius: 3,
          my: 3,
          border: `1px solid ${BRAND.border}`,
        },
        '& ul, & ol': { mb: 2.5, pl: 3, lineHeight: 1.85 },
        '& li': { mb: 0.75 },
        '& blockquote': {
          borderLeft: `3px solid ${BRAND.orange}`,
          pl: 2.5,
          py: 0.5,
          my: 3,
          mx: 0,
          color: 'text.secondary',
          fontStyle: 'italic',
          bgcolor: alpha(BRAND.orange, 0.06),
          borderRadius: '0 8px 8px 0',
        },
        '& pre': {
          bgcolor: '#05080f',
          border: `1px solid ${BRAND.border}`,
          color: '#e6edf3',
          p: 2.5,
          borderRadius: 3,
          overflowX: 'auto',
          fontSize: '0.92rem',
          my: 3,
        },
        '& code': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
        '& p > code': {
          bgcolor: alpha(BRAND.blue, 0.14),
          color: '#bfdbfe',
          px: 0.75,
          py: 0.25,
          borderRadius: 1,
          fontSize: '0.92em',
        },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
