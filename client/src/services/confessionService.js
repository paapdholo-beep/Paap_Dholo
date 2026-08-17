import { MOCK_CONFESSIONS } from '../data/mockConfessions.js';

import {
  createConfessionInFirestore,
  updateReactionsInFirestore,
  addReplyInFirestore,
  reportConfessionInFirestore,
  deleteConfessionInFirestore,
  banUserInFirestore,
  unbanUserInFirestore,
} from './firebaseService.js';

const CONFESSIONS_KEY = 'paap_confessions';
const REACTIONS_KEY   = 'paap_reactions';  // { confessionId_reactionType: true }
const MOCK_HASH_KEY   = 'paap_mock_hash_v3';
const BANNED_USERS_KEY = 'paap_banned_users';

// ─────────────────────────────────────────────
//  Internal helpers
// ─────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error('localStorage write failed');
  }
};

const notifyDataChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('paap_data_updated'));
  }
};

const getMockHash = () => {
  try {
    return JSON.stringify(
      MOCK_CONFESSIONS.map((c) => ({
        id: c.id,
        text: c.text,
        reactions: c.reactions,
        repliesCount: c.replies?.length,
      }))
    );
  } catch {
    return 'v3_' + Date.now().toString();
  }
};

/**
 * Seed mock data on first load, or automatically sync updated mock confessions
 * if mockConfessions.js has been modified, while preserving any user-posted confessions.
 */
export const seedIfEmpty = () => {
  const existing = localStorage.getItem(CONFESSIONS_KEY);
  const currentHash = getMockHash();
  const savedHash = localStorage.getItem(MOCK_HASH_KEY);

  if (!existing) {
    save(CONFESSIONS_KEY, MOCK_CONFESSIONS);
    localStorage.setItem(MOCK_HASH_KEY, currentHash);
    return;
  }

  // If mockConfessions.js content was changed/updated:
  if (savedHash !== currentHash) {
    const existingData = load(CONFESSIONS_KEY, []);
    const mockIds = new Set(MOCK_CONFESSIONS.map((c) => c.id));
    // Keep user-created confessions (any confession not in the mock list)
    const userConfessions = existingData.filter((c) => !mockIds.has(c.id));

    // Put user confessions at the top, followed by the latest mock confessions
    save(CONFESSIONS_KEY, [...userConfessions, ...MOCK_CONFESSIONS]);
    localStorage.setItem(MOCK_HASH_KEY, currentHash);
    notifyDataChanged();
  }
};

// ─────────────────────────────────────────────
//  Ban & Moderation System
// ─────────────────────────────────────────────

/**
 * Get all banned users.
 * @returns {Array<{ uid: string, ip: string, reason: string, bannedAt: number }>}
 */
export const getBannedUsers = () => {
  return load(BANNED_USERS_KEY, []);
};

/**
 * Check if a user is currently banned by UID or IP.
 */
export const isUserBanned = ({ uid, ip } = {}) => {
  const bannedList = getBannedUsers();
  return bannedList.some(
    (b) => (uid && b.uid === uid) || (ip && b.ip === ip && b.ip !== '127.0.0.1')
  );
};

/**
 * Ban a user by UID and IP.
 */
export const banUser = ({ uid, ip, reason = 'Violated community guidelines & IT Act rules' }) => {
  const list = getBannedUsers();
  const filtered = list.filter((b) => !(b.uid === uid || (ip && b.ip === ip && ip !== '127.0.0.1')));
  const updated = [
    {
      uid: uid || 'unknown_uid',
      ip: ip || 'unknown_ip',
      reason,
      bannedAt: Date.now(),
    },
    ...filtered,
  ];
  save(BANNED_USERS_KEY, updated);
  banUserInFirestore({ uid, ip, reason });
  notifyDataChanged();
  return updated;
};

/**
 * Unban a user by UID or IP.
 */
export const unbanUser = ({ uid, ip }) => {
  const list = getBannedUsers();
  const updated = list.filter((b) => {
    if (uid && b.uid === uid) return false;
    if (ip && b.ip === ip) return false;
    return true;
  });
  save(BANNED_USERS_KEY, updated);
  unbanUserInFirestore({ uid, ip });
  notifyDataChanged();
  return updated;
};

// ─────────────────────────────────────────────
//  Public API
// ─────────────────────────────────────────────

/**
 * Get all confessions with optional sorting and severity filtering.
 * Auto-hides confessions with 3+ reports from public feed unless includeReported is true.
 * @param {{ sort?: string, severityFilter?: string, includeReported?: boolean }} options
 */
export const getConfessions = ({ sort = 'latest', severityFilter = 'all', includeReported = false } = {}) => {
  let data = load(CONFESSIONS_KEY, []);

  // Auto-hide heavily reported confessions from regular public feed
  if (!includeReported) {
    data = data.filter((c) => (c.reportsCount || 0) < 3);
  }

  if (severityFilter !== 'all') {
    data = data.filter((c) => c.severity === severityFilter);
  }

  if (sort === 'latest') {
    data = [...data].sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === 'most-judged') {
    data = [...data].sort(
      (a, b) =>
        Object.values(b.reactions).reduce((s, v) => s + v, 0) -
        Object.values(a.reactions).reduce((s, v) => s + v, 0)
    );
  } else if (sort === 'most-forgiven') {
    data = [...data].sort((a, b) => b.reactions.forgive - a.reactions.forgive);
  } else if (sort === 'most-reported') {
    data = [...data].sort((a, b) => (b.reportsCount || 0) - (a.reportsCount || 0));
  }

  return data;
};

/**
 * Get a single confession by ID.
 */
export const getConfessionById = (id) => {
  const data = load(CONFESSIONS_KEY, []);
  return data.find((c) => c.id === id) || null;
};

/**
 * Create a new confession and prepend it to storage.
 * Attaches authorUid and authorIp for moderation auditing.
 * @param {{ text: string, severity: string, avatarId: string, displayName: string, authorUid?: string, authorIp?: string }} payload
 */
export const createConfession = ({ text, severity, avatarId, displayName, authorUid, authorIp }) => {
  if (isUserBanned({ uid: authorUid, ip: authorIp })) {
    throw new Error('Aapka account community guidelines violate karne par ban kar diya gaya hai.');
  }

  const data = load(CONFESSIONS_KEY, []);
  const newId = 'paap-' + Date.now().toString();
  const confession = {
    id: newId,
    text: text.trim(),
    avatarId,
    displayName,
    severity,
    authorUid: authorUid || 'anon_uid',
    authorIp: authorIp || '127.0.0.1',
    createdAt: Date.now(),
    reactions: { forgive: 0, funny: 0, shame: 0, interesting: 0, dead: 0 },
    replies: [],
    reportsCount: 0,
    reportReasons: [],
  };
  save(CONFESSIONS_KEY, [confession, ...data]);
  createConfessionInFirestore(confession);
  notifyDataChanged();
  return confession;
};

/**
 * Report a confession for legal/community violation.
 */
export const reportConfession = ({ confessionId, reason, reporterUid, reporterIp }) => {
  const data = load(CONFESSIONS_KEY, []);
  let targetCount = 0;
  let targetReasons = [];

  const updated = data.map((c) => {
    if (c.id !== confessionId) return c;
    const existingReasons = c.reportReasons || [];
    targetCount = (c.reportsCount || 0) + 1;
    targetReasons = [...existingReasons, { reason, reporterUid, reporterIp, reportedAt: Date.now() }];
    return {
      ...c,
      reportsCount: targetCount,
      reportReasons: targetReasons,
    };
  });
  save(CONFESSIONS_KEY, updated);
  reportConfessionInFirestore(confessionId, targetCount, targetReasons);
  notifyDataChanged();
  return true;
};

/**
 * Dismiss reports for a confession (Admin action).
 */
export const dismissReports = (confessionId) => {
  const data = load(CONFESSIONS_KEY, []);
  const updated = data.map((c) => {
    if (c.id !== confessionId) return c;
    return { ...c, reportsCount: 0, reportReasons: [] };
  });
  save(CONFESSIONS_KEY, updated);
  reportConfessionInFirestore(confessionId, 0, []);
  notifyDataChanged();
};

/**
 * Delete a confession permanently (Admin action).
 */
export const deleteConfession = (confessionId) => {
  const data = load(CONFESSIONS_KEY, []);
  const updated = data.filter((c) => c.id !== confessionId);
  save(CONFESSIONS_KEY, updated);
  deleteConfessionInFirestore(confessionId);
  notifyDataChanged();
};

/**
 * Add an anonymous reply to a confession.
 * Attaches authorUid and authorIp for moderation regulation.
 */
export const addReply = ({ confessionId, text, avatarId, displayName, authorUid, authorIp }) => {
  if (isUserBanned({ uid: authorUid, ip: authorIp })) {
    throw new Error('Aapka account comment karne se ban kar diya gaya hai.');
  }

  const data = load(CONFESSIONS_KEY, []);
  let updatedReplies = [];
  const reply = {
    id: 'r_' + Date.now(),
    avatarId,
    displayName,
    authorUid: authorUid || 'anon_uid',
    authorIp: authorIp || '127.0.0.1',
    text: text.trim(),
    createdAt: Date.now(),
    reportsCount: 0,
  };
  const updated = data.map((c) => {
    if (c.id !== confessionId) return c;
    updatedReplies = [...(c.replies || []), reply];
    return { ...c, replies: updatedReplies };
  });
  save(CONFESSIONS_KEY, updated);
  addReplyInFirestore(confessionId, updatedReplies);
  notifyDataChanged();
  return reply;
};

/**
 * Delete a reply (Admin action).
 */
export const deleteReply = ({ confessionId, replyId }) => {
  const data = load(CONFESSIONS_KEY, []);
  let updatedReplies = [];
  const updated = data.map((c) => {
    if (c.id !== confessionId) return c;
    updatedReplies = (c.replies || []).filter((r) => r.id !== replyId);
    return {
      ...c,
      replies: updatedReplies,
    };
  });
  save(CONFESSIONS_KEY, updated);
  addReplyInFirestore(confessionId, updatedReplies);
  notifyDataChanged();
};

/**
 * Add a reaction. Prevents the same browser from reacting more than once per type per confession.
 */
export const addReaction = ({ confessionId, reactionType, userId }) => {
  const reactionLockKey = `${REACTIONS_KEY}_${confessionId}_${reactionType}_${userId}`;
  if (localStorage.getItem(reactionLockKey)) {
    // Already reacted — toggle off (remove reaction)
    const data = load(CONFESSIONS_KEY, []);
    let newReactions = {};
    const updated = data.map((c) => {
      if (c.id !== confessionId) return c;
      newReactions = {
        ...c.reactions,
        [reactionType]: Math.max(0, (c.reactions[reactionType] || 0) - 1),
      };
      return {
        ...c,
        reactions: newReactions,
      };
    });
    save(CONFESSIONS_KEY, updated);
    localStorage.removeItem(reactionLockKey);
    updateReactionsInFirestore(confessionId, newReactions);
    notifyDataChanged();
    const confession = updated.find((c) => c.id === confessionId);
    return { updated: false, reactions: confession?.reactions };
  }

  const data = load(CONFESSIONS_KEY, []);
  let newReactions = {};
  const updated = data.map((c) => {
    if (c.id !== confessionId) return c;
    newReactions = {
      ...c.reactions,
      [reactionType]: (c.reactions[reactionType] || 0) + 1,
    };
    return {
      ...c,
      reactions: newReactions,
    };
  });
  save(CONFESSIONS_KEY, updated);
  localStorage.setItem(reactionLockKey, '1');
  updateReactionsInFirestore(confessionId, newReactions);
  notifyDataChanged();
  const confession = updated.find((c) => c.id === confessionId);
  return { updated: true, reactions: confession?.reactions };
};

/**
 * Check which reactions the user has already made on a confession.
 */
export const getUserReactions = ({ confessionId, userId }) => {
  const reactionTypes = ['forgive', 'funny', 'shame', 'interesting', 'dead'];
  const result = {};
  reactionTypes.forEach((type) => {
    const key = `${REACTIONS_KEY}_${confessionId}_${type}_${userId}`;
    result[type] = !!localStorage.getItem(key);
  });
  return result;
};

/**
 * Get top 3 most judged confessions for Karma Court.
 */
export const getKarmaCourtTop = () => {
  const data = load(CONFESSIONS_KEY, []);
  return [...data]
    .filter((c) => (c.reportsCount || 0) < 3)
    .sort(
      (a, b) =>
        Object.values(b.reactions).reduce((s, v) => s + v, 0) -
        Object.values(a.reactions).reduce((s, v) => s + v, 0)
    )
    .slice(0, 3);
};

/**
 * Get top 3 most forgiven confessions for Paap Dhulai leaderboard.
 */
export const getPaapDhulaiLeaderboard = () => {
  const data = load(CONFESSIONS_KEY, []);
  return [...data]
    .filter((c) => (c.reportsCount || 0) < 3)
    .sort((a, b) => b.reactions.forgive - a.reactions.forgive)
    .slice(0, 3);
};

/**
 * Get accurate dynamic aggregate stats computed from actual confession data.
 */
export const getStats = () => {
  const data = load(CONFESSIONS_KEY, []);

  // Exact number of confessions currently present
  const totalConfessions = data.length;

  // Actual count of all reactions & comments across all confessions
  const reactionCount = data.reduce(
    (s, c) => s + Object.values(c.reactions || {}).reduce((rs, v) => rs + v, 0),
    0
  );
  const repliesCount = data.reduce((s, c) => s + (c.replies?.length || 0), 0);
  const totalJudgements = reactionCount + repliesCount;

  // Actual 'Maaf Kiya' (🙏) count
  const totalForgiven = data.reduce((s, c) => s + (c.reactions?.forgive || 0), 0);

  return { totalConfessions, totalJudgements, totalForgiven };
};
