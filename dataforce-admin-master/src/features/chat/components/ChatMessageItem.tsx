import { Box, Stack, Typography } from '@mui/material';
import { IChatMessage } from 'src/api/chatRepository';

interface ChatMessageItemProps {
  message: IChatMessage;
  isOwn: boolean;
}

const ADMIN_ROLES = ['super_admin', 'admin', 'owner', 'manager'];

export function ChatMessageItem({ message, isOwn }: ChatMessageItemProps) {
  const senderName = message.sender
    ? `${message.sender.firstname} ${message.sender.lastname}`
    : 'User';

  const isAdmin = message.sender ? ADMIN_ROLES.includes(message.sender.role) : false;
  const roleLabel = isAdmin ? 'Admin' : 'Employee';

  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Stack
      direction="row"
      justifyContent={isOwn ? 'flex-end' : 'flex-start'}
      sx={{ px: 2, py: 0.5 }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          px: 2,
          py: 1,
          borderRadius: 1.5,
          bgcolor: isOwn ? 'primary.main' : 'grey.200',
          color: isOwn ? 'primary.contrastText' : 'text.primary',
        }}
      >
        {!isOwn && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.25 }}>
            <Typography variant="caption" fontWeight="bold">
              {senderName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                px: 0.5,
                borderRadius: 0.5,
                bgcolor: isAdmin ? 'warning.lighter' : 'info.lighter',
                color: isAdmin ? 'warning.darker' : 'info.darker',
                fontSize: 10,
              }}
            >
              {roleLabel}
            </Typography>
          </Stack>
        )}

        <Typography
          variant="body2"
          sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
        >
          {message.body}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'right',
            mt: 0.25,
            opacity: 0.7,
            fontSize: 10,
          }}
        >
          {time}
        </Typography>
      </Box>
    </Stack>
  );
}
