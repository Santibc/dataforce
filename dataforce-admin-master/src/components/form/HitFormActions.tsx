import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { GridItem } from './GridItem';
import { GridColumnStyle } from './HitForm';

/**
 * Form submit button. It will be disabled and loding while the form is submitting.
 * @example
 * <HitForm hf={hf} onSubmit={onSubmit}>
 *  <HitFormActions>
 *    <HitFormSubmitButton>Reset</HitFormSubmitButton>
 *  </HitFormActions>
 * </HitForm>
 */

export const HitFormSubmitButton = (props: LoadingButtonProps) => {
  const hf = useFormContext();
  return (
    <LoadingButton
      variant="contained"
      type="submit"
      disabled={hf.formState.isSubmitting}
      loading={hf.formState.isSubmitting}
      {...props}
    />
  );
};
/**
 * Form actions row
 * @example
 * <HitForm hf={hf} onSubmit={onSubmit}>
 *  <HitFormActions>
 *    <HitFormSubmitButton>Submit</HitFormSubmitButton>
 *  </HitFormActions>
 * </HitForm>
 */

export const HitFormActions = ({
  children,
  colSpan = 12,
}: {
  children: React.ReactNode;
  colSpan?: GridColumnStyle;
}) => (
  <GridItem colSpan={colSpan}>
    <Stack direction="row" gap={2} justifyContent="flex-end">
      {children}
    </Stack>
  </GridItem>
);
/**
 * Form reset button
 * @example
 * <HitForm hf={hf} onSubmit={onSubmit}>
 *  <HitFormActions>
 *    <HitFormResetButton>Reset</HitFormResetButton>
 *  </HitFormActions>
 * </HitForm>
 */

export const HitFormResetButton = ({ children }: { children: React.ReactNode }) => {
  const hf = useFormContext();
  return (
    <Button variant="outlined" disabled={hf.formState.isSubmitting} onClick={() => hf.reset()}>
      {children}
    </Button>
  );
};
