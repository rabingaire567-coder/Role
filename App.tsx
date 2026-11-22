import './global.css';

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import ConfirmExchangeDialog from './src/components/ConfirmExchangeDialog';
import { ExchangeProvider } from './src/context/ExchangeContext';
import { navigationRef } from './src/navigation/navigationRef';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.pink,
    background: colors.canvas,
    card: colors.canvas,
    text: colors.ink,
    border: colors.hairline,
    notification: colors.pink,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ExchangeProvider>
          <StatusBar style="dark" />
          <NavigationContainer ref={navigationRef} theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
          <ConfirmExchangeDialog />
        </ExchangeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
