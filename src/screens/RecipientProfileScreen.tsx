import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BalanceDisplay } from '../components/BalanceDisplay';
import { BottomBar } from '../components/BottomBar';
import { CustomAmountField } from '../components/CustomAmountField';
import { PresetCoinCards } from '../components/PresetCoinCards';
import { PrimaryButton } from '../components/PrimaryButton';
import { RecipientProfileCard } from '../components/RecipientProfileCard';
import { RewardsBanner } from '../components/RewardsBanner';
import { ScreenBackground } from '../components/ScreenBackground';
import { useExchange } from '../context/ExchangeContext';
import type { ScreenProps } from '../navigation/types';

/** Screen 3 — recipient profile validation. */
export default function RecipientProfileScreen({ navigation }: ScreenProps<'Recipient'>) {
  const {
    recipient,
    balance,
    totalCoins,
    exchangeAmount,
    hasChosenAmount,
    setAmount,
    openConfirm,
  } = useExchange();

  const selectPreset = (coins: number) => {
    setAmount(coins);
    navigation.navigate('Keypad');
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View className="flex-row items-center px-5 pb-2 pt-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            className="h-9 w-9 items-center justify-center rounded-full bg-white"
          >
            <Ionicons name="chevron-back" size={20} color="#161823" />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          className="px-5"
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <RewardsBanner />

          <View className="mt-8">
            <BalanceDisplay usd={balance} coins={totalCoins} />
          </View>

          {recipient ? (
            <View className="mt-7">
              <RecipientProfileCard recipient={recipient} />
            </View>
          ) : null}

          <View className="mt-6">
            <PresetCoinCards
              selected={hasChosenAmount ? exchangeAmount : null}
              onSelect={selectPreset}
            />
          </View>

          <View className="mt-6">
            <CustomAmountField
              coins={exchangeAmount}
              chosen={hasChosenAmount}
              onPress={() => navigation.navigate('Keypad')}
            />
          </View>
        </ScrollView>

        <BottomBar>
          <PrimaryButton label="Exchange" onPress={openConfirm} />
        </BottomBar>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
