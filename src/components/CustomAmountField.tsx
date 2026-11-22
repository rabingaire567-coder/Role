import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Entypo, FontAwesome6 } from '@expo/vector-icons';

import { formatCoins, formatUsd, usdForCoins } from '../lib/format';

type Props = {
  coins: number;
  chosen: boolean;
  onPress: () => void;
};

/** Tappable field that opens the custom keypad sheet. */
export function CustomAmountField({ coins, chosen, onPress }: Props) {
  return (
    <View>
      <Text className="text-[15px] font-bold text-ink">Exchange earnings for Coins</Text>

      <Pressable
        onPress={onPress}
        className="mt-3 flex-row items-center rounded-2xl bg-field px-4 py-4"
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <Text
          numberOfLines={1}
          className={`flex-1 text-[13.5px] ${
            chosen ? 'font-semibold text-ink' : 'text-muted'
          }`}
        >
          {chosen
            ? `${formatCoins(coins)} Coins · ${formatUsd(usdForCoins(coins))}`
            : 'Enter a custom number or amount...'}
        </Text>

        <View className="ml-2 flex-row items-center gap-2">
          <Entypo name="select-arrows" size={15} color="#8A8B91" />
          <FontAwesome6
            name="circle-check"
            size={17}
            color={chosen ? '#FE2C55' : '#C9C4D3'}
          />
        </View>
      </Pressable>
    </View>
  );
}
