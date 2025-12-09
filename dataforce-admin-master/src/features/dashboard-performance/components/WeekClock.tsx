import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import { IoChevronBackOutline, IoChevronForward } from 'react-icons/io5';

interface WeekClockProps {
    week: number;
    onClickBackward: () => void;
    onClickForward: () => void;
}

export const WeekClock: FC<WeekClockProps> = ({ onClickBackward, onClickForward, week }) => (
    <Box sx={{ paddingY: '1.25rem', width: '150px' }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
            }}
        >
            <IoChevronBackOutline
                style={{ marginTop: 'auto', marginBottom: 'auto', cursor: 'pointer' }}
                onClick={onClickBackward}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography fontWeight={800} sx={{ userSelect: 'none' }} fontSize={'20px'} color={'#212B36'}>
                    Week {week}
                </Typography>
            </Box>
            <IoChevronForward
                style={{ marginTop: 'auto', marginBottom: 'auto', cursor: 'pointer' }}
                onClick={onClickForward}
            />
        </Box>
    </Box>
)