import { Box, Typography, Stack } from '@mui/material';
import { BRAND } from '../theme';

interface Props {
  /** 'small' alt bilgi/dar alanlar için, 'medium' başlık için. */
  size?: 'small' | 'medium';
}

/**
 * "TG" monogramı + Tech Gündem yazısı.
 * Tek bir yerde durur; ileride SVG logo gelirse yalnızca burası değişir.
 */
export default function Logo({ size = 'medium' }: Props) {
  const box = size === 'small' ? 28 : 36;
  const fontSize = size === 'small' ? '1rem' : '1.35rem';

  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Box
        sx={{
          width: box,
          height: box,
          borderRadius: '10px',
          display: 'grid',
          placeItems: 'center',
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueDeep} 55%, ${BRAND.orange})`,
          boxShadow: `0 6px 18px -6px ${BRAND.blue}`,
          flexShrink: 0,
        }}
      >
        <Typography
          component="span"
          sx={{
            fontWeight: 900,
            fontSize: size === 'small' ? '0.72rem' : '0.9rem',
            color: '#fff',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          TG
        </Typography>
      </Box>

      <Typography
        component="span"
        sx={{
          fontWeight: 800,
          fontSize,
          letterSpacing: '-0.02em',
          color: '#fff',
          whiteSpace: 'nowrap',
        }}
      >
        Tech <span style={{ color: BRAND.orange }}>Gündem</span>
      </Typography>
    </Stack>
  );
}
