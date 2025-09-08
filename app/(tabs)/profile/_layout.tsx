import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Your Profile',
          headerShown: false,
          tabBarStyle: { display: 'flex' },
        }}
      />
      <Stack.Screen 
        name="settings" 
        options={{
          title: 'Settings',
          headerBackTitleVisible: false,
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="rate-us" 
        options={{
          title: 'Rate Us',
          headerBackTitleVisible: false,
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="share-app" 
        options={{
          title: 'Share App',
          headerBackTitleVisible: false,
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="help-center" 
        options={{
          title: 'Help Center',
          headerBackTitleVisible: false,
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="privacy-policy" 
        options={{
          title: 'Privacy Policy',
          headerBackTitleVisible: false,
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="terms-of-use" 
        options={{
          title: 'Terms of Use',
          headerBackTitleVisible: false,
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="contact-us" 
        options={{
          title: 'Contact Us',
          headerBackTitleVisible: false,
          headerShown: true,
        }}
      />
    </Stack>
  );
}