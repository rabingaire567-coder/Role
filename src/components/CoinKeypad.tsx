import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '000' | 'backspace';

type Props = {
  onPress: (key: KeypadKey) => void;
};

const ROWS: (KeypadKey | null)[][] = [
  ['1', '2', '3', 'backspace'],
  ['4', '5', '6', '000'],
  ['7', '8', '9', null],
  [null, '0', null, null],
];

/** 4-column custom coin keypad. */
export function CoinKeypad({ onPress }: Props) {
  return (
    <View className="gap-2">
      {ROWS.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} className="flex-row gap-2">
          {row.map((key, columnIndex) =>
            key === null ? (
              <View key={`spacer-${rowIndex}-${columnIndex}`} className="flex-1" />
            ) : (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={key === 'backspace' ? 'Delete last digit' : key}
                onPress={() => onPress(key)}
                className="h-[52px] flex-1 items-center justify-center rounded-[16px] bg-lavender"
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#E5DBFF' : '#F2EDFF',
                })}
              >
                {key === 'backspace' ? (
                  <Ionicons name="backspace-outline" size={22} color="#161823" />
                ) : (
                  <Text className="text-[21px] font-semibold text-ink">{key}</Text>
                )}
              </Pressable>
            ),
          )}
        </View>
      ))}
    </View>
  );
}
