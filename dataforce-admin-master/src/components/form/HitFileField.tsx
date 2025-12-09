import { FormLabel } from '@mui/material';
import { FieldValues } from 'react-hook-form';
import { Upload } from '../upload';
import { GridItem } from './GridItem';
import { SimpleImageFieldProps } from './HitImageField';
import { INPUT_LABEL_DEFAULT_STYLES } from './styles';

export const HitFileField = <TValue extends FieldValues>({
  label,
  colSpan,
  field,
  floatingLabel = true,
  fieldState,
}: SimpleImageFieldProps<TValue> & { floatingLabel?: boolean }) => (
  <GridItem colSpan={colSpan}>
    <FormLabel
      sx={!floatingLabel ? INPUT_LABEL_DEFAULT_STYLES : undefined}
      error={!!fieldState.error}
    >
      {label}
    </FormLabel>
    <Upload
      multiple={false}
      sx={{ width: '100%', marginTop: !floatingLabel ? 1 : undefined }}
      error={!!fieldState.error}
      helperText={fieldState.error?.message ?? ''}
      file={field.value.file}
      onDrop={(value) => field.onChange({ file: value[0] })}
      onDelete={() => field.onChange({ file: null })}
      {...field}
    />
  </GridItem>
);
