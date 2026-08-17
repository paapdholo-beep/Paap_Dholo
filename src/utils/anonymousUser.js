import { AVATARS, getRandomAvatar } from '../data/avatars.js';

const USER_KEY = 'paap_user';

// Possible display names paired with avatar IDs
const IDENTITIES = [
  { avatarId: 'duck',    displayName: 'Guilty Duck' },
  { avatarId: 'rock',    displayName: 'Suspicious Rock' },
  { avatarId: 'aloo',    displayName: 'Confused Aloo' },
  { avatarId: 'samosa',  displayName: 'Sleepy Samosa' },
  { avatarId: 'baba',    displayName: 'Shady Baba' },
  { avatarId: 'monkey',  displayName: 'Chaotic Monkey' },
  { avatarId: 'cat',     displayName: 'Sneaky Cat' },
  { avatarId: 'penguin', displayName: 'Chill Penguin' },
  { avatarId: 'goat',    displayName: 'Dramabaaz Goat' },
  { avatarId: 'chai',    displayName: 'Overthinking Chai' },
  { avatarId: 'onion',   displayName: 'Crying Pyaaz' },
  { avatarId: 'sock',    displayName: 'Confused Sock' },
];

const generateUserId = () =>
  'user_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);

const pickRandomIdentity = () =>
  IDENTITIES[Math.floor(Math.random() * IDENTITIES.length)];

/**
 * Get or create the current user's anonymous identity.
 * Stored persistently in localStorage.
 */
export const getOrCreateUser = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const identity = pickRandomIdentity();
    const user = {
      id: generateUserId(),
      avatarId: identity.avatarId,
      displayName: identity.displayName,
      createdAt: Date.now(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    return {
      id: 'anon',
      avatarId: 'duck',
      displayName: 'Guilty Duck',
    };
  }
};

/**
 * Re-roll to a new random identity (different from current).
 */
export const rerollIdentity = () => {
  try {
    const current = localStorage.getItem(USER_KEY);
    const currentUser = current ? JSON.parse(current) : null;

    let identity = pickRandomIdentity();
    // Ensure we get a different identity
    let attempts = 0;
    while (identity.avatarId === currentUser?.avatarId && attempts < 10) {
      identity = pickRandomIdentity();
      attempts++;
    }

    const user = {
      id: currentUser?.id || generateUserId(),
      avatarId: identity.avatarId,
      displayName: identity.displayName,
      createdAt: currentUser?.createdAt || Date.now(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    return getOrCreateUser();
  }
};
