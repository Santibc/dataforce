import { InputLabel, TextField } from '@mui/material';
import { useId } from 'react';
import { FieldValues } from 'react-hook-form';
import { GridItem } from './GridItem';
import { HitTextFieldProps } from './HitTextField';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';

/**
 * Mui TextField wrapper with phone specific attributes.
 * @param colSpan Column span
 * @param field Arguments supplied by the Controller render method
 * @param floatingLabel Optional argument to have a separate label from the input. It is enable by default.
 * @example
 * <Controller
 *    name="phone"
 *    control={hf.control}
 *    floatingLabel={false} //if you dont want default floating label
 *    render={(field) => <HitPhoneField {...field} label="phone"/>}
 *  />
 */

export const HitPhoneField = <TValue extends FieldValues>({
  label,
  colSpan,
  field,
  placeholder,
  floatingLabel = true,
  fieldState,
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
        placeholder={placeholder}
        label={floatingLabel ? label : undefined}
        error={!!fieldState.error}
        type="tel"
        inputProps={{ inputMode: 'tel' }}
        helperText={fieldState.error?.message ?? ''}
        {...props}
      />
    </GridItem>
  );
};
