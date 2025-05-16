import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function DiagnosisLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'Inter-Medium',
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Diagnosis',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Diagnosis Details',
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Analysis Results',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}