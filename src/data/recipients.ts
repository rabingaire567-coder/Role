export type Recipient = {
  handle: string;
  name: string;
  followers: number;
};

/**
 * Mock recipient directory. The flow validates a handle against this list and
 * falls back to a deterministic profile for any other well-formed handle so the
 * demo never dead-ends.
 */
const directory: Recipient[] = [
  { handle: '@Anshu', name: 'Anshu', followers: 60 },
  { handle: '@tiktok', name: 'TikTok', followers: 92_400_000 },
  { handle: '@live.rewards', name: 'LIVE Rewards', followers: 14_820 },
];

/** "@@Anshu " -> "@Anshu", "anshu" -> "@Anshu" */
export function normalizeHandle(input: string): string {
  const cleaned = input.trim().replace(/\s+/g, '').replace(/^@+/, '');
  return cleaned ? `@${cleaned}` : '';
}

const HANDLE_PATTERN = /^@[a-zA-Z0-9._]{2,24}$/;

export const isValidHandle = (input: string) => HANDLE_PATTERN.test(normalizeHandle(input));

/** Resolve a typed username into a profile, or null when it is not valid. */
export function resolveRecipient(input: string): Recipient | null {
  const handle = normalizeHandle(input);
  if (!HANDLE_PATTERN.test(handle)) return null;

  const known = directory.find((item) => item.handle.toLowerCase() === handle.toLowerCase());
  if (known) return known;

  const seed = [...handle].reduce((total, char) => total + char.charCodeAt(0), 0);
  const name = handle
    .slice(1)
    .replace(/[._]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return { handle, name, followers: 12 + (seed % 4800) };
}
