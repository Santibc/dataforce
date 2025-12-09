import { Icon } from '@iconify/react';
import { Box, Button, ButtonProps, Card, Popover, Stack, Typography } from '@mui/material';
import {
    DataGrid,
    DataGridProps,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
} from '@mui/x-data-grid';
import { createContext, useContext, useState } from 'react';
import { FieldValues, FormProvider, UseFormReturn, useFormContext } from 'react-hook-form';
import noresults from 'src/assets/noresults.png';

type HitDatagridProps<TValue extends FieldValues> = DataGridProps & {
    filter: {
        hf: UseFormReturn<TValue, any>;
        render: React.ReactNode;
        customFilterLogic?: { [key: string]: (params: { value: any; filterValue: any }) => boolean };
    };
    onEmail: () => any;
};

function CustomToolbar(props: {
    filterComponent: React.ReactNode;
    onSearch: (values: any) => any;
    onEmail: () => any;
}) {
    const hf = useFormContext();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    console.log(props.onEmail)
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
                    <GridToolbarExport />
                    <Button
                        size="small"
                        startIcon={<Icon icon="mdi:email-outline" />}
                        onClick={() => props.onEmail()}
                    >
                        Email
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

export const HitDataGridFilterResetButton = (props: ButtonProps) => {
    const { onReset } = useFilterContext();
    return (
        <Button
            variant="soft"
            color="error"
            startIcon={<Icon icon="mdi:trash" />}
            {...props}
            onClick={(ev) => {
                props.onClick && props.onClick(ev);
                onReset();
            }}
        >
            {props.children || 'Reset'}
        </Button>
    );
};

export const HitDatagridFilterSubmitButton = (props: ButtonProps) => (
    <Button variant="soft" type="submit" startIcon={<Icon icon="mdi:magnify" />} {...props}>
        {props.children || 'Search'}
    </Button>
);

export const FilterContext = createContext<{ onReset: () => any }>({} as any);

export const useFilterContext = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFormContext must be used within a FilterContext');
    }
    return context;
};

export const CustomHitDatagrid = <TValue extends FieldValues>({
    filter,
    onEmail,
    ...props
}: HitDatagridProps<TValue>) => {
    const { hf } = filter;
    const [filters, setFilters] = useState(hf.getValues());
    console.log(onEmail)
    const filteredData = props.rows.filter((row) =>
        Object.entries(filters).every(([key, value]) => {
            if (
                value === '' ||
                value === undefined ||
                value === null ||
                (Array.isArray(value) && value.length === 0)
            ) {
                return true;
            }
            if (filter.customFilterLogic && filter.customFilterLogic[key]) {
                return filter.customFilterLogic[key]({ value: row[key], filterValue: value });
            }
            if (Array.isArray(value)) {
                if (typeof row[key] === 'string' || typeof row[key] === 'number') {
                    return value.includes(row[key]);
                }
                if (Array.isArray(row[key])) {
                    return value.some((x) => row[key].includes(x));
                }
            }
            if (typeof row[key] === 'string') {
                return row[key].toLowerCase().includes((value as any).toLowerCase());
            }
            if (typeof row[key] === 'number') {
                return String(row[key]) === String(value as any);
            }
            console.warn('Unhandled filter type', key, row[key], value);
            return true;
        })
    );
    return (
        <FormProvider {...hf}>
            <Card sx={{ height: 700 }}>
                <DataGrid
                    {...props}
                    rows={filteredData}
                    slots={{
                        toolbar: CustomToolbar,
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
                            filterComponent: filter.render,
                            onSearch: setFilters,
                            onEmail: onEmail
                        },
                        ...props.slotProps,
                    }}
                />
            </Card>
        </FormProvider>
    );
};