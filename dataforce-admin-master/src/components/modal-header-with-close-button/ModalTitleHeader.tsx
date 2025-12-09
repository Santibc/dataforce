import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface ModalTitleHeaderProps {
    title?: string;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
    onClose?: () => void;
}

export const ModalTitleHeader: FC<ModalTitleHeaderProps> = ({ title = ' ', onClose, variant = 'h5' }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '19px' }}>
        <Typography variant={variant}>{title}</Typography>
        <AiOutlineClose onClick={onClose} style={{ cursor: 'pointer' }} />
    </Box>
);
