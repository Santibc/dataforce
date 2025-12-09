import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { ReactNode, useId } from 'react';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Noop,
  RefCallBack,
  useFormContext,
} from 'react-hook-form';
import { BaseFieldProps } from './BaseFieldProps';
import { GridItem } from './GridItem';
import { INPUT_LABEL_DEFAULT_STYLES, Placeholder } from './styles';

export type HitMultiSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = BaseFieldProps<TFieldValues> & {
  options: { value: FieldPathValue<TFieldValues, TName>; label: ReactNode }[];
  placeholder?: string;
  floatingLabel?: boolean;
  field: {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    value: FieldPathValue<TFieldValues, TName>[];
    name: TName;
    ref: RefCallBack;
  };
};
/**
 * Mui Select wrapper form multiple selected items.
 * @param colSpan Column span
 * @param options Options to be displayed in the select
 * @param label Label to be displayed
 * @param field Arguments supplied by the Controller render method
 * @param fieldState Arguments supplied by the Controller render method
 * @param floatingLabel Optional argument to have a separate label from the input. It is enable by default.
 * @example
 * <Controller
 *    name="roles"
 *    control={hf.control}
 *    render={(field) => <HitMultiSelectField
 *      {...field}
 *      floatingLabel={false} //if you dont want default floating label
 *      label="Roles"
 *      options={[{label: "Admin", value: "admin"}]}
 *    />}
 *  />
 */

export const HitMultiSelectField = <TValue extends FieldValues>({
  label,
  colSpan,
  floatingLabel = true,
  placeholder,
  options,
  field,
  fieldState,
}: HitMultiSelectFieldProps<TValue>) => {
  const hf = useFormContext();
  const id = useId();
  return (
    <GridItem colSpan={colSpan}>
      {!floatingLabel && (
        <InputLabel sx={{ ...INPUT_LABEL_DEFAULT_STYLES }} id={id} error={!!fieldState.error}>
          {label}
        </InputLabel>
      )}
      <FormControl fullWidth>
        {floatingLabel && <InputLabel id={id}>{label}</InputLabel>}
        <Select
          {...field}
          labelId={id}
          multiple
          label={floatingLabel ? label : undefined}
          error={!!fieldState.error}
          displayEmpty={!floatingLabel}
          renderValue={(selected) => {
            if (selected.length === 0 && !floatingLabel) {
              return <Placeholder>{placeholder}</Placeholder>;
            }
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {options
                  .filter((opt) => field.value.includes(opt.value))
                  .map((opt) => (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      onDelete={(ev) => {
                        hf.setValue(field.name, field.value.filter((x) => x !== opt.value) as any);
                      }}
                    />
                  ))}
              </Box>
            );
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
