import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

export interface PlanListItemProps {
  positive?: boolean;
  children?: React.ReactNode;
}

const PlanListItem: FC<PlanListItemProps> = ({ positive = false, children }) => (
  <Box
    sx={{
      display: 'flex',
      gap: '8px',
    }}
  >
    <Box>
      {positive ? (
        <AiOutlineCheck color="#00A8EC" size={'16px'} />
      ) : (
        <AiOutlineClose color="#637381" size={'16px'} />
      )}
    </Box>
    <Typography
      variant="body2"
      color={positive ? 'white' : '#637381'}
      sx={{
        maxWidth: {
          lg: '300px',
        },
      }}
    >
      {children}
    </Typography>
  </Box>
);

export default PlanListItem;
