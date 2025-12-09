import { IconButton, InputAdornment, InputLabel, TextField } from '@mui/material';
import { useId, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import Iconify from '../iconify';
import { GridItem } from './GridItem';
import { HitTextFieldProps } from './HitTextField';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';

/**
 * Mui TextField wrapper with password specific attributes. Password is hidden by default and can be shown by clicking on the eye icon.
 * @param colSpan Column span
 * @param field Arguments supplied by the Controller render method
 * @param floatingLabel Optional argument to have a separate label from the input. It is enable by default.
 * @example
 * <Controller
 *    name="password"
 *    control={hf.control}
 *    floatingLabel={false} //if you dont want default floating label
 *    render={(field) => <HitPasswordField {...field} label="Password"/>}
 *  />
 */

export const HitPasswordField = <TValue extends FieldValues>({
  label,
  colSpan,
  field,
  fieldState,
  floatingLabel = true,
  formState,
  ...props
}: HitTextFieldProps<TValue>) => {
  const [showPassword, setShowPassword] = useState(false);
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
        fullWidth
        id={id}
        label={floatingLabel ? label : undefined}
        error={!!fieldState.error}
        helperText={fieldState.error?.message ?? ''}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </GridItem>
  );
};
