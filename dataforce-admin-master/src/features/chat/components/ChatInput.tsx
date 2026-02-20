import { IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Iconify from 'src/components/iconify';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ChatInput({ onSend, disabled = false, loading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (disabled) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.disabledBackground',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="eva:lock-outline" width={16} sx={{ color: 'text.disabled' }} />
          <Typography variant="body2" color="text.disabled">
            Only administrators can send messages in this group
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      spacing={1}
      sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={5}
        size="small"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!message.trim() || loading}
                size="small"
              >
                <Iconify icon="eva:paper-plane-fill" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
