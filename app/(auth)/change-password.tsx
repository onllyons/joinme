import React, { useRef, useState } from 'react';
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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
// ❌ remove ThemeContext
// import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/ui';               // dacă nu ai alias '@', folosește cale relativă
import { SERVER_AJAX_URL, useRequests } from '@/hooks/useRequests';
import { getUser } from '@/utils/Auth';
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
  placeholder: '#9AA0A6',
};
const RADIUS = { xl: 16 };

export default function ChangePasswordScreen() {
  const router = useRouter();
  const styles = createStyles();
  const { sendDefaultRequest } = useRequests();
  const [loader, setLoader] = useState(false);
  const allowChangePassword = useRef(!getUser()?.byGoogle && !getUser()?.byApple);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [secureCurrent, setSecureCurrent] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureRepeat, setSecureRepeat] = useState(true);

  const onUpdate = async () => {
    setLoader(true);
    try {
      await sendDefaultRequest({
        url: `${SERVER_AJAX_URL}/user/change_password.php`,
        data: { currentPassword, newPassword, repeatNewPassword },
      });
      // TODO: toast/banner "Password updated"
      router.back();
    } catch (e) {
      // TODO: afișează eroarea (banner)
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
              <View style={styles.header}>
                <Text variant="title" style={styles.title}>
                  Change password
                </Text>

                {allowChangePassword.current ? (
                  <Text variant="body" style={styles.subtitle}>
                    Secure your account with a new password
                  </Text>
                ) : (
                  <Text variant="body" style={styles.subtitle}>
                    You cannot change your password because you logged in via Apple or Google
                  </Text>
                )}
              </View>

              <View
                style={[
                  styles.card,
                  !allowChangePassword.current && { pointerEvents: 'none', opacity: 0.75 },
                ]}
              >
                {/* Current password */}
                <View style={styles.field}>
                  <Text variant="caption" style={styles.label} color="onSurfaceVariant">
                    Current password
                  </Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Current password"
                      secureTextEntry={secureCurrent}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="password"
                      style={[styles.input, styles.inputPassword]}
                      placeholderTextColor={COLORS.placeholder}
                      returnKeyType="next"
                    />
                    <Pressable onPress={() => setSecureCurrent((s) => !s)} style={styles.showBtn}>
                      <Text variant="body" color="primary">
                        {secureCurrent ? 'Show' : 'Hide'}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* New password */}
                <View style={styles.field}>
                  <Text variant="caption" style={styles.label} color="onSurfaceVariant">
                    New password
                  </Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="New password"
                      secureTextEntry={secureNew}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      style={[styles.input, styles.inputPassword]}
                      placeholderTextColor={COLORS.placeholder}
                      returnKeyType="next"
                    />
                    <Pressable onPress={() => setSecureNew((s) => !s)} style={styles.showBtn}>
                      <Text variant="body" color="primary">
                        {secureNew ? 'Show' : 'Hide'}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Repeat new password */}
                <View style={styles.field}>
                  <Text variant="caption" style={styles.label} color="onSurfaceVariant">
                    Repeat new password
                  </Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      value={repeatNewPassword}
                      onChangeText={setRepeatNewPassword}
                      placeholder="Repeat new password"
                      secureTextEntry={secureRepeat}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      style={[styles.input, styles.inputPassword]}
                      placeholderTextColor={COLORS.placeholder}
                      returnKeyType="done"
                      blurOnSubmit
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <Pressable onPress={() => setSecureRepeat((s) => !s)} style={styles.showBtn}>
                      <Text variant="body" color="primary">
                        {secureRepeat ? 'Show' : 'Hide'}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Update button */}
                <Pressable
                  onPress={onUpdate}
                  style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
                >
                  <Text variant="button" color="onPrimary" style={styles.primaryBtnText}>
                    Update password
                  </Text>
                </Pressable>
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
    label: { marginBottom: SPACING.sm, fontSize: 15 },

    input: {
      borderWidth: 1,
      borderColor: COLORS.outline,
      backgroundColor: COLORS.surface,
      color: COLORS.onSurface,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderRadius: RADIUS.xl,
      fontSize: 16,
    },

    passwordRow: { position: 'relative', justifyContent: 'center' },
    inputPassword: { paddingRight: 72 },
    showBtn: {
      position: 'absolute',
      right: SPACING.sm,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
    },

    primaryBtn: {
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.xl,
      paddingVertical: SPACING.md + 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryBtnPressed: { opacity: 0.9 },
    primaryBtnText: { textAlign: 'center', color: COLORS.onPrimary },
  });
