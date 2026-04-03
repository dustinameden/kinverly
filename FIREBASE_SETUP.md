# 🔥 Kinverly — Firebase Setup Guide
## Get real-time sync working in about 20 minutes, for free.

---

## What you need
- A Google account (anyone in the family can own it)
- 20 minutes
- The person doing this does NOT need to be a developer

---

## Step 1 — Create a Firebase project (5 min)

1. Go to **firebase.google.com** and sign in with Google
2. Click **"Go to console"** → **"Create a project"**
3. Name it `kinverly-family` (or anything you like)
4. Disable Google Analytics (not needed) → **Create project**
5. Wait ~30 seconds for it to set up

---

## Step 2 — Create the database (3 min)

1. In the left sidebar click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** → Next
4. Pick any location (e.g. `us-central`) → **Enable**

That's your database. It's live.

---

## Step 3 — Get your app credentials (3 min)

1. Click the **gear icon** (top left) → **"Project settings"**
2. Scroll down to **"Your apps"** → click the **`</>`** (Web) icon
3. Name the app `kinverly-web` → click **"Register app"**
4. You'll see a block of code like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "kinverly-family.firebaseapp.com",
  projectId: "kinverly-family",
  storageBucket: "kinverly-family.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

5. **Copy all of this** — you need it in Step 4

---

## Step 4 — Paste your credentials into Kinverly (2 min)

1. Open the file `js/firebase-config.js` in any text editor
   (Notepad on Windows, TextEdit on Mac, or VS Code)
2. Find the section that says `★ REPLACE THESE VALUES ★`
3. Replace the placeholder values with your real values from Step 3
4. Save the file

It should look like:
```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",        // ← your real value
  authDomain:        "kinverly-family.firebaseapp.com",
  projectId:         "kinverly-family",
  ...
};
```

---

## Step 5 — Deploy and share (5 min)

**Option A — Netlify (easiest, no account needed):**
1. Go to **app.netlify.com/drop**
2. Drag the entire `kinverly-firebase` folder onto the page
3. You get a live URL like `brave-wolf-abc123.netlify.app`
4. Drop that link in the family group chat!

**Option B — Netlify with a custom name (free account):**
1. Sign up at netlify.com
2. Drag the folder to your dashboard
3. Rename the site to something like `ourkinserly`
4. Your URL becomes `ourkinverly.netlify.app`

---

## What happens now

The first person to open the app **seeds the database** — it automatically
writes all the gatherings, ideas, and tasks to Firestore.

After that, every family member who opens the link is looking at
**the same live data**. When someone:
- Checks off a task → everyone sees it checked instantly
- Votes on an idea → the count goes up for everyone in real time
- Submits their Beach Week blackout dates → it saves to the database

No refresh needed. No app install. Just the link.

---

## Firestore security (important — do this after testing)

Test mode allows anyone with the URL to read and write data.
That's fine for a private family link, but if you want to be safe:

1. In Firebase console → Firestore → **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ← anyone with URL can access
    }
  }
}
```

For now this is fine. V2 will add proper login-based security.

---

## Troubleshooting

**"Firebase not initialised" toast appears:**
→ Check that you saved `firebase-config.js` with your real credentials

**Data doesn't update in real time:**
→ Make sure you're using the `kinverly-firebase` folder, not the old `kinverly` folder

**Error in browser console about CORS:**
→ Make sure you're opening the app via a URL (netlify), not by double-clicking the HTML file

---

Built with ❤️ using Claude at claude.ai
