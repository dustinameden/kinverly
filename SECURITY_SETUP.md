# 🔒 Kinverly Security Setup
## Two steps. Takes about 10 minutes total.

---

## STEP 1 — Firestore Rules (5 min)
### Locks down who can read and write your database

1. Go to **console.firebase.google.com**
2. Click your **Kinverly** project
3. In the left sidebar click **Firestore Database**
4. Click the **Rules** tab at the top (next to Data, Indexes, etc.)
5. You'll see a text editor with some default rules
6. **Select all and delete everything** in the editor
7. Open the file `firestore.rules` from this folder
8. Copy everything from line 26 onwards (starting with `rules_version = '2';`)
9. Paste it into the Firebase rules editor
10. Click the blue **Publish** button
11. ✅ Done — your database is now protected

**What these rules do:**
- Anyone with your Netlify link can view and update data normally
- Vote counts can only change by 1 at a time (no vote bombing)
- Nobody can delete gatherings or ideas from the app
- Nobody can write random junk data — all writes are validated
- Everything else (any other collection) is completely blocked

---

## STEP 2 — API Key Restriction (5 min)
### Locks your API key so it only works from your app's URL

Right now your Firebase API key works from any website. This step
makes it only work from YOUR Netlify URL.

**Do this AFTER you've deployed to Netlify and have your URL.**
(e.g. `https://ourkinverly.netlify.app`)

1. Go to **console.cloud.google.com**
   (This is Google Cloud — Firebase runs on top of it)
2. Make sure your **Kinverly** project is selected in the top dropdown
3. In the search bar type **"API Keys"** and click the result
4. You'll see a key called **"Browser key (auto created by Firebase)"**
5. Click the pencil ✏️ edit icon next to it
6. Under **"Application restrictions"** select **"Websites"**
7. Click **"Add an item"** and enter your Netlify URL:
   ```
   https://yoursite.netlify.app/*
   ```
   (Replace `yoursite` with your actual Netlify subdomain)
8. Also add `http://localhost/*` so you can still test locally
9. Click **Save**
10. ✅ Done — your API key now only works from your app

**What this does:**
- If someone copies your API key from the source code, it won't work
  on any other website — only yours
- Requests from bots or other domains are automatically rejected
- Your family's link still works exactly as before

---

## STEP 3 (Optional) — Add login for extra security

Currently anyone who finds your Netlify link can see and edit the app.
For a private family app shared only in your group chat, this is fine.

When you're ready to add real logins (so only family members with
accounts can access), the next step is Firebase Authentication.
The two best options for a family app:

**Option A — Email link (passwordless)**
Family members enter their email, get a magic link, tap it, they're in.
No passwords to forget.

**Option B — Phone number (SMS)**
Family members enter their phone number, get a 6-digit code by text,
type it in, they're in. Works great on mobile.

Just ask Claude to "add Firebase Authentication to Kinverly" when ready.

---

## Security summary

| Threat | Protected by |
|---|---|
| Random bots writing to your DB | Firestore Rules ✅ |
| Someone vote-bombing ideas | Rules: votes change by max 1 ✅ |
| Someone deleting gatherings | Rules: delete blocked ✅ |
| API key used on other sites | API Key restriction ✅ |
| Non-family members accessing app | Share link carefully (login = Step 3) |
| Data loss | Firebase automatic backups ✅ |

---

Your Kinverly project ID: **kinverly-73cb9**
Firebase console: **console.firebase.google.com**
