import React from 'react';
import { View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

type Props = {
  size?: number;
  boxSize?: number;
  color?: string;
  background?: string;
};

/** TikTok note logo inside a soft rounded tile. */
export function TikTokLogo({
  size = 18,
  boxSize = 38,
  color = '#161823',
  background = '#FFFFFF',
}: Props) {
  return (
    <View
      style={{
        width: boxSize,
        height: boxSize,
        borderRadius: boxSize / 2,
        backgroundColor: background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesome6 name="tiktok" size={size} color={color} />
    </View>
  );
}
