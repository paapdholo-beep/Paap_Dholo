// Avatar definitions for anonymous user identities
// Each avatar has a unique ID, display name, emoji, and background color

export const AVATARS = [
  { id: 'duck',    name: 'Guilty Duck',         emoji: '🦆', bg: '#86EFAC', color: '#14532D' },
  { id: 'rock',    name: 'Suspicious Rock',      emoji: '🪨', bg: '#CBD5E1', color: '#1E293B' },
  { id: 'aloo',    name: 'Confused Aloo',        emoji: '🥔', bg: '#FDE68A', color: '#78350F' },
  { id: 'samosa',  name: 'Sleepy Samosa',        emoji: '🥟', bg: '#FCA5A5', color: '#7F1D1D' },
  { id: 'baba',    name: 'Shady Baba',           emoji: '🧙', bg: '#C4B5FD', color: '#4C1D95' },
  { id: 'monkey',  name: 'Chaotic Monkey',       emoji: '🐒', bg: '#FDBA74', color: '#7C2D12' },
  { id: 'cat',     name: 'Sneaky Cat',           emoji: '🐱', bg: '#F9A8D4', color: '#831843' },
  { id: 'penguin', name: 'Chill Penguin',        emoji: '🐧', bg: '#BAE6FD', color: '#0C4A6E' },
  { id: 'goat',    name: 'Dramabaaz Goat',       emoji: '🐐', bg: '#A7F3D0', color: '#064E3B' },
  { id: 'chai',    name: 'Overthinking Chai',    emoji: '☕', bg: '#D6B896', color: '#44250A' },
  { id: 'onion',   name: 'Crying Pyaaz',         emoji: '🧅', bg: '#E9D5FF', color: '#581C87' },
  { id: 'sock',    name: 'Confused Sock',        emoji: '🧦', bg: '#FEF08A', color: '#713F12' },
];

export const getAvatarById = (id) =>
  AVATARS.find((a) => a.id === id) || AVATARS[0];

export const getRandomAvatar = () =>
  AVATARS[Math.floor(Math.random() * AVATARS.length)];
