import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { resolveRecipient, type Recipient } from '../data/recipients';
import { usdForCoins } from '../lib/format';
import {
  DEFAULT_EXCHANGE_AMOUNT,
  DEFAULT_USERNAME,
  INITIAL_BALANCE,
  INITIAL_COINS,
  toCents,
} from '../theme';

export type ExchangeReceipt = {
  id: string;
  recipient: Recipient;
  coins: number;
  usd: number;
  createdAt: Date;
};

type ExchangeContextValue = {
  balance: number;
  totalCoins: number;
  username: string;
  setUsername: (value: string) => void;
  recipient: Recipient | null;
  exchangeAmount: number;
  exchangeUsd: number;
  hasChosenAmount: boolean;
  setAmount: (coins: number, markAsChosen?: boolean) => void;
  receipt: ExchangeReceipt | null;
  isConfirmOpen: boolean;
  openConfirm: () => void;
  closeConfirm: () => void;
  submitExchange: () => ExchangeReceipt | null;
};

const ExchangeContext = createContext<ExchangeContextValue | null>(null);

export function ExchangeProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [totalCoins, setTotalCoins] = useState(INITIAL_COINS);
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [exchangeAmount, setExchangeAmount] = useState(DEFAULT_EXCHANGE_AMOUNT);
  const [hasChosenAmount, setHasChosenAmount] = useState(false);
  const [receipt, setReceipt] = useState<ExchangeReceipt | null>(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const recipient = useMemo(() => resolveRecipient(username), [username]);
  const exchangeUsd = useMemo(() => usdForCoins(exchangeAmount), [exchangeAmount]);

  const setAmount = useCallback(
    (nextCoins: number, markAsChosen = true) => {
      const safe = Number.isFinite(nextCoins) ? Math.floor(nextCoins) : 0;
      const clamped = Math.min(Math.max(safe, 0), totalCoins);
      setExchangeAmount(clamped);
      if (markAsChosen) setHasChosenAmount(clamped > 0);
    },
    [totalCoins],
  );

  const openConfirm = useCallback(() => {
    if (!recipient || exchangeAmount <= 0) return;
    setConfirmOpen(true);
  }, [exchangeAmount, recipient]);

  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  const submitExchange = useCallback((): ExchangeReceipt | null => {
    if (!recipient || exchangeAmount <= 0 || exchangeAmount > totalCoins) {
      setConfirmOpen(false);
      return null;
    }

    const usd = usdForCoins(exchangeAmount);
    const entry: ExchangeReceipt = {
      id: `${Date.now()}`,
      recipient,
      coins: exchangeAmount,
      usd,
      createdAt: new Date(),
    };

    setBalance((previous) => toCents(Math.max(previous - usd, 0)));
    setTotalCoins((previous) => Math.max(previous - exchangeAmount, 0));
    setReceipt(entry);
    setConfirmOpen(false);
    setExchangeAmount(DEFAULT_EXCHANGE_AMOUNT);
    setHasChosenAmount(false);

    return entry;
  }, [exchangeAmount, recipient, totalCoins]);

  const value = useMemo<ExchangeContextValue>(
    () => ({
      balance,
      totalCoins,
      username,
      setUsername,
      recipient,
      exchangeAmount,
      exchangeUsd,
      hasChosenAmount,
      setAmount,
      receipt,
      isConfirmOpen,
      openConfirm,
      closeConfirm,
      submitExchange,
    }),
    [
      balance,
      totalCoins,
      username,
      recipient,
      exchangeAmount,
      exchangeUsd,
      hasChosenAmount,
      setAmount,
      receipt,
      isConfirmOpen,
      openConfirm,
      closeConfirm,
      submitExchange,
    ],
  );

  return <ExchangeContext.Provider value={value}>{children}</ExchangeContext.Provider>;
}

export function useExchange() {
  const context = useContext(ExchangeContext);
  if (!context) throw new Error('useExchange must be used inside an ExchangeProvider');
  return context;
}
