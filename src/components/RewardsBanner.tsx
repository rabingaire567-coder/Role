import React from 'react';
import { Text, View } from 'react-native';

import { TikTokLogo } from './TikTokLogo';

/** Light blue rounded banner at the top of the exchange screens. */
export function RewardsBanner() {
  return (
    <View className="flex-row items-center rounded-2xl bg-banner px-3.5 py-3">
      <TikTokLogo size={17} boxSize={36} background="#FFFFFF" />
      <View className="ml-3 flex-1">
        <Text className="text-[13.5px] font-bold text-ink">TikTok LIVE Rewards</Text>
        <Text className="mt-0.5 text-[11.5px] text-muted">
          Successfully sent coins to recipient
        </Text>
      </View>
    </View>
  );
}
