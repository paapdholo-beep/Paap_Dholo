import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase.js';
import { MOCK_CONFESSIONS } from '../data/mockConfessions.js';

const CONFESSIONS_COL = 'confessions';
const BANNED_COL = 'banned_users';

const CONFESSIONS_KEY = 'paap_confessions';
const BANNED_USERS_KEY = 'paap_banned_users';

const notifyDataChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('paap_data_updated'));
  }
};

/**
 * Initialize real-time listeners on Cloud Firestore.
 * Automatically seeds Firestore with mock confessions if collection is empty.
 */
export const initFirestoreSync = () => {
  try {
    const confessionsRef = collection(db, CONFESSIONS_COL);
    const q = query(confessionsRef, orderBy('createdAt', 'desc'));

    // Real-time listener for confessions collection
    onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial mock confessions into Firestore
        console.log('Seeding initial mock confessions into Cloud Firestore...');
        for (const c of MOCK_CONFESSIONS) {
          try {
            await setDoc(doc(db, CONFESSIONS_COL, c.id), {
              ...c,
              authorUid: c.authorUid || 'mock_author',
              authorIp: c.authorIp || '127.0.0.1',
              reportsCount: c.reportsCount || 0,
              reportReasons: c.reportReasons || [],
            });
          } catch (e) {
            console.error('Error seeding doc:', e);
          }
        }
      } else {
        const remoteConfessions = [];
        snapshot.forEach((docSnap) => {
          remoteConfessions.push({ ...docSnap.data(), id: docSnap.id });
        });
        localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(remoteConfessions));
        notifyDataChanged();
      }
    }, (err) => {
      console.warn('Firestore confessions sync error, operating with local cache:', err);
    });

    // Real-time listener for banned_users collection
    const bannedRef = collection(db, BANNED_COL);
    onSnapshot(bannedRef, (snapshot) => {
      const bannedList = [];
      snapshot.forEach((docSnap) => {
        bannedList.push({ ...docSnap.data(), docId: docSnap.id });
      });
      localStorage.setItem(BANNED_USERS_KEY, JSON.stringify(bannedList));
      notifyDataChanged();
    }, (err) => {
      console.warn('Firestore banned_users sync error:', err);
    });
  } catch (err) {
    console.error('Failed to initialize Firestore sync:', err);
  }
};

/**
 * Create a new confession in Firestore.
 */
export const createConfessionInFirestore = async ({
  text,
  severity,
  avatarId,
  displayName,
  authorUid,
  authorIp,
}) => {
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

  try {
    await setDoc(doc(db, CONFESSIONS_COL, newId), confession);
  } catch (e) {
    console.warn('Firestore write failed, saving locally:', e);
  }
  return confession;
};

/**
 * Add reaction in Firestore.
 */
export const updateReactionsInFirestore = async (confessionId, newReactions) => {
  try {
    await setDoc(doc(db, CONFESSIONS_COL, confessionId), { reactions: newReactions }, { merge: true });
  } catch (e) {
    console.warn('Firestore reaction update failed:', e);
  }
};

/**
 * Add reply in Firestore.
 */
export const addReplyInFirestore = async (confessionId, replies) => {
  try {
    await setDoc(doc(db, CONFESSIONS_COL, confessionId), { replies }, { merge: true });
  } catch (e) {
    console.warn('Firestore reply update failed:', e);
  }
};

/**
 * Report confession in Firestore.
 */
export const reportConfessionInFirestore = async (confessionId, reportsCount, reportReasons) => {
  try {
    await setDoc(doc(db, CONFESSIONS_COL, confessionId), { reportsCount, reportReasons }, { merge: true });
  } catch (e) {
    console.warn('Firestore report update failed:', e);
  }
};

/**
 * Delete confession in Firestore.
 */
export const deleteConfessionInFirestore = async (confessionId) => {
  try {
    await deleteDoc(doc(db, CONFESSIONS_COL, confessionId));
  } catch (e) {
    console.warn('Firestore delete failed:', e);
  }
};

/**
 * Ban user in Firestore.
 */
export const banUserInFirestore = async ({ uid, ip, reason }) => {
  const banId = `ban_${uid || ''}_${(ip || '').replace(/\./g, '_')}`;
  try {
    await setDoc(doc(db, BANNED_COL, banId), {
      uid: uid || 'unknown_uid',
      ip: ip || 'unknown_ip',
      reason,
      bannedAt: Date.now(),
    });
  } catch (e) {
    console.warn('Firestore ban failed:', e);
  }
};

/**
 * Unban user in Firestore.
 */
export const unbanUserInFirestore = async ({ uid, ip }) => {
  try {
    const snap = await getDocs(collection(db, BANNED_COL));
    snap.forEach(async (d) => {
      const data = d.data();
      if ((uid && data.uid === uid) || (ip && data.ip === ip)) {
        await deleteDoc(doc(db, BANNED_COL, d.id));
      }
    });
  } catch (e) {
    console.warn('Firestore unban failed:', e);
  }
};
