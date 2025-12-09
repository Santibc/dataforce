import { IconButton, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    HitDataGridFilterResetButton,
    HitDatagrid,
    HitDatagridFilterSubmitButton,
    useColumns,
} from 'src/components/datagrid';
import { HitFormActions, HitFormGrid, HitTextField } from 'src/components/form';

import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import { useConfirm } from 'src/components/confirm-action/ConfirmAction';
import moment, { Moment } from 'moment';
import { ColorNameDisplay } from 'src/features/positions/ColorNameDisplay';
import { Position } from 'src/api/superAdminRepository';
import { chainConfirm } from 'src/components/confirm-action-chain/chainConfirm';

interface SuperAdminCompanyPositionsTableProps {
    data: Position[];
    isLoading: boolean;
    onDelete: (id: number) => any;
    onEdit: (id: number) => any;
    onSelectUniversidad: (id: number) => any;
}

export function getAmPmFromDateString(dateString: Moment) {
    const hours = dateString.hours();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format and pad with 0 if needed
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    const minutes = String(dateString.minutes()).padStart(2, '0');

    return `${formattedHours}:${minutes} ${amPm}`;
}

export interface SuperAdminCompanyPositionsTableData {
    id: number;
    name: string;
    color: string;
    from: Moment;
    to: Moment;
}

export const SuperAdminCompanyPositionsTable: React.FC<SuperAdminCompanyPositionsTableProps> = ({
    data,
    onDelete,
    onEdit,
    onSelectUniversidad,
}) => {
    const hf = useForm({
        defaultValues: { name: '', color: '', time: '' },
    });
    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const selectedIdRef = useRef<number | undefined>();
    const confirm = useConfirm();

    const _data = data.map(x => {
        const time = `${getAmPmFromDateString(moment(x.from))} - 
    ${getAmPmFromDateString(moment(x.to))}`;
        return { ...x, time };
    })

    const columns = useColumns<typeof _data[0]>([
        {
            field: 'name',
            headerName: 'Name',
            type: 'string',
            maxWidth: 2000,
            renderCell: (params) => <ColorNameDisplay name={params.row.name} color={params.row.color} />,
        },
        {
            field: 'time',
            headerName: 'Time',
            maxWidth: 2000,
            type: 'string',
        },
        {
            field: 'action',
            headerName: ' ',
            type: 'actions',
            maxWidth: 60,
            renderCell: (params) => (
                <>
                    <IconButton
                        onClick={(e) => {
                            selectedIdRef.current = Number(params.id);
                            setOpenPopover(e.currentTarget);
                        }}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </>
            ),
        },
    ]);

    return (
        <Box>
            <HitDatagrid
                filter={{
                    hf,
                    render: (
                        <HitFormGrid>
                            <Controller
                                name="name"
                                render={(field) => <HitTextField {...field} label="Name" />}
                            />
                            <Controller
                                name="time"
                                render={(field) => <HitTextField {...field} label="Time" />}
                            />
                            <HitFormActions>
                                <HitDataGridFilterResetButton />
                                <HitDatagridFilterSubmitButton />
                            </HitFormActions>
                        </HitFormGrid>
                    ),
                }}
                rows={_data}
                columns={columns}
                onRowSelectionModelChange={(model) => onSelectUniversidad(Number(model[0]))}
            />

            <MenuPopover
                open={openPopover}
                onClose={() => {
                    setOpenPopover(null);
                    selectedIdRef.current = undefined;
                }}
                arrow="right-top"
            >
                <MenuItem
                    onClick={() => {
                        setOpenPopover(null);
                        chainConfirm(confirm, [
                            {
                                content: 'Are you sure you want to delete this position?',
                                actionLabel: 'Yes'
                            },
                            {
                                content: 'Are you REALLY sure you want to delete this position? This will affect the company\'s whole system',
                                action: async () => onDelete(selectedIdRef.current!),
                                actionLabel: 'Yes'
                            },
                        ]);
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="eva:trash-2-outline" />
                    Delete
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        setOpenPopover(null);
                        chainConfirm(confirm, [
                            {
                                content: 'Are you sure you want to edit this position?',
                                actionLabel: 'Yes'
                            },
                            {
                                content: 'Are you REALLY sure you want to edit this position? This will affect the company\'s whole system',
                                action: async () => onEdit(selectedIdRef.current!),
                                actionLabel: 'Yes'
                            },
                        ]);
                    }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Edit
                </MenuItem>
            </MenuPopover>
        </Box>
    );
};
