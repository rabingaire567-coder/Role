import React, { type ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  edges?: readonly Edge[];
};

/** Soft lavender-to-blue gradient canvas shared by every screen. */
export function ScreenBackground({ children, edges = ['top', 'left', 'right'] }: Props) {
  return (
    <LinearGradient
      colors={['#F7F2FF', '#F4F7FF', '#F8F5FF']}
      locations={[0, 0.45, 1]}
      style={{ flex: 1 }}
    >
      <SafeAreaView edges={edges} style={{ flex: 1 }}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}
