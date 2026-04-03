// profile.js — Kinverly v2
// Handles: member login/selection, edit profile, animal picker + quiz

window.KinverlyProfile = (function () {

  // ── QUIZ QUESTIONS ──────────────────────────────────────────
  const QUIZ = [
    {
      q: "Your ideal family gathering is...",
      opts: [
        { text: "Outdoors, active, spontaneous",   scores: { frog:3, deer:2, fox:1 } },
        { text: "Cozy, warm, everyone together",   scores: { bear:3, hedgehog:2, bunny:1 } },
        { text: "Games, laughs, friendly chaos",   scores: { penguin:3, bunny:2, frog:1 } },
        { text: "Relaxed, deep conversations",     scores: { owl:3, deer:2, panda:1 } },
      ]
    },
    {
      q: "When planning a trip you...",
      opts: [
        { text: "Have a detailed spreadsheet ready", scores: { fox:3, owl:2, bear:1 } },
        { text: "Show up and figure it out",          scores: { frog:3, bunny:2, penguin:1 } },
        { text: "Make sure everyone is comfortable", scores: { panda:3, bear:2, hedgehog:1 } },
        { text: "Research every hidden gem",          scores: { owl:3, deer:2, fox:1 } },
      ]
    },
    {
      q: "Your family role is usually...",
      opts: [
        { text: "The one who makes everyone laugh",  scores: { penguin:3, bunny:2, frog:1 } },
        { text: "The organiser keeping it together", scores: { fox:3, owl:2, bear:1 } },
        { text: "The peacemaker, warm and steady",   scores: { panda:3, bear:2, hedgehog:1 } },
        { text: "The quiet one who notices everything", scores: { deer:3, cat:2, owl:1 } },
      ]
    },
    {
      q: "Pick a vibe for the perfect evening:",
      opts: [
        { text: "Board games and snacks at home",    scores: { hedgehog:3, bear:2, panda:1 } },
        { text: "Dancing or karaoke",                scores: { penguin:3, bunny:2, fox:1 } },
        { text: "Bonfire under the stars",           scores: { frog:3, deer:2, cat:1 } },
        { text: "Long dinner, great conversation",   scores: { owl:3, panda:2, deer:1 } },
      ]
    },
  ];

  const ANIMAL_NAMES = {
    fox: 'Fox', bear: 'Bear', bunny: 'Bunny', owl: 'Owl', cat: 'Cat',
    panda: 'Panda', frog: 'Frog', penguin: 'Penguin', hedgehog: 'Hedgehog', deer: 'Deer'
  };

  const ANIMAL_TRAITS = {
    fox: 'The planner', bear: 'The hugger', bunny: 'The energizer',
    owl: 'The wise one', cat: 'The cool one', panda: 'The peacemaker',
    frog: 'The adventurer', penguin: 'The charmer', hedgehog: 'The homebody', deer: 'The gentle soul'
  };

  let quizStep = 0;
  let quizScores = {};
  let quizMode = false; // true = quiz, false = grid pick

  // ── MEMBER LOGIN SCREEN ──────────────────────────────────────
  function showLoginScreen() {
    const overlay = document.getElementById('login-overlay');
    if (!overlay) return;

    const members = window.KinverlyData?.members || [];
    const A = window.Animals;

    overlay.innerHTML = `
      <div class="login-box">
        <div class="login-logo">Kinverly<span style="color:rgba(255,255,255,0.5)">.</span></div>
        <div class="login-tagline">YOUR PEOPLE. YOUR PLACE. YOUR TURN.</div>
        <div class="login-koro">
          <svg viewBox="0 0 100 100" width="72" height="72">
            <circle cx="50" cy="50" r="50" fill="#F0C030"/>
            <circle cx="50" cy="55" r="28" fill="#D4A020"/>
            <circle cx="36" cy="32" r="10" fill="#D4A020"/>
            <circle cx="64" cy="32" r="10" fill="#D4A020"/>
            <circle cx="36" cy="32" r="6" fill="#E8B828"/>
            <circle cx="64" cy="32" r="6" fill="#E8B828"/>
            <ellipse cx="50" cy="65" rx="16" ry="11" fill="#E8C840"/>
            <circle cx="43" cy="51" r="5" fill="#1E1433"/>
            <circle cx="57" cy="51" r="5" fill="#1E1433"/>
            <circle cx="44.5" cy="49.5" r="2" fill="#fff"/>
            <circle cx="58.5" cy="49.5" r="2" fill="#fff"/>
            <ellipse cx="50" cy="61" rx="4" ry="3" fill="#C08010"/>
            <path d="M43,66 Q50,72 57,66" stroke="#B07010" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="login-prompt">Who are you?</div>
        <div class="login-grid" id="login-member-grid">
          ${members.map(m => `
            <div class="login-member-chip" onclick="KinverlyProfile.selectMember('${m.id}')">
              <div class="login-av">
                <svg viewBox="0 0 100 100" width="56" height="56">${A.paths(m.animal)}</svg>
              </div>
              <div class="login-member-name">${m.name}</div>
            </div>
          `).join('')}
        </div>
        <div class="login-new" onclick="KinverlyProfile.showNewMemberFlow()">
          + I'm not listed — add me
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
  }

  function selectMember(id) {
    const members = window.KinverlyData?.members || [];
    const member = members.find(m => m.id === id);
    if (!member) return;

    // Save to localStorage so they stay logged in
    localStorage.setItem('kinverly_user_id', id);
    localStorage.setItem('kinverly_user_name', member.name);

    // Update the global "me" reference
    if (window.KinverlyData) {
      window.KinverlyData.me = {
        ...window.KinverlyData.me,
        id: member.id,
        name: member.name,
        animal: member.animal,
        location: member.location,
        trait: ANIMAL_TRAITS[member.animal] || 'Family member',
      };
    }

    // Hide login screen
    document.getElementById('login-overlay').style.display = 'none';

    // Re-render the app with the correct user
    if (window.KinverlyApp) {
      window.KinverlyApp.renderPage('home');
      window.KinverlyApp.renderPage('profile');
    }

    window.KinverlyApp?.showToast(`Welcome back, ${member.name}! 👋`);
  }

  function showNewMemberFlow() {
    const overlay = document.getElementById('login-overlay');
    const A = window.Animals;
    const allAnimals = ['fox','bear','bunny','owl','cat','panda','frog','penguin','hedgehog','deer'];
    const takenAnimals = (window.KinverlyData?.members || []).map(m => m.animal);
    const availableAnimals = allAnimals.filter(a => !takenAnimals.includes(a));
    // If all taken, allow all
    const animals = availableAnimals.length > 0 ? availableAnimals : allAnimals;

    overlay.innerHTML = `
      <div class="login-box" style="gap:0">
        <div class="login-logo" style="font-size:32px;margin-bottom:4px">Kinverly<span style="color:rgba(255,255,255,0.5)">.</span></div>
        <div class="login-tagline" style="margin-bottom:20px">JOIN THE FLOCK</div>

        <div id="new-member-step" data-step="1">

          <div style="width:100%;margin-bottom:20px">
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Your name</div>
            <input id="nm-name" type="text" placeholder="e.g. Sara or Aunt Sara"
              style="width:100%;padding:12px 16px;border-radius:12px;border:2px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);color:#fff;font-size:16px;font-family:var(--font-body);outline:none"
              oninput="document.getElementById('nm-name-err').style.display='none'"
              onfocus="this.style.borderColor='rgba(240,192,48,0.6)'"
              onblur="this.style.borderColor='rgba(255,255,255,0.2)'">
            <div id="nm-name-err" style="display:none;color:#F0C030;font-size:12px;margin-top:6px;font-weight:600">Please enter your name</div>
          </div>

          <div style="width:100%;margin-bottom:20px">
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Your city</div>
            <input id="nm-location" type="text" placeholder="e.g. Portland, OR"
              style="width:100%;padding:12px 16px;border-radius:12px;border:2px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);color:#fff;font-size:16px;font-family:var(--font-body);outline:none"
              onfocus="this.style.borderColor='rgba(240,192,48,0.6)'"
              onblur="this.style.borderColor='rgba(255,255,255,0.2)'">
          </div>

          <div style="width:100%;margin-bottom:20px">
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Pick your animal</div>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px" id="nm-animal-grid">
              ${animals.map(a => `
                <div class="nm-animal-opt" id="nma-${a}" onclick="KinverlyProfile.selectNewAnimal('${a}')"
                  style="border-radius:12px;padding:8px 4px;text-align:center;cursor:pointer;border:2px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.08);transition:all .15s">
                  <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;margin:0 auto 4px;border:2px solid rgba(255,255,255,0.2)">
                    <svg viewBox="0 0 100 100" width="44" height="44">${A.paths(a)}</svg>
                  </div>
                  <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.7)">${window.KinverlyProfile._animalName(a)}</div>
                </div>
              `).join('')}
            </div>
            <div id="nm-animal-err" style="display:none;color:#F0C030;font-size:12px;margin-top:8px;font-weight:600">Please pick an animal</div>
          </div>

          <button onclick="KinverlyProfile.submitNewMember()"
            style="width:100%;padding:13px;border-radius:12px;background:#F0C030;color:#1E1433;font-size:15px;font-weight:800;border:none;cursor:pointer;font-family:var(--font-body);margin-bottom:10px">
            Join the flock!
          </button>

          <div onclick="KinverlyProfile.showLoginScreen()"
            style="font-size:13px;color:rgba(255,255,255,0.5);cursor:pointer;text-align:center;text-decoration:underline;text-underline-offset:3px">
            Back to member list
          </div>

        </div>
      </div>
    `;
    overlay.style.display = 'flex';
    window._newMemberAnimal = null;
  }

  // Expose animal name helper for use in template
  window.KinverlyProfile._animalName = function(a) {
    return {fox:'Fox',bear:'Bear',bunny:'Bunny',owl:'Owl',cat:'Cat',
            panda:'Panda',frog:'Frog',penguin:'Penguin',hedgehog:'Hedgehog',deer:'Deer'}[a] || a;
  };

  function selectNewAnimal(animal) {
    window._newMemberAnimal = animal;
    document.querySelectorAll('.nm-animal-opt').forEach(el => {
      el.style.borderColor = 'rgba(255,255,255,0.15)';
      el.style.background = 'rgba(255,255,255,0.08)';
      el.style.transform = 'scale(1)';
    });
    const el = document.getElementById('nma-' + animal);
    if (el) {
      el.style.borderColor = '#F0C030';
      el.style.background = 'rgba(240,192,48,0.2)';
      el.style.transform = 'scale(1.08)';
    }
    document.getElementById('nm-animal-err').style.display = 'none';
  }

  async function submitNewMember() {
    const name = document.getElementById('nm-name')?.value.trim();
    const location = document.getElementById('nm-location')?.value.trim() || 'Somewhere wonderful';
    const animal = window._newMemberAnimal;

    // Validate
    if (!name) {
      document.getElementById('nm-name-err').style.display = 'block';
      return;
    }
    if (!animal) {
      document.getElementById('nm-animal-err').style.display = 'block';
      return;
    }

    // Create new member object
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now().toString(36);
    const newMember = { id, name, animal, location, online: false, mode: 'in-person', pct: 0 };

    // Add to local data
    if (window.KinverlyData) {
      window.KinverlyData.members = window.KinverlyData.members || [];
      window.KinverlyData.members.push(newMember);
    }

    // Save to Firebase
    try {
      const db = await (async () => {
        let t = 0;
        while (!window.__kinverlyDB && t++ < 20) await new Promise(r => setTimeout(r, 100));
        return window.__kinverlyDB;
      })();
      if (db) {
        const { doc, setDoc, serverTimestamp } =
          await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        await setDoc(doc(db, 'members', id), { ...newMember, createdAt: serverTimestamp() });
      }
    } catch(e) { console.warn('[Kinverly] New member save offline:', e.message); }

    // Log them in
    selectMember(id);
    window.KinverlyApp?.showToast('Welcome to the flock, ' + name + '! 🎉');
  }

  // ── EDIT PROFILE MODAL ───────────────────────────────────────
  function showEditProfile() {
    const me = window.KinverlyData?.me || {};
    const modal = document.getElementById('edit-profile-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="ep-modal">
        <div class="ep-header">
          <div class="ep-title">Edit profile</div>
          <button class="ep-close" onclick="KinverlyProfile.closeEditProfile()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="ep-avatar-section" onclick="KinverlyProfile.showAnimalPicker()">
          <div class="ep-av-wrap">
            <div id="ep-av-preview" style="width:72px;height:72px;border-radius:50%;overflow:hidden;border:3px solid #F0C030">
              <svg viewBox="0 0 100 100" width="72" height="72">${window.Animals.paths(me.animal || 'bunny')}</svg>
            </div>
            <div class="ep-av-change-btn">Change animal</div>
          </div>
        </div>

        <div class="ep-body">
          <div class="ep-field">
            <div class="ep-label">Display name</div>
            <input class="ep-input" id="ep-name" type="text" value="${me.name || ''}" placeholder="Your name">
          </div>
          <div class="ep-field">
            <div class="ep-label">Nickname <span class="ep-optional">optional</span></div>
            <input class="ep-input" id="ep-nickname" type="text" value="${me.nickname || ''}" placeholder="e.g. Mama Bear, Big D">
          </div>
          <div class="ep-field">
            <div class="ep-label">City / location</div>
            <input class="ep-input" id="ep-location" type="text" value="${me.location || ''}" placeholder="e.g. Nashville, TN">
          </div>

          <div class="ep-divider"></div>

          <div class="ep-field">
            <div class="ep-label">Travel flexibility</div>
            <div class="ep-chips" id="ep-travel">
              ${['Very flexible','Flexible','Somewhat limited','Hard to travel'].map(v =>
                `<div class="ep-chip ${me.prefs?.Travel === v ? 'selected' : ''}" onclick="KinverlyProfile.selectChip('ep-travel','${v}')">${v}</div>`
              ).join('')}
            </div>
          </div>

          <div class="ep-field">
            <div class="ep-label">Favourite activity</div>
            <div class="ep-chips" id="ep-activity">
              ${['Outdoors + nature','Games + trivia','Food + cooking','Music + dancing','Movies + TV','Arts + crafts','Sports','Anything together'].map(v =>
                `<div class="ep-chip ${me.prefs?.['Fav activity'] === v ? 'selected' : ''}" onclick="KinverlyProfile.selectChip('ep-activity','${v}')">${v}</div>`
              ).join('')}
            </div>
          </div>

          <div class="ep-field">
            <div class="ep-label">Notifications</div>
            <div class="ep-chips" id="ep-notifs">
              ${['All on','Gatherings only','Ideas only','Off'].map(v =>
                `<div class="ep-chip ${me.prefs?.Notifications === v ? 'selected' : ''}" onclick="KinverlyProfile.selectChip('ep-notifs','${v}')">${v}</div>`
              ).join('')}
            </div>
          </div>
        </div>

        <div style="padding:0 20px 32px">
          <button class="ep-save-btn" onclick="KinverlyProfile.saveProfile()">Save changes</button>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  }

  function selectChip(groupId, value) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll('.ep-chip').forEach(c => {
      c.classList.toggle('selected', c.textContent === value);
    });
  }

  function getSelectedChip(groupId) {
    const group = document.getElementById(groupId);
    if (!group) return null;
    return group.querySelector('.ep-chip.selected')?.textContent || null;
  }

  function saveProfile() {
    const me = window.KinverlyData?.me;
    if (!me) return;

    const name     = document.getElementById('ep-name')?.value.trim() || me.name;
    const nickname = document.getElementById('ep-nickname')?.value.trim();
    const location = document.getElementById('ep-location')?.value.trim() || me.location;
    const travel   = getSelectedChip('ep-travel') || me.prefs?.Travel;
    const activity = getSelectedChip('ep-activity') || me.prefs?.['Fav activity'];
    const notifs   = getSelectedChip('ep-notifs') || me.prefs?.Notifications;

    // Update local data
    me.name     = name;
    me.nickname = nickname;
    me.location = location;
    me.prefs = {
      ...me.prefs,
      Travel: travel,
      'Fav activity': activity,
      Notifications: notifs,
    };

    // Persist to localStorage
    localStorage.setItem('kinverly_profile', JSON.stringify({
      name, nickname, location,
      animal: me.animal,
      prefs: me.prefs
    }));

    // Also save to Firebase if connected
    saveProfileToFirebase(me);

    closeEditProfile();
    window.KinverlyApp?.renderPage('profile');
    window.KinverlyApp?.showToast('Profile saved! ✓');
  }

  async function saveProfileToFirebase(me) {
    try {
      const db = await getDB();
      const { doc, setDoc, serverTimestamp } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await setDoc(doc(db, 'profiles', me.id), {
        name:     me.name,
        nickname: me.nickname || '',
        location: me.location,
        animal:   me.animal,
        prefs:    me.prefs,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('[Kinverly] Profile save offline:', e.message);
    }
  }

  function closeEditProfile() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) modal.style.display = 'none';
  }

  // ── ANIMAL PICKER ────────────────────────────────────────────
  function showAnimalPicker() {
    closeEditProfile();
    quizStep = 0;
    quizScores = {};
    quizMode = false;

    const modal = document.getElementById('animal-picker-modal');
    if (!modal) return;

    renderAnimalPickerHome(modal);
    modal.style.display = 'flex';
  }

  function renderAnimalPickerHome(modal) {
    const A = window.Animals;
    const animals = Object.keys(ANIMAL_NAMES);
    const me = window.KinverlyData?.me;
    const current = me?.animal || 'bunny';

    modal.innerHTML = `
      <div class="ap-modal">
        <div class="ep-header">
          <div class="ep-title">Choose your animal</div>
          <button class="ep-close" onclick="KinverlyProfile.closeAnimalPicker()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style="padding:0 20px 12px">
          <div class="ap-mode-row">
            <button class="ap-mode-btn active" id="btn-grid" onclick="KinverlyProfile.switchMode('grid')">Pick one</button>
            <button class="ap-mode-btn" id="btn-quiz" onclick="KinverlyProfile.switchMode('quiz')">Take the quiz</button>
          </div>
        </div>

        <div id="ap-content" style="padding:0 20px;overflow-y:auto;flex:1">
          <div class="ap-grid" id="ap-animal-grid">
            ${animals.map(a => `
              <div class="ap-animal-card ${a === current ? 'selected' : ''}" id="apcard-${a}"
                   onclick="KinverlyProfile.selectAnimal('${a}')">
                <div style="width:64px;height:64px;border-radius:50%;overflow:hidden;margin:0 auto 6px">
                  <svg viewBox="0 0 100 100" width="64" height="64">${A.paths(a)}</svg>
                </div>
                <div class="ap-animal-name">${ANIMAL_NAMES[a]}</div>
                <div class="ap-animal-trait">${ANIMAL_TRAITS[a]}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="padding:16px 20px 32px">
          <button class="ep-save-btn" id="ap-confirm-btn" onclick="KinverlyProfile.confirmAnimal()">
            Confirm animal
          </button>
        </div>
      </div>
    `;
  }

  let pendingAnimal = null;

  function selectAnimal(animal) {
    pendingAnimal = animal;
    document.querySelectorAll('.ap-animal-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('apcard-' + animal)?.classList.add('selected');
  }

  function switchMode(mode) {
    document.getElementById('btn-grid')?.classList.toggle('active', mode === 'grid');
    document.getElementById('btn-quiz')?.classList.toggle('active', mode === 'quiz');

    if (mode === 'quiz') {
      quizMode = true;
      quizStep = 0;
      quizScores = {};
      renderQuizStep();
    } else {
      quizMode = false;
      const A = window.Animals;
      const animals = Object.keys(ANIMAL_NAMES);
      const me = window.KinverlyData?.me;
      const current = pendingAnimal || me?.animal || 'bunny';
      document.getElementById('ap-content').innerHTML = `
        <div class="ap-grid" id="ap-animal-grid">
          ${animals.map(a => `
            <div class="ap-animal-card ${a === current ? 'selected' : ''}" id="apcard-${a}"
                 onclick="KinverlyProfile.selectAnimal('${a}')">
              <div style="width:64px;height:64px;border-radius:50%;overflow:hidden;margin:0 auto 6px">
                <svg viewBox="0 0 100 100" width="64" height="64">${A.paths(a)}</svg>
              </div>
              <div class="ap-animal-name">${ANIMAL_NAMES[a]}</div>
              <div class="ap-animal-trait">${ANIMAL_TRAITS[a]}</div>
            </div>
          `).join('')}
        </div>`;
      document.getElementById('ap-confirm-btn').style.display = 'block';
    }
  }

  function renderQuizStep() {
    const q = QUIZ[quizStep];
    if (!q) { showQuizResult(); return; }

    const content = document.getElementById('ap-content');
    if (!content) return;

    const pct = Math.round(((quizStep) / QUIZ.length) * 100);

    content.innerHTML = `
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="quiz-step-label">Question ${quizStep + 1} of ${QUIZ.length}</div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options">
        ${q.opts.map((o, i) => `
          <div class="quiz-opt" id="qopt-${i}" onclick="KinverlyProfile.answerQuiz(${i})">
            ${o.text}
          </div>
        `).join('')}
      </div>
    `;
    document.getElementById('ap-confirm-btn').style.display = 'none';
  }

  function answerQuiz(optIndex) {
    const q = QUIZ[quizStep];
    const scores = q.opts[optIndex].scores;

    // Animate selection
    document.querySelectorAll('.quiz-opt').forEach((el, i) => {
      el.classList.toggle('selected', i === optIndex);
    });

    // Accumulate scores
    Object.entries(scores).forEach(([animal, pts]) => {
      quizScores[animal] = (quizScores[animal] || 0) + pts;
    });

    setTimeout(() => {
      quizStep++;
      renderQuizStep();
    }, 400);
  }

  function showQuizResult() {
    // Find top scoring animal
    const winner = Object.entries(quizScores)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'bear';

    pendingAnimal = winner;
    const A = window.Animals;
    const content = document.getElementById('ap-content');

    content.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-label">You got...</div>
        <div style="width:90px;height:90px;border-radius:50%;overflow:hidden;margin:0 auto 12px;border:3px solid #F0C030">
          <svg viewBox="0 0 100 100" width="90" height="90">${A.paths(winner)}</svg>
        </div>
        <div class="quiz-result-name">${ANIMAL_NAMES[winner]}</div>
        <div class="quiz-result-trait">${ANIMAL_TRAITS[winner]}</div>
        <div class="quiz-result-desc">${getAnimalDesc(winner)}</div>
        <button class="quiz-retry" onclick="KinverlyProfile.switchMode('quiz')">Retake quiz</button>
        <button class="quiz-grid-btn" onclick="KinverlyProfile.switchMode('grid')">Browse all animals instead</button>
      </div>
    `;
    document.getElementById('ap-confirm-btn').style.display = 'block';
    document.getElementById('ap-confirm-btn').textContent = `Choose ${ANIMAL_NAMES[winner]}`;
  }

  function getAnimalDesc(animal) {
    const descs = {
      fox:      "Sharp, strategic, and always three steps ahead. The flock's natural organiser.",
      bear:     "Warm, dependable, and everyone's safe landing. The heart of any gathering.",
      bunny:    "Full of energy and big ideas. The one who turns a plan into a party.",
      owl:      "Thoughtful, perceptive, and quietly brilliant. The flock's wise counsel.",
      cat:      "Effortlessly cool with a soft interior. Independent but always shows up.",
      panda:    "Calm, balanced, and endlessly kind. The flock's natural peacemaker.",
      frog:     "Spontaneous, outdoorsy, and always up for the next adventure.",
      penguin:  "Charming, funny, and magnetic. The one who makes every gathering memorable.",
      hedgehog: "Cosy, warm, and deeply reliable. Happiest when the whole family is together.",
      deer:     "Gentle, graceful, and a wonderful listener. The quiet soul who remembers everything.",
    };
    return descs[animal] || '';
  }

  function confirmAnimal() {
    const animal = pendingAnimal || window.KinverlyData?.me?.animal;
    if (!animal) return;

    const me = window.KinverlyData?.me;
    if (me) {
      me.animal = animal;
      me.trait  = ANIMAL_TRAITS[animal];
    }

    // Persist
    const saved = JSON.parse(localStorage.getItem('kinverly_profile') || '{}');
    saved.animal = animal;
    localStorage.setItem('kinverly_profile', JSON.stringify(saved));

    saveProfileToFirebase(me);
    closeAnimalPicker();

    // Re-open edit profile with new animal showing
    setTimeout(() => {
      showEditProfile();
      window.KinverlyApp?.renderPage('profile');
    }, 200);

    window.KinverlyApp?.showToast(`${ANIMAL_NAMES[animal]} saved! 🎉`);
  }

  function closeAnimalPicker() {
    const modal = document.getElementById('animal-picker-modal');
    if (modal) modal.style.display = 'none';
  }

  // ── HELPERS ──────────────────────────────────────────────────
  async function getDB() {
    let tries = 0;
    while (!window.__kinverlyDB && tries < 20) {
      await new Promise(r => setTimeout(r, 100));
      tries++;
    }
    if (!window.__kinverlyDB) throw new Error('Firebase not ready');
    return window.__kinverlyDB;
  }

  // ── RESTORE SAVED PROFILE ────────────────────────────────────
  function restoreSavedProfile() {
    try {
      const userId = localStorage.getItem('kinverly_user_id');
      const savedProfile = localStorage.getItem('kinverly_profile');

      if (userId && window.KinverlyData) {
        // Find the member
        const member = window.KinverlyData.members?.find(m => m.id === userId);
        if (member) {
          window.KinverlyData.me = {
            ...window.KinverlyData.me,
            id:       member.id,
            name:     member.name,
            animal:   member.animal,
            location: member.location,
            trait:    ANIMAL_TRAITS[member.animal] || 'Family member',
          };
        }
      }

      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (window.KinverlyData?.me) {
          if (p.name)     window.KinverlyData.me.name     = p.name;
          if (p.animal)   window.KinverlyData.me.animal   = p.animal;
          if (p.location) window.KinverlyData.me.location = p.location;
          if (p.nickname) window.KinverlyData.me.nickname = p.nickname;
          if (p.prefs)    window.KinverlyData.me.prefs    = { ...window.KinverlyData.me.prefs, ...p.prefs };
        }
      }

      return !!userId;
    } catch (e) {
      return false;
    }
  }

  // Public API
  return {
    showLoginScreen,
    selectMember,
    showNewMemberFlow,
    showEditProfile,
    closeEditProfile,
    saveProfile,
    selectChip,
    showAnimalPicker,
    closeAnimalPicker,
    selectAnimal,
    switchMode,
    answerQuiz,
    confirmAnimal,
    restoreSavedProfile,
  };

})();
