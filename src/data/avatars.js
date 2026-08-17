// Avatar definitions for anonymous user identities using custom avatar artwork
import alooChill from '../assets/avatars/aloo-chill.webp';
import catBeanie from '../assets/avatars/cat-beanie.webp';
import catDj from '../assets/avatars/cat-dj.webp';
import catKing from '../assets/avatars/cat-king.webp';
import chilliFire from '../assets/avatars/chilli-fire.webp';
import duckSwagger from '../assets/avatars/duck-swagger.webp';
import ghostParty from '../assets/avatars/ghost-party.webp';
import goatThug from '../assets/avatars/goat-thug.webp';
import huskyCool from '../assets/avatars/husky-cool.webp';
import lionCrown from '../assets/avatars/lion-crown.webp';
import pandaBeats from '../assets/avatars/panda-beats.webp';
import pandaSleepy from '../assets/avatars/panda-sleepy.webp';
import rockGrumpy from '../assets/avatars/rock-grumpy.webp';
import skullBlunt from '../assets/avatars/skull-blunt.webp';

export const AVATARS = [
  { id: 'duck-swagger', legacyId: 'duck',    name: 'Swagger Duck',     image: duckSwagger, emoji: '🦆', bg: '#86EFAC', color: '#14532D' },
  { id: 'rock-grumpy',  legacyId: 'rock',    name: 'Grumpy Rock',      image: rockGrumpy,  emoji: '🪨', bg: '#CBD5E1', color: '#1E293B' },
  { id: 'aloo-chill',   legacyId: 'aloo',    name: 'Chill Aloo',       image: alooChill,   emoji: '🥔', bg: '#FDE68A', color: '#78350F' },
  { id: 'cat-dj',       legacyId: 'cat',     name: 'DJ Billa',         image: catDj,       emoji: '🐱', bg: '#F9A8D4', color: '#831843' },
  { id: 'cat-beanie',   legacyId: 'samosa',  name: 'Beanie Billi',     image: catBeanie,   emoji: '😼', bg: '#FCA5A5', color: '#7F1D1D' },
  { id: 'cat-king',     legacyId: 'baba',    name: 'King Cat',         image: catKing,     emoji: '👑', bg: '#C4B5FD', color: '#4C1D95' },
  { id: 'chilli-fire',  legacyId: 'monkey',  name: 'Teekhi Mirchi',    image: chilliFire,  emoji: '🌶️', bg: '#FDBA74', color: '#7C2D12' },
  { id: 'ghost-party',  legacyId: 'penguin', name: 'Party Bhoot',      image: ghostParty,  emoji: '👻', bg: '#BAE6FD', color: '#0C4A6E' },
  { id: 'goat-thug',    legacyId: 'goat',    name: 'Thug Bakri',       image: goatThug,    emoji: '🐐', bg: '#A7F3D0', color: '#064E3B' },
  { id: 'husky-cool',   legacyId: 'chai',    name: 'Cool Husky',       image: huskyCool,   emoji: '🐕', bg: '#D6B896', color: '#44250A' },
  { id: 'lion-crown',   legacyId: 'onion',   name: 'Sher Raja',        image: lionCrown,   emoji: '🦁', bg: '#E9D5FF', color: '#581C87' },
  { id: 'panda-beats',  legacyId: 'sock',    name: 'Beats Panda',      image: pandaBeats,  emoji: '🎧', bg: '#FEF08A', color: '#713F12' },
  { id: 'panda-sleepy', legacyId: null,      name: 'Sleepy Panda',     image: pandaSleepy, emoji: '🐼', bg: '#E2E8F0', color: '#334155' },
  { id: 'skull-blunt',  legacyId: null,      name: 'Blunt Khopdi',     image: skullBlunt,  emoji: '💀', bg: '#DDD6FE', color: '#5B21B6' },
];

export const getAvatarById = (id) =>
  AVATARS.find((a) => a.id === id || a.legacyId === id) || AVATARS[0];

export const getRandomAvatar = () =>
  AVATARS[Math.floor(Math.random() * AVATARS.length)];
