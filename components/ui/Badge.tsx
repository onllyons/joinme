import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Badge({
  label,
  variant = 'primary',
  style,
  accessibilityLabel,
}: BadgeProps) {
  const styles = createStyles(variant);

  return (
    <View
      style={[styles.badge, style]}
      accessibilityLabel={accessibilityLabel || label}
    >
      <Text variant="caption" style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const createStyles = (variant: BadgeVariant) => {
  let backgroundColor = '#E5E5EA'; // default gray
  let textColor = '#000000';

  switch (variant) {
    case 'primary':
      backgroundColor = '#007AFF20'; // semi-transparent iOS blue
      textColor = '#007AFF';
      break;
    case 'secondary':
      backgroundColor = '#F2F2F7';
      textColor = '#3C3C43';
      break;
    case 'success':
      backgroundColor = '#34C75920'; // semi-transparent green
      textColor = '#34C759';
      break;
    case 'error':
      backgroundColor = '#FF3B3020'; // semi-transparent red
      textColor = '#FF3B30';
      break;
  }

  return StyleSheet.create({
    badge: {
      backgroundColor,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: backgroundColor,
    },
    text: {
      color: textColor,
      fontWeight: '600',
    },
  });
};
