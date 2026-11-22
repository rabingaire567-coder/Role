import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import { useExchange } from '../context/ExchangeContext';
import { formatUsd } from '../lib/format';
import { navigationRef } from '../navigation/navigationRef';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

/** Screen 4 — confirmation dialog, rendered above the navigation stack. */
export default function ConfirmExchangeDialog() {
  const { isConfirmOpen, closeConfirm, submitExchange, exchangeUsd, recipient } =
    useExchange();

  const [isSubmitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const spin = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isConfirmOpen) {
      submittingRef.current = false;
      setSubmitting(false);
      return;
    }

    spin.setValue(0);
    bob.setValue(0);
    enter.setValue(0);

    Animated.spring(enter, {
      toValue: 1,
      damping: 16,
      stiffness: 190,
      mass: 0.7,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();

    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    );

    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );

    spinLoop.start();
    bobLoop.start();

    return () => {
      spinLoop.stop();
      bobLoop.stop();
    };
  }, [isConfirmOpen, spin, bob, enter]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const frontFlip = spin.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.75, 1, 0.75, 1],
  });
  const backFlip = spin.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.4, 1, 0.4, 1],
  });
  const frontBob = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const backBob = bob.interpolate({ inputRange: [0, 1], outputRange: [2, -2] });

  const popScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  const handleConfirm = () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);

    // Brief "processing" beat, then the dialog shrinks away and the receipt appears.
    Animated.timing(enter, {
      toValue: 0,
      delay: 620,
      duration: 220,
      easing: Easing.in(Easing.quad),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start(({ finished }) => {
      if (!finished) {
        submittingRef.current = false;
        setSubmitting(false);
        return;
      }

      const receipt = submitExchange();
      if (!receipt || !navigationRef.isReady()) return;
      navigationRef.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'Success' }],
      });
    });
  };

  return (
    <Modal
      visible={isConfirmOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={isSubmitting ? undefined : closeConfirm}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-8">
        <Animated.View
          style={{
            width: '100%',
            maxWidth: 340,
            opacity: enter,
            transform: [{ scale: popScale }],
          }}
        >
          <View className="overflow-hidden rounded-[22px] bg-white pt-6">
            <Text className="text-center text-[17px] font-bold text-ink">
              Complete exchange?
            </Text>

            <View className="my-3 items-center">
              <View style={{ width: 74, height: 46 }}>
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: 2,
                    top: 12,
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: '#F6B93B',
                    opacity: 0.6,
                    transform: [{ translateY: backBob }, { rotate }, { scaleX: backFlip }],
                  }}
                />
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 2,
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: '#FFC93C',
                    borderWidth: 2,
                    borderColor: '#E8A21C',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ translateY: frontBob }, { rotate }, { scaleX: frontFlip }],
                  }}
                >
                  <FontAwesome6 name="tiktok" size={14} color="#A06200" />
                </Animated.View>
              </View>
            </View>

            <Text className="px-6 text-center text-[13.5px] leading-[20px] text-muted">
              <Text className="font-semibold text-ink">{formatUsd(exchangeUsd)}</Text> will be
              deducted from LIVE rewards balance and sent to{' '}
              <Text className="font-semibold text-ink">
                {recipient?.handle ?? 'recipient'}
              </Text>
              .
            </Text>

            <View className="mt-5 flex-row border-t border-hairline">
              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={closeConfirm}
                className="flex-1 items-center py-4"
                style={({ pressed }) => ({
                  opacity: isSubmitting ? 0.4 : pressed ? 0.6 : 1,
                })}
              >
                <Text className="text-[15px] font-semibold text-muted">Go back</Text>
              </Pressable>

              <View className="w-px bg-hairline" />

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={handleConfirm}
                className="flex-1 flex-row items-center justify-center py-4"
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FE2C55" style={{ marginRight: 7 }} />
                ) : null}
                <Text className="text-[15px] font-bold text-pink">
                  {isSubmitting ? 'Exchanging…' : 'Exchange'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
