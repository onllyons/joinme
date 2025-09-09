import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';

export type TextVariant = 'title' | 'headline' | 'body' | 'caption';
export type TextColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'onBackground'
  | 'onSurface'
  | 'onSurfaceVariant';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  style?: TextStyle;
  accessibilityLabel?: string;
  numberOfLines?: number;
}

// Paletă de culori simplă
const COLORS: Record<TextColor, string> = {
  primary: '#0A84FF',
  secondary: '#8E8E93',
  error: '#FF3B30',
  success: '#34C759',
  onBackground: '#111111',
  onSurface: '#111111',
  onSurfaceVariant: '#6B7280',
};

// Tipografie simplă
const TYPOGRAPHY = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  headline: { fontSize: 20, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 16, fontWeight: '400' as const },
};

export function Text({
  children,
  variant = 'body',
  color = 'onSurface',
  style,
  accessibilityLabel,
  numberOfLines,
}: TextProps) {
  const typographyStyle = TYPOGRAPHY[variant] ?? TYPOGRAPHY.body;
  const textColor = COLORS[color] ?? COLORS.onSurface;

  return (
    <RNText
      style={[
        {
          fontSize: typographyStyle.fontSize,
          lineHeight: typographyStyle.lineHeight,
          fontWeight: typographyStyle.fontWeight,
          color: textColor,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}
