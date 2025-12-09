import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { FC } from 'react';
import { FaRegCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router';

interface StepThreeProps {

}

export const StepThree: FC<StepThreeProps> = (props) => {
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 5, paddingTop: 8, flexDirection: 'column', gap: 2 }}>
            <FaRegCircleCheck size={100} color={theme.palette.primary.light} />
            <Typography fontWeight={600}>All set! Now check your email to complete the registration process for your company. </Typography>
            <Button variant='contained' onClick={() => navigate('/auth/login')}>Go to login</Button>
        </Box>
    );
}