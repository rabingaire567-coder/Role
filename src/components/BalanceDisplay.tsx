import React from 'react';
import { Text, View } from 'react-native';

import { formatCoins, formatUsd } from '../lib/format';

type Props = {
  usd: number;
  coins: number;
  compact?: boolean;
};

/** Huge spendable balance plus the coins it represents. */
export function BalanceDisplay({ usd, coins, compact = false }: Props) {
  return (
    <View className="items-center">
      <Text
        allowFontScaling={false}
        numberOfLines={1}
        adjustsFontSizeToFit
        className={
          compact
            ? 'text-[30px] font-extrabold tracking-[-0.8px] text-ink'
            : 'text-[38px] font-extrabold tracking-[-1.2px] text-ink'
        }
      >
        {formatUsd(usd)}
      </Text>
      <Text
        allowFontScaling={false}
        numberOfLines={1}
        className={compact ? 'mt-1 text-[12px] text-muted' : 'mt-2 text-[12.5px] text-muted'}
      >
        = {formatUsd(usd)} (🪙 {formatCoins(coins)})
      </Text>
    </View>
  );
}
