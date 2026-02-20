import { Box, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';

export function ChatEmptyState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary',
        gap: 2,
      }}
    >
      <Iconify icon="eva:message-circle-outline" width={64} sx={{ opacity: 0.4 }} />
      <Typography variant="h6" color="text.secondary">
        Select a group to get started
      </Typography>
      <Typography variant="body2" color="text.disabled">
        Choose a group from the list to view messages
      </Typography>
    </Box>
  );
}
