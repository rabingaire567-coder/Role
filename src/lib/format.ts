import { COIN_USD_RATE, toCents } from '../theme';

/** 1234567 -> "1,234,567" */
const groupThousands = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** 12136 -> "$12,136.00" */
export function formatUsd(value: number): string {
  const safe = Number.isFinite(value) ? Math.max(value, 0) : 0;
  const [whole, decimal] = toCents(safe).toFixed(2).split('.');
  return `$${groupThousands(whole)}.${decimal}`;
}

/** 1000000 -> "1,000,000" */
export function formatCoins(value: number): string {
  const safe = Number.isFinite(value) ? Math.max(Math.floor(value), 0) : 0;
  return groupThousands(String(safe));
}

/** Coins -> USD, rounded to cents. */
export const usdForCoins = (coins: number) => toCents(Math.max(coins, 0) * COIN_USD_RATE);

/** 2026-09-05T09:53:12 -> "9/5/2026, 09:53:12" */
export function formatReceiptTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return (
    `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/** Digits-only string of an amount, used by the custom keypad. */
export const coinDigits = (coins: number) => (coins > 0 ? String(Math.floor(coins)) : '');
