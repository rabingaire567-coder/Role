import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BottomBar } from '../components/BottomBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { TikTokLogo } from '../components/TikTokLogo';
import { useExchange, type ExchangeReceipt } from '../context/ExchangeContext';
import type { Recipient } from '../data/recipients';
import { formatCoins, formatReceiptTime, formatUsd, usdForCoins } from '../lib/format';
import type { ScreenProps } from '../navigation/types';
import { DEFAULT_USERNAME } from '../theme';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

function ReceiptRow({ label, value, divider }: { label: string; value: string; divider?: boolean }) {
  return (
    <View>
      <View className="flex-row items-center justify-between py-3.5">
        <Text className="text-[13px] text-muted">{label}</Text>
        <Text className="ml-4 flex-1 text-right text-[13px] font-semibold text-ink">
          {value}
        </Text>
      </View>
      {divider ? <View className="h-px bg-hairline" /> : null}
    </View>
  );
}

/** Screen 5 — success receipt. */
export default function ExchangeSuccessScreen({ navigation }: ScreenProps<'Success'>) {
  const { receipt, recipient, exchangeAmount } = useExchange();

  const [snapshot] = useState<ExchangeReceipt>(() => {
    if (receipt) return receipt;
    const fallbackRecipient: Recipient = recipient ?? {
      handle: DEFAULT_USERNAME,
      name: DEFAULT_USERNAME.slice(1),
      followers: 60,
    };
    return {
      id: 'fallback',
      recipient: fallbackRecipient,
      coins: exchangeAmount,
      usd: usdForCoins(exchangeAmount),
      createdAt: new Date(),
    };
  });

  const check = useRef(new Animated.Value(0)).current;
  const header = useRef(new Animated.Value(0)).current;
  const body = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(check, {
        toValue: 1,
        damping: 11,
        stiffness: 170,
        mass: 0.7,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.parallel([
        Animated.timing(header, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(body, {
          toValue: 1,
          duration: 380,
          delay: 90,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, [check, header, body, pulse]);

  const checkScale = check.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const checkOpacity = check.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const headerShift = header.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const bodyShift = body.interpolate({ inputRange: [0, 1], outputRange: [22, 0] });

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          className="px-5"
          contentContainerStyle={{ paddingTop: 28, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <Animated.View
              style={{
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              }}
            >
              <Animated.View
                style={{
                  opacity: checkOpacity,
                  transform: [{ scale: checkScale }],
                  height: 92,
                  width: 92,
                  borderRadius: 46,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#E4FAEE',
                }}
              >
                <View className="h-[70px] w-[70px] items-center justify-center rounded-full bg-green">
                  <Ionicons name="checkmark" size={38} color="#FFFFFF" />
                </View>
              </Animated.View>
            </Animated.View>

            <Animated.View
              style={{
                opacity: header,
                transform: [{ translateY: headerShift }],
                alignItems: 'center',
                marginTop: 24,
              }}
            >
              <Text className="text-[23px] font-extrabold tracking-[-0.4px] text-ink">
                Exchange Completed!
              </Text>
              <Text className="mt-2 text-[13px] text-muted">
                You exchanged for 🪙 {formatCoins(snapshot.coins)} Coins
              </Text>
            </Animated.View>
          </View>

          <Animated.View
            style={{ opacity: body, transform: [{ translateY: bodyShift }] }}
          >
            <View
              className="mt-7 rounded-3xl bg-white px-4 py-1"
              style={{
                shadowColor: '#4B3A7A',
                shadowOpacity: 0.06,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 8 },
                elevation: 2,
              }}
            >
              <ReceiptRow label="Recipient" value={snapshot.recipient.handle} divider />
              <ReceiptRow
                label="Coins Exchanged"
                value={`${formatCoins(snapshot.coins)} Coins`}
                divider
              />
              <ReceiptRow label="Deducted Amount" value={formatUsd(snapshot.usd)} divider />
              <ReceiptRow label="Time" value={formatReceiptTime(snapshot.createdAt)} />
            </View>

            <View className="mt-4 flex-row items-start rounded-2xl bg-[#F1EEF7] px-4 py-3.5">
              <TikTokLogo size={15} boxSize={32} />
              <View className="ml-3 flex-1">
                <Text className="text-[13.5px] font-bold text-ink">Start gifter level</Text>
                <Text className="mt-1 text-[11.5px] leading-[17px] text-muted">
                  Send your first Gift to begin your gifter journey and unlock more rewards as
                  you level up.
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomBar>
        <PrimaryButton
          label="Go back"
          variant="green"
          icon={
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          }
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
        />
      </BottomBar>
    </ScreenBackground>
  );
}
