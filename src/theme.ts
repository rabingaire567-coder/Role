/**
 * Shared design tokens + mock data for the Coin Exchange flow.
 */

/** 1 Coin = $0.012136  ->  1,000,000 Coins = $12,136.00 */
export const COIN_USD_RATE = 0.012136;

export const INITIAL_BALANCE = 999591987.68;
export const INITIAL_COINS = 82365852643;
export const DEFAULT_USERNAME = '@Anshu';
export const DEFAULT_EXCHANGE_AMOUNT = 1_000_000;

/** Preset coin amounts shown on the exchange screens. */
export const PRESET_AMOUNTS = [250, 500, 15_000] as const;

export const colors = {
  canvas: '#F8F5FF',
  ink: '#161823',
  muted: '#8A8B91',
  pink: '#FE2C55',
  green: '#00C853',
  lavender: '#F2EDFF',
  banner: '#E7F1FF',
  hairline: '#EFEAF7',
  field: '#F3F0F8',
} as const;

/** Round a USD value to whole cents. */
export const toCents = (value: number) => Math.round(value * 100) / 100;
