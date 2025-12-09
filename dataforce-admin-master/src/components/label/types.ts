import { BoxProps } from '@mui/material';
import { ColorSchema } from 'src/theme/palette';

// ----------------------------------------------------------------------

export type LabelColor = ColorSchema | 'default';

export type LabelVariant = 'filled' | 'outlined' | 'soft';

export interface LabelProps extends BoxProps {
  startIcon?: React.ReactElement | null;
  endIcon?: React.ReactElement | null;
  color?: LabelColor;
  variant?: LabelVariant;
}
