import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase.js';

const CONFESSIONS_COL = 'confessions';
const BANNED_COL = 'banned_users';

const CONFESSIONS_KEY = 'paap_confessions';
const BANNED_USERS_KEY = 'paap_banned_users';

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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('paap_data_updated'));
    }
  } catch {
    console.error('Failed to save in localStorage');
  }
};

/**
 * Real-time synchronization with Firestore in Admin.
 */
export const initAdminFirestoreSync = (callback) => {
  try {
    const q = query(collection(db, CONFESSIONS_COL), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data(), id: docSnap.id });
      });
      if (items.length > 0) {
        localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(items));
        if (callback) callback();
      }
    });

    onSnapshot(collection(db, BANNED_COL), (snapshot) => {
      const banned = [];
      snapshot.forEach((docSnap) => {
        banned.push({ ...docSnap.data(), docId: docSnap.id });
      });
      localStorage.setItem(BANNED_USERS_KEY, JSON.stringify(banned));
      if (callback) callback();
    });
  } catch (err) {
    console.warn('Admin Firestore sync listener error:', err);
  }
};

export const getAllConfessions = () => {
  return load(CONFESSIONS_KEY, []);
};

export const getReportedConfessions = () => {
  const all = getAllConfessions();
  return all
    .filter((c) => (c.reportsCount || 0) > 0)
    .sort((a, b) => (b.reportsCount || 0) - (a.reportsCount || 0));
};

export const getAllComments = () => {
  const all = getAllConfessions();
  const comments = [];
  all.forEach((c) => {
    (c.replies || []).forEach((r) => {
      comments.push({
        ...r,
        confessionId: c.id,
        confessionText: c.text,
        parentDisplayName: c.displayName,
      });
    });
  });
  return comments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const getBannedUsers = () => {
  return load(BANNED_USERS_KEY, []);
};

export const banUser = async ({ uid, ip, reason = 'Violated community guidelines & IT Act' }) => {
  const current = getBannedUsers();
  const filtered = current.filter((b) => !(b.uid === uid || (ip && b.ip === ip && ip !== '127.0.0.1')));
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

  try {
    const banId = `ban_${uid || ''}_${(ip || '').replace(/\./g, '_')}`;
    await setDoc(doc(db, BANNED_COL, banId), {
      uid: uid || 'unknown_uid',
      ip: ip || 'unknown_ip',
      reason,
      bannedAt: Date.now(),
    });
  } catch (e) {
    console.warn('Firestore ban sync failed:', e);
  }

  return updated;
};

export const unbanUser = async ({ uid, ip }) => {
  const current = getBannedUsers();
  const updated = current.filter((b) => {
    if (uid && b.uid === uid) return false;
    if (ip && b.ip === ip) return false;
    return true;
  });
  save(BANNED_USERS_KEY, updated);

  try {
    const snap = await getDocs(collection(db, BANNED_COL));
    snap.forEach(async (d) => {
      const data = d.data();
      if ((uid && data.uid === uid) || (ip && data.ip === ip)) {
        await deleteDoc(doc(db, BANNED_COL, d.id));
      }
    });
  } catch (e) {
    console.warn('Firestore unban sync failed:', e);
  }

  return updated;
};

export const deleteConfession = async (confessionId) => {
  const all = getAllConfessions();
  const updated = all.filter((c) => c.id !== confessionId);
  save(CONFESSIONS_KEY, updated);

  try {
    await deleteDoc(doc(db, CONFESSIONS_COL, confessionId));
  } catch (e) {
    console.warn('Firestore delete failed:', e);
  }

  return updated;
};

export const dismissReports = async (confessionId) => {
  const all = getAllConfessions();
  const updated = all.map((c) => {
    if (c.id !== confessionId) return c;
    return { ...c, reportsCount: 0, reportReasons: [] };
  });
  save(CONFESSIONS_KEY, updated);

  try {
    await setDoc(doc(db, CONFESSIONS_COL, confessionId), { reportsCount: 0, reportReasons: [] }, { merge: true });
  } catch (e) {
    console.warn('Firestore dismiss reports failed:', e);
  }

  return updated;
};

export const deleteComment = async ({ confessionId, commentId }) => {
  const all = getAllConfessions();
  let updatedReplies = [];
  const updated = all.map((c) => {
    if (c.id !== confessionId) return c;
    updatedReplies = (c.replies || []).filter((r) => r.id !== commentId);
    return {
      ...c,
      replies: updatedReplies,
    };
  });
  save(CONFESSIONS_KEY, updated);

  try {
    await setDoc(doc(db, CONFESSIONS_COL, confessionId), { replies: updatedReplies }, { merge: true });
  } catch (e) {
    console.warn('Firestore delete comment failed:', e);
  }

  return updated;
};
