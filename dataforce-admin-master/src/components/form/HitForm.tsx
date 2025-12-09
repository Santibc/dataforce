import { Grid } from '@mui/material';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

export type GridColumnStyle = number | { xs: number; sm?: number; md?: number };

export type HitFormProps<TValue extends FieldValues> = {
  onSubmit: (values: TValue) => Promise<any>;
  columns?: GridColumnStyle;
  children: React.ReactNode;
  hf: UseFormReturn<TValue, any>;
};

/**
 * Hit form component
 * @param onSubmit Function to be called when the form is submitted
 * @param columns Number of columns to be used in the grid
 * @param children Children to be rendered inside the form
 * @param hf object returned by useForm hook from react-hook-form
 *
 * @example
 * const hf = useForm();
 * <HitForm hf={hf} onSubmit={onSubmit}>
 *  <Controller
 *    name="name"
 *    control={hf.control}
 *    render={(field) => <HitTextField {...field} label="Name"/>}
 *  />
 * </HitForm>
 */
export const HitForm = <TValue extends FieldValues>({
  onSubmit,
  columns,
  children,
  hf,
}: HitFormProps<TValue>) => {
  const catchedOnSubmit = async (value: TValue) => {
    try {
      await onSubmit(value);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <FormProvider {...hf}>
      <form onSubmit={hf.handleSubmit(catchedOnSubmit)}>
        <HitFormGrid columns={columns}>{children}</HitFormGrid>
      </form>
    </FormProvider>
  );
};

export const HitFormGrid = ({
  columns = 12,
  children,
}: {
  columns?: GridColumnStyle;
  children: React.ReactNode;
}) => (
  <Grid container columns={columns} spacing={2}>
    {children}
  </Grid>
);
