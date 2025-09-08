import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

// Mock messages data
const mockMessages = [
  {
    id: '1',
    text: 'Hey! Are you still up for tennis tomorrow?',
    sender: 'other',
    timestamp: '2:30 PM',
  },
  {
    id: '2',
    text: 'Yes, absolutely! What time works for you?',
    sender: 'me',
    timestamp: '2:32 PM',
  },
  {
    id: '3',
    text: 'How about 6 PM at the community center?',
    sender: 'other',
    timestamp: '2:33 PM',
  },
  {
    id: '4',
    text: 'Perfect! I\'ll bring the rackets',
    sender: 'me',
    timestamp: '2:35 PM',
  },
  {
    id: '5',
    text: 'Great! See you there 🎾',
    sender: 'other',
    timestamp: '2:36 PM',
  },
  {
    id: '6',
    text: 'Looking forward to it!',
    sender: 'me',
    timestamp: '2:37 PM',
  },
];

// Date separator component
const DateSeparator = () => (
  <View style={styles.dateSeparatorContainer}>
    <View style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>Today</Text>
    </View>
  </View>
);

// Message bubble component
const MessageBubble = ({ message, isFirstInGroup, isLastInGroup }: { 
  message: typeof mockMessages[0]; 
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}) => {
  const isMe = message.sender === 'me';
  
  // Calculate border radius based on position in group
  const getBorderRadius = () => {
    if (isMe) {
      return {
        borderTopLeftRadius: 18,
        borderTopRightRadius: isFirstInGroup ? 22 : 18,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: isLastInGroup ? 4 : 18,
      };
    } else {
      return {
        borderTopLeftRadius: isFirstInGroup ? 22 : 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: isLastInGroup ? 4 : 18,
        borderBottomRightRadius: 18,
      };
    }
  };
  
  return (
    <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
      <View style={[
        styles.messageBubble, 
        isMe ? styles.myMessageBubble : styles.otherMessageBubble,
        getBorderRadius()
      ]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
          {message.text}
        </Text>
      </View>
      <Text style={[styles.timestamp, isMe ? styles.myTimestamp : styles.otherTimestamp]}>
        {message.timestamp}
      </Text>
    </View>
  );
};

export default function ChatDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const contactName = (name as string) || 'Chat';
  
  // Helper to determine if message is first/last in sender group
  const getMessageGroupInfo = (index: number) => {
    const currentMessage = mockMessages[index];
    const prevMessage = index > 0 ? mockMessages[index - 1] : null;
    const nextMessage = index < mockMessages.length - 1 ? mockMessages[index + 1] : null;
    
    const isFirstInGroup = !prevMessage || prevMessage.sender !== currentMessage.sender;
    const isLastInGroup = !nextMessage || nextMessage.sender !== currentMessage.sender;
    
    return { isFirstInGroup, isLastInGroup };
  };
  
  const renderItem = ({ item, index }: { item: typeof mockMessages[0]; index: number }) => {
    const { isFirstInGroup, isLastInGroup } = getMessageGroupInfo(index);
    
    return (
      <>
        {index === 0 && <DateSeparator />}
        <MessageBubble 
          message={item} 
          isFirstInGroup={isFirstInGroup}
          isLastInGroup={isLastInGroup}
        />
      </>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <Pressable 
          style={styles.headerCenter}
          onPress={() => router.push({
            pathname: '/user/[id]',
            params: { 
              id: id as string, 
              name: contactName,
              avatar: contactName.charAt(0)
            }
          })}
          android_ripple={{ color: '#E5E5EA' }}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{contactName.charAt(0)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.contactName}>{contactName}</Text>
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </Pressable>
        
        <View style={styles.headerRight} />
      </View>
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages List */}
        <FlatList
          data={mockMessages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />
        
        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Message…"
              placeholderTextColor="#8E8E93"
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.sendButton} activeOpacity={0.7}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  onlineStatus: {
    fontSize: 13,
    color: '#34C759',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerRight: {
    width: 32,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateSeparator: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  messageContainer: {
    marginVertical: 2,
    maxWidth: '78%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 2,
  },
  myMessageBubble: {
    backgroundColor: '#0A84FF',
  },
  otherMessageBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginHorizontal: 4,
    marginBottom: 4,
  },
  myTimestamp: {
    textAlign: 'right',
  },
  otherTimestamp: {
    textAlign: 'left',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 17,
    color: '#000000',
    maxHeight: 100,
    minHeight: 44,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  sendButton: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});