import { Box, Divider, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { IChatMessage } from 'src/api/chatRepository';
import { ChatMessageItem } from './ChatMessageItem';

interface ChatMessageListProps {
  messages: IChatMessage[];
  currentUserId?: number | string;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ChatMessageList({ messages, currentUserId }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: messages.length - prevLengthRef.current > 5 ? 'auto' : 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  // Initial scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  let lastDateLabel = '';

  return (
    <Box
      ref={containerRef}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        py: 2,
      }}
    >
      {messages.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" color="text.disabled">
            No messages yet. Be the first to write.
          </Typography>
        </Box>
      )}

      {messages.map((msg) => {
        const dateLabel = formatDateLabel(msg.created_at);
        const showDivider = dateLabel !== lastDateLabel;
        lastDateLabel = dateLabel;

        return (
          <Box key={msg.id}>
            {showDivider && (
              <Divider sx={{ my: 1.5, mx: 2 }}>
                <Typography variant="caption" color="text.disabled">
                  {dateLabel}
                </Typography>
              </Divider>
            )}
            <ChatMessageItem
              message={msg}
              isOwn={msg.sender?.id === currentUserId}
            />
          </Box>
        );
      })}

      <div ref={bottomRef} />
    </Box>
  );
}
