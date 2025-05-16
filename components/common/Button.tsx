import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { fontFamily, fontSize } from '@/constants/Typography';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useColorScheme } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getButtonStyles = () => {
    const baseStyle = [
      styles.button,
      styles[`${size}Button`],
      fullWidth && styles.fullWidth,
    ];
    
    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          { backgroundColor: disabled ? colors.primary[300] : colors.primary[500] },
        ];
      case 'secondary':
        return [
          ...baseStyle,
          { backgroundColor: disabled ? colors.secondary[300] : colors.secondary[500] },
        ];
      case 'outline':
        return [
          ...baseStyle,
          { 
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: disabled ? colors.primary[300] : colors.primary[500],
          },
        ];
      case 'ghost':
        return [
          ...baseStyle,
          { 
            backgroundColor: 'transparent',
          },
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyles = () => {
    const baseStyle = [
      styles.text,
      styles[`${size}Text`],
    ];
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return [
          ...baseStyle,
          { color: colors.background },
        ];
      case 'outline':
        return [
          ...baseStyle,
          { color: disabled ? colors.primary[300] : colors.primary[500] },
        ];
      case 'ghost':
        return [
          ...baseStyle,
          { color: disabled ? colors.primary[300] : colors.primary[500] },
        ];
      default:
        return baseStyle;
    }
  };

  return (
    <AnimatedTouchable
      style={[getButtonStyles(), animatedStyle]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? 'white' : colors.primary[500]}
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={getTextStyles()}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  smButton: {
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
    minHeight: 38,
  },
  mdButton: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    minHeight: 46,
  },
  lgButton: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
    minHeight: 54,
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fontFamily.inter.medium,
    textAlign: 'center',
  },
  smText: {
    fontSize: fontSize.sm,
  },
  mdText: {
    fontSize: fontSize.md,
  },
  lgText: {
    fontSize: fontSize.lg,
  },
  iconLeft: {
    marginRight: Layout.spacing.sm,
  },
  iconRight: {
    marginLeft: Layout.spacing.sm,
  },
});