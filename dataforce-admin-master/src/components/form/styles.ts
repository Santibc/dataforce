import { styled, SxProps, Theme } from '@mui/material';

export const INPUT_LABEL_DEFAULT_STYLES: SxProps<Theme> = {
  color: 'text.secondary',
  mb: 1,
};

export const TYPOGRAPHY_LABEL_DEFAULT_STYLES: SxProps<Theme> = {
  '& .MuiTypography-root': {
    color: 'text.secondary',
  },
};

export const Placeholder = styled('span')(({ theme }) => ({
  opacity: 0.5,
}));
