// ─────────────────────────────────────────────
//  KINVERLY — Firebase Configuration
//  Credentials locked to kinverly-73cb9
// ─────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBiJFbnv8nUcyNbv_aUqeCUvtTDfk8d_QA",
  authDomain:        "kinverly-73cb9.firebaseapp.com",
  projectId:         "kinverly-73cb9",
  storageBucket:     "kinverly-73cb9.firebasestorage.app",
  messagingSenderId: "651356988560",
  appId:             "1:651356988560:web:930e3394910638f5576415"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// Enable offline persistence — app works even with no internet,
// syncs automatically when connection returns
enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open — persistence only works in one tab at a time
    console.warn('[Kinverly] Offline persistence disabled (multiple tabs open)');
  } else if (err.code === 'unimplemented') {
    console.warn('[Kinverly] Offline persistence not supported in this browser');
  }
});

// ── Client-side write guard ──────────────────────────────────
// Tracks writes per session to prevent runaway loops.
// Firestore Rules are the real security — this is a belt-and-suspenders
// sanity check on the client side.
const _writeLog = { count: 0, resetAt: Date.now() + 60000 };

window.__kinverlyDB = db;
window.__kinverlyWriteGuard = function() {
  const now = Date.now();
  if (now > _writeLog.resetAt) {
    _writeLog.count = 0;
    _writeLog.resetAt = now + 60000;
  }
  _writeLog.count++;
  if (_writeLog.count > 50) {
    console.warn('[Kinverly] Write rate limit hit — throttling');
    return false;
  }
  return true;
};

// ── Input sanitizer ──────────────────────────────────────────
// Strips HTML tags from any string before it goes to Firestore
window.__kinverlySanitize = function(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim().slice(0, 500);
};

export { db };

