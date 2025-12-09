import { Icon } from '@iconify/react';
import { Avatar, Box } from '@mui/material';
import { GridColDef, GridNativeColTypes, GridValidRowModel } from '@mui/x-data-grid';
import { useMemo } from 'react';
import Label from '../label';

export type ColumnGeneratorProps<R extends GridValidRowModel = any, V = any, F = V> = Omit<
  GridColDef<R, V, F>,
  'type'
> & {
  renderAs?: 'check' | 'avatar' | 'badge' | 'text';
  valueOptions?: (string | { value: any; label: any })[];
  type: Omit<GridNativeColTypes, 'string'> | 'array' | 'avatar';
};

const renderFactory =
  (renderAs: ColumnGeneratorProps['renderAs'] = 'text') =>
  (params: any) => {
    switch (renderAs) {
      case 'check':
        return params.value ? (
          <Box sx={{ color: 'success.main' }}>
            <Icon icon="material-symbols:check-circle-rounded" height={25} />
          </Box>
        ) : null;
      case 'avatar':
        return <Avatar src={params.value} />;
      case 'badge':
        return Array.isArray(params.value) ? (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {params.value.map((item: any) => (
              <Label key={item} variant="soft" color="primary">
                {item}
              </Label>
            ))}
          </Box>
        ) : (
          <Label variant="soft" color="primary">
            {params.value}
          </Label>
        );
      default:
        return undefined;
    }
  };

const columnFactory = ({ type, ...column }: ColumnGeneratorProps) => {
  let defaultValue = undefined;
  if (type === 'array') defaultValue = arrayColumn;
  if (type === 'avatar') defaultValue = avatarColumn;
  if (type === 'actions') defaultValue = actionsColumn;
  if (type === 'boolean') defaultValue = booleanColumn;
  if (type === 'date') defaultValue = momentDateColumn;
  if (type === 'dateTime') defaultValue = momentDatetimeColumn;
  if (type === 'number') defaultValue = numberColumn;
  if (type === 'string') defaultValue = stringColumn;
  if (defaultValue === undefined) throw new Error('Column type is not supported');

  return {
    ...defaultValue,
    renderCell: column.renderAs ? renderFactory(column.renderAs) : defaultValue.renderCell,
    ...column,
  };
};

const avatarColumn: Partial<GridColDef> = {
  renderCell: renderFactory('avatar'),
  flex: 1,
  sortable: false,
  filterable: false,
};

const numberColumn: Partial<GridColDef> = {
  type: 'number',
  flex: 1,
};

const stringColumn: Partial<GridColDef> = {
  type: 'string',
  flex: 1,
};

const arrayColumn: Partial<GridColDef> = {
  renderCell: (params) => (params.value.length > 0 ? params.value.join(', ') : '-'),
  flex: 1,
  type: 'string',
  sortable: false,
  valueFormatter: (params) => (params.value.length > 0 ? params.value.join(', ') : '-'),
};

const momentDateColumn: Partial<GridColDef> = {
  flex: 1,
  type: 'date',
  valueGetter: (params) => (params.value ? params.value.toDate() : null),
  valueFormatter: (params) => (params.value ? params.value.format('DD/MM/YYYY') : null),
};

const momentDatetimeColumn: Partial<GridColDef> = {
  flex: 1,
  type: 'datetime',
  valueGetter: (params) => (params.value ? params.value.toDate() : null),
  valueFormatter: (params) => (params.value ? params.value.format('DD/MM/YYYY HH:mm') : null),
};

const booleanColumn: Partial<GridColDef> = {
  renderCell: renderFactory('check'),
  flex: 1,
  type: 'boolean',
};

const actionsColumn: Partial<GridColDef> = {
  flex: 1,
  type: 'actions',
};

export function useColumns<R extends GridValidRowModel = any, V = any, F = V>(
  columns: ColumnGeneratorProps<R, V, F>[],
  deps?: any[]
) {
  return useMemo(() => columns.map(columnFactory), deps ?? []);
}
