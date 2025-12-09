import { Grid } from '@mui/material';
import { GridColumnStyle } from './HitForm';

export const GridItem = ({
  colSpan,
  children,
}: {
  colSpan?: GridColumnStyle;
  children: React.ReactNode;
}) => (
  <Grid
    item
    xs={typeof colSpan === 'number' ? colSpan : colSpan?.xs ?? 12}
    sm={typeof colSpan === 'number' ? undefined : colSpan?.sm}
    md={typeof colSpan === 'number' ? undefined : colSpan?.md}
  >
    {children}
  </Grid>
);
