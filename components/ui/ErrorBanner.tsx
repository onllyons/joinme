import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
// ❌ fără ThemeContext
import { Text } from './Text';
import { Button } from './Button';
import { Icon } from './Icon';
import { Spacer } from './Spacer';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function ErrorBanner({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  style,
  accessibilityLabel,
}: ErrorBannerProps) {
  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel || `Error: ${message}`}
    >
      <View style={styles.content}>
        <Icon
          name="warning"
          size="medium"
          color="error"
          accessibilityLabel="Error icon"
        />
        <Spacer size="md" horizontal />
        <View style={styles.textContent}>
          <Text variant="body" color="error" style={styles.title}>
            {title}
          </Text>
          <Text variant="caption" color="error" style={styles.message}>
            {message}
          </Text>
        </View>
        {onRetry && (
          <>
            <Spacer size="md" horizontal />
            <Button
              title={retryLabel}
              onPress={onRetry}
              variant="outline"
              size="small"
              accessibilityLabel={`${retryLabel} - retry the failed operation`}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2', // light red background
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FF3B30', // iOS red
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#FF3B30',
  },
  message: {
    lineHeight: 18,
    color: '#FF3B30',
  },
});
