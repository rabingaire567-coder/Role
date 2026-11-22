import React, { type ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'pink' | 'green';
  disabled?: boolean;
  icon?: ReactNode;
};

/** Full-width solid CTA. */
export function PrimaryButton({
  label,
  onPress,
  variant = 'pink',
  disabled = false,
  icon,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`h-[54px] flex-row items-center justify-center rounded-full ${
        variant === 'green' ? 'bg-green' : 'bg-pink'
      } ${disabled ? 'opacity-40' : 'opacity-100'}`}
      style={({ pressed }) => ({
        transform: [{ scale: pressed && !disabled ? 0.985 : 1 }],
      })}
    >
      {icon ? <>{icon}</> : null}
      <Text className="text-[16px] font-bold text-white">{label}</Text>
    </Pressable>
  );
}
