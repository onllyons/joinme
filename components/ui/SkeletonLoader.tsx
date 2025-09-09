import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const COLORS = {
  surface: '#FFFFFF',
  outline: '#E5E5EA',        // gri subtil
  surfaceVariant: '#F2F2F7', // gri deschis pentru skeleton
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
};

const SPACING = {
  sm: 8,
  md: 16,
  lg: 24,
};

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius,
  style,
}: SkeletonLoaderProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false, // animăm culoarea, deci rămâne false
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.surfaceVariant, COLORS.outline],
  });

  return (
    <Animated.View
      // ascundem de la accesibility (decorativ)
      accessible={false}
      importantForAccessibility="no"
      style={[
        styles.skeleton,
        { width, height, backgroundColor, borderRadius: borderRadius ?? RADIUS.sm },
        style,
      ]}
    />
  );
}

interface SkeletonCardProps {
  style?: ViewStyle;
}

export function SkeletonCard({ style }: SkeletonCardProps) {
  return (
    <View
      style={[styles.card, style]}
      accessible={false}
      importantForAccessibility="no"
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <SkeletonLoader width="70%" height={24} borderRadius={4} />
          <View style={styles.spacer} />
          <SkeletonLoader width="50%" height={16} borderRadius={4} />
        </View>
        <SkeletonLoader width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    // borderRadius setat în runtime
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  spacer: {
    height: SPACING.sm,
  },
});
