# ✨ Kinverly — Your People. Your Place. Your Turn.

A real web app for organizing your family's gatherings, with Koro the mascot cheering you on.
Ready to deploy in under 30 minutes — free hosting, no accounts needed for visitors.

---

## What's inside

```
kinverly/
├── index.html       ← the whole app shell
├── css/
│   └── style.css    ← all styling
└── js/
    ├── data.js      ← all family data (edit this!)
    ├── animals.js   ← the 10 cartoon animals
    └── app.js       ← all app logic
```

---

## Deploy in 15 minutes — free

### Easiest: Netlify Drop (no account needed)
1. Go to **app.netlify.com/drop**
2. Drag the entire `kinverly/` folder onto the page
3. You get a live URL instantly — share it with the family

### With a free account (keep the same URL):
1. Sign up at **netlify.com**
2. Drag the folder to your dashboard
3. Rename the site to `ourkinverly` → URL becomes `ourkinverly.netlify.app`

### Vercel (also free):
```bash
npm i -g vercel
cd kinverly
vercel
```

---

## Customize your family

Edit **js/data.js** — it's the only file you need to touch.

**Change family members:**
```js
members: [
  { id: 'sara', name: 'Sara', animal: 'fox', location: 'Nashville, TN', online: true, mode: 'in-person', pct: 100 },
  // Add or remove rows here
]
```

**Available animals:** fox · bear · bunny · owl · cat · panda · frog · penguin · hedgehog · deer

**Change who "you" are** (the logged-in user):
```js
me: { id: 'mom', name: 'Mom', animal: 'bunny', location: 'Nashville, TN', ... }
```

**Add or edit gatherings:**
Each gathering has: name, month, day, location, host, status, tasks, attending.

---

## What's working in v1
- Home with countdown + live kinverly scroll + activity feed
- All gatherings list with progress bars
- Gathering detail with shared task list (tap to check off)
- Beach Week availability calendar (tap blackout dates, submit)
- Idea bank with live voting
- Travel fairness tracker + year-to-date burden
- Profile with animal avatar + badges
- Works on every phone — no app install needed

## What's next for v2
- Real-time sync so everyone sees updates live
- Push notifications / nudges
- Photo sharing per gathering
- Post-gathering memory recap
- Hosting checklist builder

---

Built with Claude at claude.ai. To add features, just describe what you want.
