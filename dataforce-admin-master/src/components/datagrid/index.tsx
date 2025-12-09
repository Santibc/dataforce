import { Icon } from '@iconify/react';
import { Avatar, Box } from '@mui/material';
import {
  GridColDef,
  GridFilterInputMultipleSingleSelect,
  GridFilterOperator,
  GridNativeColTypes,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { useMemo } from 'react';
import Label from '../label';

export const getGridArrayOperators = (): GridFilterOperator[] => [
  {
    value: 'includes any',
    label: 'Includes any',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      // filterItem.value is the value of the input
      //  value is the value of the cell
      return ({ value }) => filterItem.value.some((x: any) => value.some((y: any) => y === x));
    },
    InputComponent: GridFilterInputMultipleSingleSelect,
  },
  {
    value: 'includes all',
    label: 'Includes all',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      // filterItem.value is the value of the input
      //  value is the value of the cell
      return ({ value }) => filterItem.value.every((x: any) => value.some((y: any) => y === x));
    },
    InputComponent: GridFilterInputMultipleSingleSelect,
  },
];

export type ColumnGeneratorProps<R extends GridValidRowModel = any, V = any, F = V> = Omit<
  GridColDef<R, V, F>,
  'type'
> & {
  renderAs?: 'check' | 'avatar' | 'badge' | 'text';
  valueOptions?: (string | { value: any; label: any })[];
  type: GridNativeColTypes | 'array' | 'avatar';
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

const columnFactory = (column: ColumnGeneratorProps) => {
  let defaultValue = undefined;
  if (column.type === 'array') defaultValue = arrayColumn;
  if (column.type === 'avatar') defaultValue = avatarColumn;
  if (column.type === 'actions') defaultValue = actionsColumn;
  if (column.type === 'boolean') defaultValue = booleanColumn;
  if (column.type === 'date') defaultValue = momentDateColumn;
  if (column.type === 'dateTime') defaultValue = momentDatetimeColumn;
  if (column.type === 'number') defaultValue = numberColumn;
  if (column.type === 'singleSelect') defaultValue = stringColumn;
  if (column.type === 'string') defaultValue = stringColumn;
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
  renderCell: renderFactory('badge'),
  flex: 1,
  type: 'singleSelect',
  sortable: false,
  filterOperators: getGridArrayOperators(),
};

const momentDateColumn: Partial<GridColDef> = {
  flex: 1,
  type: 'date',
  valueGetter: (params) => (params.value ? params.value.toDate() : null),
};

const momentDatetimeColumn: Partial<GridColDef> = {
  flex: 1,
  type: 'datetime',
  valueGetter: (params) => (params.value ? params.value.toDate() : null),
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
  columns: ColumnGeneratorProps<R, V, F>[]
) {
  return useMemo(() => columns.map(columnFactory), []);
}
