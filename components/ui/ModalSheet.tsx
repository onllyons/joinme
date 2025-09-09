import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
// ❌ remove ThemeContext
// import { useTheme } from '@/contexts/ThemeContext';
import { Text } from './Text';
import { Icon } from './Icon';
import { Spacer } from './Spacer';

interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const RADIUS = { lg: 24 };
const COLORS = {
  surface: '#FFFFFF',
  outline: '#E5E5EA',
  backdrop: 'rgba(0,0,0,0.5)',
  onSurface: '#1C1C1E',
  onSurfaceVariant: '#6E6E73',
};

export function ModalSheet({
  visible,
  onClose,
  title,
  children,
  style,
  accessibilityLabel,
}: ModalSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close modal"
          accessibilityRole="button"
          accessibilityHint="Tap to close the modal"
        />
        <View
          style={[styles.sheet, style]}
          accessibilityLabel={accessibilityLabel || title || 'Modal sheet'}
          accessibilityRole="dialog"
          accessibilityViewIsModal={true}
        >
          <View style={styles.handle} />
          {title && (
            <>
              <View style={styles.header}>
                <Text variant="headline" color="onSurface">
                  {title}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Icon name="close" size="medium" color="onSurfaceVariant" />
                </TouchableOpacity>
              </View>
              <Spacer size="md" />
            </>
          )}
          <View style={styles.content}>
            {typeof children === 'string' ? <Text>{children}</Text> : children}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: COLORS.backdrop,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.outline,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
  },
});
