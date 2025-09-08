import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfileScreen() {
  const { id, name, avatar } = useLocalSearchParams();
  const userName = (name as string) || 'User';
  const userAvatar = (avatar as string) || userName.charAt(0);
  
  const handleReportUser = () => {
    Alert.alert(
      'Report User',
      'Report this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {} }
      ]
    );
  };
  
  const handleBlockUser = () => {
    Alert.alert(
      'Block User',
      "Block this user? You won't receive messages.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {} }
      ]
    );
  };
  
  const handleDeleteConversation = () => {
    Alert.alert(
      'Delete Conversation',
      'Delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', style: 'destructive', onPress: () => {} }
      ]
    );
  };
  
  const actionItems = [
    {
      id: 'report',
      title: 'Report user',
      icon: 'flag-outline' as const,
      color: '#1C1C1E',
      onPress: handleReportUser,
    },
    {
      id: 'block',
      title: 'Block user',
      icon: 'ban-outline' as const,
      color: '#1C1C1E',
      onPress: handleBlockUser,
    },
    {
      id: 'delete',
      title: 'Delete conversation',
      icon: 'trash-outline' as const,
      color: '#FF3B30',
      onPress: handleDeleteConversation,
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.largeAvatar}>
            <Text style={styles.largeAvatarText}>{userAvatar}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        
        {/* Actions Section */}
        <View style={styles.actionsContainer}>
          {actionItems.map((item, index) => (
            <View key={item.id}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && styles.actionItemPressed
                ]}
                onPress={item.onPress}
                android_ripple={{ color: '#F2F2F7' }}
              >
                <View style={styles.actionLeft}>
                  <Ionicons 
                    name={item.icon} 
                    size={22} 
                    color={item.color} 
                    style={styles.actionIcon}
                  />
                  <Text style={[styles.actionText, { color: item.color }]}>
                    {item.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
              </Pressable>
              {index < actionItems.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  largeAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  largeAvatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  actionsContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  actionItemPressed: {
    backgroundColor: '#F2F2F7',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 17,
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 50,
  },
});