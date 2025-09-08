import { View, Text, StyleSheet, FlatList, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  type: 'event' | 'chat' | 'reminder' | 'system';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface NotificationSection {
  title: string;
  data: Notification[];
}

const mockNotifications: NotificationSection[] = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        type: 'event',
        title: 'Football 5v5 starting soon',
        description: 'Your event starts in 30 minutes at Central Park. Don\'t forget your gear!',
        time: '2:30 PM',
        isRead: false,
      },
      {
        id: '2',
        type: 'chat',
        title: 'New message from Sarah',
        description: 'Hey! Are you still coming to tennis tomorrow? Let me know if you need...',
        time: '1:15 PM',
        isRead: false,
      },
      {
        id: '3',
        type: 'event',
        title: 'Family Playdate confirmed',
        description: 'Anna M. confirmed your spot for the family playdate this Saturday.',
        time: '11:45 AM',
        isRead: true,
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '4',
        type: 'reminder',
        title: 'Event reminder',
        description: 'Concert in the Park is tomorrow at 7:00 PM. See you there!',
        time: '6:00 PM',
        isRead: true,
      },
      {
        id: '5',
        type: 'system',
        title: 'Profile updated',
        description: 'Your profile information has been successfully updated.',
        time: '2:20 PM',
        isRead: true,
      },
    ],
  },
  {
    title: 'Earlier',
    data: [
      {
        id: '6',
        type: 'event',
        title: 'New event near you',
        description: 'Paddle Tennis is happening 3 km away. Join now and meet new people!',
        time: 'Mon 4:15 PM',
        isRead: true,
      },
      {
        id: '7',
        type: 'chat',
        title: 'Football Group',
        description: 'Great game everyone! Same time next week?',
        time: 'Sun 8:30 PM',
        isRead: true,
      },
    ],
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'event':
      return 'calendar-outline';
    case 'chat':
      return 'chatbubble-outline';
    case 'reminder':
      return 'notifications-outline';
    case 'system':
      return 'settings-outline';
    default:
      return 'information-circle-outline';
  }
};

const NotificationItem = ({ item }: { item: Notification }) => {
  const handlePress = () => {
    // Placeholder for navigation and mark as read
    console.log('Notification tapped:', item.id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.notificationIcon}>
        <Ionicons
          name={getNotificationIcon(item.type) as any}
          size={20}
          color="#007AFF"
        />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text
            style={[
              styles.notificationTitle,
              !item.isRead && styles.unreadTitle
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        
        <Text
          style={styles.notificationDescription}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
      
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

export default function NotificationsScreen() {
  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem item={item} />
  );

  const renderSectionHeader = ({ section }: { section: NotificationSection }) => (
    <SectionHeader title={section.title} />
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Notifications',
          headerShown: true,
          headerBackTitleVisible: false,
        }} 
      />
      <SafeAreaView style={styles.container}>
        <SectionList
          sections={mockNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  unreadNotification: {
    backgroundColor: '#F8F9FA',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  notificationDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginTop: 8,
    marginLeft: 4,
  },
});