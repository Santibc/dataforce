import { Icon } from '@iconify/react';
import { Box, Button, Card, Popover, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { useState } from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import noresults from 'src/assets/noresults.png';
import { FilterContext } from './HitDatagrid';
import { ServerSideDatagridOptions } from './useTableQuery';

type HitServerSideDatgridProps = DataGridProps & {
  serverSideOptions: ServerSideDatagridOptions;
  filter: {
    render: React.ReactNode;
  };
};

function CustomServerSideToolbar(props: {
  onExport: () => any;
  filterComponent: React.ReactNode;
  isLoading: boolean;
  onSearch: (values: any) => any;
}) {
  const hf = useFormContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  return (
    <>
      <FilterContext.Provider
        value={{
          onReset: () => {
            hf.reset();
            hf.handleSubmit((values) => {
              props.onSearch(values);
            })();
            setAnchorEl(null);
          },
        }}
      >
        <GridToolbarContainer>
          <Button
            size="small"
            startIcon={<Icon icon="mdi:filter-outline" />}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            Filter
          </Button>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <Button
            size="small"
            startIcon={<Icon icon="mdi:tray-arrow-down" />}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            Export
          </Button>
        </GridToolbarContainer>
        <Popover
          open={anchorEl !== null}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 4, width: 800 }}>
            <form
              onSubmit={hf.handleSubmit((values) => {
                setAnchorEl(null);
                return props.onSearch(values);
              })}
            >
              {props.filterComponent}
            </form>
          </Box>
        </Popover>
      </FilterContext.Provider>
    </>
  );
}

export const HitServerSideDatagrid = ({ filter, ...props }: HitServerSideDatgridProps) => {
  const hf = useFormContext();

  return (
    <FormProvider {...hf}>
      <Card sx={{ height: 700 }}>
        <DataGrid
          {...props}
          {...props.serverSideOptions}
          rows={props.rows}
          slots={{
            toolbar: CustomServerSideToolbar,
            noResultsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                <img src={noresults} alt="Sin Resultados" />
                <Typography>No hay resultados para tu búsqueda</Typography>
              </Stack>
            ),
            ...props.slots,
          }}
          disableColumnFilter
          slotProps={{
            toolbar: {
              onExport: props.serverSideOptions.onExport,
              filterComponent: filter.render,
              onSearch: props.serverSideOptions.onFilterChange,
            },
            ...props.slotProps,
          }}
        />
      </Card>
    </FormProvider>
  );
};
