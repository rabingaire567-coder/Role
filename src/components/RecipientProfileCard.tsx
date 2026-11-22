import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { Recipient } from '../data/recipients';
import { formatCoins } from '../lib/format';

/** Validated recipient card: name, handle and follower count. */
export function RecipientProfileCard({ recipient }: { recipient: Recipient }) {
  return (
    <View
      className="flex-row items-center rounded-3xl border border-white bg-white px-4 py-4"
      style={{
        shadowColor: '#4B3A7A',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
      }}
    >
      <View className="flex-1">
        <Text className="text-[16px] font-bold text-ink">{recipient.name}</Text>
        <Text className="mt-0.5 text-[13px] text-muted">{recipient.handle}</Text>
      </View>

      <View className="ml-3 flex-row items-center">
        <Ionicons name="people-outline" size={15} color="#8A8B91" />
        <Text className="ml-1 text-[12.5px] text-muted">
          {formatCoins(recipient.followers)} followers
        </Text>
      </View>
    </View>
  );
}
