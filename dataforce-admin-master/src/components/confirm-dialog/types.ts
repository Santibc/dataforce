// @mui
import { DialogProps } from '@mui/material';
import { ReactNode } from 'react';

// ----------------------------------------------------------------------

export interface ConfirmDialogProps extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  content?: any;
  action: React.ReactNode;
  open: boolean;
  onCancel: VoidFunction;
  cancelLabel?: ReactNode;
}
