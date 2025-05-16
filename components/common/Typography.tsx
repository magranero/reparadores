import React from 'react';
import { Text, StyleSheet, TextStyle, TextProps } from 'react-native';
import { fontFamily, fontSize, lineHeight } from '@/constants/Typography';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning';
  weight?: 'regular' | 'medium' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle;
  children: React.ReactNode;
}

export function Typography({
  variant = 'body1',
  color = 'primary',
  weight = 'regular',
  align = 'left',
  style,
  children,
  ...props
}: TypographyProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getTextColor = () => {
    switch (color) {
      case 'primary':
        return colors.text;
      case 'secondary':
        return colors.textSecondary;
      case 'tertiary':
        return colors.textTertiary;
      case 'error':
        return colors.error[500];
      case 'success':
        return colors.success[500];
      case 'warning':
        return colors.warning[500];
      default:
        return colors.text;
    }
  };

  const getFontFamily = () => {
    switch (weight) {
      case 'regular':
        return fontFamily.inter.regular;
      case 'medium':
        return fontFamily.inter.medium;
      case 'bold':
        return fontFamily.inter.bold;
      default:
        return fontFamily.inter.regular;
    }
  };

  return (
    <Text
      style={[
        styles[variant],
        { 
          color: getTextColor(),
          fontFamily: getFontFamily(),
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: fontSize.display,
    lineHeight: fontSize.display * lineHeight.tight,
  },
  h2: {
    fontSize: fontSize.xxxl,
    lineHeight: fontSize.xxxl * lineHeight.tight,
  },
  h3: {
    fontSize: fontSize.xxl,
    lineHeight: fontSize.xxl * lineHeight.tight,
  },
  h4: {
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.tight,
  },
  h5: {
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.tight,
  },
  h6: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.tight,
  },
  body1: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  body2: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  caption: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
  },
  button: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.tight,
  },
  overline: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});