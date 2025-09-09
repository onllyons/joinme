import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Card({ children, style, accessibilityLabel }: CardProps) {
  return (
    <View
      style={[styles.card, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="group"
    >
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',   // alb curat
    borderRadius: 12,             // colțuri rotunjite iOS
    padding: 16,                  // spacing consistent
    borderWidth: 1,
    borderColor: '#E5E5EA',       // gri subtil
    marginVertical: 8,
  },
});
