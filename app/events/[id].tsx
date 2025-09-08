import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailScreen() {
  const handleBackPress = () => {
    router.back();
  };

  const handleFavoritePress = () => {
    // No-op as requested
  };

  const handleJoinPress = () => {
    // Navigate to event (placeholder behavior)
    router.push('/events/1' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image with Overlay Buttons */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://img.freepik.com/free-vector/family-eating-zongzi_23-2148544865.jpg?t=st=1756802999~exp=1756806599~hmac=c46de42f88e8b64fb2ef5dcad59a33e0587f2263362ce090e1612a2f3a298910&w=1060' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          {/* Overlay Buttons */}
          <View style={styles.overlayButtons}>
            <TouchableOpacity 
              style={styles.overlayButton}
              onPress={handleBackPress}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.overlayButton}
              onPress={handleFavoritePress}
              activeOpacity={0.8}
            >
              <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>FAMILY</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Family Playdate</Text>

          {/* Subline with Date/Time */}
          <View style={styles.sublineContainer}>
            <View style={styles.sublineRow}>
              <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
              <Text style={styles.sublineText}>Saturday, April 27</Text>
            </View>
            <View style={styles.sublineRow}>
              <Ionicons name="time-outline" size={16} color="#8E8E93" />
              <Text style={styles.sublineText}>10:00 AM • 1 hour</Text>
            </View>
          </View>

          {/* Capacity */}
          <View style={styles.capacityContainer}>
            <Text style={styles.capacityText}>3/6 • 3 spots left</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '50%' }]} />
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              We'll meet in Fælledparken for a relaxed family hangout. Bring kids, snacks, and a blanket. We'll have simple games and plenty of time to chat.
            </Text>
          </View>

          {/* Creator */}
          <View style={styles.creatorSection}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png' }}
              style={styles.creatorAvatar}
            />
            <Text style={styles.creatorText}>Created by Anna M.</Text>
          </View>

          {/* Bottom spacing for sticky button */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Sticky Join Button */}
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={handleJoinPress}
          activeOpacity={0.8}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    height: 240,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  overlayButtons: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for sticky button
  },
  badgeContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  sublineContainer: {
    marginBottom: 20,
  },
  sublineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sublineText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  capacityContainer: {
    marginBottom: 32,
  },
  capacityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 3,
  },
  descriptionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1C1C1E',
    lineHeight: 24,
  },
  creatorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  creatorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  bottomSpacer: {
    height: 20,
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  joinButton: {
    backgroundColor: '#3460F7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});