import { Box, Button, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import PlanListItem from './PlanListItem';

interface SuscriptionContentWarningProps {
  onClick?: () => void;
}

export const SuscriptionContentWarning: FC<SuscriptionContentWarningProps> = ({ onClick }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '500px',
      paddingX: '1rem',
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 700 }} justifyContent="center" alignContent="center">
      Activate your subscription to see content
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        borderRadius: 2,
        padding: 5,
        backgroundColor: '#212B36',
      }}
    >
      <Box>
        <Typography variant="overline" color="white" sx={{ color: '#919EAB' }}>
          basic
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            marginY: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              color: 'white',
              fontWeight: 700,
            }}
          >
            $
          </Box>
          <Typography variant="h2" color="white">
            4.99
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="#919EAB">
              /month
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="#00A8EC">
          Saving $24 a year
        </Typography>
      </Box>
      <Stack spacing={2} sx={{ marginY: 4 }}>
        <PlanListItem positive>Feature 1</PlanListItem>
        <PlanListItem positive>Feature 2</PlanListItem>
        <PlanListItem positive>Feature 3</PlanListItem>
        <PlanListItem positive>Feature 4</PlanListItem>
      </Stack>
      <Button fullWidth size="large" variant="contained" sx={{ color: 'white' }} onClick={onClick}>
        Upgrade
      </Button>
    </Box>
  </Box>
);
