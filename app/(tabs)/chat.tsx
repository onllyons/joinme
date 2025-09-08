import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock chat data
const mockChats = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastMessage: 'Hey! Are you still up for tennis tomorrow?',
    time: 'Just now',
    unreadCount: 2,
    avatar: 'SJ',
    avatarColor: '#FF6B6B',
    isTyping: false,
    isDelivered: true,
  },
  {
    id: '2',
    name: 'Football Group',
    lastMessage: 'typing…',
    time: '2 min ago',
    unreadCount: 0,
    avatar: '⚽',
    avatarColor: '#4ECDC4',
    isTyping: true,
    isDelivered: false,
  },
  {
    id: '3',
    name: 'Alex Chen',
    lastMessage: 'Thanks for the book recommendation!',
    time: '20 min ago',
    unreadCount: 0,
    avatar: 'AC',
    avatarColor: '#45B7D1',
    isTyping: false,
    isDelivered: true,
  },
  {
    id: '4',
    name: 'Maria Rodriguez',
    lastMessage: 'See you at the book club meeting',
    time: '11:02 AM',
    unreadCount: 1,
    avatar: 'MR',
    avatarColor: '#96CEB4',
    isTyping: false,
    isDelivered: true,
  },
  {
    id: '5',
    name: 'Running Buddies',
    lastMessage: 'Great run today everyone! 🏃‍♂️',
    time: 'Yesterday',
    unreadCount: 0,
    avatar: '🏃',
    avatarColor: '#FFEAA7',
    isTyping: false,
    isDelivered: true,
  },
  {
    id: '6',
    name: 'Emma Wilson',
    lastMessage: 'Let me know when you\'re free to chat',
    time: 'Tuesday',
    unreadCount: 0,
    avatar: 'EW',
    avatarColor: '#DDA0DD',
    isTyping: false,
    isDelivered: true,
  },
];

// Chat Item Component
const ChatItem = ({ item }: { item: typeof mockChats[0] }) => {
  const handlePress = () => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: item.id, name: item.name }
    });
  };

  return (
    <TouchableOpacity style={styles.chatItem} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.chatLeft}>
        <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.chatContent}>
          <Text style={styles.chatName}>{item.name}</Text>
          <View style={styles.lastMessageRow}>
            <Text style={[
              styles.lastMessage,
              item.isTyping && styles.typingText
            ]}>
              {item.lastMessage}
            </Text>
            {item.isDelivered && !item.isTyping && (
              <Text style={styles.deliveredTicks}>✓✓</Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.chatRight}>
        <Text style={styles.timeText}>{item.time}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search here…"
              placeholderTextColor="#8E8E93"
            />
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          data={mockChats}
          renderItem={({ item }) => <ChatItem item={item} />}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  chatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  typingText: {
    color: '#34C759',
    fontStyle: 'italic',
  },
  deliveredTicks: {
    fontSize: 12,
    color: '#C7C7CC',
  },
  chatRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  unreadBadge: {
    backgroundColor: '#34C759',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 82,
  },
});