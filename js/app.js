// app.js — Kinverly · Firebase real-time version
// All data reads/writes go to Firestore — every family member sees the same live state

import {
  collection, doc,
  getDoc, setDoc, updateDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Wait for Firebase to initialise ──
async function getDB() {
  let tries = 0;
  while (!window.__kinverlyDB && tries < 30) {
    await new Promise(r => setTimeout(r, 100));
    tries++;
  }
  if (!window.__kinverlyDB) throw new Error("Firebase not initialised");
  return window.__kinverlyDB;
}

// ─────────────────────────────────────────────
//  DEFAULT DATA  (shown instantly; Firebase overwrites on connect)
// ─────────────────────────────────────────────
const LOCAL = {
  me: {
    id: 'mom', name: 'Mom', animal: 'bunny',
    location: 'Nashville, TN', trait: 'The energizer',
    stats: { attended: 7, hosted: 2, ideas: 5 },
    prefs: { Dietary: 'No restrictions', Travel: 'Flexible', 'Fav activity': 'Anything together', Notifications: 'All on' },
    badges: [
      { id: 'animal',  icon: '🐰', label: 'The energizer', earned: true  },
      { id: 'starter', icon: '🎉', label: 'Party starter',  earned: true  },
      { id: 'planner', icon: '📋', label: 'Head planner',   earned: true  },
      { id: 'host',    icon: '👑', label: 'Host legend',    earned: false },
      { id: 'trail',   icon: '🗺️', label: 'Trailblazer',   earned: false },
      { id: 'ideas',   icon: '💡', label: 'Idea machine',   earned: false },
      { id: 'never',   icon: '🤝', label: 'Never missed',   earned: false },
      { id: 'star',    icon: '🌟', label: 'All-star',       earned: false },
    ]
  },
  members: [
    { id: 'sara',   name: 'Sara',   animal: 'fox',      location: 'Nashville, TN', online: true,  mode: 'in-person', pct: 100 },
    { id: 'marcus', name: 'Marcus', animal: 'bear',     location: 'Atlanta, GA',   online: true,  mode: 'local',     pct: 100 },
    { id: 'jen',    name: 'Jen',    animal: 'owl',      location: 'Chicago, IL',   online: false, mode: 'in-person', pct: 60  },
    { id: 'david',  name: 'David',  animal: 'penguin',  location: 'Denver, CO',    online: true,  mode: 'virtual',   pct: 100 },
    { id: 'amy',    name: 'Amy',    animal: 'cat',      location: 'Portland, OR',  online: false, mode: 'in-person', pct: 30  },
    { id: 'tom',    name: 'Tom',    animal: 'deer',     location: 'Seattle, WA',   online: true,  mode: 'in-person', pct: 75  },
    { id: 'lily',   name: 'Lily',   animal: 'frog',     location: 'Boston, MA',    online: false, mode: 'in-person', pct: 100 },
    { id: 'grace',  name: 'Grace',  animal: 'hedgehog', location: 'Austin, TX',    online: true,  mode: 'pending',   pct: 10  },
  ],
  activity: [
    { member: 'amy',    text: 'added "Escape room challenge" to the idea bank',            time: '2h ago'     },
    { member: 'david',  text: "RSVP'd to Summer Cookout — joining virtually",              time: '5h ago'     },
    { member: 'sara',   text: 'voted on 3 ideas — "Trivia night" is leading!',             time: 'Yesterday'  },
    { member: 'tom',    text: 'booked flights — arriving Jul 18',                          time: '2 days ago' },
    { member: 'marcus', text: 'confirmed Piedmont Park Shelter B — reserved all day',      time: '3 days ago' },
  ],
  fairness: {
    gathering: 'Summer Cookout · Atlanta, GA',
    members: [
      { id: 'sara',   cost: 0,   pct: 4,  label: 'Local',   color: '#4A9E4C' },
      { id: 'marcus', cost: 0,   pct: 4,  label: 'Host',    color: '#4A9E4C' },
      { id: 'jen',    cost: 260, pct: 38, label: 'Medium',  color: '#2A6DB5' },
      { id: 'david',  cost: 380, pct: 56, label: 'High',    color: '#E8A020' },
      { id: 'amy',    cost: 550, pct: 80, label: 'Highest', color: '#D85A30' },
      { id: 'tom',    cost: 580, pct: 85, label: 'Highest', color: '#D85A30' },
      { id: 'lily',   cost: 320, pct: 47, label: 'Medium',  color: '#2A6DB5' },
      { id: 'grace',  cost: 180, pct: 26, label: 'Low',     color: '#4A9E4C' },
    ],
    poolPerPerson: 125, poolTotal: 1000,
    yearMiles: [
      { id: 'amy',   miles: 2840, pct: 90, color: '#D85A30' },
      { id: 'tom',   miles: 2650, pct: 84, color: '#D85A30' },
      { id: 'david', miles: 1720, pct: 55, color: '#E8A020' },
      { id: 'lily',  miles: 1340, pct: 42, color: '#2A6DB5' },
      { id: 'jen',   miles: 1100, pct: 35, color: '#2A6DB5' },
      { id: 'grace', miles: 820,  pct: 26, color: '#4A9E4C' },
    ]
  }
};

// Default Firestore documents
const DEFAULT_GATHERINGS = [
  {
    id: 'cookout', name: 'Summer Cookout', month: 'Jul', day: 19,
    location: 'Atlanta, GA', host: 'marcus', type: 'planned', status: 'next',
    theme: 'BBQ + games', themePill: 'amber', hybrid: true, progress: 72,
    attending: ['sara','marcus','jen','david','tom','lily'],
    tasks: [
      { id: 't1', title: 'Pick & reserve the location',    owner: 'marcus', note: 'Piedmont Park · Shelter B', done: true  },
      { id: 't2', title: 'Organize grill & equipment',     owner: 'tom',    note: 'Charcoal, tools, cooler',  done: true  },
      { id: 't3', title: 'Set up video call for David',    owner: 'sara',   note: 'Tablet + good wifi spot',  done: true  },
      { id: 't4', title: 'Mail remote kit to David',       owner: 'lily',   note: 'Snacks, game card, photo', done: true  },
      { id: 't5', title: 'Plan the group activity',        owner: 'jen',    note: 'Trivia night — in progress',done: false },
      { id: 't6', title: 'Collect food sign-up list',      owner: 'grace',  note: 'Waiting on RSVP first',   done: false },
      { id: 't7', title: 'Create shared photo album',      owner: 'amy',    note: 'Shared after the event',   done: false },
      { id: 't8', title: 'Send directions + parking info', owner: 'marcus', note: '1 week before + day-of',   done: false },
    ]
  },
  {
    id: 'beach', name: 'Summer Beach Week', month: 'Jul', day: 19,
    location: 'TBD — voting in progress', host: 'mom', type: 'bonus',
    status: 'planning', theme: 'Beach rental', themePill: 'blue', progress: 15,
    attending: [], beachMode: true,
    windows: [
      { dates: 'Jul 12–19',    label: 'Blocked for 3',    status: 'blocked' },
      { dates: 'Jul 19–26',    label: 'Best window',      status: 'best'    },
      { dates: 'Jul 26–Aug 2', label: 'Lauren partial',   status: 'partial' },
    ],
    responses: [
      { id: 'sara',   status: 'responded' },
      { id: 'marcus', status: 'responded' },
      { id: 'jen',    status: 'responded' },
      { id: 'david',  status: 'pending'   },
      { id: 'amy',    status: 'pending'   },
      { id: 'tom',    status: 'pending'   },
      { id: 'lily',   status: 'pending'   },
      { id: 'grace',  status: 'pending'   },
    ]
  },
  {
    id: 'fall', name: 'Fall Harvest', month: 'Oct', day: 5,
    location: 'TBD — your turn!', host: 'mom', type: 'planned',
    status: 'upcoming', theme: 'Planning opens Aug 1', themePill: 'amber',
    attending: [], progress: 0,
  },
  {
    id: 'winter', name: 'Winter Celebration', month: 'Dec', day: 21,
    location: 'TBD', host: 'jen', type: 'planned',
    status: 'upcoming', theme: 'Coming soon', themePill: 'gray',
    attending: [], progress: 0,
  },
];

const DEFAULT_IDEAS = [
  { id: 'i1', icon: '🎲', title: 'Family trivia night',   sub: 'Teams, custom questions — works hybrid!',        votes: 7, votePct: 85, voted: false },
  { id: 'i2', icon: '🍳', title: 'Cook-off competition',  sub: 'Each sibling makes a dish, everyone rates blind', votes: 6, votePct: 72, voted: false },
  { id: 'i3', icon: '🧩', title: 'Escape room challenge', sub: 'Book same-time rooms in different cities',        votes: 5, votePct: 60, voted: false },
  { id: 'i4', icon: '🎨', title: 'Paint + sip night',     sub: 'Everyone paints the same image — compare!',      votes: 4, votePct: 48, voted: false },
  { id: 'i5', icon: '⛺', title: 'Camping weekend',       sub: 'National park, cabins for those who prefer',     votes: 3, votePct: 36, voted: false },
];

// ── LIVE STATE ──
const STATE = {
  gatherings: JSON.parse(JSON.stringify(DEFAULT_GATHERINGS)),
  ideas:      JSON.parse(JSON.stringify(DEFAULT_IDEAS)),
  blockedDates: new Set(),
};

// ─────────────────────────────────────────────
//  FIREBASE  — seed + listeners
// ─────────────────────────────────────────────
async function seedIfEmpty(db) {
  try {
    for (const g of DEFAULT_GATHERINGS) {
      const snap = await getDoc(doc(db, 'gatherings', g.id));
      if (!snap.exists()) await setDoc(doc(db, 'gatherings', g.id), { ...g, _seeded: serverTimestamp() });
    }
    for (const idea of DEFAULT_IDEAS) {
      const snap = await getDoc(doc(db, 'ideas', idea.id));
      if (!snap.exists()) await setDoc(doc(db, 'ideas', idea.id), { ...idea, _seeded: serverTimestamp() });
    }
    console.log('[Kinverly] ✓ Firestore seeded');
  } catch (e) {
    console.warn('[Kinverly] Seed skipped:', e.message);
  }
}

function attachListeners(db) {
  // Gatherings — real-time
  onSnapshot(collection(db, 'gatherings'), snap => {
    snap.forEach(ds => {
      const data = ds.data();
      const idx = STATE.gatherings.findIndex(g => g.id === data.id);
      if (idx >= 0) STATE.gatherings[idx] = { ...STATE.gatherings[idx], ...data };
      else STATE.gatherings.push(data);
    });
    if (currentPage === 'gatherings') renderGatherings();
    if (currentPage === 'gathering-detail' && currentGatheringId) {
      const g = STATE.gatherings.find(g => g.id === currentGatheringId);
      if (g) renderGatheringDetail(g);
    }
  });

  // Ideas — real-time
  onSnapshot(collection(db, 'ideas'), snap => {
    snap.forEach(ds => {
      const data = ds.data();
      const idx = STATE.ideas.findIndex(i => i.id === data.id);
      if (idx >= 0) STATE.ideas[idx] = { ...STATE.ideas[idx], ...data };
      else STATE.ideas.push(data);
    });
    if (currentPage === 'ideas') renderIdeas();
  });
}

// ── WRITES ──
async function writeTask(gId, tId, done) {
  if (!window.__kinverlyWriteGuard?.()) return;
  try {
    const db = await getDB();
    const g = STATE.gatherings.find(g => g.id === gId);
    if (!g?.tasks) return;
    const updatedTasks = g.tasks.map(t => t.id === tId ? { ...t, done } : t);
    await updateDoc(doc(db, 'gatherings', gId), { tasks: updatedTasks });
  } catch (e) { console.warn('[Kinverly] writeTask (offline):', e.message); }
}

async function writeVote(ideaId, voted, votes) {
  if (!window.__kinverlyWriteGuard?.()) return;
  try {
    const db = await getDB();
    await updateDoc(doc(db, 'ideas', ideaId), { voted, votes });
  } catch (e) { console.warn('[Kinverly] writeVote (offline):', e.message); }
}

async function writeAvailability(gId, memberId, blocked) {
  if (!window.__kinverlyWriteGuard?.()) return;
  try {
    const db = await getDB();
    const fieldKey = `availability.${memberId}`;
    await updateDoc(doc(db, 'gatherings', gId), {
      [fieldKey]: { blocked, submittedAt: serverTimestamp() }
    });
    const g = STATE.gatherings.find(g => g.id === gId);
    if (g?.responses) {
      const updated = g.responses.map(r => r.id === memberId ? { ...r, status: 'responded' } : r);
      await updateDoc(doc(db, 'gatherings', gId), { responses: updated });
    }
  } catch (e) { console.warn('[Kinverly] writeAvailability (offline):', e.message); }
}

// ─────────────────────────────────────────────
//  UI LAYER
// ─────────────────────────────────────────────
const A = window.Animals;
let currentPage = 'home';
let pageHistory = [];
let currentGatheringId = null;

function getMember(id) {
  if (id === LOCAL.me.id || id === 'mom') return LOCAL.me;
  return LOCAL.members.find(m => m.id === id) || null;
}
function makeAvSvg(id, size = 44) {
  const m = getMember(id);
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block">${A.paths(m?.animal || 'bear')}</svg>`;
}
function pill(text, color = 'green') {
  return `<span class="pill pill-${color}">${text}</span>`;
}
function memberName(id) { return getMember(id)?.name || id; }
function pctColor(p) { return p >= 90 ? '#4A9E4C' : p >= 50 ? '#E8A020' : '#D85A30'; }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── NAVIGATION ──
function goto(pageId) {
  document.querySelector('.page.active')?.classList.remove('active');
  const next = document.getElementById('page-' + pageId);
  if (!next) return;
  next.classList.add('active');
  currentPage = pageId;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === pageId));
  pageHistory.push(pageId);
  renderPage(pageId);
}
function back() {
  pageHistory.pop();
  goto(pageHistory.pop() || 'gatherings');
}
function openGathering(id) {
  currentGatheringId = id;
  const g = STATE.gatherings.find(g => g.id === id);
  if (!g) return;
  renderGatheringDetail(g);
  goto('gathering-detail');
}

// ── HOME ──
function renderHome() {
  document.getElementById('my-avatar').innerHTML = makeAvSvg(LOCAL.me.id, 38);
  document.getElementById('kinverly-scroll').innerHTML = LOCAL.members.map(m => `
    <div class="kinverly-chip">
      <div class="kinverly-chip-av">
        <div class="av" style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:2.5px solid #fff">${makeAvSvg(m.id, 52)}</div>
        ${m.online ? '<div class="online-dot"></div>' : ''}
      </div>
      <div class="kinverly-chip-name">${m.name}</div>
    </div>`).join('');

  document.getElementById('activity-feed').innerHTML = LOCAL.activity.map(a => `
    <div class="activity-item">
      <div class="av av-sm" style="flex-shrink:0">${makeAvSvg(a.member, 32)}</div>
      <div style="flex:1">
        <div class="activity-text"><strong>${memberName(a.member)}</strong> ${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`).join('');
}

// ── GATHERINGS ──
function renderGatherings() {
  document.getElementById('gatherings-list').innerHTML = STATE.gatherings.map(g => {
    const faces = (g.attending || []).slice(0, 4).map(id =>
      `<div class="av" style="width:22px;height:22px;border-radius:50%;overflow:hidden;margin-left:-6px;border:1.5px solid #fff;flex-shrink:0">${makeAvSvg(id, 22)}</div>`
    ).join('');
    const extra = (g.attending?.length || 0) > 4 ? `<div class="gc-more">+${g.attending.length - 4}</div>` : '';
    return `
      <div class="gathering-card ${g.status === 'next' ? 'featured' : ''} ${g.beachMode ? 'beach' : ''}"
           onclick="KinverlyApp.openGathering('${g.id}')">
        <div class="gc-header">
          <div class="gc-date-block ${g.status === 'next' ? 'featured' : ''} ${g.beachMode ? 'beach' : ''}">
            <div class="gc-month">${g.month}</div>
            <div class="gc-day">${g.day}</div>
          </div>
          <div class="gc-info">
            <div class="gc-title">${g.name}</div>
            <div class="gc-location">${g.location}</div>
            <div class="gc-meta">
              ${pill(g.theme, g.themePill || 'gray')}
              ${g.hybrid ? pill('Hybrid', 'blue') : ''}
              ${g.status === 'completed' ? pill('Completed', 'gray') : ''}
              ${g.status === 'next' ? pill('Next up', 'green') : ''}
              ${g.beachMode ? pill('⚡ Bonus', 'amber') : ''}
              ${g.status === 'planning' ? pill('Collecting dates', 'amber') : ''}
              <div style="display:flex;margin-left:auto">${faces}${extra}</div>
            </div>
          </div>
        </div>
        ${g.progress > 0 ? `<div class="gc-progress" style="margin-top:10px">
          <div class="gc-progress-bar"><div class="gc-progress-fill" style="width:${g.progress}%"></div></div>
        </div>` : ''}
      </div>`;
  }).join('');
}

// ── GATHERING DETAIL ──
function renderGatheringDetail(g) {
  document.getElementById('gathering-detail-content').innerHTML =
    g.beachMode ? renderBeachDetail(g) : renderStandardDetail(g);
}

function renderStandardDetail(g) {
  const tasksDone  = (g.tasks || []).filter(t => t.done).length;
  const tasksTotal = (g.tasks || []).length;
  const taskHTML = (g.tasks || []).map(t => `
    <div class="task-item ${t.done ? 'done' : ''}" id="task-${t.id}">
      <div class="task-check ${t.done ? 'checked' : ''}" onclick="KinverlyApp.toggleTask('${g.id}','${t.id}')">
        ${t.done ? `<svg width="11" height="11" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
      </div>
      <div style="width:28px;height:28px;border-radius:50%;overflow:hidden;flex-shrink:0">${makeAvSvg(t.owner, 28)}</div>
      <div class="task-body">
        <div class="task-title ${t.done ? 'done' : ''}">${t.title}</div>
        <div class="task-owner">${memberName(t.owner)} · ${t.note}</div>
      </div>
    </div>`).join('');

  const memberRows = (g.attending || []).map(id => {
    const m = getMember(id); if (!m) return '';
    const color = pctColor(m.pct || 0);
    return `<div class="member-row">
      <div class="av av-sm">${makeAvSvg(id, 32)}</div>
      <div class="member-info"><div class="member-name">${m.name}</div><div class="member-loc">${m.location || ''}</div></div>
      <span class="pill pill-${m.mode === 'virtual' ? 'blue' : m.mode === 'pending' ? 'amber' : 'green'}">${m.mode || 'in-person'}</span>
      <div class="member-pct-wrap">
        <div class="member-pct-bar"><div class="member-pct-fill" style="width:${m.pct||0}%;background:${color}"></div></div>
        <div class="member-pct-num" style="color:${color}">${m.pct||0}%</div>
      </div>
    </div>`;
  }).join('');

  return `
    <div class="detail-hero">
      <div class="detail-eyebrow">${g.type === 'planned' ? 'Planned gathering' : '⚡ Bonus gathering'}</div>
      <div class="detail-title">${g.name}</div>
      <div class="detail-sub">${g.month} ${g.day} · ${g.location}</div>
      <div class="detail-stats">
        <div class="detail-stat"><div class="detail-stat-n">${g.attending?.length || 0}</div><div class="detail-stat-l">attending</div></div>
        ${tasksTotal > 0 ? `<div class="detail-stat"><div class="detail-stat-n">${tasksDone}/${tasksTotal}</div><div class="detail-stat-l">tasks done</div></div>` : ''}
        <div class="detail-stat"><div class="detail-stat-n">${g.progress || 0}%</div><div class="detail-stat-l">ready</div></div>
      </div>
    </div>
    <div class="collab-banner">
      <div class="collab-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
      <div><div class="collab-title">Everyone owns a piece of this</div><div class="collab-sub">${tasksTotal} tasks spread across the family. No one carries it all.</div></div>
    </div>
    ${tasksTotal > 0 ? `<div class="section-label">Shared task list</div><div class="task-list">${taskHTML}</div>` : ''}
    <div class="section-label">Who's coming</div>
    <div class="section-card"><div class="member-list">${memberRows || '<div style="font-size:13px;color:var(--text-secondary);padding:8px 0">Collecting RSVPs...</div>'}</div></div>
    <button class="btn-primary" onclick="KinverlyApp.showToast('RSVP updated! ✓')">Update my details</button>
    <button class="btn-secondary" onclick="KinverlyApp.showToast('Nudge sent! 👋')">Nudge stragglers</button>`;
}

function renderBeachDetail(g) {
  const responded = (g.responses || []).filter(r => r.status === 'responded').length;
  const total = (g.responses || []).length;
  return `
    <div class="detail-hero beach">
      <div class="detail-eyebrow">⚡ Bonus · Collecting availability</div>
      <div class="detail-title">${g.name}</div>
      <div class="detail-sub">July 2025 · beach rental · all ages · relaxed week</div>
      <div class="detail-stats">
        <div class="detail-stat"><div class="detail-stat-n">${responded}/${total}</div><div class="detail-stat-l">responded</div></div>
        <div class="detail-stat"><div class="detail-stat-n">7</div><div class="detail-stat-l">nights</div></div>
        <div class="detail-stat"><div class="detail-stat-n">Jun 28</div><div class="detail-stat-l">deadline</div></div>
      </div>
      <div class="window-grid" style="margin-top:14px">
        ${(g.windows || []).map(w => `<div class="window-opt ${w.status}"><div class="window-date">${w.dates}</div><div class="window-sub">${w.label}</div></div>`).join('')}
      </div>
    </div>
    <div class="collab-banner">
      <div class="collab-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
      <div><div class="collab-title">Jul 19–26 is the leading window</div><div class="collab-sub">Based on ${responded} responses — updates live as more come in.</div></div>
    </div>
    <div class="section-label">Mark your availability</div>
    <button class="btn-primary" onclick="KinverlyApp.openAvailModal()" style="margin-bottom:12px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      Submit my blackout dates
    </button>
    <div class="section-label">Responses</div>
    <div class="section-card"><div class="member-list">
      ${(g.responses || []).map(r => {
        const m = getMember(r.id); if (!m) return '';
        return `<div class="member-row">
          <div class="av av-sm">${makeAvSvg(r.id, 32)}</div>
          <div class="member-info"><div class="member-name">${m.name}</div><div class="member-loc">${m.location||''}</div></div>
          ${r.status === 'responded' ? pill('Responded','green') : pill('Pending','amber')}
        </div>`;
      }).join('')}
    </div></div>
    <button class="btn-secondary" onclick="KinverlyApp.showToast('Nudge sent to ${total - responded} pending members! 👋')">Nudge pending members</button>`;
}

// ── TOGGLE TASK ──
function toggleTask(gId, tId) {
  const g = STATE.gatherings.find(g => g.id === gId);
  if (!g?.tasks) return;
  const t = g.tasks.find(t => t.id === tId);
  if (!t) return;
  t.done = !t.done;
  const card = document.getElementById('task-' + tId);
  if (!card) return;
  const chk = card.querySelector('.task-check');
  const title = card.querySelector('.task-title');
  chk.classList.toggle('checked', t.done);
  chk.innerHTML = t.done ? `<svg width="11" height="11" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` : '';
  title.classList.toggle('done', t.done);
  card.classList.toggle('done', t.done);
  writeTask(gId, tId, t.done);
  showToast(t.done ? '✓ Task marked complete!' : 'Task reopened');
}

// ── IDEAS ──
function renderIdeas() {
  document.getElementById('ideas-list').innerHTML = STATE.ideas.map(idea => `
    <div class="idea-card">
      <div class="idea-icon" style="background:var(--amber-light)">${idea.icon}</div>
      <div class="idea-body">
        <div class="idea-title">${idea.title}</div>
        <div class="idea-sub">${idea.sub}</div>
        <div class="idea-vote-row">
          <div class="vote-bar-bg"><div class="vote-bar-fill" id="vbar-${idea.id}" style="width:${idea.votePct}%"></div></div>
          <div class="vote-count" id="vcnt-${idea.id}">${idea.votes} votes</div>
          <button class="vote-btn ${idea.voted?'voted':''}" id="vbtn-${idea.id}" onclick="KinverlyApp.toggleVote('${idea.id}')">
            ${idea.voted ? 'Voted' : 'Vote'}
          </button>
        </div>
      </div>
    </div>`).join('');
}

function toggleVote(id) {
  const idea = STATE.ideas.find(i => i.id === id);
  if (!idea) return;
  idea.voted = !idea.voted;
  idea.votes += idea.voted ? 1 : -1;
  idea.votePct = Math.max(4, Math.min(98, idea.votePct + (idea.voted ? 13 : -13)));
  document.getElementById('vbar-'+id).style.width = idea.votePct + '%';
  document.getElementById('vcnt-'+id).textContent = idea.votes + ' votes';
  const btn = document.getElementById('vbtn-'+id);
  btn.textContent = idea.voted ? 'Voted' : 'Vote';
  btn.classList.toggle('voted', idea.voted);
  writeVote(id, idea.voted, idea.votes);
}

// ── FAIRNESS ──
function renderFairness() {
  const f = LOCAL.fairness;
  const costRows = f.members.map(m => `
    <div class="cost-row">
      <div class="av" style="width:30px;height:30px;border-radius:50%;overflow:hidden;flex-shrink:0">${makeAvSvg(m.id,30)}</div>
      <div class="cost-name">${memberName(m.id)}</div>
      <div class="cost-bar-wrap">
        <div class="cost-bar-bg"><div class="cost-bar-fill" style="width:${m.pct}%;background:${m.color}"></div></div>
        <div class="cost-amt" style="color:${m.color}">$${m.cost}</div>
      </div>
      ${pill(m.label, m.color==='#4A9E4C'?'green':m.color==='#D85A30'?'coral':m.color==='#E8A020'?'amber':'blue')}
    </div>`).join('');
  const mileRows = f.yearMiles.map(m => `
    <div class="cost-row">
      <div class="av" style="width:30px;height:30px;border-radius:50%;overflow:hidden;flex-shrink:0">${makeAvSvg(m.id,30)}</div>
      <div class="cost-name">${memberName(m.id)}</div>
      <div class="cost-bar-wrap">
        <div class="cost-bar-bg"><div class="cost-bar-fill" style="width:${m.pct}%;background:${m.color}"></div></div>
        <div class="cost-amt" style="color:${m.color}">${m.miles.toLocaleString()} mi</div>
      </div>
    </div>`).join('');
  document.getElementById('fairness-content').innerHTML = `
    <div class="fairness-card">
      <div class="fairness-card-title">${f.gathering}</div>${costRows}
      <div class="pool-box">
        <div><div class="pool-label">Fairness pool</div><div class="pool-sub">$${f.poolPerPerson} from each · subsidies for top travelers</div></div>
        <div class="pool-amt">$${f.poolTotal.toLocaleString()}</div>
      </div>
    </div>
    <div class="fairness-card">
      <div class="fairness-card-title">Year-to-date travel burden</div>${mileRows}
      <div style="background:var(--purple-light);border-radius:10px;padding:10px 12px;margin-top:10px;font-size:12px;color:var(--brand);font-weight:600;line-height:1.5">
        📍 Next 2 gatherings should lean toward the Pacific Northwest to rebalance.
      </div>
    </div>
    <button class="btn-secondary" onclick="KinverlyApp.showToast('Location finder coming soon!')">Find fair meeting locations →</button>`;
}

// ── PROFILE ──
function renderProfile() {
  const me = LOCAL.me;
  document.getElementById('profile-content').innerHTML = `
    <div class="profile-hero">
      <div class="av av-xxl" style="border:3px solid #F0C030">${makeAvSvg(me.id,88)}</div>
      <div class="profile-name">${me.name}</div>
      <div class="profile-handle">${me.trait} · ${me.location}</div>
    </div>
    <div class="profile-stats">
      <div class="pstat"><div class="pstat-n">${me.stats.attended}</div><div class="pstat-l">gatherings</div></div>
      <div class="pstat"><div class="pstat-n">${me.stats.hosted}</div><div class="pstat-l">times hosted</div></div>
      <div class="pstat"><div class="pstat-n">${me.stats.ideas}</div><div class="pstat-l">ideas shared</div></div>
    </div>
    <div class="section-label">Badges</div>
    <div class="badge-grid" style="margin-bottom:18px">
      ${me.badges.map(b => `<div class="badge-item ${b.earned?'earned':''}"><div class="badge-icon">${b.icon}</div>${b.label}</div>`).join('')}
    </div>
    <div class="section-label">Preferences</div>
    <div class="prefs-card">
      ${Object.entries(me.prefs).map(([k,v]) => `<div class="pref-row"><div class="pref-key">${k}</div><div class="pref-val">${v}</div></div>`).join('')}
    </div>
    <button class="btn-primary" onclick="KinverlyApp.showToast('Profile editing coming soon!')">Edit my profile</button>
    <button class="btn-secondary" onclick="KinverlyApp.showToast('Animal picker coming soon!')">Change my animal</button>`;
}

// ── AVAILABILITY MODAL ──
function openAvailModal() {
  STATE.blockedDates = new Set();
  buildCalendar();
  document.getElementById('avail-modal').style.display = 'flex';
}
function closeModal() { document.getElementById('avail-modal').style.display = 'none'; }
function buildCalendar() {
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  let html = days.map(d => `<div class="cal-day-header">${d}</div>`).join('');
  [{ name:'July', month:6, start:12, end:31 }, { name:'Aug', month:7, start:1, end:2 }].forEach(m => {
    html += `<div class="cal-month-label">${m.name}</div>`;
    const first = new Date(2025, m.month, m.start).getDay();
    for (let i = 0; i < first; i++) html += `<div class="cal-day empty"></div>`;
    for (let d = m.start; d <= m.end; d++) {
      const key = `${m.name}-${d}`;
      html += `<div class="cal-day" id="cal-${key}" onclick="KinverlyApp.toggleDay('${key}')">${d}</div>`;
    }
  });
  document.getElementById('calendar-grid').innerHTML = html;
}
function toggleDay(key) {
  if (STATE.blockedDates.has(key)) { STATE.blockedDates.delete(key); document.getElementById('cal-'+key)?.classList.remove('blocked'); }
  else { STATE.blockedDates.add(key); document.getElementById('cal-'+key)?.classList.add('blocked'); }
}
async function submitAvailability() {
  closeModal();
  const count = STATE.blockedDates.size;
  await writeAvailability('beach', LOCAL.me.id, [...STATE.blockedDates]);
  showToast(count === 0 ? '✓ All dates available — saved!' : `✓ ${count} blackout date${count>1?'s':''} saved for everyone to see!`);
}

// ── COUNTDOWN ──
function updateCountdown() {
  const diff = new Date('2025-07-19T13:00:00') - new Date();
  if (diff <= 0) return;
  const el = id => document.getElementById(id);
  if (el('cd-days')) el('cd-days').textContent = Math.floor(diff/86400000);
  if (el('cd-hrs'))  el('cd-hrs').textContent  = String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');
  if (el('cd-min'))  el('cd-min').textContent  = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
}

function renderPage(id) {
  if (id==='home')             renderHome();
  if (id==='gatherings')       renderGatherings();
  if (id==='ideas')            renderIdeas();
  if (id==='fairness')         renderFairness();
  if (id==='profile')          renderProfile();
}

// ── INIT ──
async function init() {
  document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => goto(btn.dataset.page)));
  document.getElementById('profile-nav-btn')?.addEventListener('click', () => goto('profile'));
  document.getElementById('new-kinverly-btn')?.addEventListener('click', () => showToast('Gathering creator coming soon!'));

  // Instant first paint with local data
  renderHome(); renderGatherings(); renderIdeas(); renderFairness(); renderProfile();
  updateCountdown();
  setInterval(updateCountdown, 60000);
  goto('home');

  // Then connect Firebase
  try {
    const db = await getDB();
    await seedIfEmpty(db);
    attachListeners(db);
    console.log('[Kinverly] 🔥 Firebase live sync active');
  } catch (e) {
    console.warn('[Kinverly] Offline mode — add your Firebase config to enable live sync');
  }
}

// Public API for HTML onclick handlers
window.KinverlyApp = {
  goto, back, openGathering,
  toggleTask, toggleVote,
  openAvailModal, closeModal, toggleDay, submitAvailability,
  showToast, renderPage
};

document.addEventListener('DOMContentLoaded', init);
