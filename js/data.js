// data.js — all app data, easily editable by the family

window.KinverlyData = {

  // ── CURRENT USER ──
  me: {
    id: 'mom',
    name: 'Mom',
    animal: 'bunny',
    location: 'Nashville, TN',
    trait: 'The energizer',
    online: true,
    stats: { attended: 7, hosted: 2, ideas: 5 },
    prefs: { dietary: 'No restrictions', travel: 'Flexible', activity: 'Anything with the whole crew', notifications: 'All on' },
    badges: [
      { id: 'animal', icon: '🐰', label: 'The energizer', earned: true },
      { id: 'starter', icon: '🎉', label: 'Party starter', earned: true },
      { id: 'planner', icon: '📋', label: 'Head planner', earned: true },
      { id: 'host', icon: '👑', label: 'Host legend', earned: false },
      { id: 'trail', icon: '🗺️', label: 'Trailblazer', earned: false },
      { id: 'ideas', icon: '💡', label: 'Idea machine', earned: false },
      { id: 'never', icon: '🤝', label: 'Never missed', earned: false },
      { id: 'star', icon: '🌟', label: 'All-star', earned: false },
    ]
  },

  // ── FAMILY MEMBERS ──
  members: [
    { id: 'sara',    name: 'Sara',    animal: 'fox',      location: 'Nashville, TN',  online: true,  mode: 'in-person', pct: 100 },
    { id: 'marcus',  name: 'Marcus',  animal: 'bear',     location: 'Atlanta, GA',    online: true,  mode: 'local',     pct: 100 },
    { id: 'jen',     name: 'Jen',     animal: 'owl',      location: 'Chicago, IL',    online: false, mode: 'in-person', pct: 60  },
    { id: 'david',   name: 'David',   animal: 'penguin',  location: 'Denver, CO',     online: true,  mode: 'virtual',   pct: 100 },
    { id: 'amy',     name: 'Amy',     animal: 'cat',      location: 'Portland, OR',   online: false, mode: 'in-person', pct: 30  },
    { id: 'tom',     name: 'Tom',     animal: 'deer',     location: 'Seattle, WA',    online: true,  mode: 'in-person', pct: 75  },
    { id: 'lily',    name: 'Lily',    animal: 'frog',     location: 'Boston, MA',     online: false, mode: 'in-person', pct: 100 },
    { id: 'grace',   name: 'Grace',   animal: 'hedgehog', location: 'Austin, TX',     online: true,  mode: 'pending',   pct: 10  },
  ],

  // ── GATHERINGS ──
  gatherings: [
    {
      id: 'new-year',
      name: 'New Year Kickoff',
      month: 'Jan', day: 6,
      location: 'Nashville, TN',
      host: 'sara',
      type: 'planned',
      status: 'completed',
      theme: 'Game night',
      themePill: 'purple',
      attending: ['sara','marcus','jen','amy','tom','lily'],
      progress: 100,
    },
    {
      id: 'cookout',
      name: 'Summer Cookout',
      month: 'Jul', day: 19,
      location: 'Atlanta, GA',
      host: 'marcus',
      type: 'planned',
      status: 'next',
      theme: 'BBQ + games',
      themePill: 'amber',
      hybrid: true,
      attending: ['sara','marcus','jen','david','tom','lily'],
      progress: 72,
      tasks: [
        { id: 't1', title: 'Pick & reserve the location',    owner: 'marcus', note: 'Piedmont Park · Shelter B', done: true  },
        { id: 't2', title: 'Organize grill & equipment',     owner: 'tom',    note: 'Charcoal, tools, cooler',  done: true  },
        { id: 't3', title: 'Set up video call for David',    owner: 'sara',   note: 'Tablet stand + wifi spot', done: true  },
        { id: 't4', title: 'Mail remote kit to David',       owner: 'lily',   note: 'Snacks, game card, photo', done: true  },
        { id: 't5', title: 'Plan the group activity',        owner: 'jen',    note: 'Trivia night — setting up',done: false },
        { id: 't6', title: 'Collect food sign-up list',      owner: 'grace',  note: 'Waiting on RSVP first',   done: false },
        { id: 't7', title: 'Create shared photo album',      owner: 'amy',    note: 'Link shared after event',  done: false },
        { id: 't8', title: 'Send directions + parking info', owner: 'marcus', note: '1 week before + day-of',   done: false },
      ]
    },
    {
      id: 'beach',
      name: 'Summer Beach Week',
      month: 'Jul', day: 19,
      location: 'TBD — voting in progress',
      host: 'mom',
      type: 'bonus',
      status: 'planning',
      theme: 'Beach rental',
      themePill: 'blue',
      attending: [],
      progress: 15,
      beachMode: true,
      windows: [
        { dates: 'Jul 12–19', label: 'Blocked for 3', status: 'blocked' },
        { dates: 'Jul 19–26', label: 'Best window',   status: 'best'    },
        { dates: 'Jul 26–Aug 2', label: 'Lauren partial', status: 'partial' },
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
      id: 'fall',
      name: 'Fall Harvest',
      month: 'Oct', day: 5,
      location: 'TBD — your turn!',
      host: 'mom',
      type: 'planned',
      status: 'upcoming',
      theme: 'Planning opens Aug 1',
      themePill: 'amber',
      attending: [],
      progress: 0,
    },
    {
      id: 'winter',
      name: 'Winter Celebration',
      month: 'Dec', day: 21,
      location: 'TBD',
      host: 'jen',
      type: 'planned',
      status: 'upcoming',
      theme: 'Coming soon',
      themePill: 'gray',
      attending: [],
      progress: 0,
    },
  ],

  // ── IDEAS ──
  ideas: [
    { id: 'i1', icon: '🎲', title: 'Family trivia night',       sub: 'Teams, custom questions — works hybrid!',            votes: 7,  votePct: 85, voted: true  },
    { id: 'i2', icon: '🍳', title: 'Cook-off competition',      sub: 'Each sibling makes a dish, everyone rates blind',     votes: 6,  votePct: 72, voted: false },
    { id: 'i3', icon: '🧩', title: 'Escape room challenge',     sub: 'Book same-time rooms in different cities',            votes: 5,  votePct: 60, voted: false },
    { id: 'i4', icon: '🎨', title: 'Paint + sip night',         sub: 'Everyone paints the same image — compare results!',   votes: 4,  votePct: 48, voted: false },
    { id: 'i5', icon: '⛺', title: 'Camping weekend',           sub: 'National park, cabins for those who prefer',          votes: 3,  votePct: 36, voted: false },
    { id: 'i6', icon: '🏖️', title: 'Beach Olympics',            sub: 'Sand volleyball, paddleball, relay races',            votes: 2,  votePct: 24, voted: false },
  ],

  // ── FAIRNESS DATA ──
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
    poolPerPerson: 125,
    poolTotal: 1000,
    yearMiles: [
      { id: 'amy',   miles: 2840, pct: 90, color: '#D85A30' },
      { id: 'tom',   miles: 2650, pct: 84, color: '#D85A30' },
      { id: 'david', miles: 1720, pct: 55, color: '#E8A020' },
      { id: 'lily',  miles: 1340, pct: 42, color: '#2A6DB5' },
      { id: 'jen',   miles: 1100, pct: 35, color: '#2A6DB5' },
      { id: 'grace', miles: 820,  pct: 26, color: '#4A9E4C' },
    ]
  },

  // ── ACTIVITY FEED ──
  activity: [
    { member: 'amy',    text: 'added "Escape room challenge" to the idea bank',          time: '2h ago'     },
    { member: 'david',  text: 'RSVP\'d to Summer Cookout — joining virtually from Denver', time: '5h ago'     },
    { member: 'sara',   text: 'voted on 3 ideas — "Trivia night" is leading!',           time: 'Yesterday'  },
    { member: 'tom',    text: 'booked flights for the Summer Cookout — arriving Jul 18', time: '2 days ago' },
    { member: 'marcus', text: 'confirmed Piedmont Park Shelter B — reserved all day',    time: '3 days ago' },
  ]

};
