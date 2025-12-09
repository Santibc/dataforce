import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { useId } from 'react';
import { FieldPath, FieldValues, Noop, RefCallBack } from 'react-hook-form';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';

export type HitTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseFieldProps<TFieldValues> &
  TextFieldProps & {
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

export const HitTextField = <TValue extends FieldValues>({
  label,
  colSpan,
  placeholder,
  field,
  fieldState,
  floatingLabel = true,
  formState,
  required,
  ...props
}: HitTextFieldProps<TValue>) => {
  const id = useId();
  return (
    <GridItem colSpan={colSpan}>
      {!floatingLabel ? (
        <InputLabel htmlFor={id} sx={INPUT_LABEL_DEFAULT_STYLES} error={!!fieldState.error}>
          {label}
        </InputLabel>
      ) : null}
      <TextField
        {...field}
        id={id}
        fullWidth
        label={floatingLabel ? label : undefined}
        placeholder={placeholder}
        error={!!fieldState.error}
        helperText={fieldState.error?.message ?? ''}
        {...props}
      />
    </GridItem>
  );
};
