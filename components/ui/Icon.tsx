import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export type IconName = keyof typeof Ionicons.glyphMap;
export type IconSize = 'small' | 'medium' | 'large';
export type IconColor = 'primary' | 'secondary' | 'error' | 'success' | 'onBackground' | 'onSurface' | 'onSurfaceVariant';

interface IconProps {
  name: IconName;
  size?: IconSize | number;
  color?: IconColor | string;
  accessibilityLabel?: string;
}

export function Icon({
  name,
  size = 'medium',
  color = 'onSurface',
  accessibilityLabel,
}: IconProps) {
  const getIconSize = () => {
    if (typeof size === 'number') return size;

    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const getIconColor = () => {
    if (typeof color === 'string' && color.startsWith('#')) return color;

    switch (color) {
      case 'primary':
        return '#007AFF'; // iOS Blue
      case 'secondary':
        return '#8E8E93'; // iOS Secondary Gray
      case 'error':
        return '#FF3B30'; // iOS Red
      case 'success':
        return '#34C759'; // iOS Green
      case 'onBackground':
        return '#000000';
      case 'onSurface':
        return '#1C1C1E';
      case 'onSurfaceVariant':
        return '#6E6E73';
      default:
        return '#1C1C1E';
    }
  };

  return (
    <Ionicons
      name={name}
      size={getIconSize()}
      color={getIconColor()}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    />
  );
}
