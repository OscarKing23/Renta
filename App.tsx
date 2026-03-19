import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AppNavigator } from './src/navigation';
import { ThemeProvider, useTheme } from './src/theme';
import { AuthProvider, CartProvider, OrdersProvider } from './src/context';
import { ToastProvider } from './src/components';

function AppContent() {
  const { isLightMode, colors } = useTheme();

  const navTheme = useMemo(() => ({
    ...(isLightMode ? DefaultTheme : DarkTheme),
    colors: {
      ...(isLightMode ? DefaultTheme.colors : DarkTheme.colors),
      background: colors.background,
      card: colors.surface,
      border: colors.border,
      text: colors.textPrimary,
      primary: colors.primary,
    },
  }), [isLightMode, colors]);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isLightMode ? 'dark' : 'light'} />
      <ToastProvider>
        <AppNavigator />
      </ToastProvider>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#0F0F14' }}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <AppContent />
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
