import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@vadiun/react-native-eevee';
import { IChatMessage } from 'app/api/chatRepository';

interface ChatMessageItemProps {
  message: IChatMessage;
  isOwn: boolean;
}

const ADMIN_ROLES = ['super_admin', 'admin', 'owner', 'manager'];

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isOwn,
}) => {
  const theme = useTheme();

  const senderName = message.sender
    ? `${message.sender.firstname} ${message.sender.lastname}`
    : 'User';

  const isAdmin = message.sender
    ? ADMIN_ROLES.includes(message.sender.role)
    : false;
  const roleLabel = isAdmin ? 'Admin' : 'Employee';

  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.containerOwn : styles.containerOther,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwn
            ? { backgroundColor: theme.colors.primary500 }
            : styles.bubbleOther,
        ]}
      >
        {!isOwn && (
          <View style={styles.senderRow}>
            <Text
              size="sm"
              weight="bold"
              style={isOwn ? { color: '#fff' } : {}}
            >
              {senderName}
            </Text>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: isAdmin ? '#FFF8E1' : '#E3F2FD',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 9,
                  color: isAdmin ? '#F57F17' : '#1565C0',
                  fontWeight: '600',
                }}
              >
                {roleLabel}
              </Text>
            </View>
          </View>
        )}

        <Text
          size="md"
          style={[styles.body, isOwn ? { color: '#fff' } : {}]}
        >
          {message.body}
        </Text>

        <Text
          size="sm"
          style={[
            styles.time,
            isOwn ? { color: 'rgba(255,255,255,0.7)' } : { color: '#999' },
          ]}
        >
          {time}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  containerOwn: {
    alignItems: 'flex-end',
  },
  containerOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bubbleOther: {
    backgroundColor: '#F0F0F0',
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  roleBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  body: {
    lineHeight: 20,
  },
  time: {
    textAlign: 'right',
    marginTop: 2,
    fontSize: 10,
  },
});

export default ChatMessageItem;
