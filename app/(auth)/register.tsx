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
  ScrollView,
  Keyboard,
} from 'react-native';
import { Link } from 'expo-router';
import { Text, Spacer } from '@/components/ui'; // dacă aliasul '@' nu e configurat, folosește o cale relativă
import Loader from '@/components/modals/Loader';
import { SERVER_AJAX_URL, SuccessResponse, useRequests } from '@/hooks/useRequests';
import { login, User, UserTokens } from '@/utils/Auth';
import { useData } from '@/contexts/DataContext';

type AuthResponse = SuccessResponse & {
  userData: User;
  tokens: UserTokens;
};

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

export default function RegisterScreen() {
  const styles = createStyles();
  const { restartApp } = useData();
  const { sendDefaultRequest } = useRequests();
  const [loader, setLoader] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  const onCreateProfile = async () => {
    setLoader(true);
    try {
      const data = await sendDefaultRequest<AuthResponse>({
        url: `${SERVER_AJAX_URL}/user/register_v2.php`,
        data: { ...userData },
        showOptions: { success: false },
      });
      await login({ userData: data.userData, tokensData: data.tokens });
      restartApp();
    } catch (e) {
      // poți afișa un toast/banner aici
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
            contentContainerStyle={[styles.scrollContent, { paddingBottom: SPACING.xxl * 2 }]}
          >
            <View style={styles.wrapper}>
              <Text variant="title" style={styles.title}>
                Create account
              </Text>
              <Text variant="body" style={styles.subtitle} color="onSurfaceVariant">
                Fill in your details to continue
              </Text>

              <View style={styles.card}>
                {/* Full name */}
                <View style={styles.field}>
                  <Text variant="caption" color="onSurfaceVariant" style={styles.label}>
                    Full name
                  </Text>
                  <TextInput
                    value={userData.name}
                    onChangeText={(val) => setUserData((prev) => ({ ...prev, name: val }))}
                    placeholder="John Appleseed"
                    autoCapitalize="words"
                    autoCorrect
                    textContentType="name"
                    style={styles.input}
                    placeholderTextColor={COLORS.placeholder}
                    accessibilityLabel="Full name"
                    returnKeyType="next"
                  />
                </View>

                {/* Email */}
                <View style={styles.field}>
                  <Text variant="caption" color="onSurfaceVariant" style={styles.label}>
                    Email
                  </Text>
                  <TextInput
                    value={userData.email}
                    onChangeText={(val) => setUserData((prev) => ({ ...prev, email: val }))}
                    placeholder="name@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    style={styles.input}
                    placeholderTextColor={COLORS.placeholder}
                    accessibilityLabel="Email"
                    returnKeyType="next"
                  />
                </View>

                {/* Password */}
                <View style={styles.field}>
                  <Text variant="caption" color="onSurfaceVariant" style={styles.label}>
                    Password
                  </Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      value={userData.password}
                      onChangeText={(val) => setUserData((prev) => ({ ...prev, password: val }))}
                      placeholder="Create a password"
                      secureTextEntry={secure1}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      style={[styles.input, styles.inputPassword]}
                      placeholderTextColor={COLORS.placeholder}
                      accessibilityLabel="Password"
                      returnKeyType="next"
                    />
                    <Pressable
                      onPress={() => setSecure1((s) => !s)}
                      accessibilityRole="button"
                      accessibilityLabel={secure1 ? 'Show password' : 'Hide password'}
                      style={styles.showBtn}
                    >
                      <Text variant="body" color="primary">
                        {secure1 ? 'Show' : 'Hide'}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Repeat password */}
                <View style={styles.field}>
                  <Text variant="caption" color="onSurfaceVariant" style={styles.label}>
                    Repeat password
                  </Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      value={userData.passwordConfirm}
                      onChangeText={(val) => setUserData((prev) => ({ ...prev, passwordConfirm: val }))}
                      placeholder="Repeat your password"
                      secureTextEntry={secure2}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      style={[styles.input, styles.inputPassword]}
                      placeholderTextColor={COLORS.placeholder}
                      accessibilityLabel="Repeat password"
                      returnKeyType="done"
                      blurOnSubmit
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <Pressable
                      onPress={() => setSecure2((s) => !s)}
                      accessibilityRole="button"
                      accessibilityLabel={secure2 ? 'Show password' : 'Hide password'}
                      style={styles.showBtn}
                    >
                      <Text variant="body" color="primary">
                        {secure2 ? 'Show' : 'Hide'}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Create profile */}
                <Pressable
                  onPress={onCreateProfile}
                  accessibilityRole="button"
                  accessibilityLabel="Create profile"
                  style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
                >
                  <Text variant="button" style={styles.primaryBtnText} color="onPrimary">
                    Create profile
                  </Text>
                </Pressable>

                <Spacer size="lg" />

                <Link href="/login" asChild>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="I already have an account"
                    style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
                  >
                    <Text variant="button" color="primary" style={styles.secondaryBtnText}>
                      I already have an account
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
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    wrapper: {
      flex: 1,
      paddingHorizontal: SPACING.lg,
    },
    title: {
      marginTop: SPACING.xl,
      color: COLORS.onBackground,
    },
    subtitle: {
      marginBottom: SPACING.xl,
      color: COLORS.onSurfaceVariant,
    },

    card: {},

    field: {
      marginBottom: SPACING.lg,
    },
    label: {
      marginBottom: SPACING.sm,
      fontSize: 15,
      color: COLORS.onSurfaceVariant,
    },
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

    passwordRow: {
      position: 'relative',
      justifyContent: 'center',
    },
    inputPassword: {
      paddingRight: 72,
    },
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
    secondaryBtn: {},
    secondaryBtnPressed: { opacity: 0.6 },
    secondaryBtnText: { textAlign: 'center' },
  });
