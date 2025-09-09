import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Divider({
  orientation = 'horizontal',
  style,
  accessibilityLabel,
}: DividerProps) {
  return (
    <View
      style={[
        styles.base,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
      accessibilityLabel={accessibilityLabel || 'Divider'}
      accessibilityRole="separator"
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#E5E5EA', // iOS outline gray
    opacity: 0.6,
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});
