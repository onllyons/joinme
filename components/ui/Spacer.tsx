import React from 'react';
import { View } from 'react-native';

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface SpacerProps {
  size?: SpacerSize | number;
  horizontal?: boolean;
  accessibilityLabel?: string;
}

export function Spacer({
  size = 'md',
  horizontal = false,
  accessibilityLabel,
}: SpacerProps) {
  const spacing: Record<SpacerSize, number> = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };

  const getSpacerSize = () => {
    if (typeof size === 'number') return size;
    return spacing[size];
  };

  const spacerSize = getSpacerSize();

  return (
    <View
      style={horizontal ? { width: spacerSize } : { height: spacerSize }}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
