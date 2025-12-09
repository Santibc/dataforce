import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import { FieldPath, FieldValues, Noop, RefCallBack } from 'react-hook-form';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { TYPOGRAPHY_LABEL_DEFAULT_STYLES } from './styles';

export type HitCheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseFieldProps<TFieldValues> & {
  field: {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    value: boolean;
    name: TName;
    ref: RefCallBack;
  };
  floatingLabel?: boolean;
};

/**
 * Mui Checkbox wrapper.
 * @param colSpan Column span
 * @param field Arguments supplied by the Controller render method
 * @param floatingLabel Optional argument to have a separate label from the input. It is enable by default.
 * @example
 * <Controller
 *    name="isAdmin"
 *    control={hf.control}
 *    floatingLabel={false} //if you dont want default floating label
 *    render={(field) => <HitCheckboxField {...field} label="Is admin?"/>}
 *  />
 */

export const HitCheckboxField = <TValue extends FieldValues>({
  label,
  colSpan,
  field,
  floatingLabel = true,
  fieldState,
}: HitCheckboxFieldProps<TValue>) => (
  <GridItem colSpan={colSpan}>
    <FormControl error={!!fieldState.error} fullWidth>
      <FormControlLabel
        label={label}
        sx={!floatingLabel ? TYPOGRAPHY_LABEL_DEFAULT_STYLES : undefined}
        control={<Checkbox {...field} />}
      />
      <FormHelperText>{fieldState.error?.message ?? ''}</FormHelperText>
    </FormControl>
  </GridItem>
);
