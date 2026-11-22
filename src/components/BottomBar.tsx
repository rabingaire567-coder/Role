import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Fixed bottom action area that respects the home indicator. */
export function BottomBar({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-hairline bg-canvas px-5 pt-3"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      {children}
    </View>
  );
}
