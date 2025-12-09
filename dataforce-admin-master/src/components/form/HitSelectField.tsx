import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material';
import { ReactNode, useId } from 'react';
import { FieldPath, FieldPathValue, FieldValues, Noop, RefCallBack } from 'react-hook-form';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { INPUT_LABEL_DEFAULT_STYLES, Placeholder } from './styles';

export type HitSelectFieldProps<
  TFieldValues extends Record<string, any> = Record<string, any>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = FieldPathValue<TFieldValues, TName>,
  TLabel = string
> = BaseFieldProps<TFieldValues> &
  Omit<SelectProps<TValue>, 'onChange' | 'value'> & {
    // TODO: Fix any with generic type to have anything as value
    options: { value: any; label: TLabel }[];
    field: {
      onChange: (...event: any[]) => void;
      onBlur: Noop;
      value: TValue;
      name: TName;
      ref: RefCallBack;
    };
    floatingLabel?: boolean;
    placeholder?: string;
  };

/**
 * Mui Select wrapper. Check HitMultiSelectField for multiple select.
 * @param colSpan Column span
 * @param options Options to be displayed in the select
 * @param label Label to be displayed
 * @param field Arguments supplied by the Controller render method
 * @param fieldState Arguments supplied by the Controller render method
 * @param floatingLabel Optional argument to have a separate label from the input. It is enable by default.
 * @example
 * <Controller
 *    name="role"
 *    control={hf.control}
 *    render={(field) => <HitSelectField
 *      {...field}
 *      label="Role"
 *      floatingLabel={false} //if you dont want default floating label
 *      options={[{label: "Admin", value: "admin"}]}
 *    />}
 *  />
 */

export const HitSelectField = <TValue extends FieldValues>({
  label,
  colSpan,
  options,
  placeholder,
  floatingLabel = true,
  field,
  fieldState,
  ...selectProps
}: HitSelectFieldProps<TValue>) => {
  const id = useId();
  return (
    <GridItem colSpan={colSpan}>
      {!floatingLabel && (
        <InputLabel sx={{ ...INPUT_LABEL_DEFAULT_STYLES }} id={id} error={!!fieldState.error}>
          {label}
        </InputLabel>
      )}
      <FormControl fullWidth sx={{ marginTop: !floatingLabel ? 1 : undefined }}>
        {floatingLabel && <InputLabel id={id}>{label}</InputLabel>}
        <Select
          {...field}
          {...selectProps}
          labelId={id}
          error={!!fieldState.error}
          displayEmpty={!floatingLabel}
          renderValue={(selected) => {
            if (selected.length === 0 && !floatingLabel) {
              return <Placeholder>{placeholder}</Placeholder>;
            }
            if (selected === 0) return <Placeholder>{placeholder}</Placeholder>;
            return options.filter((x) => x.value === selected)[0].label;
          }}
        >
          {!floatingLabel ? (
            <MenuItem disabled value="">
              <Placeholder>{placeholder}</Placeholder>
            </MenuItem>
          ) : null}

          {options.map((x) => (
            <MenuItem value={x.value as any} key={x.value}>
              {x.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!fieldState.error}>
          {fieldState.error?.message ?? ''}
        </FormHelperText>
      </FormControl>
    </GridItem>
  );
};
