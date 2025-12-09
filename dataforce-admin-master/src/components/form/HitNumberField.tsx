import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { useId } from 'react';
import { FieldPath, FieldValues, Noop, RefCallBack } from 'react-hook-form';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';

export type HitNumberFieldProps<
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
 * Mui TextField wrapper with number specific attributes.
 * @param colSpan Column span
 * @param field Arguments supplied by the Controller render method
 * @param floatingLabel Optional argument to have a separate label from the input. It is enable by default.
 * @example
 * <Controller
 *    name="weight"
 *    control={hf.control}
 *    floatingLabel={false} //if you dont want default floating label
 *    render={(field) => <HitNumberField {...field} label="Weight"/>}
 *  />
 */

export const HitNumberField = <TValue extends FieldValues>({
  label,
  colSpan,
  placeholder,
  field,
  floatingLabel = true,
  fieldState,
  ...props
}: HitNumberFieldProps<TValue>) => {
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
        placeholder={placeholder}
        type="number"
        label={floatingLabel ? label : undefined}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        error={!!fieldState.error}
        helperText={fieldState.error?.message ?? ''}
        {...props}
      />
    </GridItem>
  );
};
