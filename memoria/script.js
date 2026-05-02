// ==================== MODULE REGISTRY ====================
const MODULES = [
  MATH_MODULE,
  PORTUGUES_MODULE,
  INGLES_MODULE,
  ANIMAIS_MODULE,
];

// ==================== GAME STATE ====================
const state = {
  module: null,
  difficulty: 'facil',
  mode: 'classic',
  cards: [],
  flipped: [],
  matched: 0,
  totalPairs: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  moves: 0,
  maxMoves: 0,
  timer: null,
  timeLeft: 0,
  startTime: null,
  isProcessing: false,
  gameActive: false
};

// ==================== DOM REFS ====================
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const screens = {
  menu: $('menu-screen'),
  game: $('game-screen'),
  results: $('results-screen')
};

// ==================== BACKGROUND ====================
function initBackground() {
  const canvas = $('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % canvas.width;
      const y = (i * 97.3) % canvas.height;
      const r = 1 + Math.sin(Date.now() * 0.001 + i) * 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${0.1 + Math.sin(Date.now() * 0.0005 + i) * 0.05})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
}

// ==================== NAVIGATION ====================
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name]?.classList.add('active');
}

// ==================== MENU SETUP ====================
function initMenu() {
  renderModuleCards();
  renderDifficultyButtons();

  // Classic mode is default
  $$('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      $$('.mode-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.mode = card.dataset.mode;
    });
  });

  $('start-btn').addEventListener('click', startGame);
}

function renderModuleCards() {
  const container = $('module-cards');
  container.innerHTML = '';

  MODULES.forEach((mod, i) => {
    const card = document.createElement('button');
    card.className = `module-card ${i === 0 ? 'selected' : ''}`;
    card.dataset.module = mod.id;
    card.innerHTML = `
      <div class="module-icon">${mod.icon}</div>
      <div class="module-info">
        <h3>${mod.name}</h3>
        <p>${mod.description}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      $$('.module-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.module = mod;
    });
    container.appendChild(card);
  });

  state.module = MODULES[0];
}

function renderDifficultyButtons() {
  const container = $('difficulty-buttons');
  container.innerHTML = '';

  const diffs = ['facil', 'medio', 'dificil', 'expert'];
  const labels = ['Fácil', 'Médio', 'Difícil', 'Expert'];
  const stars = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'];

  diffs.forEach((diff, i) => {
    const btn = document.createElement('button');
    btn.className = `diff-btn ${i === 0 ? 'selected' : ''}`;
    btn.dataset.diff = diff;
    btn.innerHTML = `<span class="diff-icon">${stars[i]}</span> ${labels[i]}`;
    btn.addEventListener('click', () => {
      $$('.diff-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.difficulty = diff;
    });
    container.appendChild(btn);
  });
}

// ==================== GAME START ====================
function startGame() {
  const mod = state.module || MODULES[0];
  const diff = mod.difficulties[state.difficulty];
  const pairs = diff.generate();

  state.cards = [];
  state.flipped = [];
  state.matched = 0;
  state.totalPairs = pairs.length;
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.moves = 0;
  state.maxMoves = pairs.length * 2;
  state.isProcessing = false;
  state.gameActive = false;

  if (state.mode === 'timed') {
    state.timeLeft = diff.time;
  }

  pairs.forEach(pair => {
    const cardA = typeof pair.cardA === 'object' ? pair.cardA : { content: pair.cardA, isImage: false };
    const cardB = typeof pair.cardB === 'object' ? pair.cardB : { content: pair.cardB, isImage: false };
    state.cards.push({ id: `a-${pair.pairId}`, pairId: pair.pairId, content: cardA.content, isImage: cardA.isImage, type: 'A', revealed: false, matched: false });
    state.cards.push({ id: `b-${pair.pairId}`, pairId: pair.pairId, content: cardB.content, isImage: cardB.isImage, type: 'B', revealed: false, matched: false });
  });

  for (let i = state.cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.cards[i], state.cards[j]] = [state.cards[j], state.cards[i]];
  }

  renderBoard(mod);
  updateGameUI();

  // Check if visual module - preload images first
  if (mod.visual) {
    showScreen('game');
    showImageLoading(() => {
      startPreviewPhase();
    });
  } else {
    showScreen('game');
    startPreviewPhase();
  }
}

function showImageLoading(callback) {
  const imageUrls = state.cards.filter(c => c.isImage).map(c => c.content);
  if (imageUrls.length === 0) { callback(); return; }

  // Show loading overlay
  const overlay = document.createElement('div');
  overlay.className = 'countdown-overlay';
  overlay.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:20px">
      <div class="card-spinner" style="width:48px;height:48px;border-width:4px"></div>
      <span style="color:#aaa;font-size:0.9rem">Carregando imagens...</span>
      <span style="color:#555;font-size:0.75rem" id="img-progress">0/${imageUrls.length}</span>
    </div>
  `;
  document.body.appendChild(overlay);

  let loaded = 0;
  const progressEl = overlay.querySelector('#img-progress');

  imageUrls.forEach(url => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loaded++;
      if (progressEl) progressEl.textContent = `${loaded}/${imageUrls.length}`;
      if (loaded >= imageUrls.length) {
        setTimeout(() => {
          overlay.remove();
          callback();
        }, 500);
      }
    };
    img.src = url;
  });

  // Timeout: start anyway after 20s
  setTimeout(() => {
    if (loaded < imageUrls.length) {
      overlay.remove();
      callback();
    }
  }, 20000);
}

function startPreviewPhase() {
  const mod = state.module;
  const isVisual = mod && mod.visual;
  const previewTimes = isVisual
    ? { facil: 6000, medio: 5000, dificil: 4000, expert: 3500 }
    : { facil: 4000, medio: 3000, dificil: 2000, expert: 1500 };
  const previewTime = previewTimes[state.difficulty] || 3000;

  // Flip all cards face-up for preview
  const cardEls = document.querySelectorAll('.card');
  cardEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('flipped');
      state.cards[i].revealed = true;
    }, i * 50);
  });

  // After preview time, flip all face-down with countdown
  setTimeout(() => {
    showCountdown(() => {
      cardEls.forEach((el, i) => {
        setTimeout(() => {
          el.classList.remove('flipped');
          state.cards[i].revealed = false;
        }, i * 30);
      });

      // After all flipped, activate game
      setTimeout(() => {
        state.gameActive = true;
        startTimer();
      }, cardEls.length * 30 + 300);
    });
  }, previewTime + cardEls.length * 50);
}

// ==================== BOARD RENDERING ====================
function renderBoard(mod) {
  const board = $('game-board');
  board.innerHTML = '';

  const cols = state.cards.length <= 12 ? 4 : state.cards.length <= 16 ? 4 : state.cards.length <= 20 ? 5 : 6;
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // Apply module theme
  document.documentElement.style.setProperty('--module-color', mod.color);
  document.documentElement.style.setProperty('--module-color-light', mod.colorLight);

  state.cards.forEach((card, index) => {
    const el = document.createElement('div');
    el.className = card.isImage ? 'card card-image' : 'card';
    el.dataset.index = index;
    el.style.animationDelay = `${index * 0.03}s`;

    el.innerHTML = card.isImage
      ? `
        <div class="card-inner">
          <div class="card-front">
            <span class="card-logo">${mod.icon}</span>
          </div>
          <div class="card-back">
            <img class="card-img" src="${card.content}" alt="memory card" fetchpriority="high" onload="this.nextElementSibling.style.display='none'" onerror="this.style.display='none';this.nextElementSibling.innerHTML='${mod.icon}';">
            <div class="card-loading">
              <div class="card-spinner"></div>
            </div>
          </div>
        </div>
      `
      : `
        <div class="card-inner">
          <div class="card-front">
            <span class="card-logo">${mod.icon}</span>
          </div>
          <div class="card-back">
            <span class="card-content">${card.content}</span>
          </div>
        </div>
      `;

    el.addEventListener('click', () => flipCard(index));
    board.appendChild(el);
  });
}

// ==================== CARD FLIP ====================
function flipCard(index) {
  if (state.isProcessing || !state.gameActive) return;

  const card = state.cards[index];
  if (card.revealed || card.matched) return;

  const el = document.querySelectorAll('.card')[index];
  el.classList.add('flipped');
  card.revealed = true;
  state.flipped.push({ index, card });

  if (state.flipped.length === 2) {
    state.moves++;
    state.isProcessing = true;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = state.flipped;

  if (first.card.pairId === second.card.pairId) {
    // Match!
    first.card.matched = true;
    second.card.matched = true;
    state.matched++;
    state.combo++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;

    const comboMultiplier = Math.min(state.combo, 5);
    state.score += 100 * comboMultiplier;

    const el1 = document.querySelectorAll('.card')[first.index];
    const el2 = document.querySelectorAll('.card')[second.index];
    el1.classList.add('matched');
    el2.classList.add('matched');

    spawnConfetti(el1);
    spawnConfetti(el2);

    state.flipped = [];
    state.isProcessing = false;
    updateGameUI();

    if (state.matched === state.totalPairs) {
      setTimeout(endGame, 800);
    }
  } else {
    // No match
    state.combo = 0;

    setTimeout(() => {
      const el1 = document.querySelectorAll('.card')[first.index];
      const el2 = document.querySelectorAll('.card')[second.index];
      el1.classList.add('no-match');
      el2.classList.add('no-match');

      setTimeout(() => {
        el1.classList.remove('flipped', 'no-match');
        el2.classList.remove('flipped', 'no-match');
        first.card.revealed = false;
        second.card.revealed = false;
        state.flipped = [];
        state.isProcessing = false;
        updateGameUI();
      }, 500);
    }, 800);
  }
}

// ==================== TIMER ====================
function startTimer() {
  if (state.mode === 'timed') {
    state.timer = setInterval(() => {
      state.timeLeft--;
      updateTimerDisplay();
      if (state.timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  } else {
    state.startTime = Date.now();
    state.timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      state.timeLeft = -elapsed; // negative = counting up
      updateTimerDisplay();
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(state.timer);
}

function updateTimerDisplay() {
  const display = $('timer-display');
  if (state.mode === 'timed') {
    const min = String(Math.floor(state.timeLeft / 60)).padStart(2, '0');
    const sec = String(state.timeLeft % 60).padStart(2, '0');
    display.textContent = `${min}:${sec}`;
    display.style.color = state.timeLeft <= 10 ? '#ef4444' : '#ddd';
  } else {
    const elapsed = Math.abs(state.timeLeft);
    const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const sec = String(elapsed % 60).padStart(2, '0');
    display.textContent = `${min}:${sec}`;
    display.style.color = '#ddd';
  }
}

// ==================== UI UPDATE ====================
function updateGameUI() {
  const mod = state.module || MODULES[0];

  $('module-badge').textContent = `${mod.icon} ${mod.name}`;
  $('diff-badge').textContent = mod.difficulties[state.difficulty].label;

  $('score-display').textContent = state.score;
  $('moves-display').textContent = state.moves;

  const comboEl = $('combo-display');
  if (state.combo >= 2) {
    comboEl.textContent = `x${state.combo}`;
    comboEl.style.opacity = '1';
    comboEl.style.color = state.combo >= 4 ? '#ef4444' : state.combo >= 3 ? '#f59e0b' : '#22c55e';
  } else {
    comboEl.style.opacity = '0.3';
    comboEl.textContent = 'x1';
  }

  // Progress
  const pct = (state.matched / state.totalPairs) * 100;
  $('progress-fill').style.width = `${pct}%`;
  $('progress-text').textContent = `${state.matched}/${state.totalPairs}`;

  updateTimerDisplay();
}

// ==================== END GAME ====================
function endGame() {
  stopTimer();
  state.gameActive = false;

  const won = state.matched === state.totalPairs;
  const time = state.mode === 'timed'
    ? `${Math.floor(state.timeLeft / 60)}:${String(state.timeLeft % 60).padStart(2, '0')} restante`
    : formatTime(Math.abs(state.timeLeft));

  const accuracy = state.moves > 0 ? Math.round((state.matched / state.moves) * 100) : 0;

  $('results-icon').textContent = won ? '🏆' : '😔';
  $('results-title').textContent = won ? 'Parabéns!' : 'Fim de Jogo!';
  $('results-subtitle').textContent = won ? 'Você encontrou todos os pares!' : 'Tente novamente para melhorar!';

  $('result-score').textContent = state.score;
  $('result-moves').textContent = state.moves;
  $('result-time').textContent = time;
  $('result-combo').textContent = `x${state.maxCombo}`;
  $('result-accuracy').textContent = `${accuracy}%`;

  saveScore();
  showScreen('results');
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

// ==================== SCORES ====================
function saveScore() {
  const key = `memoria-scores-${state.module?.id || 'math'}`;
  const scores = JSON.parse(localStorage.getItem(key) || '[]');
  scores.push({
    score: state.score,
    moves: state.moves,
    time: state.timeLeft,
    combo: state.maxCombo,
    difficulty: state.difficulty,
    mode: state.mode,
    pairs: state.totalPairs,
    date: Date.now()
  });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(scores.slice(0, 20)));
}

// ==================== COUNTDOWN ====================
function showCountdown(callback) {
  const overlay = document.createElement('div');
  overlay.className = 'countdown-overlay';
  document.body.appendChild(overlay);

  const steps = [
    { text: '3', duration: 800 },
    { text: '2', duration: 800 },
    { text: '1', duration: 800 },
    { text: 'VAI!', duration: 500, isText: true }
  ];

  let i = 0;
  function next() {
    if (i >= steps.length) {
      overlay.remove();
      callback();
      return;
    }
    const step = steps[i];
    overlay.innerHTML = `<span class="${step.isText ? 'countdown-text' : 'countdown-number'}">${step.text}</span>`;
    i++;
    setTimeout(next, step.duration);
  }

  next();
}

// ==================== EFFECTS ====================
function spawnConfetti(el) {
  const rect = el.getBoundingClientRect();
  const container = document.createElement('div');
  container.className = 'confetti-container';
  container.style.position = 'fixed';
  container.style.left = `${rect.left + rect.width / 2}px`;
  container.style.top = `${rect.top + rect.height / 2}px`;
  container.style.pointerEvents = 'none';
  container.style.zIndex = '100';

  const colors = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#ec4899'];
  for (let i = 0; i < 8; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.setProperty('--tx', `${(Math.random() - 0.5) * 120}px`);
    c.style.setProperty('--ty', `${30 + Math.random() * 80}px`);
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = `${Math.random() * 0.2}s`;
    container.appendChild(c);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 1200);
}

// ==================== INIT ====================
function init() {
  initBackground();
  initMenu();

  // Back to menu
  $('back-to-menu').addEventListener('click', () => {
    stopTimer();
    showScreen('menu');
  });

  // Results buttons
  $('results-menu').addEventListener('click', () => showScreen('menu'));
  $('results-retry').addEventListener('click', startGame);
}

document.addEventListener('DOMContentLoaded', init);
