import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BalanceDisplay } from '../components/BalanceDisplay';
import { CoinKeypad, type KeypadKey } from '../components/CoinKeypad';
import { PrimaryButton } from '../components/PrimaryButton';
import { useExchange } from '../context/ExchangeContext';
import { formatCoins, formatUsd, usdForCoins } from '../lib/format';
import type { ScreenProps } from '../navigation/types';

/** Screen 2 — custom keypad bottom sheet. */
export default function CustomKeypadScreen({ navigation }: ScreenProps<'Keypad'>) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const sheetMaxHeight = Math.round(windowHeight * 0.92);
  const {
    exchangeAmount,
    setAmount,
    totalCoins,
    balance,
    recipient,
    username,
    openConfirm,
  } = useExchange();

  const [draft, setDraft] = useState<string | null>(null);

  const amount = draft === null ? exchangeAmount : Number(draft || '0');
  const usd = usdForCoins(amount);
  const handle = recipient?.handle ?? username;

  useEffect(() => {
    if (draft === null) return;
    setAmount(Number(draft || '0'));
  }, [draft, setAmount]);

  const handleKey = (key: KeypadKey) => {
    if (key === 'backspace') {
      setDraft((previous) => (previous === null ? '' : previous.slice(0, -1)));
      return;
    }

    setDraft((previous) => {
      const base = previous ?? '';
      const next = (base + key).replace(/^0+(?=\d)/, '').slice(0, 12);
      if (Number(next || '0') > totalCoins) return previous;
      return next;
    });
  };

  const selectAll = () => setDraft(String(totalCoins));

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close keypad"
        onPress={() => navigation.goBack()}
        style={StyleSheet.absoluteFill}
        className="bg-black/45"
      />

      <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          className="rounded-t-[28px] bg-white px-5 pt-2.5"
          style={{ maxHeight: sheetMaxHeight, paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="mb-1 h-1 w-10 self-center rounded-full bg-[#E4DEF0]" />

          <View className="h-10 flex-row items-center justify-center">
            <Text className="text-[15px] font-bold text-ink">Custom</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={() => navigation.goBack()}
              className="absolute right-0 h-8 w-8 items-center justify-center rounded-full bg-field"
            >
              <Ionicons name="close" size={17} color="#161823" />
            </Pressable>
          </View>

          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingBottom: 4 }}
          >
            <View className="mt-1">
              <BalanceDisplay usd={balance} coins={totalCoins} compact />
            </View>

            <View className="mt-2 flex-row items-center justify-center">
              <Text className="text-[12.5px] font-semibold text-ink">{handle}</Text>
              <FontAwesome6
                name="circle-check"
                size={12}
                color="#00C853"
                style={{ marginLeft: 5 }}
              />
            </View>

            <View className="mt-5">
              <View className="flex-row items-center">
                <Text className="text-[12px] font-bold text-muted">Number of Coins</Text>
                <FontAwesome6
                  name="chevron-down"
                  size={10}
                  color="#8A8B91"
                  style={{ marginLeft: 6, marginTop: 1 }}
                />
              </View>

              <View className="mt-2 flex-row items-end justify-between">
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  allowFontScaling={false}
                  className="flex-1 text-[32px] font-extrabold tracking-[-1px] text-ink"
                >
                  🪙 {formatCoins(amount)}
                </Text>
                <Pressable onPress={selectAll} className="pl-3 pb-1.5">
                  <Text className="text-[15px] font-bold text-pink">All</Text>
                </Pressable>
              </View>

              <Text allowFontScaling={false} className="mt-1 text-[13px] text-muted">
                = {formatUsd(usd)}
              </Text>
            </View>

            <View className="mt-4">
              <CoinKeypad onPress={handleKey} />
            </View>
          </ScrollView>

          <View className="pt-3">
            <Text className="text-right text-[13px] font-semibold text-ink">
              Total = {formatUsd(usd)}
            </Text>

            <Text className="mt-2 text-[10.5px] leading-[15px] text-muted">
              Coins obtained through this exchange are subject to our{' '}
              <Text className="font-semibold text-pink">Virtual Items Policy</Text>. Since you
              are accepting your Coins, they are non-refundable.
            </Text>

            <View className="mt-3">
              <PrimaryButton
                label="Exchange"
                onPress={openConfirm}
                disabled={amount <= 0}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      </View>
    </View>
  );
}
