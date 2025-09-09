import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ComponentsScreen() {
  const navigationItems = [
    { title: 'Login', route: '/(auth)/login' },
    { title: 'Register', route: '/(auth)/register' },
    { title: 'Forgot Password', route: '/(auth)/forgot-password' },
    { title: 'Reset Password', route: '/(auth)/reset-password' },
    { title: 'Change Password', route: '/(auth)/change-password' },
  ];


  const handleNavigation = (route: string) => {
    router.push(route as any);
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Components</Text>
        
        <View style={styles.buttonContainer}>
          {navigationItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.navigationButton}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
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
    paddingTop: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  navigationButton: {
    backgroundColor: '#0A84FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});