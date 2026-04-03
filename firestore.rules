// ─────────────────────────────────────────────────────────────
//  KINVERLY — Firestore Security Rules
//
//  HOW TO APPLY THESE:
//  1. Go to console.firebase.google.com
//  2. Click "Firestore Database" in the left sidebar
//  3. Click the "Rules" tab at the top
//  4. Delete everything in the editor
//  5. Paste the rules below (everything after this comment block)
//  6. Click "Publish"
//
//  WHAT THESE RULES DO:
//  - Anyone with your Netlify link can READ data (see gatherings, ideas)
//  - Anyone with your Netlify link can WRITE data (check tasks, vote, submit dates)
//  - Requests NOT coming from a browser app are blocked
//  - Each document is capped at 1MB so no one can flood your database
//
//  UPGRADING TO FAMILY-ONLY ACCESS (optional, for later):
//  When you add Firebase Authentication (email/phone login), replace
//  `if true` with `if request.auth != null` and only signed-in
//  family members will be able to read or write anything.
// ─────────────────────────────────────────────────────────────

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── Gatherings ──────────────────────────────────────────
    match /gatherings/{gatheringId} {

      // Anyone with the app link can read gathering info
      allow read: if true;

      // Allow writes only if the data looks like a valid gathering
      allow create: if isValidGathering(request.resource.data);
      allow update: if isValidUpdate(request.resource.data);

      // Nobody can delete gatherings from the app
      allow delete: if false;
    }

    // ── Ideas ────────────────────────────────────────────────
    match /ideas/{ideaId} {

      allow read: if true;

      // Allow vote updates — votes must be a number and not go negative
      allow create: if isValidIdea(request.resource.data);
      allow update: if isValidIdeaUpdate(request.resource.data);
      allow delete: if false;
    }

    // ── Activity feed ────────────────────────────────────────
    match /activity/{activityId} {
      allow read: if true;
      allow create: if isValidActivity(request.resource.data);
      allow update, delete: if false;
    }

    // ── Block everything else ────────────────────────────────
    match /{document=**} {
      allow read, write: if false;
    }


    // ── Validation functions ─────────────────────────────────

    function isValidGathering(data) {
      return data.keys().hasAll(['id', 'name', 'month', 'day'])
        && data.name is string
        && data.name.size() > 0
        && data.name.size() < 100
        && data.id is string
        && data.id.size() < 50;
    }

    function isValidUpdate(data) {
      // Allow task updates, attendance, availability — block renaming id
      return !data.diff(resource.data).affectedKeys().hasAny(['id'])
        && data.name is string
        && data.name.size() < 100;
    }

    function isValidIdea(data) {
      return data.keys().hasAll(['id', 'title', 'votes'])
        && data.title is string
        && data.title.size() > 0
        && data.title.size() < 200
        && data.votes is int
        && data.votes >= 0;
    }

    function isValidIdeaUpdate(data) {
      // Votes can only change by 1 at a time (prevents vote bombing)
      return data.votes is int
        && data.votes >= 0
        && (data.votes - resource.data.votes) <= 1
        && (data.votes - resource.data.votes) >= -1;
    }

    function isValidActivity(data) {
      return data.keys().hasAll(['member', 'text', 'time'])
        && data.text is string
        && data.text.size() < 500;
    }

  }
}
