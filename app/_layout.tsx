import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';
import { Analytics } from '@/components/analytics/Analytics';
import { isAuthenticated } from '@/utils/Auth';
import { DataProvider } from '@/contexts/DataContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthGate } from "@/components/auth/AuthGate";

const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      text1NumberOfLines={3}
      style={{ borderLeftColor: '#57cc04', width: '90%', marginTop: 10 }}
      text1Style={{
        fontSize: 12,
        color: '#494949'
      }}
    />
  ),

  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={3}
      style={{
        borderLeftColor: '#ca3431', width: '90%', marginTop: 10,
        flexWrap: 'wrap'
      }}
      text1Style={{
        fontSize: 12,
        color: '#494949'
      }}
    />
  ),

  info: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={3}
      style={{ borderLeftColor: '#1cb0f6', width: '90%', marginTop: 10 }}
      text1Style={{
        fontSize: 12,
        color: '#494949'
      }}
    />
  )
};

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
        <DataProvider>
          <AuthGate>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Tabs' }} />
                {!isAuthenticated() && (
                  <Stack.Screen name="(auth)" options={{ headerShown: false, title: 'Auth' }} />
                )}
                <Stack.Screen name="+not-found" />
                <Stack.Screen name="mail-verify" options={{ headerShown: true, title: 'Verify email' }} />
                <Stack.Screen name="reset-password" options={{ headerShown: true, title: 'Reset password' }} />
            </Stack>
          </AuthGate>

          <StatusBar style="auto" />
          <Toast position="top" config={toastConfig} onPress={() => Toast.hide()}/>
          <Analytics />

        </DataProvider>
    </ThemeProvider>
  );
}

