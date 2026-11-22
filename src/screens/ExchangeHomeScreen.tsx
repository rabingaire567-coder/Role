import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { BalanceDisplay } from '../components/BalanceDisplay';
import { BottomBar } from '../components/BottomBar';
import { CustomAmountField } from '../components/CustomAmountField';
import { PresetCoinCards } from '../components/PresetCoinCards';
import { PrimaryButton } from '../components/PrimaryButton';
import { RewardsBanner } from '../components/RewardsBanner';
import { ScreenBackground } from '../components/ScreenBackground';
import { UsernameField } from '../components/UsernameField';
import { useExchange } from '../context/ExchangeContext';
import type { ScreenProps } from '../navigation/types';

/** Screen 1 — exchange home. */
export default function ExchangeHomeScreen({ navigation }: ScreenProps<'Home'>) {
  const {
    username,
    setUsername,
    recipient,
    balance,
    totalCoins,
    exchangeAmount,
    hasChosenAmount,
    setAmount,
  } = useExchange();

  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handleChangeUsername = (value: string) => {
    setUsername(value);
    if (error) setError(null);
  };

  const goToRecipient = () => {
    if (!recipient) {
      setError('Enter a valid TikTok username to continue.');
      inputRef.current?.focus();
      return;
    }
    setError(null);
    navigation.navigate('Recipient');
  };

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
        <ScrollView
          style={{ flex: 1 }}
          className="px-5"
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <RewardsBanner />

          <View className="mt-8">
            <BalanceDisplay usd={balance} coins={totalCoins} />
          </View>

          <View className="mt-9">
            <UsernameField
              value={username}
              onChangeText={handleChangeUsername}
              onSubmit={goToRecipient}
              error={error}
              recipient={recipient}
              inputRef={inputRef}
            />
          </View>

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
          <PrimaryButton label="Exchange" onPress={goToRecipient} />
        </BottomBar>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
