import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from '@vadiun/react-native-eevee';
import { Chip } from 'react-native-paper';
import { IChatGroup } from 'app/api/chatRepository';

interface ChatGroupItemProps {
  group: IChatGroup;
  onPress: () => void;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

const ChatGroupItem: React.FC<ChatGroupItemProps> = ({ group, onPress }) => {
  const theme = useTheme();
  const hasUnread = group.unread_count > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        Platform.OS === 'ios' ? styles.containerIOS : styles.containerAndroid,
      ]}
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text
              size="lg"
              weight="bold"
              style={{ flex: 1 }}
              numberOfLines={1}
            >
              {group.name}
            </Text>
            {group.last_message && (
              <Text size="sm" color="gray500">
                {formatTimeAgo(group.last_message.created_at)}
              </Text>
            )}
          </View>

          <View style={styles.chipsRow}>
            <Chip
              style={{
                backgroundColor:
                  group.type === 'global' ? '#E3F2FD' : '#F3E5F5',
                height: 24,
              }}
              textStyle={{ fontSize: 10, lineHeight: 14 }}
            >
              {group.type === 'global' ? 'Global' : 'Custom'}
            </Chip>
            <Chip
              style={{
                backgroundColor:
                  group.mode === 'bidirectional' ? '#E8F5E9' : '#FFF3E0',
                height: 24,
              }}
              textStyle={{ fontSize: 10, lineHeight: 14 }}
            >
              {group.mode === 'bidirectional' ? 'Bidirectional' : 'Unilateral'}
            </Chip>
          </View>

          <View style={styles.previewRow}>
            <Text
              size="sm"
              color="gray500"
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {group.last_message
                ? `${group.last_message.sender_name}: ${group.last_message.body}`
                : 'No messages'}
            </Text>
            {hasUnread && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.colors.primary500 },
                ]}
              >
                <Text
                  size="sm"
                  style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}
                >
                  {group.unread_count > 99 ? '99+' : group.unread_count}
                </Text>
              </View>
            )}
          </View>

          <Text size="sm" color="gray500" style={{ marginTop: 2 }}>
            {group.members_count} members
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  containerAndroid: {
    elevation: 2,
  },
  containerIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
});

export default ChatGroupItem;
