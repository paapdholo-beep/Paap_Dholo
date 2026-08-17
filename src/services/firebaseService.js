// Firebase adapter — ready to be configured when needed.
// All functions have the same signature as confessionService.js
// so they can be dropped in as replacements without touching UI code.

// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, addDoc, getDocs, ... } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export const getConfessions = async ({ sort, severityFilter }) => { ... };
// export const createConfession = async ({ text, severity, avatarId, displayName }) => { ... };
// export const addReaction = async ({ confessionId, reactionType, userId }) => { ... };
// export const addReply = async ({ confessionId, text, avatarId, displayName }) => { ... };
// export const getKarmaCourtTop = async () => { ... };
// export const getPaapDhulaiLeaderboard = async () => { ... };
// export const getStats = async () => { ... };

export default {};
