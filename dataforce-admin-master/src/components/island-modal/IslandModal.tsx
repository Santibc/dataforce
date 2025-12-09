import { Modal, Paper } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import React, { FC } from 'react';

interface IslandModalProps {
    open: boolean;
    onClose: () => void;
    maxWidth?: string | number;
    padding?: string | number;
    children: React.ReactNode;
}

export const IslandModal: FC<IslandModalProps> = ({ children, onClose, open, padding = 5, maxWidth = '700px' }) => (
    <Modal
        open={open}
        onClose={onClose}
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Paper
            sx={{
                position: 'relative',
                maxWidth: maxWidth,
                padding: padding,
                width: '100%'
            }}
        >
            {children}
        </Paper>
    </Modal>
)
