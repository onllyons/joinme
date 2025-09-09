import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
// ❌ remove ThemeContext
// import { useTheme } from '@/contexts/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export type ListItemProps = {
  title: string;
  subtitle?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24 };
const RADIUS = { sm: 8, md: 12 };
const COLORS = {
  surface: '#FFFFFF',
  outline: '#E5E5EA',
};

export function ListItem({
  title,
  subtitle,
  leftIcon,
  rightIcon = 'chevron-forward',
  onPress,
  style,
  accessibilityLabel,
}: ListItemProps) {
  const styles = createStyles();

  const Component: any = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[styles.container, style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole={onPress ? 'button' : 'text'}
      hitSlop={onPress ? { top: 8, bottom: 8, left: 8, right: 8 } : undefined}
    >
      {leftIcon && (
        <View style={styles.leftIcon}>
          <Icon
            name={leftIcon}
            size="medium"
            color="onSurfaceVariant"
            accessibilityLabel={`${title} icon`}
          />
        </View>
      )}

      <View style={styles.content}>
        <Text>{title}</Text>
        {!!subtitle && (
          <Text variant="caption" color="onSurfaceVariant" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      {onPress && rightIcon && (
        <Icon
          name={rightIcon}
          size="medium"
          color="onSurfaceVariant"
          accessibilityLabel="Navigate"
        />
      )}
    </Component>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.lg,
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: COLORS.outline,
    },
    leftIcon: {
      marginRight: SPACING.md,
    },
    content: {
      flex: 1,
    },
    subtitle: {
      marginTop: SPACING.xs,
    },
  });
