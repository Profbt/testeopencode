// ==================== GEODATA ====================
const GEO_DATA = {
  name: "Brasil",
  type: "country",
  width: 800,
  height: 900,
  regions: [
    { id: "norte", name: "Norte", color: "#22c55e" },
    { id: "nordeste", name: "Nordeste", color: "#eab308" },
    { id: "centro-oeste", name: "Centro-Oeste", color: "#a855f7" },
    { id: "sudeste", name: "Sudeste", color: "#3b82f6" },
    { id: "sul", name: "Sul", color: "#ef4444" }
  ],
  states: [
    { id: "AC", name: "Acre", capital: "Rio Branco", region: "norte", cx: 90, cy: 400, path: "M 60 400 L 90 380 L 130 390 L 120 420 L 80 440 L 50 420 Z" },
    { id: "AM", name: "Amazonas", capital: "Manaus", region: "norte", cx: 145, cy: 310, path: "M 60 260 L 150 230 L 220 250 L 260 300 L 240 370 L 200 400 L 130 390 L 90 380 L 60 400 L 30 350 L 40 290 Z" },
    { id: "RR", name: "Roraima", capital: "Boa Vista", region: "norte", cx: 170, cy: 140, path: "M 150 100 L 180 80 L 200 110 L 210 160 L 190 200 L 150 230 L 130 180 L 140 140 Z" },
    { id: "PA", name: "Pará", capital: "Belém", region: "norte", cx: 320, cy: 180, path: "M 200 110 L 280 90 L 360 100 L 400 130 L 420 180 L 400 230 L 350 260 L 260 300 L 220 250 L 190 200 L 210 160 Z" },
    { id: "AP", name: "Amapá", capital: "Macapá", region: "norte", cx: 418, cy: 90, path: "M 400 60 L 430 50 L 450 80 L 440 120 L 420 140 L 400 130 L 380 100 Z" },
    { id: "TO", name: "Tocantins", capital: "Palmas", region: "norte", cx: 390, cy: 330, path: "M 360 260 L 420 250 L 440 300 L 450 360 L 420 400 L 370 390 L 350 340 L 340 290 Z" },
    { id: "MA", name: "Maranhão", capital: "São Luís", region: "nordeste", cx: 480, cy: 240, path: "M 420 180 L 480 160 L 520 180 L 530 240 L 510 290 L 470 310 L 440 300 L 420 250 L 420 180 Z" },
    { id: "PI", name: "Piauí", capital: "Teresina", region: "nordeste", cx: 490, cy: 370, path: "M 470 310 L 510 290 L 530 340 L 540 400 L 510 440 L 470 420 L 450 380 L 450 340 Z" },
    { id: "CE", name: "Ceará", capital: "Fortaleza", region: "nordeste", cx: 575, cy: 210, path: "M 530 180 L 580 160 L 620 180 L 610 230 L 580 260 L 540 270 L 520 240 L 530 240 Z" },
    { id: "RN", name: "Rio Grande do Norte", capital: "Natal", region: "nordeste", cx: 645, cy: 200, path: "M 620 180 L 660 170 L 680 200 L 670 240 L 640 250 L 610 230 Z" },
    { id: "PB", name: "Paraíba", capital: "João Pessoa", region: "nordeste", cx: 615, cy: 270, path: "M 610 230 L 640 250 L 660 280 L 640 310 L 600 300 L 580 260 Z" },
    { id: "PE", name: "Pernambuco", capital: "Recife", region: "nordeste", cx: 605, cy: 320, path: "M 580 260 L 600 300 L 640 310 L 660 340 L 620 360 L 570 340 L 540 320 L 530 290 Z" },
    { id: "AL", name: "Alagoas", capital: "Maceió", region: "nordeste", cx: 640, cy: 375, path: "M 620 360 L 650 350 L 670 370 L 650 400 L 620 390 Z" },
    { id: "SE", name: "Sergipe", capital: "Aracaju", region: "nordeste", cx: 665, cy: 415, path: "M 650 400 L 670 390 L 690 410 L 670 440 L 640 430 Z" },
    { id: "BA", name: "Bahia", capital: "Salvador", region: "nordeste", cx: 580, cy: 470, path: "M 470 420 L 510 440 L 560 420 L 600 440 L 640 430 L 670 440 L 680 480 L 650 520 L 590 530 L 530 510 L 480 480 Z" },
    { id: "MT", name: "Mato Grosso", capital: "Cuiabá", region: "centro-oeste", cx: 230, cy: 520, path: "M 180 440 L 260 400 L 300 440 L 320 500 L 300 560 L 260 600 L 200 610 L 160 570 L 140 520 L 150 470 Z" },
    { id: "GO", name: "Goiás", capital: "Goiânia", region: "centro-oeste", cx: 340, cy: 600, path: "M 300 560 L 350 540 L 400 560 L 420 600 L 400 640 L 360 660 L 310 640 L 280 600 Z" },
    { id: "DF", name: "Distrito Federal", capital: "Brasília", region: "centro-oeste", cx: 380, cy: 597, path: "M 370 590 L 390 585 L 395 600 L 380 610 L 365 600 Z" },
    { id: "MS", name: "Mato Grosso do Sul", capital: "Campo Grande", region: "centro-oeste", cx: 220, cy: 680, path: "M 200 610 L 260 600 L 280 640 L 290 700 L 260 750 L 210 760 L 170 720 L 160 660 Z" },
    { id: "MG", name: "Minas Gerais", capital: "Belo Horizonte", region: "sudeste", cx: 450, cy: 700, path: "M 400 640 L 450 620 L 500 640 L 540 680 L 550 730 L 520 770 L 470 790 L 420 780 L 380 750 L 360 710 L 380 670 Z" },
    { id: "ES", name: "Espírito Santo", capital: "Vitória", region: "sudeste", cx: 570, cy: 710, path: "M 550 680 L 580 670 L 600 700 L 590 740 L 560 750 L 540 730 Z" },
    { id: "RJ", name: "Rio de Janeiro", capital: "Rio de Janeiro", region: "sudeste", cx: 500, cy: 805, path: "M 480 790 L 520 770 L 540 800 L 520 830 L 480 820 L 460 800 Z" },
    { id: "SP", name: "São Paulo", capital: "São Paulo", region: "sudeste", cx: 360, cy: 760, path: "M 310 640 L 360 660 L 380 750 L 420 780 L 460 800 L 480 820 L 440 850 L 380 860 L 320 840 L 280 800 L 260 750 L 290 700 Z" },
    { id: "PR", name: "Paraná", capital: "Curitiba", region: "sul", cx: 320, cy: 860, path: "M 280 800 L 320 840 L 380 860 L 400 890 L 360 920 L 300 910 L 260 880 L 240 840 Z" },
    { id: "SC", name: "Santa Catarina", capital: "Florianópolis", region: "sul", cx: 330, cy: 940, path: "M 300 910 L 360 920 L 380 950 L 350 970 L 300 960 L 280 940 Z" },
    { id: "RS", name: "Rio Grande do Sul", capital: "Porto Alegre", region: "sul", cx: 310, cy: 1000, path: "M 280 940 L 350 970 L 380 1000 L 360 1040 L 300 1050 L 250 1020 L 230 970 Z" }
  ]
};

// ==================== GAME STATE ====================
const state = {
  mode: 'dragdrop',
  region: 'brasil',
  difficulty: 'facil',
  states: [],
  score: 0,
  lives: 3,
  maxLives: 3,
  hints: 3,
  combo: 0,
  maxCombo: 0,
  correct: 0,
  wrong: 0,
  startTime: null,
  timer: null,
  elapsed: 0,
  currentQuestion: null,
  results: [],
  selectedPiece: null,
  dragState: null,
  isAnimating: false
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
function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function showGame(mode) {
  state.mode = mode;
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.correct = 0;
  state.wrong = 0;
  state.hints = 3;
  state.results = [];
  state.selectedPiece = null;
  state.isAnimating = false;

  const diffMap = { facil: 3, medio: 2, dificil: 1 };
  state.lives = diffMap[state.difficulty] || 3;
  state.maxLives = state.lives;

  loadRegionData();
  renderMap();

  if (mode === 'dragdrop') {
    renderPiecesPool();
    $('pieces-pool').parentElement.classList.remove('hidden');
    $('quiz-panel').classList.add('hidden');
  } else {
    $('pieces-pool').parentElement.classList.add('hidden');
    $('quiz-panel').classList.remove('hidden');
    showQuizQuestion();
  }

  updateUI();
  startTimer();

  const modeNames = { dragdrop: 'Monte o Mapa', quiz: 'Quiz no Mapa' };
  const regionNames = { brasil: 'Brasil', norte: 'Norte', nordeste: 'Nordeste', sudeste: 'Sudeste', sul: 'Sul', centro: 'Centro-Oeste' };
  $('mode-title').textContent = modeNames[mode] || mode;
  $('region-title').textContent = regionNames[state.region] || state.region;

  showScreen('game');
}

function loadRegionData() {
  if (state.region === 'brasil') {
    state.states = [...GEO_DATA.states];
  } else {
    const regionMap = {
      norte: 'norte', nordeste: 'nordeste', sudeste: 'sudeste',
      sul: 'sul', centro: 'centro-oeste'
    };
    const regionId = regionMap[state.region];
    state.states = GEO_DATA.states.filter(s => s.region === regionId);
  }

  if (state.difficulty === 'medio') {
    state.states = shuffleArray([...state.states]).slice(0, Math.ceil(state.states.length * 0.6));
  } else if (state.difficulty === 'dificil') {
    state.states = shuffleArray([...state.states]).slice(0, Math.ceil(state.states.length * 0.4));
  }

  state.states.forEach(s => {
    s.placed = false;
  });
}

// ==================== MAP RENDERING ====================
function renderMap() {
  const svg = $('game-map');
  svg.innerHTML = '';

  // Ghost outlines for all states (educational guide)
  GEO_DATA.states.forEach(st => {
    const ghost = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    ghost.setAttribute('d', st.path);
    ghost.setAttribute('class', 'state-ghost');
    ghost.setAttribute('data-id', st.id);
    ghost.style.fill = 'none';
    ghost.style.stroke = 'rgba(100, 100, 140, 0.15)';
    ghost.style.strokeWidth = '1';
    ghost.style.strokeDasharray = '4, 3';
    svg.appendChild(ghost);
  });

  GEO_DATA.regions.forEach(region => {
    const regionStates = state.states.filter(s => s.region === region.id);
    regionStates.forEach(st => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', st.path);
      path.setAttribute('class', 'state-path');
      path.setAttribute('data-id', st.id);
      path.style.fill = 'rgba(20, 20, 35, 0.9)';
      path.style.stroke = 'rgba(100, 100, 140, 0.3)';
      path.style.strokeWidth = '1.5';

      if (state.mode === 'dragdrop') {
        path.addEventListener('dragover', e => e.preventDefault());
        path.addEventListener('drop', handleDrop);
      } else {
        path.addEventListener('click', () => handleMapClick(st));
      }

      svg.appendChild(path);
    });
  });

  // Labels
  state.states.forEach(st => {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', st.cx);
    text.setAttribute('y', st.cy);
    text.setAttribute('class', 'state-label');
    text.setAttribute('data-id', st.id);
    text.textContent = '';
    svg.appendChild(text);
  });
}

function highlightState(stateId, className) {
  const path = document.querySelector(`.state-path[data-id="${stateId}"]`);
  if (path) {
    path.classList.remove('highlight', 'correct', 'wrong');
    path.classList.add(className);
    setTimeout(() => path.classList.remove(className), 1500);
  }
}

function markStatePlaced(stateId) {
  const st = state.states.find(s => s.id === stateId);
  if (!st) return;
  st.placed = true;

  // Hide ghost outline
  const ghost = document.querySelector(`.state-ghost[data-id="${stateId}"]`);
  if (ghost) ghost.style.opacity = '0';

  const path = document.querySelector(`.state-path[data-id="${stateId}"]`);
  if (path) {
    const region = GEO_DATA.regions.find(r => r.id === st.region);
    path.style.fill = region ? region.color + '40' : 'rgba(34, 197, 94, 0.3)';
    path.style.stroke = region ? region.color : '#22c55e';
    path.style.strokeWidth = '2';
  }

  const label = document.querySelector(`.state-label[data-id="${stateId}"]`);
  if (label) {
    label.textContent = st.id;
    label.style.fill = '#fff';
    label.style.fontSize = '11px';
    label.style.fontWeight = '700';
  }
}

// ==================== DRAG & DROP MODE ====================
function renderPiecesPool() {
  const pool = $('pieces-pool');
  pool.innerHTML = '';

  const shuffled = shuffleArray([...state.states]);

  shuffled.forEach(st => {
    const piece = document.createElement('div');
    piece.className = 'drag-piece';
    piece.dataset.id = st.id;
    piece.draggable = true;

    const region = GEO_DATA.regions.find(r => r.id === st.region);

    piece.innerHTML = `
      <span class="piece-color" style="background: ${region ? region.color : '#666'}"></span>
      <span class="piece-name">${st.name}</span>
      <span class="piece-abbrev">${st.id}</span>
    `;

    piece.addEventListener('dragstart', handleDragStart);
    piece.addEventListener('dragend', handleDragEnd);
    pool.appendChild(piece);
  });
}

function handleDragStart(e) {
  if (state.isAnimating) {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
  e.target.classList.add('dragging');
  state.dragState = e.target.dataset.id;
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  state.dragState = null;
}

function handleDrop(e) {
  e.preventDefault();
  const droppedId = e.dataTransfer.getData('text/plain');
  const targetId = e.target.dataset.id;

  if (!droppedId || !targetId) return;

  const droppedState = state.states.find(s => s.id === droppedId);
  const targetState = state.states.find(s => s.id === targetId);

  if (!droppedState || !targetState || targetState.placed) return;

  if (droppedId === targetId) {
    handleCorrectDrop(droppedId);
  } else {
    handleWrongDrop(droppedId, targetId);
  }
}

function handleCorrectDrop(stateId) {
  state.isAnimating = true;
  state.combo++;
  if (state.combo > state.maxCombo) state.maxCombo = state.combo;

  const points = 100 * state.combo;
  state.score += points;
  state.correct++;

  state.results.push({
    id: stateId,
    name: state.states.find(s => s.id === stateId).name,
    correct: true,
    time: getElapsed()
  });

  markStatePlaced(stateId);
  const piece = document.querySelector(`.drag-piece[data-id="${stateId}"]`);
  if (piece) piece.classList.add('placed');

  spawnConfetti();
  updateUI();

  setTimeout(() => {
    state.isAnimating = false;
    if (state.states.every(s => s.placed)) {
      endGame();
    }
  }, 600);
}

function handleWrongDrop(droppedId, targetId) {
  state.combo = 0;
  state.wrong++;
  state.lives--;

  state.results.push({
    id: droppedId,
    name: `${state.states.find(s => s.id === droppedId).name} -> ${state.states.find(s => s.id === targetId).name}`,
    correct: false,
    time: getElapsed()
  });

  highlightState(targetId, 'wrong');

  state.results.push({
    id: targetId,
    name: state.states.find(s => s.id === targetId).name,
    correct: true,
    time: getElapsed()
  });

  updateUI();

  if (state.lives <= 0) {
    endGame();
  }
}

// ==================== QUIZ MODE ====================
function showQuizQuestion() {
  const available = state.states.filter(s => !s.placed);
  if (available.length === 0) {
    endGame();
    return;
  }

  state.currentQuestion = available[Math.floor(Math.random() * available.length)];
  const q = state.currentQuestion;

  highlightState(q.id, 'highlight');

  const questionType = Math.random() > 0.5 ? 'state' : 'capital';

  const questionEl = $('quiz-question');
  if (questionType === 'state') {
    questionEl.textContent = `Qual estado está destacado no mapa?`;
  } else {
    questionEl.textContent = `Qual é a capital do estado destacado?`;
  }

  const optionsEl = $('quiz-options');
  optionsEl.innerHTML = '';

  let options = questionType === 'state'
    ? state.states.map(s => s.name)
    : state.states.map(s => s.capital);

  const correctAnswer = questionType === 'state' ? q.name : q.capital;
  options = shuffleArray(options.filter(o => o !== correctAnswer)).slice(0, 3);
  options.push(correctAnswer);
  options = shuffleArray(options);

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleQuizAnswer(btn, opt, correctAnswer, questionType, q));
    optionsEl.appendChild(btn);
  });
}

function handleQuizAnswer(btn, selected, correct, type, questionState) {
  if (state.isAnimating) return;
  state.isAnimating = true;

  const isCorrect = selected === correct;

  $$('.quiz-option').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });

  if (isCorrect) {
    btn.classList.add('correct');
    state.combo++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;
    state.score += 100 * state.combo;
    state.correct++;

    markStatePlaced(questionState.id);

    state.results.push({
      id: questionState.id,
      name: questionState.name,
      correct: true,
      time: getElapsed()
    });

    spawnConfetti();
  } else {
    btn.classList.add('wrong');
    state.combo = 0;
    state.wrong++;
    state.lives--;

    state.results.push({
      id: questionState.id,
      name: `${questionState.name} (${questionState.capital})`,
      correct: false,
      time: getElapsed()
    });

    highlightState(questionState.id, 'wrong');
  }

  updateUI();

  setTimeout(() => {
    state.isAnimating = false;
    if (state.lives <= 0 || state.states.every(s => s.placed)) {
      endGame();
    } else {
      showQuizQuestion();
    }
  }, 1200);
}

function handleMapClick(st) {
  if (st.placed) return;
}

// ==================== HINTS ====================
function useHint() {
  if (state.hints <= 0 || state.isAnimating) return;
  state.hints--;

  if (state.mode === 'dragdrop') {
    const available = state.states.filter(s => !s.placed);
    if (available.length > 0) {
      const hintState = available[Math.floor(Math.random() * available.length)];
      showHintOverlay(`"${hintState.name}" vai na região ${GEO_DATA.regions.find(r => r.id === hintState.region)?.name || ''}`);

      // Highlight ghost outline
      const ghost = document.querySelector(`.state-ghost[data-id="${hintState.id}"]`);
      if (ghost) {
        ghost.style.stroke = 'rgba(59, 130, 246, 0.5)';
        ghost.style.strokeWidth = '2';
        ghost.style.strokeDasharray = 'none';
        setTimeout(() => {
          ghost.style.stroke = 'rgba(100, 100, 140, 0.15)';
          ghost.style.strokeWidth = '1';
          ghost.style.strokeDasharray = '4, 3';
        }, 3000);
      }
    }
  } else {
    const q = state.currentQuestion;
    if (q) {
      const wrongOptions = state.states
        .filter(s => s.id !== q.id && !s.placed)
        .slice(0, 2)
        .map(s => s.name);
      showHintOverlay(`"${q.name}" não é: ${wrongOptions.join(', ')}`);
    }
  }

  updateUI();
}

function showHintOverlay(text) {
  $('hint-text').textContent = text;
  $('hint-overlay').classList.remove('hidden');
}

function hideHintOverlay() {
  $('hint-overlay').classList.add('hidden');
}

// ==================== TIMER ====================
function startTimer() {
  state.startTime = Date.now();
  state.timer = setInterval(() => {
    state.elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    const min = String(Math.floor(state.elapsed / 60)).padStart(2, '0');
    const sec = String(state.elapsed % 60).padStart(2, '0');
    $('timer-display').textContent = `${min}:${sec}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timer);
}

function getElapsed() {
  return state.elapsed;
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

// ==================== UI UPDATE ====================
function updateUI() {
  $('score-display').textContent = state.score;
  $('combo-display').textContent = `x${Math.max(1, state.combo)}`;
  $('hints-count').textContent = state.hints;
  $('hint-btn').disabled = state.hints <= 0;

  const livesEl = $('lives-display');
  livesEl.innerHTML = '';
  for (let i = 0; i < state.maxLives; i++) {
    const heart = document.createElement('span');
    heart.textContent = '❤️';
    if (i >= state.lives) heart.classList.add('lost');
    livesEl.appendChild(heart);
  }

  const total = state.states.length;
  const placed = state.states.filter(s => s.placed).length;
  const pct = (placed / total) * 100;

  document.querySelector('.progress-fill').style.width = `${pct}%`;
  document.querySelector('.progress-text').textContent = `${placed}/${total}`;

  if (state.combo >= 3) {
    $('combo-display').style.color = '#ef4444';
  } else if (state.combo >= 2) {
    $('combo-display').style.color = '#f59e0b';
  } else {
    $('combo-display').style.color = '#ddd';
  }
}

// ==================== EFFECTS ====================
function spawnConfetti() {
  const mapEl = $('game-map');
  const rect = mapEl.getBoundingClientRect();
  const container = document.createElement('div');
  container.className = 'particles-container';
  mapEl.parentElement.appendChild(container);

  const colors = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'];

  for (let i = 0; i < 15; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${50 + (Math.random() - 0.5) * 30}%`;
    confetti.style.top = `${50 + (Math.random() - 0.5) * 20}%`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
    confetti.style.setProperty('--ty', `${50 + Math.random() * 150}px`);
    confetti.style.animationDelay = `${Math.random() * 0.3}s`;
    container.appendChild(confetti);
  }

  setTimeout(() => container.remove(), 1500);
}

// ==================== END GAME ====================
function endGame() {
  stopTimer();

  const allPlaced = state.states.every(s => s.placed);
  const accuracy = state.correct + state.wrong > 0
    ? Math.round((state.correct / (state.correct + state.wrong)) * 100)
    : 0;

  $('results-icon').textContent = allPlaced ? '🏆' : '😔';
  $('results-title').textContent = allPlaced ? 'Parabéns!' : 'Fim de Jogo!';
  $('results-subtitle').textContent = allPlaced
    ? 'Você completou o mapa!'
    : 'Não se preocupe, tente novamente!';

  $('result-score').textContent = state.score;
  $('result-accuracy').textContent = `${accuracy}%`;
  $('result-time').textContent = formatTime(state.elapsed);
  $('result-combo').textContent = `x${state.maxCombo}`;

  const listEl = $('results-list');
  listEl.innerHTML = '';
  state.results.forEach(r => {
    const entry = document.createElement('div');
    entry.className = 'result-entry';
    entry.innerHTML = `
      <span class="result-dot ${r.correct ? 'correct' : 'wrong'}"></span>
      <span class="result-text">${r.name}</span>
      <span class="result-time">${formatTime(r.time)}</span>
    `;
    listEl.appendChild(entry);
  });

  saveScore(state.score, accuracy, state.elapsed, state.maxCombo);
  showScreen('results');
}

// ==================== SCORES ====================
function saveScore(score, accuracy, time, combo) {
  const scores = JSON.parse(localStorage.getItem('geo-scores') || '[]');
  scores.push({
    score,
    accuracy,
    time,
    combo,
    mode: state.mode,
    region: state.region,
    difficulty: state.difficulty,
    date: Date.now()
  });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('geo-scores', JSON.stringify(scores.slice(0, 20)));
}

function showScoresModal() {
  const scores = JSON.parse(localStorage.getItem('geo-scores') || '[]');
  const listEl = $('scores-list');

  if (scores.length === 0) {
    listEl.innerHTML = `
      <div class="empty-scores">
        <p>Nenhum recorde ainda!</p>
        <p>Jogue sua primeira partida.</p>
      </div>
    `;
  } else {
    listEl.innerHTML = '';
    scores.forEach((s, i) => {
      const entry = document.createElement('div');
      entry.className = 'score-entry';
      const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      entry.innerHTML = `
        <span class="score-rank ${rankClass}">#${i + 1}</span>
        <span class="score-info">
          <strong>${s.region} - ${s.difficulty}</strong>
          <span>${s.mode === 'dragdrop' ? 'Monte o Mapa' : 'Quiz'} • ${formatTime(s.time)}</span>
        </span>
        <span class="score-value">${s.score}</span>
      `;
      listEl.appendChild(entry);
    });
  }

  $('scores-modal').classList.remove('hidden');
}

function hideScoresModal() {
  $('scores-modal').classList.add('hidden');
}

// ==================== UTILS ====================
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ==================== INIT ====================
function init() {
  initBackground();

  // Mode selection
  $$('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      $$('.mode-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.mode = card.dataset.mode;
    });
  });

  // Region selection
  $$('.region-btn:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.region-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.region = btn.dataset.region;
    });
  });

  // Difficulty selection
  $$('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.diff-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.difficulty = btn.dataset.diff;
    });
  });

  // Start
  $('start-btn').addEventListener('click', () => showGame(state.mode));

  // Back
  $('back-to-menu').addEventListener('click', () => {
    stopTimer();
    showScreen('menu');
  });

  // Hint
  $('hint-btn').addEventListener('click', useHint);
  $('hint-close').addEventListener('click', hideHintOverlay);

  // Results
  $('results-menu').addEventListener('click', () => showScreen('menu'));
  $('results-retry').addEventListener('click', () => showGame(state.mode));

  // Scores
  $('scores-btn').addEventListener('click', showScoresModal);
  $('close-scores').addEventListener('click', hideScoresModal);
  $('scores-modal').addEventListener('click', e => {
    if (e.target === $('scores-modal')) hideScoresModal();
  });

  // Mode titles
  $('mode-title').textContent = state.mode === 'dragdrop' ? 'Monte o Mapa' : 'Quiz no Mapa';
}

document.addEventListener('DOMContentLoaded', init);
