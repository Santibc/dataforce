import { Button, IconButton, MenuItem } from '@mui/material';
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
import { IRecievedUser } from 'src/api/usersRepository';
import { useLocation } from 'react-router';
import { User } from 'src/api/superAdminRepository';
import { chainConfirm } from 'src/components/confirm-action-chain/chainConfirm';

interface SuperAdminCompanyUsersTableProps {
    data: User[];
    isLoading: boolean;
    onDelete: (id: number) => any;
    onEdit: (id: number) => any;
    onSelectedModels: (models: any[]) => any;
    selectedRowIds?: number[];
    hideActions?: boolean;
}

export const SuperAdminCompanyUsersTable: React.FC<SuperAdminCompanyUsersTableProps> = ({
    data,
    isLoading,
    selectedRowIds,
    hideActions,
    onDelete,
    onEdit,
    onSelectedModels,
}) => {
    const hf = useForm();
    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const selectedIdRef = useRef<number | undefined>();
    const confirm = useConfirm();

    const columns = useColumns<(typeof data)[0]>(
        hideActions && hideActions
            ? [
                {
                    field: 'firstname',
                    headerName: 'Name',
                    type: 'string',
                },
                {
                    field: 'lastname',
                    headerName: 'Surname',
                    type: 'string',
                },
                {
                    field: 'email',
                    headerName: 'Email',
                    type: 'string',
                },
                {
                    field: 'phone_number',
                    headerName: 'Phone number',
                    type: 'string',
                }
            ]
            : [
                {
                    field: 'firstname',
                    headerName: 'Name',
                    type: 'string',
                },
                {
                    field: 'lastname',
                    headerName: 'Surname',
                    type: 'string',
                },
                {
                    field: 'email',
                    headerName: 'Email',
                    type: 'string',
                },
                {
                    field: 'phone_number',
                    headerName: 'Phone number',
                    type: 'string',
                },
                {
                    field: 'action',
                    headerName: ' ',
                    type: 'actions',
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
            ]
    );

    return (
        <Box>
            <HitDatagrid
                filter={{
                    hf,
                    render: (
                        <HitFormGrid>
                            <Controller
                                name="firstname"
                                render={(field) => <HitTextField {...field} label="Name" />}
                            />

                            <Controller
                                name="lastname"
                                render={(field) => <HitTextField {...field} label="Surname" />}
                            />
                            <Controller
                                name="email"
                                render={(field) => <HitTextField {...field} label="Email" />}
                            />
                            <HitFormActions>
                                <HitDataGridFilterResetButton />
                                <HitDatagridFilterSubmitButton />
                            </HitFormActions>
                        </HitFormGrid>
                    ),
                }}
                rows={data}
                columns={columns}
                onRowSelectionModelChange={(model) => onSelectedModels(model)}
                rowSelectionModel={selectedRowIds || []}
                checkboxSelection={false}
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
                                content: 'Are you sure you want to delete this user?',
                                actionLabel: 'Yes'
                            },
                            {
                                content: 'Are you REALLY sure you want to delete this user? This will affect the company\'s whole system',
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
                                content: 'Are you sure you want to edit this user?',
                                actionLabel: 'Yes'
                            },
                            {
                                content: 'Are you REALLY sure you want to edit this user? This will affect the company\'s whole system',
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