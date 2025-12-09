import React, { FC } from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingComponentProps {
  children: React.ReactNode;
  isFetching: boolean;
  center?: boolean;
}

export const LoadingComponent: FC<LoadingComponentProps> = ({
  children,
  isFetching,
  center = false,
}) => {
  if (isFetching) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={
          center
            ? {
                height: '100%',
                width: '100%',
              }
            : {}
        }
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return <>{children}</>; // Render children when not fetching
};
