import { InputLabel } from '@mui/material';
import { useId } from 'react';
import { FieldPath, FieldValues, Noop, RefCallBack } from 'react-hook-form';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';
import { TimeField } from '@mui/x-date-pickers';
import { TimeFieldProps } from '@mui/x-date-pickers';

export type HitTimeFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseFieldProps<TFieldValues> &
  // @ts-ignore
  TimeFieldProps & {
    field: {
      onChange: (...event: any[]) => void;
      onBlur: Noop;
      value: string;
      name: TName;
      ref: RefCallBack;
    };
    floatingLabel?: boolean;
  };

/**
 * Mui TextField wrapper.
 * Check HitEmailField, HitNumberField, HitPasswordField or HitPhoneField for more specific components.
 * @param colSpan Column span
 * @param field Arguments supplied by the Controller render method
 * @param floatingLabel Optional argument to have a separate label from the input. It is enable by default.
 * @example
 * <Controller
 *    name="title"
 *    control={hf.control}
 *    floatingLabel={false} //if you dont want default floating label
 *    render={(field) => <HitTextField {...field} label="Title"/>}
 *  />
 */

export const HitTimeField = <TValue extends FieldValues>({
  label,
  colSpan,
  placeholder,
  field,
  fieldState,
  floatingLabel = true,
  formState,
  required,
  ...props
}: HitTimeFieldProps<TValue>) => {
  const id = useId();
  return (
    <GridItem colSpan={colSpan}>
      {!floatingLabel ? (
        <InputLabel htmlFor={id} sx={INPUT_LABEL_DEFAULT_STYLES} error={!!fieldState.error}>
          {label}
        </InputLabel>
      ) : null}
      <TimeField
        {...field}
        id={id}
        fullWidth
        label={floatingLabel ? label : undefined}
        error={!!fieldState.error}
        helperText={fieldState.error?.message ?? ''}
        {...props}
      />
    </GridItem>
  );
};
