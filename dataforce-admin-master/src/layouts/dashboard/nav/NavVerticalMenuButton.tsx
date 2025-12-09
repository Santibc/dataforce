import React, { FC } from 'react';
import { Box, SxProps, Typography, useTheme } from '@mui/material';
import { FiChevronDown } from 'react-icons/fi';

interface NavVerticalMenuButtonProps {
    icon: React.ReactNode;
    text: string;
    selected?: boolean;
    chevron?: boolean;
    onClick: (e: any) => void;
    sx?: SxProps;
}

export const NavVerticalMenuButton: FC<NavVerticalMenuButtonProps> = ({
    icon,
    text,
    selected = false,
    chevron = false,
    onClick,
    sx = {}
}) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingY: 3,
                gap: 1,
                cursor: 'pointer',
                userSelect: 'none',
                width: '100%',
                ...sx
            }}
            onClick={onClick}
        >
            <Box sx={{ display: 'flex', mr: 'auto', gap: 2 }}>
                {icon}
                <Typography
                    sx={{ color: selected ? theme.palette.primary.darker : 'inherit', transition: 'color 0.1s ease-in-out', fontSize: 16 }}
                    fontWeight={500}
                    variant='body2'
                >
                    {text}
                </Typography>
            </Box>
            {chevron && <FiChevronDown />}
        </Box>
    );
}