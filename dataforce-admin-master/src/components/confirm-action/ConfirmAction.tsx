import { LoadingButton } from '@mui/lab';
import { DialogProps } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useState } from 'react';
import ConfirmDialog from '../confirm-dialog';

type ContextType = {
  setProps: (props: ConfirmActionProps | undefined) => void;
  requestPermission: (props: ConfirmActionProps) => void;
};

export const Context = createContext({} as ContextType);

export type ConfirmActionProps = Omit<DialogProps, 'title' | 'open' | 'action'> & {
  title?: React.ReactNode;
  content?: React.ReactNode;
  cancelLabel?: ReactNode;
  actionLabel?: ReactNode;
  action: () => Promise<unknown>;
};

export const ConfirmActionProvider = ({
  children,
  defaultProps,
}: {
  children: ReactNode;
  defaultProps?: {
    cancelLabel?: ReactNode;
    actionLabel?: ReactNode;
    title: React.ReactNode;
    content?: any;
  };
}) => {
  const [props, setProps] = useState<ConfirmActionProps | undefined>();
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: async () => props!.action(),
    onSuccess: () => setOpen(false),
  });

  /**
   * Opens the confirm dialog.
   * @param props.title The title of the dialog
   * @param props.content The content of the dialog
   * @param props.cancelLabel The label of the cancel button
   * @param props.actionLabel The label of the action button
   * @param props.action The action to execute when the user click the action button
   * @param props.onClose The callback to execute when the dialog is closed
   */
  const requestPermission = (props: ConfirmActionProps) => {
    setProps({
      ...props,
      title: props.title ?? defaultProps?.title,
      content: props.content ?? (defaultProps?.content as any),
      cancelLabel: props.cancelLabel ?? defaultProps?.cancelLabel,
      actionLabel: props.actionLabel ?? defaultProps?.actionLabel,
    });
    setOpen(true);
  };

  return (
    <Context.Provider value={{ setProps, requestPermission }}>
      {props && (
        <ConfirmDialog
          {...props}
          title={props.title ?? 'Are you sure you want to delete this record?'}
          open={open}
          action={
            <LoadingButton
              variant="contained"
              color="error"
              loading={mutation.isLoading}
              disabled={mutation.isLoading}
              onClick={() => mutation.mutate()}
            >
              {props.actionLabel ?? 'Delete'}
            </LoadingButton>
          }
          onCancel={() => {
            setOpen(false);
          }}
          onClose={(event, reason) => {
            setOpen(false);
            props.onClose && props.onClose(event, reason);
          }}
        />
      )}
      {children}
    </Context.Provider>
  );
};

/**
 * Executes the provided action after the user click the action button.
 * The confirm dialog can be curtomized via the returnesdfunction or via the ConfirmActionProvider.
 * @returns A function that will open the confirm dialog.
 *
 * @example
 * const confirm = useConfirm();
 *
 * confirm({
 *  title: 'Are you sure you want to delete this record?',
 *  content: 'This action cannot be undone.',
 *  action: () => deleteMutation.mutateAsync(id),
 * })
 */
export const useConfirm = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useConfirm must be used inside ConfirmActionProvider');
  }

  return context.requestPermission;
};
