import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@vadiun/react-native-eevee';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuth } from 'app/auth/services/useAuth';
import {
  useChatMessagesQuery,
  useMarkAsReadMutation,
  useSendMessageMutation,
  IChatMessage,
  IAttachmentInput,
} from 'app/api/chatRepository';
import { ChatNavigationType } from '../navigation';
import ChatMessageItem from '../components/ChatMessageItem';
import ChatInput from '../components/ChatInput';

type ConversationRoute = RouteProp<ChatNavigationType, 'chatConversation'>;

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface MessageWithDivider {
  type: 'divider' | 'message';
  key: string;
  label?: string;
  message?: IChatMessage;
}

function buildMessageList(messages: IChatMessage[]): MessageWithDivider[] {
  const items: MessageWithDivider[] = [];
  let lastDateLabel = '';

  for (const msg of messages) {
    const dateLabel = formatDateLabel(msg.created_at);
    if (dateLabel !== lastDateLabel) {
      items.push({
        type: 'divider',
        key: `divider-${dateLabel}-${msg.id}`,
        label: dateLabel,
      });
      lastDateLabel = dateLabel;
    }
    items.push({
      type: 'message',
      key: `msg-${msg.id}`,
      message: msg,
    });
  }

  return items;
}

const ChatConversationPage: React.FC = () => {
  const route = useRoute<ConversationRoute>();
  const { groupId, groupMode } = route.params;
  const auth = useAuth();
  const flatListRef = useRef<FlatList>(null);

  const {
    data: messages,
    isLoading,
  } = useChatMessagesQuery(groupId);
  const sendMutation = useSendMessageMutation();
  const markReadMutation = useMarkAsReadMutation();

  const isUnilateral = groupMode === 'unilateral';
  const prevLengthRef = useRef(0);

  // Mark as read when opening
  useEffect(() => {
    markReadMutation.mutate(groupId);
  }, [groupId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > prevLengthRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    prevLengthRef.current = messages?.length ?? 0;
  }, [messages?.length]);

  // On Android, scroll to end when keyboard opens so input stays visible
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    });
    return () => sub.remove();
  }, []);

  const handleSend = (payload: {
    body?: string;
    attachment?: IAttachmentInput | null;
  }) => {
    sendMutation.mutate({ groupId, ...payload });
  };

  const listData = buildMessageList(messages ?? []);

  const renderItem = ({ item }: { item: MessageWithDivider }) => {
    if (item.type === 'divider') {
      return (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text size="sm" color="gray500" style={styles.dividerText}>
            {item.label}
          </Text>
          <View style={styles.dividerLine} />
        </View>
      );
    }

    if (item.message) {
      return (
        <ChatMessageItem
          message={item.message}
          isOwn={item.message.sender?.id === auth.loggedUserID}
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {isLoading && !messages ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4478C1" />
        </View>
      ) : listData.length === 0 ? (
        <View style={styles.center}>
          <Text size="lg" color="gray500">
            No messages yet. Be the first to write.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />
      )}

      <ChatInput
        onSend={handleSend}
        disabled={isUnilateral}
        loading={sendMutation.isPending}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
  },
});

export default ChatConversationPage;
