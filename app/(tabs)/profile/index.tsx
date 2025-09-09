import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuthUser, isAuthenticated, logout } from '@/utils/Auth';
import { useData } from '@/contexts/DataContext';

interface MenuItem {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
    isDestructive?: boolean;
}

const menuItems: MenuItem[] = [
    {
        id: 'settings',
        title: 'Settings',
        icon: 'settings-outline',
        route: '/profile/settings'
    },
    {
        id: 'rate-us',
        title: 'Rate Us',
        icon: 'star-outline',
        route: '/profile/rate-us'
    },
    {
        id: 'share-app',
        title: 'Share App',
        icon: 'share-outline',
        route: '/profile/share-app'
    },
    {
        id: 'help-center',
        title: 'Help Center',
        icon: 'help-circle-outline',
        route: '/profile/help-center'
    },
    {
        id: 'privacy-policy',
        title: 'Privacy Policy',
        icon: 'shield-outline',
        route: '/profile/privacy-policy'
    },
    {
        id: 'terms-of-use',
        title: 'Terms of Use',
        icon: 'document-text-outline',
        route: '/profile/terms-of-use'
    },
    {
        id: 'contact-us',
        title: 'Contact Us',
        icon: 'mail-outline',
        route: '/profile/contact-us'
    }
];

const MenuItem = ({ item, onPress }: { item: MenuItem; onPress: () => void }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
      <View style={styles.menuItemLeft}>
          <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={20} color="#007AFF" />
          </View>
          <Text style={[
              styles.menuItemText,
              item.isDestructive && styles.menuItemTextDestructive
          ]}>
              {item.title}
          </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
    const { restartApp } = useData();

    const handleMenuPress = (item: MenuItem) => {
        if (item.id === 'logout') {
            Alert.alert(
              'Log Out',
              'Are you sure you want to log out?',
              [
                  { text: 'Cancel', style: 'cancel' },
                  {
                      text: 'Log Out', style: 'destructive', onPress: async () => {
                          await logout();
                          restartApp();
                      }
                  }
              ]
            );
        } else {
            router.push(item.route as any);
        }
    };

    const handleLogout = () => {
        Alert.alert(
          'Log Out',
          'Are you sure you want to log out?',
          [
              { text: 'Cancel', style: 'cancel' },
              {
                  text: 'Log Out', style: 'destructive', onPress: async () => {
                      await logout();
                      restartApp();
                  }
              }
          ]
        );
    };

    return (
      <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                  <Text style={styles.headerTitle}>Your Profile</Text>
              </View>

              {/* Profile Card */}
              <View style={styles.profileCard}>
                  {isAuthenticated() ? (
                    <>
                        <View style={styles.avatarContainer}>
                            <Image
                              source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }}
                              style={styles.avatar}
                            />
                            <View style={styles.editBadge}>
                                <Ionicons name="pencil" size={12} color="#FFFFFF" />
                            </View>
                        </View>
                        <Text style={styles.userName}>{getAuthUser().name}</Text>
                    </>
                  ) : (
                    <Text style={styles.userName}>You are not authorized</Text>
                  )}

              </View>

              {/* Menu Items */}
              <View style={styles.menuContainer}>
                  {menuItems.map((item, index) => (
                    <View key={item.id}>
                        <MenuItem
                          item={item}
                          onPress={() => handleMenuPress(item)}
                        />
                        {index < menuItems.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
              </View>

              {/* Logout Button */}
              {isAuthenticated() && (
                <View style={styles.logoutContainer}>
                    <TouchableOpacity
                      style={styles.logoutButton}
                      onPress={handleLogout}
                      activeOpacity={0.7}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                            </View>
                            <Text style={styles.logoutText}>Log out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
              )}
          </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7'
    },
    scrollView: {
        flex: 1
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#F2F2F7'
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1C1C1E'
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        paddingVertical: 24,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E5E5EA'
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1C1C1E'
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF'
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F2F2F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#1C1C1E'
    },
    menuItemTextDestructive: {
        color: '#FF3B30'
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginLeft: 60
    },
    logoutContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 40,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF'
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FF3B30'
    }
});