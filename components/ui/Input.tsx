import React, { useState } from 'react';
import { TextInput, View, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { Text } from './Text';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Input({
  label,
  error,
  style,
  accessibilityLabel,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const styles = createStyles(isFocused, !!error);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text variant="caption" style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor="#6E6E73"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole="text"
        accessibilityState={{ focused: isFocused }}
        enablesReturnKeyAutomatically
        {...textInputProps}
      />
      {error && (
        <Text variant="caption" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const createStyles = (isFocused: boolean, hasError: boolean) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      marginBottom: 8,
      color: '#6E6E73',
    },
    input: {
      borderWidth: 1,
      borderColor: hasError ? '#FF3B30' : isFocused ? '#007AFF' : '#E5E5EA',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: '#000000',
      backgroundColor: '#FFFFFF',
      // focus glow subtil iOS-like
      shadowColor: isFocused ? '#007AFF' : 'transparent',
      shadowOffset: { width: 0, height: isFocused ? 1 : 0 },
      shadowOpacity: isFocused ? 0.08 : 0,
      shadowRadius: isFocused ? 4 : 0,
      elevation: isFocused ? 1 : 0,
    },
    errorText: {
      marginTop: 6,
      color: '#FF3B30',
    },
  });
