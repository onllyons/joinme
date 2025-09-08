import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#0A84FF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{
          title: 'Login',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="register" 
        options={{
          title: 'Înregistrare utilizator',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{
          title: 'Am uitat parola',
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}