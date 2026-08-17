import { MOCK_CONFESSIONS } from '../data/mockConfessions.js';

const CONFESSIONS_KEY = 'paap_confessions';
const REACTIONS_KEY   = 'paap_reactions';  // { confessionId_reactionType: true }

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

/**
 * Seed mock data once on first load.
 * Will NOT duplicate if already seeded.
 */
export const seedIfEmpty = () => {
  const existing = localStorage.getItem(CONFESSIONS_KEY);
  if (!existing) {
    save(CONFESSIONS_KEY, MOCK_CONFESSIONS);
  }
};

// ─────────────────────────────────────────────
//  Public API  (mirrors what Firebase would expose)
// ─────────────────────────────────────────────

/**
 * Get all confessions.
 * @param {{ sort?: string, severityFilter?: string }} options
 */
export const getConfessions = ({ sort = 'latest', severityFilter = 'all' } = {}) => {
  let data = load(CONFESSIONS_KEY, []);

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
 * @param {{ text: string, severity: string, avatarId: string, displayName: string }} payload
 */
export const createConfession = ({ text, severity, avatarId, displayName }) => {
  const data = load(CONFESSIONS_KEY, []);
  const newId = 'paap-' + (48292 + data.length).toString();
  const confession = {
    id: newId,
    text: text.trim(),
    avatarId,
    displayName,
    severity,
    createdAt: Date.now(),
    reactions: { forgive: 0, funny: 0, shame: 0, interesting: 0, dead: 0 },
    replies: [],
  };
  save(CONFESSIONS_KEY, [confession, ...data]);
  notifyDataChanged();
  return confession;
};

/**
 * Add a reaction. Prevents the same browser from reacting more than once per type per confession.
 * @returns {{ updated: boolean, reactions: object }}
 */
export const addReaction = ({ confessionId, reactionType, userId }) => {
  const reactionLockKey = `${REACTIONS_KEY}_${confessionId}_${reactionType}_${userId}`;
  if (localStorage.getItem(reactionLockKey)) {
    // Already reacted — toggle off (remove reaction)
    const data = load(CONFESSIONS_KEY, []);
    const updated = data.map((c) => {
      if (c.id !== confessionId) return c;
      return {
        ...c,
        reactions: {
          ...c.reactions,
          [reactionType]: Math.max(0, (c.reactions[reactionType] || 0) - 1),
        },
      };
    });
    save(CONFESSIONS_KEY, updated);
    localStorage.removeItem(reactionLockKey);
    notifyDataChanged();
    const confession = updated.find((c) => c.id === confessionId);
    return { updated: false, reactions: confession?.reactions };
  }

  const data = load(CONFESSIONS_KEY, []);
  const updated = data.map((c) => {
    if (c.id !== confessionId) return c;
    return {
      ...c,
      reactions: {
        ...c.reactions,
        [reactionType]: (c.reactions[reactionType] || 0) + 1,
      },
    };
  });
  save(CONFESSIONS_KEY, updated);
  localStorage.setItem(reactionLockKey, '1');
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
 * Add an anonymous reply to a confession.
 */
export const addReply = ({ confessionId, text, avatarId, displayName }) => {
  const data = load(CONFESSIONS_KEY, []);
  const reply = {
    id: 'r_' + Date.now(),
    avatarId,
    displayName,
    text: text.trim(),
    createdAt: Date.now(),
  };
  const updated = data.map((c) => {
    if (c.id !== confessionId) return c;
    return { ...c, replies: [...(c.replies || []), reply] };
  });
  save(CONFESSIONS_KEY, updated);
  notifyDataChanged();
  return reply;
};

/**
 * Get top 3 most judged confessions for Karma Court.
 */
export const getKarmaCourtTop = () => {
  const data = load(CONFESSIONS_KEY, []);
  return [...data]
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
    .sort((a, b) => b.reactions.forgive - a.reactions.forgive)
    .slice(0, 3);
};

/**
 * Get dynamic aggregate stats.
 * Base dynamic targets:
 * - Total Confessions: 48,292
 * - Total Judgements: 1,47,941
 * - Total Forgiven: 20,793
 */
export const getStats = () => {
  const data = load(CONFESSIONS_KEY, []);
  
  // Confessions count: base of 48,292 for the initial 14 mock items
  const baseConfessions = 48292 - 14;
  const totalConfessions = Math.max(48292, baseConfessions + data.length);

  // Judgements count: sum of all reactions & comments
  const reactionCount = data.reduce(
    (s, c) => s + Object.values(c.reactions || {}).reduce((rs, v) => rs + v, 0),
    0
  );
  const repliesCount = data.reduce((s, c) => s + (c.replies?.length || 0), 0);
  const baseJudgements = 147941 - (58225 + 11);
  const totalJudgements = Math.max(147941, baseJudgements + reactionCount + repliesCount);

  // Forgiven count: sum of all forgive (🙏) reactions
  const forgiveCount = data.reduce((s, c) => s + (c.reactions?.forgive || 0), 0);
  const baseForgiven = 20793 - 8784;
  const totalForgiven = Math.max(20793, baseForgiven + forgiveCount);

  return { totalConfessions, totalJudgements, totalForgiven };
};
