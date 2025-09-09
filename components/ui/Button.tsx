import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const COLORS = {
  primaryBg: '#007AFF',     // iOS Blue
  primaryText: '#FFFFFF',
  secondaryBg: '#E5E5EA',   // iOS Gray 3
  secondaryText: '#000000',
  outlineText: '#007AFF',
  outlineBorder: '#007AFF',
  ghostText: '#007AFF',
  disabledBg: '#F2F2F7',
  disabledText: '#8E8E93',
};

const SIZES = {
  small:  { paddingV: 8,  paddingH: 12, font: 14, radius: 12 },
  medium: { paddingV: 12, paddingH: 16, font: 16, radius: 12 },
  large:  { paddingV: 16, paddingH: 20, font: 18, radius: 12 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  accessibilityLabel,
  style,
  textStyle,
}: ButtonProps) {

  const { paddingV, paddingH, font, radius } = SIZES[size];

  // colors per variant
  let backgroundColor = 'transparent';
  let color = COLORS.primaryText;
  let borderColor: string | undefined = undefined;
  let borderWidth = 0;

  if (disabled) {
    backgroundColor = COLORS.disabledBg;
    color = COLORS.disabledText;
  } else {
    switch (variant) {
      case 'primary':
        backgroundColor = COLORS.primaryBg;
        color = COLORS.primaryText;
        break;
      case 'secondary':
        backgroundColor = COLORS.secondaryBg;
        color = COLORS.secondaryText;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        color = COLORS.outlineText;
        borderColor = COLORS.outlineBorder;
        borderWidth = 1;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        color = COLORS.ghostText;
        break;
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          borderWidth,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
          borderRadius: radius,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text
        style={[{ color, fontSize: font, fontWeight: '600' } as TextStyle, textStyle]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
