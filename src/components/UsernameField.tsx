import React, { useState } from 'react';
import { Text, TextInput, View, type TextInput as TextInputType } from 'react-native';

import type { Recipient } from '../data/recipients';
import { formatCoins } from '../lib/format';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: () => void;
  error?: string | null;
  recipient?: Recipient | null;
  inputRef?: React.RefObject<TextInputType | null>;
};

/** TikTok username field with focus, validation and resolved-recipient states. */
export function UsernameField({
  value,
  onChangeText,
  onSubmit,
  error,
  recipient,
  inputRef,
}: Props) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? 'border-pink/70'
    : focused
      ? 'border-pink'
      : 'border-[#E9E3F4]';

  return (
    <View>
      <Text className="mb-2 text-[12.5px] font-bold text-muted">TikTok username</Text>

      <View
        className={`flex-row items-center rounded-2xl border-2 bg-white px-4 ${borderClass}`}
      >
        <Text className="mr-1 text-[15px] font-semibold text-muted">@</Text>
        <TextInput
          ref={inputRef}
          value={value.replace(/^@/, '')}
          onChangeText={(next) => onChangeText(`@${next}`)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmit}
          placeholder="your TikTok handle"
          placeholderTextColor="#B7B3C2"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          selectionColor="#FE2C55"
          className="flex-1 py-3.5 text-[15px] font-semibold text-ink"
        />
      </View>

      {error ? (
        <Text className="mt-2 text-[11.5px] font-medium text-pink">{error}</Text>
      ) : recipient ? (
        <View className="mt-2 flex-row items-center">
          <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green" />
          <Text className="text-[11.5px] text-muted">
            {recipient.name} · {formatCoins(recipient.followers)} followers
          </Text>
        </View>
      ) : null}
    </View>
  );
}
