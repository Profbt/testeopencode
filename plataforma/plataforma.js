const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const menuCanvas = document.getElementById('menuCanvas');
const menuCtx = menuCanvas.getContext('2d');

const audioMenu = document.getElementById('audio-menu');
const audioGame = document.getElementById('audio-game');
const audioScream = document.getElementById('audio-scream');
audioScream.volume = 0.3;

let img67 = new Image();
img67.src = 'assets/images/67.png';

const keys = {};
let gameState = 'menu';
let startTime = 0;
let survivalTime = 0;
let score = 0;
let jumpPressed = false;
let selectedDifficulty = 'medium';
let screenShake = 0;
let countdownValue = 3;
let countdownTimer = 0;

const GRAVITY = 0.6;
const WALL_GRAVITY = 0.25;
const JUMP_FORCE = -13;
const WALL_JUMP_X = 8;
const WALL_JUMP_Y = -12;
const BASE_MOVE_SPEED = 5;
const PLAYER_W = 30;
const PLAYER_H = 50;
const ENEMY_W = 60;
const ENEMY_H = 80;
const MAX_JUMPS = 2;

const DIFFICULTIES = {
  easy: {
    label: 'Fácil',
    chaseSpeedMult: 0.7,
    forwardSpawnInterval: 14000,
    forwardEnemySpeed: 2.2,
    forwardEnemyMaxCount: 2,
    levelThresholds: [12, 30, 55, 85],
    hsKey: 'fuja67_hs_easy'
  },
  medium: {
    label: 'Médio',
    chaseSpeedMult: 1.0,
    forwardSpawnInterval: 10000,
    forwardEnemySpeed: 3,
    forwardEnemyMaxCount: 3,
    levelThresholds: [10, 25, 45, 70],
    hsKey: 'fuja67_hs_medium'
  },
  hard: {
    label: 'Difícil',
    chaseSpeedMult: 1.4,
    forwardSpawnInterval: 6000,
    forwardEnemySpeed: 4,
    forwardEnemyMaxCount: 4,
    levelThresholds: [8, 18, 35, 55],
    hsKey: 'fuja67_hs_hard'
  }
};

const LEVEL_NAMES = ['Lento', 'Normal', 'Rápido', 'Muito Rápido', 'INSANO'];

let player, enemy, platforms, cameraX, lastPlatformX, particles, items, buffs, currentLevel;
let forwardEnemies, lastForwardSpawn;
let spawnWarningTimer = 0;

let menuParticles = [];
let menuAnimFrame = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  menuCanvas.width = window.innerWidth;
  menuCanvas.height = window.innerHeight;
  initMenuParticles();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initMenuParticles() {
  menuParticles = [];
  for (let i = 0; i < 80; i++) {
    menuParticles.push({
      x: Math.random() * menuCanvas.width,
      y: Math.random() * menuCanvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.2 - Math.random() * 0.8,
      size: 1 + Math.random() * 3,
      alpha: 0.1 + Math.random() * 0.4,
      color: Math.random() > 0.7 ? '#ff0033' : '#ffffff'
    });
  }
}

function animateMenu() {
  if (gameState !== 'menu') return;

  menuCtx.fillStyle = '#0a0a0a';
  menuCtx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);

  for (const p of menuParticles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -10) { p.y = menuCanvas.height + 10; p.x = Math.random() * menuCanvas.width; }
    if (p.x < -10) p.x = menuCanvas.width + 10;
    if (p.x > menuCanvas.width + 10) p.x = -10;

    menuCtx.globalAlpha = p.alpha;
    menuCtx.fillStyle = p.color;
    menuCtx.beginPath();
    menuCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    menuCtx.fill();

    if (p.color === '#ff0033') {
      menuCtx.globalAlpha = p.alpha * 0.3;
      menuCtx.beginPath();
      menuCtx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      menuCtx.fill();
    }
  }
  menuCtx.globalAlpha = 1;

  menuAnimFrame = requestAnimationFrame(animateMenu);
}

function initGame() {
  const diff = DIFFICULTIES[selectedDifficulty];
  const groundY = canvas.height - 50;

  player = {
    x: 200, y: 0, vx: 0, vy: 0,
    onGround: false, onWall: 0, jumpsLeft: MAX_JUMPS,
    color: '#4a9eff', speedMultiplier: 1, shields: 0
  };

  enemy = {
    x: -100, y: 0,
    baseSpeed: diff.chaseSpeedMult * 1.8,
    speed: diff.chaseSpeedMult * 1.8,
    slowTimer: 0, level: 0
  };

  forwardEnemies = [];
  lastForwardSpawn = -diff.forwardSpawnInterval / 2;

  currentLevel = 0;
  cameraX = 0;
  particles = [];
  items = [];
  buffs = { speed: 0, slow: 0 };
  score = 0;
  platforms = [];
  screenShake = 0;
  spawnWarningTimer = 0;

  platforms.push({ x: -200, y: groundY, w: 2500, h: 50, ground: true });

  lastPlatformX = 600;
  for (let i = 0; i < 20; i++) {
    generatePlatform();
  }

  player.y = groundY - PLAYER_H;
  enemy.y = groundY - ENEMY_H;
}

function generatePlatform() {
  const groundY = canvas.height - 50;
  const gap = 60 + Math.random() * 80;
  const w = 120 + Math.random() * 180;
  const maxJumpHeight = 120;
  const y = groundY - 30 - Math.random() * maxJumpHeight;
  platforms.push({ x: lastPlatformX + gap, y, w, h: 15, ground: false });

  if (Math.random() < 0.45) {
    const itemTypes = ['orb', 'orb', 'orb', 'shield', 'slow'];
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    items.push({
      x: lastPlatformX + gap + 30 + Math.random() * (w - 60),
      y: y - 25, type, radius: 12,
      collected: false, bobOffset: Math.random() * Math.PI * 2
    });
  }

  lastPlatformX += gap + w;
}

function spawnForwardEnemy() {
  const diff = DIFFICULTIES[selectedDifficulty];
  const activeCount = forwardEnemies.filter(e => !e.passed).length;
  if (activeCount >= diff.forwardEnemyMaxCount) return;

  const groundY = canvas.height - 50;
  const spawnX = player.x + canvas.width * 0.7 + Math.random() * 200;

  const heightType = Math.random();
  let y, h, canJumpOver;

  if (heightType < 0.4) {
    y = groundY - ENEMY_H;
    h = ENEMY_H;
    canJumpOver = true;
  } else if (heightType < 0.7) {
    y = groundY - ENEMY_H * 0.6;
    h = ENEMY_H * 0.6;
    canJumpOver = true;
  } else if (heightType < 0.9) {
    y = groundY - ENEMY_H * 1.5;
    h = ENEMY_H * 0.4;
    canJumpOver = false;
  } else {
    y = groundY - ENEMY_H * 2;
    h = ENEMY_H * 0.35;
    canJumpOver = false;
  }

  forwardEnemies.push({
    x: spawnX, y, w: ENEMY_W, h,
    speed: diff.forwardEnemySpeed + currentLevel * 0.3,
    passed: false, alive: true, canJumpOver,
    heightType: heightType < 0.7 ? 'ground' : 'flying'
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function switchAudio(to) {
  audioMenu.pause();
  audioGame.pause();
  audioScream.pause();
  audioScream.currentTime = 0;
  if (to === 'menu') { audioMenu.currentTime = 0; audioMenu.play().catch(() => {}); }
  else if (to === 'game') { audioGame.currentTime = 0; audioGame.play().catch(() => {}); }
  else if (to === 'scream') { audioScream.currentTime = 0; audioScream.play().catch(() => {}); }
}

function getHighScore() {
  const diff = DIFFICULTIES[selectedDifficulty];
  return parseInt(localStorage.getItem(diff.hsKey) || '0');
}

function setHighScore(s) {
  const diff = DIFFICULTIES[selectedDifficulty];
  const current = getHighScore();
  if (s > current) localStorage.setItem(diff.hsKey, Math.floor(s));
}

function updateMenuHighScore() {
  const hs = getHighScore();
  document.getElementById('menu-highscore').textContent = hs > 0 ? `Melhor: ${hs} pts` : '';
}

function triggerJumpscare() {
  if (player.shields > 0) {
    player.shields--;
    enemy.x = player.x - ENEMY_W - 200;
    screenShake = 10;
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: player.x + PLAYER_W / 2, y: player.y + PLAYER_H / 2,
        vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
        life: 0.5 + Math.random() * 0.5, size: 4 + Math.random() * 5,
        color: '#2ecc71'
      });
    }
    return;
  }

  setHighScore(score);
  gameState = 'jumpscare';
  document.getElementById('final-time').textContent = `Sobreviveu por ${survivalTime.toFixed(1)} segundos`;
  document.getElementById('final-score').textContent = `Pontuação: ${Math.floor(score)}`;
  document.getElementById('final-difficulty').textContent = `Dificuldade: ${DIFFICULTIES[selectedDifficulty].label}`;
  const hs = getHighScore();
  document.getElementById('final-highscore').textContent = hs > 0 ? `Melhor pontuação: ${hs}` : '';
  showScreen('jumpscare-screen');
  switchAudio('scream');

  const wrapper = document.getElementById('jumpscare-wrapper');
  wrapper.style.animation = 'none';
  void wrapper.offsetHeight;
  wrapper.style.animation = '';
  wrapper.classList.remove('shaking');
  setTimeout(() => wrapper.classList.add('shaking'), 1500);
}

function collectItem(item) {
  item.collected = true;
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: item.x, y: item.y,
      vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
      life: 0.3 + Math.random() * 0.3, size: 3 + Math.random() * 4,
      color: item.type === 'orb' ? '#f1c40f' : item.type === 'shield' ? '#2ecc71' : '#3498db'
    });
  }
  if (item.type === 'orb') {
    player.speedMultiplier = Math.min(player.speedMultiplier + 0.2, 2);
    buffs.speed = 8;
    score += 50;
  } else if (item.type === 'shield') {
    player.shields++;
    score += 100;
  } else if (item.type === 'slow') {
    enemy.slowTimer = 5;
    buffs.slow = 5;
    score += 200;
  }
  updateBuffDisplay();
}

function updateBuffDisplay() {
  const el = document.getElementById('buff-display');
  el.innerHTML = '';
  if (buffs.speed > 0) {
    const d = document.createElement('div');
    d.className = 'buff-icon buff-speed';
    d.textContent = `⚡ ${buffs.speed.toFixed(1)}s`;
    el.appendChild(d);
  }
  if (buffs.slow > 0) {
    const d = document.createElement('div');
    d.className = 'buff-icon buff-slow';
    d.textContent = `❄️ ${buffs.slow.toFixed(1)}s`;
    el.appendChild(d);
  }
}

function startCountdown() {
  initGame();
  gameState = 'countdown';
  countdownValue = 3;
  countdownTimer = performance.now();
  showScreen('countdown-screen');
  document.getElementById('countdown-text').textContent = '3';
  switchAudio('game');
  requestAnimationFrame(countdownLoop);
}

function countdownLoop(timestamp) {
  if (gameState !== 'countdown') return;

  const elapsed = timestamp - countdownTimer;
  const newCount = 3 - Math.floor(elapsed / 1000);

  if (newCount !== countdownValue) {
    countdownValue = newCount;
    if (countdownValue > 0) {
      const el = document.getElementById('countdown-text');
      el.textContent = countdownValue.toString();
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = 'countPop 0.8s ease-out';
    } else if (countdownValue === 0) {
      const el = document.getElementById('countdown-text');
      el.textContent = 'FUJA!';
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = 'countPop 0.8s ease-out';
      setTimeout(() => {
        gameState = 'playing';
        startTime = performance.now();
        showScreen('game-screen');
        requestAnimationFrame(gameLoop);
      }, 800);
      return;
    }
  }

  requestAnimationFrame(countdownLoop);
}

function togglePause() {
  if (gameState === 'playing') {
    gameState = 'paused';
    showScreen('pause-screen');
    audioGame.pause();
  } else if (gameState === 'paused') {
    gameState = 'playing';
    showScreen('game-screen');
    startTime = performance.now() - survivalTime * 1000;
    audioGame.play().catch(() => {});
    requestAnimationFrame(gameLoop);
  }
}

function startGame() {
  if (gameState === 'menu' || gameState === 'jumpscare') {
    startCountdown();
  }
}

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedDifficulty = btn.dataset.diff;
    updateMenuHighScore();
  });
});

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('retry-btn').addEventListener('click', startGame);
document.getElementById('resume-btn').addEventListener('click', togglePause);
document.getElementById('pause-retry-btn').addEventListener('click', startGame);

window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }
  if (e.code === 'Escape') {
    if (gameState === 'playing' || gameState === 'paused') togglePause();
  }
});
window.addEventListener('keyup', e => {
  keys[e.code] = false;
  if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
    jumpPressed = false;
  }
});

function gameLoop(timestamp) {
  if (gameState !== 'playing') return;

  survivalTime = (timestamp - startTime) / 1000;

  update();
  render();

  requestAnimationFrame(gameLoop);
}

function updateLevel() {
  const diff = DIFFICULTIES[selectedDifficulty];
  let newLevel = 0;
  for (let i = diff.levelThresholds.length; i >= 0; i--) {
    if (survivalTime >= (i === 0 ? 0 : diff.levelThresholds[i - 1])) {
      newLevel = i;
      break;
    }
  }
  newLevel = Math.min(newLevel, LEVEL_NAMES.length - 1);

  if (newLevel !== currentLevel) {
    currentLevel = newLevel;
    screenShake = 5;
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: canvas.width / 2, y: 60,
        vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10,
        life: 0.5 + Math.random() * 0.5, size: 4 + Math.random() * 6,
        color: '#ff0033'
      });
    }
  }
  return newLevel;
}

function update() {
  const diff = DIFFICULTIES[selectedDifficulty];
  const left = keys['KeyA'] || keys['ArrowLeft'];
  const right = keys['KeyD'] || keys['ArrowRight'];
  const jumpKey = keys['KeyW'] || keys['ArrowUp'] || keys['Space'];

  const moveSpeed = BASE_MOVE_SPEED * player.speedMultiplier;

  player.vx = 0;
  if (left) player.vx = -moveSpeed;
  if (right) player.vx = moveSpeed;

  if (jumpKey && !jumpPressed) {
    if (player.onWall !== 0) {
      const wallDir = player.onWall;
      player.vy = WALL_JUMP_Y;
      player.vx = -wallDir * WALL_JUMP_X;
      player.onWall = 0;
      player.jumpsLeft = 1;
      jumpPressed = true;
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: player.x + PLAYER_W / 2, y: player.y + PLAYER_H / 2,
          vx: -wallDir * (Math.random() * 4 + 2), vy: (Math.random() - 0.5) * 4,
          life: 0.3 + Math.random() * 0.3, size: 3 + Math.random() * 3,
          color: '#ff6600'
        });
      }
    } else if (player.jumpsLeft > 0) {
      player.vy = JUMP_FORCE;
      player.jumpsLeft--;
      jumpPressed = true;
      if (player.jumpsLeft === 0) {
        for (let i = 0; i < 6; i++) {
          particles.push({
            x: player.x + PLAYER_W / 2, y: player.y + PLAYER_H,
            vx: (Math.random() - 0.5) * 4, vy: Math.random() * 2,
            life: 0.4 + Math.random() * 0.3, size: 3 + Math.random() * 4,
            color: '#4a9eff'
          });
        }
      }
    }
  }

  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;

  player.onGround = false;
  player.onWall = 0;

  for (const p of platforms) {
    if (player.x + PLAYER_W > p.x && player.x < p.x + p.w &&
        player.y + PLAYER_H > p.y && player.y + PLAYER_H < p.y + p.h + 15 &&
        player.vy >= 0) {
      player.y = p.y - PLAYER_H;
      player.vy = 0;
      player.onGround = true;
      player.jumpsLeft = MAX_JUMPS;
    }

    if (player.vy > 0) {
      if (player.x + PLAYER_W > p.x && player.x < p.x + 6 &&
          player.y + PLAYER_H > p.y + 5 && player.y < p.y + p.h) {
        player.x = p.x - PLAYER_W;
        if (!player.onGround && player.vy > 2) {
          player.vy = Math.min(player.vy, WALL_GRAVITY * 15);
          player.vy *= 0.85;
          player.onWall = 1;
        }
      }
      if (player.x < p.x + p.w && player.x + PLAYER_W > p.x + p.w - 6 &&
          player.y + PLAYER_H > p.y + 5 && player.y < p.y + p.h) {
        player.x = p.x + p.w;
        if (!player.onGround && player.vy > 2) {
          player.vy = Math.min(player.vy, WALL_GRAVITY * 15);
          player.vy *= 0.85;
          player.onWall = -1;
        }
      }
    }
  }

  if (player.onWall !== 0 && player.vy > 1) {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: player.onWall > 0 ? player.x : player.x + PLAYER_W,
        y: player.y + PLAYER_H * 0.3 + Math.random() * PLAYER_H * 0.4,
        vx: -player.onWall * (0.5 + Math.random()), vy: -Math.random() * 1.5,
        life: 0.2 + Math.random() * 0.2, size: 2 + Math.random() * 2,
        color: '#ffaa44'
      });
    }
  }

  if (player.y > canvas.height + 100) {
    triggerJumpscare();
    return;
  }

  if (player.x < cameraX - 50) {
    player.x = cameraX - 50;
  }

  for (const item of items) {
    if (!item.collected) {
      const dx = (player.x + PLAYER_W / 2) - item.x;
      const dy = (player.y + PLAYER_H / 2) - item.y;
      if (Math.sqrt(dx * dx + dy * dy) < item.radius + 20) {
        collectItem(item);
      }
    }
  }

  updateLevel();
  enemy.baseSpeed = diff.chaseSpeedMult * (1.8 + currentLevel * 0.8);
  enemy.speed = enemy.baseSpeed;

  if (enemy.slowTimer > 0) {
    enemy.slowTimer -= 1 / 60;
    if (enemy.slowTimer <= 0) { enemy.slowTimer = 0; buffs.slow = 0; updateBuffDisplay(); }
  }

  if (buffs.speed > 0) {
    buffs.speed -= 1 / 60;
    if (buffs.speed <= 0) {
      buffs.speed = 0;
      player.speedMultiplier = Math.max(player.speedMultiplier - 0.2, 1);
      updateBuffDisplay();
    }
  }

  const effectiveChaseSpeed = enemy.slowTimer > 0 ? enemy.speed * 0.5 : enemy.speed;
  const targetX = player.x - ENEMY_W / 2;
  const dxChase = targetX - enemy.x;
  if (Math.abs(dxChase) > 1) enemy.x += Math.sign(dxChase) * effectiveChaseSpeed;

  if (enemy.x + ENEMY_W > player.x + 5 && enemy.x < player.x + PLAYER_W - 5) {
    if (enemy.y + ENEMY_H > player.y + 10 && enemy.y < player.y + PLAYER_H) {
      triggerJumpscare();
      return;
    }
  }

  enemy.y = canvas.height - 50 - ENEMY_H;

  const spawnEl = document.getElementById('spawn-warning');
  const timeSinceSpawn = survivalTime * 1000 - lastForwardSpawn;
  const warnTime = 2000;
  if (timeSinceSpawn > diff.forwardSpawnInterval - warnTime && timeSinceSpawn < diff.forwardSpawnInterval) {
    spawnWarningTimer = (diff.forwardSpawnInterval - timeSinceSpawn) / 1000;
    spawnEl.classList.remove('hidden');
  } else {
    spawnEl.classList.add('hidden');
  }

  if (timeSinceSpawn > diff.forwardSpawnInterval) {
    spawnForwardEnemy();
    lastForwardSpawn = survivalTime * 1000;
  }

  const groundY = canvas.height - 50;
  for (let i = forwardEnemies.length - 1; i >= 0; i--) {
    const fe = forwardEnemies[i];
    if (!fe.alive) { forwardEnemies.splice(i, 1); continue; }

    fe.x -= fe.speed;

    if (fe.x + fe.w < player.x - 100 && !fe.passed) {
      fe.passed = true;
      score += 75;
    }

    if (fe.x + fe.w < cameraX - 300) { forwardEnemies.splice(i, 1); continue; }

    const overlapX = fe.x < player.x + PLAYER_W && fe.x + fe.w > player.x;
    const playerBottom = player.y + PLAYER_H;
    const clearance = fe.h * 0.55;
    const overlapY = playerBottom > fe.y + clearance;

    if (overlapX && overlapY && (!fe.passed || fe.x > player.x - 50)) {
      triggerJumpscare();
      return;
    }
  }

  cameraX = player.x - 200;

  while (lastPlatformX < player.x + canvas.width * 2) generatePlatform();

  score += survivalTime * (currentLevel + 1) * 0.1;

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life -= 0.02;
    if (p.life <= 0) particles.splice(i, 1);
  }

  if (player.onGround && Math.abs(player.vx) > 0 && Math.random() < 0.3) {
    particles.push({
      x: player.x + PLAYER_W / 2, y: player.y + PLAYER_H,
      vx: -player.vx * 0.2 + (Math.random() - 0.5), vy: -Math.random() * 2,
      life: 0.5 + Math.random() * 0.3, size: 2 + Math.random() * 3, color: '#888'
    });
  }

  const dangerDist = player.x - (enemy.x + ENEMY_W);
  if (dangerDist < 200) {
    screenShake = Math.max(screenShake, (1 - dangerDist / 200) * 6);
  }

  if (screenShake > 0) screenShake *= 0.9;
  if (screenShake < 0.1) screenShake = 0;

  updateHUD();
}

function drawPlatform(p) {
  if (p.x + p.w < cameraX - 50 || p.x > cameraX + canvas.width + 50) return;
  ctx.save();
  if (p.ground) {
    const grd = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
    grd.addColorStop(0, '#2a1a1a'); grd.addColorStop(0.3, '#1a1a1a'); grd.addColorStop(1, '#111');
    ctx.fillStyle = grd;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = '#ff003366'; ctx.lineWidth = 2;
    ctx.shadowColor = '#ff0033'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.w, p.y); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ff003315'; ctx.lineWidth = 1;
    for (let gx = p.x; gx < p.x + p.w; gx += 30) {
      ctx.beginPath(); ctx.moveTo(gx, p.y); ctx.lineTo(gx - 10, p.y + p.h); ctx.stroke();
    }
  } else {
    const grd = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
    grd.addColorStop(0, '#4a3a2a'); grd.addColorStop(0.5, '#3a2a1a'); grd.addColorStop(1, '#2a1a0a');
    ctx.fillStyle = grd;
    const radius = 4;
    ctx.beginPath();
    ctx.moveTo(p.x + radius, p.y);
    ctx.lineTo(p.x + p.w - radius, p.y);
    ctx.quadraticCurveTo(p.x + p.w, p.y, p.x + p.w, p.y + radius);
    ctx.lineTo(p.x + p.w, p.y + p.h - radius);
    ctx.quadraticCurveTo(p.x + p.w, p.y + p.h, p.x + p.w - radius, p.y + p.h);
    ctx.lineTo(p.x + radius, p.y + p.h);
    ctx.quadraticCurveTo(p.x, p.y + p.h, p.x, p.y + p.h - radius);
    ctx.lineTo(p.x, p.y + radius);
    ctx.quadraticCurveTo(p.x, p.y, p.x + radius, p.y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = '#e67e22'; ctx.shadowBlur = 6;
    ctx.strokeStyle = '#e67e22'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x + radius, p.y);
    ctx.lineTo(p.x + p.w - radius, p.y);
    ctx.quadraticCurveTo(p.x + p.w, p.y, p.x + p.w, p.y + radius);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(p.x + 4, p.y + 2, p.w - 8, 3);
    ctx.strokeStyle = '#2a1a0a44'; ctx.lineWidth = 1;
    ctx.strokeRect(p.x + 8, p.y + p.h - 6, 12, 4);
    ctx.strokeRect(p.x + p.w - 20, p.y + p.h - 6, 12, 4);
  }
  ctx.restore();
}

function drawForwardEnemy(fe) {
  ctx.save();
  const dangerPulse = 0.7 + Math.sin(performance.now() / 200) * 0.3;
  ctx.shadowColor = '#ff0033';
  ctx.shadowBlur = 12 * dangerPulse;

  if (img67.complete && img67.naturalWidth > 0) {
    ctx.drawImage(img67, fe.x, fe.y, fe.w, fe.h);
  } else {
    const eGrd = ctx.createLinearGradient(fe.x, fe.y, fe.x + fe.w, fe.y + fe.h);
    eGrd.addColorStop(0, '#ff3344'); eGrd.addColorStop(1, '#cc0022');
    ctx.fillStyle = eGrd;
    ctx.beginPath(); ctx.roundRect(fe.x, fe.y, fe.w, fe.h, 6); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${fe.h * 0.4}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('67', fe.x + fe.w / 2, fe.y + fe.h / 2);
  }
  ctx.shadowBlur = 0;

  const warnAlpha = 0.5 + Math.sin(performance.now() / 150) * 0.5;
  ctx.fillStyle = `rgba(255, 0, 0, ${warnAlpha})`;
  ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('⚠', fe.x + fe.w / 2, fe.y - 10);
  ctx.restore();
}

function updateHUD() {
  const diff = DIFFICULTIES[selectedDifficulty];
  document.getElementById('timer').textContent = `${survivalTime.toFixed(1)}s`;
  document.getElementById('score').textContent = `${Math.floor(score)}`;
  const lvl = LEVEL_NAMES[currentLevel];
  document.getElementById('level-label').textContent = `67 Nível ${currentLevel + 1} - ${lvl}`;
  const prevUntil = currentLevel > 0 ? diff.levelThresholds[currentLevel - 1] : 0;
  const currentUntil = diff.levelThresholds[currentLevel];
  const progress = (survivalTime - prevUntil) / (currentUntil - prevUntil);
  document.getElementById('level-fill').style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
  document.getElementById('speed-indicator').textContent = `⚡ ${player.speedMultiplier.toFixed(1)}x`;
  document.getElementById('shield-indicator').textContent = `🛡️ ${player.shields}`;
}

function render() {
  ctx.save();
  if (screenShake > 0) {
    ctx.translate(
      (Math.random() - 0.5) * screenShake * 2,
      (Math.random() - 0.5) * screenShake * 2
    );
  }

  ctx.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);

  for (let i = 0; i < 60; i++) {
    const sx = (i * 137 + 50) % canvas.width;
    const sy = (i * 97 + 30) % (canvas.height * 0.7);
    const brightness = 80 + (i * 13) % 120;
    const twinkle = 0.3 + Math.sin(performance.now() / 1000 + i) * 0.2;
    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness + 30}, ${twinkle})`;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }

  ctx.save();
  ctx.translate(-cameraX, 0);

  for (const p of platforms) drawPlatform(p);

  for (const item of items) {
    if (item.collected) continue;
    if (item.x < cameraX - 50 || item.x > cameraX + canvas.width + 50) continue;
    const bob = Math.sin(performance.now() / 300 + item.bobOffset) * 4;
    const iy = item.y + bob;
    ctx.save();
    ctx.translate(item.x, iy);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, item.radius + 8);
    if (item.type === 'orb') {
      glow.addColorStop(0, 'rgba(241,196,15,0.9)'); glow.addColorStop(0.5, 'rgba(241,196,15,0.3)'); glow.addColorStop(1, 'rgba(241,196,15,0)');
    } else if (item.type === 'shield') {
      glow.addColorStop(0, 'rgba(46,204,113,0.9)'); glow.addColorStop(0.5, 'rgba(46,204,113,0.3)'); glow.addColorStop(1, 'rgba(46,204,113,0)');
    } else {
      glow.addColorStop(0, 'rgba(52,152,219,0.9)'); glow.addColorStop(0.5, 'rgba(52,152,219,0.3)'); glow.addColorStop(1, 'rgba(52,152,219,0)');
    }
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, item.radius + 8, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = item.type === 'orb' ? '#f1c40f' : item.type === 'shield' ? '#2ecc71' : '#3498db';
    ctx.shadowBlur = 12;
    if (item.type === 'orb') {
      const og = ctx.createRadialGradient(-3, -3, 0, 0, 0, item.radius);
      og.addColorStop(0, '#ffe066'); og.addColorStop(0.7, '#f1c40f'); og.addColorStop(1, '#d4a017');
      ctx.fillStyle = og; ctx.beginPath(); ctx.arc(0, 0, item.radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⚡', 0, 1);
    } else if (item.type === 'shield') {
      const sg = ctx.createRadialGradient(-3, -3, 0, 0, 0, item.radius);
      sg.addColorStop(0, '#6dff9e'); sg.addColorStop(0.7, '#2ecc71'); sg.addColorStop(1, '#1a9c54');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, item.radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🛡', 0, 1);
    } else {
      const lg = ctx.createRadialGradient(-3, -3, 0, 0, 0, item.radius);
      lg.addColorStop(0, '#7ec8f0'); lg.addColorStop(0.7, '#3498db'); lg.addColorStop(1, '#1a6fa0');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(0, 0, item.radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('❄', 0, 1);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  for (const fe of forwardEnemies) {
    if (fe.x > cameraX - 100 && fe.x < cameraX + canvas.width + 100) drawForwardEnemy(fe);
  }

  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (player.onWall !== 0) {
    ctx.strokeStyle = 'rgba(255,102,0,0.4)'; ctx.lineWidth = 3; ctx.setLineDash([4, 4]);
    const wallX = player.onWall > 0 ? player.x : player.x + PLAYER_W;
    ctx.beginPath(); ctx.moveTo(wallX, player.y + 5); ctx.lineTo(wallX, player.y + PLAYER_H - 5); ctx.stroke();
    ctx.setLineDash([]);
  }

  const pGrd = ctx.createLinearGradient(player.x, player.y, player.x + PLAYER_W, player.y + PLAYER_H);
  pGrd.addColorStop(0, '#5baaff'); pGrd.addColorStop(0.5, '#4a9eff'); pGrd.addColorStop(1, '#2a7edf');
  ctx.fillStyle = pGrd;
  ctx.shadowColor = '#4a9eff'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.roundRect(player.x, player.y, PLAYER_W, PLAYER_H, 4); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  const eyeDir = enemy.x > player.x ? 1 : -1;
  ctx.beginPath(); ctx.arc(player.x + 10 + eyeDir * 3, player.y + 14, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(player.x + 20 + eyeDir * 3, player.y + 14, 3, 0, Math.PI * 2); ctx.fill();

  if (player.shields > 0) {
    const sa = 0.3 + Math.sin(performance.now() / 200) * 0.15;
    ctx.strokeStyle = `rgba(46,204,113,${sa})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(player.x + PLAYER_W / 2, player.y + PLAYER_H / 2, PLAYER_W * 0.85, 0, Math.PI * 2); ctx.stroke();
  }

  const dangerDist = player.x - (enemy.x + ENEMY_W);
  if (dangerDist < 300) {
    const intensity = 1 - dangerDist / 300;
    ctx.fillStyle = `rgba(255,0,0,${intensity * 0.2})`;
    ctx.beginPath(); ctx.arc(player.x + PLAYER_W / 2, player.y + PLAYER_H / 2, PLAYER_W + 20, 0, Math.PI * 2); ctx.fill();
  }

  if (img67.complete && img67.naturalWidth > 0) {
    ctx.shadowColor = '#ff0033'; ctx.shadowBlur = 15;
    ctx.drawImage(img67, enemy.x, enemy.y, ENEMY_W, ENEMY_H);
    ctx.shadowBlur = 0;
  } else {
    const eGrd = ctx.createLinearGradient(enemy.x, enemy.y, enemy.x + ENEMY_W, enemy.y + ENEMY_H);
    eGrd.addColorStop(0, '#ff3344'); eGrd.addColorStop(1, '#cc0022');
    ctx.fillStyle = eGrd;
    ctx.shadowColor = '#ff0033'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.roundRect(enemy.x, enemy.y, ENEMY_W, ENEMY_H, 6); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('67', enemy.x + ENEMY_W / 2, enemy.y + ENEMY_H / 2);
  }

  ctx.restore();

  const vignette = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
    canvas.width / 2, canvas.height / 2, canvas.height
  );
  const vAlpha = Math.max(0, 0.4 - dangerDist / 2000);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, `rgba(255,0,0,${vAlpha})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.restore();
}

updateMenuHighScore();
showScreen('menu-screen');
switchAudio('menu');
animateMenu();
