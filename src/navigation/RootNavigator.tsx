import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ExchangeHomeScreen from '../screens/ExchangeHomeScreen';
import RecipientProfileScreen from '../screens/RecipientProfileScreen';
import CustomKeypadScreen from '../screens/CustomKeypadScreen';
import ExchangeSuccessScreen from '../screens/ExchangeSuccessScreen';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.canvas },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={ExchangeHomeScreen} />
      <Stack.Screen name="Recipient" component={RecipientProfileScreen} />
      <Stack.Screen
        name="Keypad"
        component={CustomKeypadScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="Success"
        component={ExchangeSuccessScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
