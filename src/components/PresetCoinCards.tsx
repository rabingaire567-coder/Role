import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { usdForCoins } from '../lib/format';
import { PRESET_AMOUNTS } from '../theme';

type Props = {
  selected?: number | null;
  onSelect: (coins: number) => void;
};

/** Three soft purple coin preset cards. */
export function PresetCoinCards({ selected, onSelect }: Props) {
  return (
    <View className="flex-row gap-2.5">
      {PRESET_AMOUNTS.map((coins) => {
        const isSelected = selected === coins;
        return (
          <Pressable
            key={coins}
            onPress={() => onSelect(coins)}
            className={`flex-1 items-center rounded-2xl border-2 bg-lavender px-2 py-3.5 ${
              isSelected ? 'border-pink' : 'border-transparent'
            }`}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              adjustsFontSizeToFit
              className="text-[15.5px] font-bold text-ink"
            >
              🪙 {coins.toLocaleString('en-US')}
            </Text>
            <Text allowFontScaling={false} className="mt-1 text-[11.5px] text-muted">
              ${usdForCoins(coins).toFixed(2)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
