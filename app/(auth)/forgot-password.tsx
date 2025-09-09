import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Pressable,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from 'react-native';
import { Link } from 'expo-router';
// ❌ remove ThemeContext
// import { useTheme } from '@/contexts/ThemeContext';
import { Text, Spacer } from '@/components/ui'; // dacă nu ai alias '@', folosește cale relativă
import { SERVER_AJAX_URL, useRequests } from '@/hooks/useRequests';
import Loader from '@/components/modals/Loader';

const SPACING = { xs: 6, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
const COLORS = {
    background: '#F7F8FA',
    surface: '#FFFFFF',
    onBackground: '#111111',
    onSurface: '#111111',
    onSurfaceVariant: '#6B7280',
    primary: '#0A84FF',
    onPrimary: '#FFFFFF',
    outline: '#E5E7EB',
    placeholder: '#9AA0A6'
};
const RADIUS = { xl: 16 };

export default function ForgotPasswordScreen() {
    const styles = createStyles();
    const { sendDefaultRequest } = useRequests();
    const [loader, setLoader] = useState(false);
    const [email, setEmail] = useState('');

    const onSend = async () => {
        setLoader(true);
        try {
            await sendDefaultRequest({
                url: `${SERVER_AJAX_URL}/user/send_reset_mail.php`,
                data: { email }
            });
            // poți arăta un toast/banner aici: "Check your email for the reset link."
        } catch (e) {
            // poți arăta un banner de eroare aici
        } finally {
            setLoader(false);
        }
    };

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Loader visible={loader} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <SafeAreaView style={styles.container}>
                  <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: SPACING.xl }]}
                  >
                      <View style={styles.wrapper}>
                          {/* Header */}
                          <View style={styles.header}>
                              <Text variant="title" style={styles.title}>
                                  Forgot password
                              </Text>
                              <Text variant="body" style={styles.subtitle} color="onSurfaceVariant">
                                  Enter your email and we’ll send you a reset link.
                              </Text>
                          </View>

                          {/* Card */}
                          <View style={styles.card}>
                              <View style={styles.field}>
                                  <Text variant="caption" color="onSurfaceVariant" style={styles.label}>
                                      Email
                                  </Text>
                                  <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="name@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="emailAddress"
                                    returnKeyType="done"
                                    onSubmitEditing={onSend}
                                    style={styles.input}
                                    placeholderTextColor={COLORS.placeholder}
                                    accessibilityLabel="Email"
                                  />
                              </View>

                              <Pressable
                                onPress={onSend}
                                accessibilityRole="button"
                                accessibilityLabel="Send reset link"
                                style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
                              >
                                  <Text variant="button" color="onPrimary" style={styles.primaryBtnText}>
                                      Send reset link
                                  </Text>
                              </Pressable>

                              <Spacer size="lg" />

                              <Link href="/login" asChild>
                                  <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Back to login"
                                    style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
                                  >
                                      <Text variant="button" color="primary" style={styles.secondaryBtnText}>
                                          Back to login
                                      </Text>
                                  </Pressable>
                              </Link>
                          </View>
                      </View>
                  </ScrollView>
              </SafeAreaView>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
}

const createStyles = () =>
  StyleSheet.create({
      container: { flex: 1, backgroundColor: COLORS.background },
      scrollContent: { flexGrow: 1 },
      wrapper: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },

      header: { marginBottom: SPACING.xl },
      title: { color: COLORS.onBackground },
      subtitle: { color: COLORS.onSurfaceVariant },

      card: {},

      field: { marginBottom: SPACING.lg },
      label: { marginBottom: SPACING.sm, fontSize: 15, color: COLORS.onSurfaceVariant },

      input: {
          borderWidth: 1,
          borderColor: COLORS.outline,
          backgroundColor: COLORS.surface,
          color: COLORS.onSurface,
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderRadius: RADIUS.xl,
          fontSize: 16
      },

      primaryBtn: {
          backgroundColor: COLORS.primary,
          borderRadius: RADIUS.xl,
          paddingVertical: SPACING.md + 2,
          alignItems: 'center',
          justifyContent: 'center'
      },
      primaryBtnPressed: { opacity: 0.9 },
      primaryBtnText: { textAlign: 'center', color: COLORS.onPrimary },

      secondaryBtn: {
          marginTop: SPACING.lg,
          alignItems: 'center',
          justifyContent: 'center'
      },
      secondaryBtnPressed: { opacity: 0.95 },
      secondaryBtnText: { textAlign: 'center' }
  });
