import React from 'react';
import { StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function Card({
  children,
  style,
  onPress,
  elevation = 'md',
  animated = false,
}: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: animated ? [{ scale: scale.value }] : undefined,
    };
  });
  
  const handlePressIn = () => {
    if (animated && onPress) {
      scale.value = withSpring(0.98);
    }
  };
  
  const handlePressOut = () => {
    if (animated && onPress) {
      scale.value = withSpring(1);
    }
  };

  const Container = animated ? Animated.View : View;
  
  const cardStyle = [
    styles.card,
    { backgroundColor: colors.card },
    elevation !== 'none' && Layout.shadows[elevation],
    { borderColor: colors.border },
    style,
  ];
  
  if (onPress) {
    const AnimatedTouchable = Animated.createAnimatedComponent(View);
    return (
      <AnimatedTouchable
        style={[cardStyle, animatedStyle]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onClick={onPress}
      >
        {children}
      </AnimatedTouchable>
    );
  }

  return <Container style={[cardStyle, animated ? animatedStyle : null]}>{children}</Container>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    marginBottom: Layout.spacing.md,
  },
});