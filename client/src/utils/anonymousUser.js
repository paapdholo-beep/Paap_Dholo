import { AVATARS, getRandomAvatar } from '../data/avatars.js';

const USER_KEY = 'paap_user';
const IP_KEY = 'paap_user_ip';

// Possible display names paired with avatar IDs derived from AVATARS
const IDENTITIES = AVATARS.map((a) => ({
  avatarId: a.id,
  displayName: a.name,
}));

const generateUserId = () =>
  'uid_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now().toString(36);

const pickRandomIdentity = () =>
  IDENTITIES[Math.floor(Math.random() * IDENTITIES.length)];

/**
 * Fetch and cache user's public IP address.
 */
export const getUserIp = async () => {
  try {
    const cached = localStorage.getItem(IP_KEY);
    if (cached) return cached;

    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.ip) {
        localStorage.setItem(IP_KEY, data.ip);
        return data.ip;
      }
    }
  } catch {
    // Fallback if offline or network blocked
  }
  const fallbackIp = localStorage.getItem(IP_KEY) || '127.0.0.1';
  return fallbackIp;
};

/**
 * Get or create the current user's anonymous identity.
 * Stored persistently in localStorage.
 */
export const getOrCreateUser = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure uid exists
      if (!parsed.uid) {
        parsed.uid = parsed.id || generateUserId();
        localStorage.setItem(USER_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
    const identity = pickRandomIdentity();
    const uid = generateUserId();
    const user = {
      id: uid,
      uid,
      avatarId: identity.avatarId,
      displayName: identity.displayName,
      createdAt: Date.now(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    return {
      id: 'uid_anon',
      uid: 'uid_anon',
      avatarId: AVATARS[0].id,
      displayName: AVATARS[0].name,
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

    const uid = currentUser?.uid || currentUser?.id || generateUserId();
    const user = {
      id: uid,
      uid,
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
