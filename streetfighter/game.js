const ASSETS = 'streetfighter/assets/';

// ─── Audio Engine (Web Audio API) ───
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function resumeAudio() { if (audioCtx.state === 'suspended') audioCtx.resume(); }
window.addEventListener('click', resumeAudio);
window.addEventListener('keydown', resumeAudio);
window.addEventListener('touchstart', resumeAudio);

function noiseBuf(dur) {
  const len = Math.floor(audioCtx.sampleRate * dur);
  const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * dur * 0.3));
  return buf;
}

function snd(type, vol = 0.3) {
  const now = audioCtx.currentTime;
  const g = audioCtx.createGain(); g.connect(audioCtx.destination); g.gain.value = vol;

  const play = (freq, type, dur, delay = 0, gainMul = 1) => {
    const o = audioCtx.createOscillator(); o.type = type; o.frequency.value = freq;
    const g2 = audioCtx.createGain(); g2.connect(audioCtx.destination); g2.gain.value = vol * gainMul;
    o.connect(g2); o.start(now + delay); g2.gain.exponentialRampToValueAtTime(0.01, now + delay + dur); o.stop(now + delay + dur);
  };
  const noise = (dur, delay = 0, filter = null, gainMul = 1) => {
    const src = audioCtx.createBufferSource(); src.buffer = noiseBuf(dur);
    const g2 = audioCtx.createGain(); g2.connect(audioCtx.destination); g2.gain.value = vol * gainMul;
    if (filter) { const f = audioCtx.createBiquadFilter(); f.type = filter.type; f.frequency.value = filter.freq; src.connect(f); f.connect(g2); }
    else src.connect(g2);
    src.start(now + delay);
  };

  switch (type) {
    case 'round': play(440,'square',0.6); play(554,'square',0.7,0.25); break;
    case 'you': play(660,'sine',0.3); break;
    case 'fight': play(220,'sawtooth',0.25); audioCtx.createOscillator(); const o=audioCtx.createOscillator(); o.type='sawtooth'; o.frequency.value=220; o.frequency.exponentialRampToValueAtTime(880,now+0.1); o.connect(g); o.start(now); g.gain.exponentialRampToValueAtTime(0.01,now+0.25); o.stop(now+0.25); break;
    case 'punch': noise(0.08, 0, {type:'bandpass',freq:2000}, 0.6); break;
    case 'kick': noise(0.12, 0, {type:'lowpass',freq:1200}, 0.7); break;
    case 'hit_soft': noise(0.1, 0, null, 0.8); play(300,'sine',0.1, 0, 0.4); break;
    case 'hit_hard': noise(0.15, 0, null, 1); play(120,'sawtooth',0.2, 0, 0.6); break;
    case 'block': play(150,'triangle',0.08, 0, 0.5); break;
    case 'hadouken': play(200,'sine',0.4); play(400,'sine',0.45,0.05,0.3); break;
    case 'hadouken_fly': play(600,'sine',0.6, 0, 0.1); break;
    case 'shoryuken': { const o=audioCtx.createOscillator(); o.type='sawtooth'; o.frequency.value=150; o.frequency.exponentialRampToValueAtTime(1800,now+0.4); o.connect(g); o.start(now); g.gain.exponentialRampToValueAtTime(0.01,now+0.5); o.stop(now+0.5); noise(0.3,0.05,{type:'highpass',freq:800},0.5); break; }
    case 'jump': play(300,'sine',0.12); audioCtx.createOscillator(); const o2=audioCtx.createOscillator(); o2.type='sine'; o2.frequency.value=300; o2.frequency.exponentialRampToValueAtTime(600,now+0.1); o2.connect(g); o2.start(now); g.gain.exponentialRampToValueAtTime(0.01,now+0.12); o2.stop(now+0.12); break;
    case 'ko': { const o=audioCtx.createOscillator(); o.type='sawtooth'; o.frequency.value=440; o.frequency.exponentialRampToValueAtTime(80,now+1); o.connect(g); o.start(now); g.gain.exponentialRampToValueAtTime(0.01,now+1.2); o.stop(now+1.2); noise(0.8,0.2,null,0.3); break; }
    case 'win': [523,659,784,1047].forEach((f,i) => play(f,'sine',0.15,i*0.12,0.4)); break;
    case 'final': [262,330,392,523,659,784,1047].forEach((f,i) => play(f,'square',0.2,i*0.15,0.25)); break;
    case 'charge_ready': play(800,'sine',0.15); play(1200,'sine',0.2,0.1,0.3); break;
    case 'select': play(880,'sine',0.08, 0, 0.3); break;
  }
}

let bgmTimeouts = [];
function stopBGM() {
  bgmTimeouts.forEach(t => clearTimeout(t));
  bgmTimeouts = [];
}

function startBGM() {
  stopBGM();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const bpm = 130;
  const beatDur = 60 / bpm;
  const loopLen = beatDur * 16;

  const melody = [261, 329, 392, 523, 392, 329, 261, 246, 261, 329, 392, 440, 392, 329, 261, 293];
  const bass = [130, 130, 146, 146, 164, 164, 146, 146, 130, 130, 146, 146, 164, 164, 196, 196];

  function playLoop() {
    const now = audioCtx.currentTime;
    for (let i = 0; i < melody.length; i++) {
      const t = now + i * beatDur;
      const o1 = audioCtx.createOscillator(); o1.type = 'square'; o1.frequency.value = melody[i];
      const g1 = audioCtx.createGain(); g1.gain.value = 0.06;
      o1.connect(g1); g1.connect(audioCtx.destination);
      o1.start(t); g1.gain.exponentialRampToValueAtTime(0.01, t + beatDur * 0.9); o1.stop(t + beatDur);

      const o2 = audioCtx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = bass[i] / 2;
      const g2 = audioCtx.createGain(); g2.gain.value = 0.1;
      o2.connect(g2); g2.connect(audioCtx.destination);
      o2.start(t); g2.gain.exponentialRampToValueAtTime(0.01, t + beatDur * 0.95); o2.stop(t + beatDur);

      if (i % 2 === 1) {
        const src = audioCtx.createBufferSource(); src.buffer = noiseBuf(0.05);
        const hg = audioCtx.createGain(); hg.gain.value = 0.03;
        const hf = audioCtx.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 8000;
        src.connect(hf); hf.connect(hg); hg.connect(audioCtx.destination);
        src.start(t);
      }
    }
    bgmTimeouts.push(setTimeout(playLoop, loopLen * 1000 - 20));
  }

  playLoop();
}

// ─── Utility ───
function loadJSON(path) { return fetch(path).then(r => r.json()); }
function loadImg(path) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = path; }); }

class SpriteSheet {
  constructor() { this.cache = {}; }
  async load(path, name) { const img = await loadImg(path); if (img) this.cache[name] = img; }
  get(n) { return this.cache[n] || null; }
  first() { const v = Object.values(this.cache); return v.length ? v[0] : null; }
}

// ─── Screens ───
const screens = {
  loading: document.getElementById('loading-screen'),
  select: document.getElementById('select-screen'),
  versus: document.getElementById('versus-screen'),
  result: document.getElementById('result-screen'),
};
const loadBar = document.getElementById('load-bar');
const loadText = document.getElementById('load-text');

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  if (screens[name]) screens[name].classList.remove('hidden');
}

function setLoadProgress(pct, text) {
  loadBar.style.width = pct + '%';
  if (text) loadText.textContent = text;
}

// ─── Asset Loading ───
const assetList = [];
function addAsset(path) { assetList.push(path); }

async function loadAllAssets(charNames) {
  const assets = {
    bg: null,
    ryu: { sheet: new SpriteSheet(), mapping: null },
    ken: { sheet: new SpriteSheet(), mapping: null },
    hadouken: { sheet: new SpriteSheet(), mapping: null },
    kenhadouken: { sheet: new SpriteSheet(), mapping: null },
    hikou: { sheet: new SpriteSheet(), mapping: null },
    charging: { sheet: new SpriteSheet(), mapping: null },
    announcer: { sheet: new SpriteSheet(), mapping: null },
  };

  let loaded = 0;
  const total = assetList.length;
  const update = () => { loaded++; setLoadProgress(Math.round(loaded / total * 100), `Loading ${loaded}/${total}...`); };

  for (const path of assetList) {
    try {
      const ext = path.split('.').pop().toLowerCase();
      if (ext === 'json') {
        const data = await loadJSON(path);
        // Store in appropriate asset slot
        if (path.includes('/ryu/')) assets.ryu.mapping = data;
        else if (path.includes('/ken/') && !path.includes('kenhadouken')) assets.ken.mapping = data;
        else if (path.includes('kenhadouken')) assets.kenhadouken.mapping = data;
        else if (path.includes('hadouken/') && !path.includes('kenhadouken')) assets.hadouken.mapping = data;
        else if (path.includes('hikou')) assets.hikou.mapping = data;
        else if (path.includes('charging')) assets.charging.mapping = data;
        else if (path.includes('announcer')) assets.announcer.mapping = data;
      } else if (ext === 'png' || ext === 'svg') {
        const img = await loadImg(path);
        // Store in appropriate sheet
        if (path.includes('/ryu/')) { const n = path.split('/').pop().split('.')[0]; assets.ryu.sheet.cache[n] = img; }
        else if (path.includes('/ken/') && !path.includes('kenhadouken')) { const n = path.split('/').pop().split('.')[0]; assets.ken.sheet.cache[n] = img; }
        else if (path.includes('kenhadouken')) { const n = path.split('/').pop().split('.')[0]; assets.kenhadouken.sheet.cache[n] = img; }
        else if (path.includes('hadouken/') && !path.includes('kenhadouken')) { const n = path.split('/').pop().split('.')[0]; assets.hadouken.sheet.cache[n] = img; }
        else if (path.includes('hikou')) { const n = path.split('/').pop().split('.')[0]; assets.hikou.sheet.cache[n] = img; }
        else if (path.includes('charging')) { const n = path.split('/').pop().split('.')[0]; assets.charging.sheet.cache[n] = img; }
        else if (path.includes('announcer')) { const n = path.split('/').pop().split('.')[0]; assets.announcer.sheet.cache[n] = img; }
      } else if (ext === 'gif') {
        assets.bg = await loadImg(path);
      }
    } catch(e) {}
    update();
  }

  return assets;
}

// ─── Game Constants ───
const STATE = { INTRO: 0, FIGHT: 1, ROUND_END: 2, MATCH_END: 3 };
const DISPLAY_H = 150;
const ANIM_SPEED = { idle:3, walk:6, walkback:5, jump:4, duck:2, punch:12, kick:10, hadouken:8, shoryuken:10, win:3, ko:2, block:1, hitstun:6, charge:4, recover:6 };

// ─── Canvas Setup ───
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const msgEl = document.getElementById('screen-message');
const W = 960, H = 540;
canvas.width = W; canvas.height = H;

function resize() {
  const s = Math.min(window.innerWidth / W, window.innerHeight / H);
  canvas.style.width = (W * s) + 'px';
  canvas.style.height = (H * s) + 'px';
}
window.addEventListener('resize', resize);
resize();

// ─── Input ───
const keys = {};
window.addEventListener('keydown', e => { keys[e.code] = true; e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ─── Particles ───
const particles = [];
class Particle {
  constructor(x, y, color, size) {
    this.x = x; this.y = y; this.color = color; this.size = size || 4;
    this.vx = (Math.random() - 0.5) * 10; this.vy = (Math.random() - 0.5) * 10 - 3;
    this.life = 12 + Math.random() * 18; this.maxLife = this.life;
  }
  update() { this.x += this.vx; this.y += this.vy; this.vy += 0.4; this.life--; }
  draw(c) { c.globalAlpha = this.life / this.maxLife; c.fillStyle = this.color; const s = this.size * (this.life / this.maxLife); c.fillRect(this.x - s/2, this.y - s/2, s, s); c.globalAlpha = 1; }
}
function spawnParticles(x, y, count = 8, color = null) {
  const colors = color ? [color,'#fff','#ff0'] : ['#fff','#ff0','#f80','#f00'];
  for (let i = 0; i < count; i++) particles.push(new Particle(x, y, colors[Math.floor(Math.random()*colors.length)], 2+Math.random()*4));
}

// ─── Fighter ───
class Fighter {
  constructor(cfg) {
    this.name = cfg.name;
    this.x = cfg.x; this.groundY = H - 40; this.y = this.groundY;
    this.vx = 0; this.vy = 0;
    this.facing = cfg.facing;
    this.hp = 100; this.maxHp = 100;
    this.state = 'idle'; this.stateFrame = 0;
    this.grounded = true;
    this.charge = 0; this.maxCharge = 100;
    this.attackHit = false; this.blocking = false; this.hitStun = 0;
    this.sheet = cfg.sheet; this.mapping = cfg.mapping;
    this.wins = 0;
    this.controls = cfg.controls;
    this.comboCount = 0; this.comboTimer = 0;
    this.invincible = 60;
    this.refSpriteW = 0; this.refSpriteH = 0;
    this.shoryukenActive = false; this.shoryukenFrame = 0;
    this.chargeAura = cfg.chargeSheet; this.chargeMap = cfg.chargeMap;
    this.hadoukenPose = 0;
    this.totalDmgDealt = 0; this.maxCombo = 0;
  }

  getFrames(prefix) {
    const out = [];
    if (!this.mapping) return out;
    for (const k of Object.keys(this.mapping.costumes)) {
      if (k.toLowerCase().startsWith(prefix.toLowerCase())) out.push(k);
    }
    return out;
  }

  getImage() {
    const map = {
      idle: ['Standard','Idle1','Idle'], walk: ['WalkForward','Walk1','Walk'],
      walkback: ['WalkBackward'], jump: ['Jump'], duck: ['Ducken','Duck'],
      punch: ['DoublePunch','Punch'], kick: ['HighKick','Kick'],
      hadouken: ['Hadouken'], shoryuken: ['Shoyuken','Shoryuken'],
      win: ['Win','EinsVonDerWinRei','Win1'], ko: ['KO'],
      block: ['Blocken','Block'], hitstun: ['Getroffen','Recover'],
      charge: ['Charge'], start: ['Start'],
    };
    const cands = map[this.state] || [this.state];
    for (const c of cands) {
      const frames = this.getFrames(c);
      if (frames.length) {
        const idx = Math.floor(this.stateFrame) % frames.length;
        return this.sheet.get(frames[idx]) || this.sheet.get(frames[0]) || null;
      }
    }
    return this.sheet.first();
  }

  doShoryuken() {
    this.state = 'shoryuken'; this.stateFrame = 0; this.attackHit = false;
    this.charge = 0; this.vy = -14; this.grounded = false;
    this.vx = this.facing * 3; this.shoryukenActive = true; this.shoryukenFrame = 0;
    this.invincible = 15;
    snd('shoryuken', 0.4);
    spawnParticles(this.x + this.facing * 20, this.y - DISPLAY_H * 0.3, 20, '#ff6600');
    return 'shoryuken';
  }

  update(opponent) {
    const c = this.controls;
    let action = null;
    this.facing = opponent.x > this.x ? 1 : -1;

    if (this.hitStun > 0) { this.hitStun--; this.state = 'hitstun'; this.vx *= 0.85; }
    else {
      if (this.invincible > 0) this.invincible--;
      this.blocking = (this.facing === 1 && keys[c.left]) || (this.facing === -1 && keys[c.right]);

      let moveX = 0;
      if (keys[c.left]) moveX = -1;
      if (keys[c.right] && moveX === 0) moveX = 1;

      if (keys[c.up] && this.grounded) { this.vy = -12; this.grounded = false; this.state = 'jump'; this.stateFrame = 0; snd('jump',0.2); }
      else if (keys[c.down] && this.grounded) { this.state = 'duck'; this.stateFrame = 0; }
      else if (keys[c.punch]) { this.state = 'punch'; this.stateFrame = 0; this.attackHit = false; keys[c.punch] = false; snd('punch',0.3); }
      else if (keys[c.kick]) { this.state = 'kick'; this.stateFrame = 0; this.attackHit = false; keys[c.kick] = false; snd('kick',0.3); }
      else if (keys[c.hadouken] && this.charge >= 30) { this.state = 'hadouken'; this.stateFrame = 0; this.attackHit = false; this.charge -= 30; keys[c.hadouken] = false; this.hadoukenPose = 15; action = 'hadouken'; }
      else if (keys[c.special] && this.charge >= 50) { action = this.doShoryuken(); keys[c.special] = false; }
      else if (moveX !== 0) {
        this.vx = moveX * 3.5;
        if (this.grounded && !['punch','kick','hadouken','shoryuken'].includes(this.state)) {
          this.state = ((this.facing===1&&moveX===-1)||(this.facing===-1&&moveX===1)) ? 'walkback' : 'walk';
          this.stateFrame = 0;
        }
      }
      else if (this.grounded) { this.vx *= 0.8; if (this.state !== 'idle' && this.state !== 'hadouken') { this.state = 'idle'; this.stateFrame = 0; } }
    }

    if (!this.grounded) { this.vy += 0.6; this.y += this.vy; if (this.y >= this.groundY) { this.y = this.groundY; this.vy = 0; this.grounded = true; if (this.state==='jump'){this.state='idle';this.stateFrame=0;} } }

    this.x += this.vx; this.x = Math.max(30, Math.min(W-30, this.x));
    this.stateFrame += (ANIM_SPEED[this.state]||5) / 60;

    const atkStates = ['punch','kick','hadouken','shoryuken'];
    if (atkStates.includes(this.state)) {
      const px = this.state==='shoryuken'?'shoyuken':this.state;
      const frames = this.getFrames(px);
      if (frames.length && this.stateFrame >= frames.length) { this.state = 'idle'; this.stateFrame = 0; if(this.state==='shoryuken') this.shoryukenActive=false; }
    }

    if (this.hadoukenPose > 0) this.hadoukenPose--;
    else if (this.state === 'hadouken') { this.state = 'idle'; this.stateFrame = 0; }

    if (this.shoryukenActive) { this.shoryukenFrame += 8/60; if (this.shoryukenFrame >= 12) this.shoryukenActive = false; }
    if (this.grounded) this.charge = Math.min(this.maxCharge, this.charge + 0.25);
    if (this.comboTimer > 0) { this.comboTimer--; if (this.comboTimer === 0) this.comboCount = 0; }

    if (!this.attackHit && (this.state==='punch'||this.state==='kick'||this.state==='shoryuken')) {
      const px = this.state==='shoryuken'?'shoyuken':this.state;
      const frames = this.getFrames(px);
      const mid = frames.length ? Math.floor(frames.length*0.4) : 0;
      if (frames.length && this.stateFrame >= mid) {
        const range = this.state==='shoryuken'?90:(this.state==='kick'?75:65);
        if (Math.abs(this.x+this.facing*35-opponent.x)<range && Math.abs(this.y-opponent.y)<90 && opponent.invincible<=0) {
          this.attackHit = true;
          if (opponent.blocking) { opponent.hp-=3; opponent.vx=this.facing*5; opponent.hitStun=10; snd('block',0.4); spawnParticles((this.x+opponent.x)/2,this.y-DISPLAY_H*0.4,5,'#88f'); }
          else {
            const dmg = this.state==='shoryuken'?25:(this.state==='kick'?12:8);
            opponent.hp -= dmg; opponent.hitStun=this.state==='shoryuken'?25:18;
            opponent.vx=this.facing*(this.state==='shoryuken'?10:6);
            if (this.state==='shoryuken') opponent.vy=-8;
            this.totalDmgDealt += dmg;
            this.comboCount++; this.comboTimer=60;
            if (this.comboCount > this.maxCombo) this.maxCombo = this.comboCount;
            spawnParticles(opponent.x, this.y-DISPLAY_H*0.5, this.state==='shoryuken'?25:12);
            snd(this.state==='shoryuken'?'hit_hard':'hit_soft',0.4);
          }
        }
      }
    }
    return action;
  }

  draw(c) {
    const img = this.getImage();
    if (!img) { c.fillStyle=this.name==='Ryu'?'#fff':'#e44'; c.fillRect(this.x-20,this.y-DISPLAY_H,40,DISPLAY_H); return; }

    const refW = this.refSpriteW || img.width, refH = this.refSpriteH || img.height;
    const scale = DISPLAY_H / refH;
    const w = refW * scale, h = refH * scale;

    c.save(); c.translate(this.x, this.y);
    const flip = this.name==='Ken' ? this.facing===1 : this.facing===-1;
    if (flip) c.scale(-1,1);
    if (this.invincible>0 && Math.floor(this.invincible/3)%2===0) c.globalAlpha=0.35;
    c.drawImage(img, -w/2, -h, w, h);

    if (this.charge>=80 && this.chargeAura) {
      const cn = Object.keys(this.chargeMap.costumes);
      const ci = Math.floor(Date.now()/100)%cn.length;
      const ci2 = this.chargeAura.get(cn[ci]);
      if (ci2) { c.globalAlpha=0.25+Math.sin(Date.now()/200)*0.1; c.drawImage(ci2,-w/2,-h*0.9,w,h*0.9); c.globalAlpha=1; }
    }
    c.restore();

    if (this.shoryukenActive && window.hikouSheet && window.hikouMap) {
      const hn = Object.keys(window.hikouMap.costumes);
      const hi = Math.floor(this.shoryukenFrame)%hn.length;
      const hImg = window.hikouSheet.get(hn[hi]);
      if (hImg) { c.save(); c.translate(this.x,this.y); if(flip)c.scale(-1,1); c.globalAlpha=0.7+Math.sin(this.shoryukenFrame)*0.2; const fs=1.5; c.drawImage(hImg,-hImg.width*fs/2+10,-hImg.height*fs+10,hImg.width*fs,hImg.height*fs); c.globalAlpha=1; c.restore(); }
    }
  }
}

// ─── Projectile ───
class Projectile {
  constructor(x,y,facing,type,owner,sheet,mapping) {
    this.x=x; this.y=y; this.facing=facing; this.owner=owner; this.speed=7; this.active=true; this.frame=0;
    this.sheet=sheet; this.mapping=mapping; this.type=type;
  }
  update() { this.x+=this.speed*this.facing; this.frame+=0.2; if(this.x<-50||this.x>W+50) this.active=false; }
  draw(c) {
    if (!this.mapping) return;
    const names = Object.keys(this.mapping.costumes);
    const img = this.sheet.get(names[Math.floor(this.frame)%names.length]);
    if (!img) return;
    c.drawImage(img, this.x-28, this.y-28, 56, 56);
  }
}

// ─── Game State ───
let ryu, ken, projectiles = [];
let gameState = STATE.INTRO, stateTimer = 0, roundTimer = 99, round = 1;
let screenShake = 0, bgImage = null, loaded = false;
let lastTime = 0, timerAccum = 0;
let assets = null;
let selectedChars = { p1: 'Ryu', p2: 'Ken' };
let gameStats = { rounds: 0, totalDmg: 0, maxCombo: 0 };

// ─── Init: Load assets, show screens ───
async function init() {
  showScreen('loading');

  // Build asset list
  const chars = ['ryu','ken'];
  const projTypes = ['hadouken','kenhadouken'];
  const effects = ['hikou','charging','announcer'];

  for (const ch of chars) {
    try {
      const m = await loadJSON(`${ASSETS}${ch}/mapping.json`);
      for (const [key, file] of Object.entries(m.costumes)) {
        addAsset(`${ASSETS}${ch}/${file}`);
      }
    } catch(e) {}
  }
  for (const t of projTypes) {
    try {
      const m = await loadJSON(`${ASSETS}${t}/mapping.json`);
      for (const [k,f] of Object.entries(m.costumes)) addAsset(`${ASSETS}${t}/${f}`);
    } catch(e) {}
  }
  for (const e of effects) {
    try {
      const m = await loadJSON(`${ASSETS}${e}/mapping.json`);
      for (const [k,f] of Object.entries(m.costumes)) addAsset(`${ASSETS}${e}/${f}`);
    } catch(e) {}
  }
  addAsset(`${ASSETS}stages/sf2-ken-stage.gif`);

  // Load all
  assets = await loadAllAssets(chars);

  // Set reference sizes
  ['ryu','ken'].forEach(ch => {
    const idle = assets[ch].sheet.get('Standard') || assets[ch].sheet.get('Idle1') || assets[ch].sheet.first();
    if (idle) { assets[ch].refSpriteW = idle.width; assets[ch].refSpriteH = idle.height; }
  });

  // Store globals for shoryuken effect
  window.hikouSheet = assets.hikou.sheet;
  window.hikouMap = assets.hikou.mapping;

  bgImage = assets.bg;

  // Character select screen
  setLoadProgress(100, 'Loading complete!');
  await new Promise(r => setTimeout(r, 500));
  showSelectScreen();
}

function showSelectScreen() {
  stopBGM();
  showScreen('select');

  // Draw previews
  const ryuImg = assets.ryu.sheet.get('Standard') || assets.ryu.sheet.first();
  const kenImg = assets.ken.sheet.get('Standard') || assets.ken.sheet.first();
  if (ryuImg) {
    const rc = document.getElementById('preview-ryu').getContext('2d');
    rc.drawImage(ryuImg, 0, 0, 80, 80);
  }
  if (kenImg) {
    const kc = document.getElementById('preview-ken').getContext('2d');
    kc.drawImage(kenImg, 0, 0, 80, 80);
  }

  // Selection logic
  let p1 = 'Ryu', p2 = 'Ken';
  document.getElementById('char-ryu').classList.add('selected');
  document.getElementById('char-ken').classList.add('selected');

  document.getElementById('char-ryu').addEventListener('click', () => { p1 = 'Ryu'; updateSelection(); });
  document.getElementById('char-ken').addEventListener('click', () => { p2 = 'Ken'; updateSelection(); });

  function updateSelection() {
    document.getElementById('char-ryu').classList.toggle('selected', true);
    document.getElementById('char-ken').classList.toggle('selected', true);
    document.getElementById('start-btn').disabled = false;
  }

  document.getElementById('start-btn').addEventListener('click', () => {
    selectedChars = { p1, p2 };
    showVersusScreen();
  });
}

function showVersusScreen() {
  showScreen('versus');
  document.getElementById('vs-p1-name').textContent = selectedChars.p1.toUpperCase();
  document.getElementById('vs-p2-name').textContent = selectedChars.p2.toUpperCase();

  // Draw vs characters
  const p1Assets = selectedChars.p1 === 'Ryu' ? assets.ryu : assets.ken;
  const p2Assets = selectedChars.p2 === 'Ryu' ? assets.ryu : assets.ken;
  const p1Img = p1Assets.sheet.get('Standard') || p1Assets.sheet.first();
  const p2Img = p2Assets.sheet.get('Standard') || p2Assets.sheet.first();
  if (p1Img) { const c = document.getElementById('vs-p1').getContext('2d'); c.drawImage(p1Img,0,0,120,120); }
  if (p2Img) { const c = document.getElementById('vs-p2').getContext('2d'); c.drawImage(p2Img,0,0,120,120); }

  snd('round', 0.4);

  setTimeout(() => {
    screens.versus.classList.add('hidden');
    startGame();
  }, 2500);
}

function showResultScreen(winner) {
  stopBGM();
  showScreen('result');
  document.getElementById('result-title').textContent = 'K.O.!';
  document.getElementById('result-winner').textContent = winner.name + ' WINS!';

  const stats = `Rounds: ${round} | Max Combo: ${Math.max(ryu.maxCombo, ken.maxCombo)} | Damage: ${Math.max(ryu.totalDmgDealt, ken.totalDmgDealt)}`;
  document.getElementById('result-stats').textContent = stats;

  document.getElementById('rematch-btn').onclick = () => {
    screens.result.classList.add('hidden');
    startGame();
  };
  document.getElementById('menu-btn').onclick = () => {
    screens.result.classList.add('hidden');
    showSelectScreen();
  };
}

function startGame() {
  const p1Name = selectedChars.p1;
  const p2Name = selectedChars.p2;
  const p1Data = p1Name === 'Ryu' ? assets.ryu : assets.ken;
  const p2Data = p2Name === 'Ryu' ? assets.ryu : assets.ken;

  ryu = new Fighter({
    name: p1Name, x: 250, facing: 1,
    sheet: p1Data.sheet, mapping: p1Data.mapping,
    controls: { left:'KeyA', right:'KeyD', up:'KeyW', down:'KeyS', punch:'KeyJ', kick:'KeyK', hadouken:'KeyL', special:'KeyF' },
    chargeSheet: assets.charging.sheet, chargeMap: assets.charging.mapping,
  });
  ryu.refSpriteW = p1Data.refSpriteW || 80;
  ryu.refSpriteH = p1Data.refSpriteH || 100;

  ken = new Fighter({
    name: p2Name, x: 710, facing: -1,
    sheet: p2Data.sheet, mapping: p2Data.mapping,
    controls: { left:'ArrowLeft', right:'ArrowRight', up:'ArrowUp', down:'ArrowDown', punch:'Numpad1', kick:'Numpad2', hadouken:'Numpad3', special:'Numpad0' },
    chargeSheet: assets.charging.sheet, chargeMap: assets.charging.mapping,
  });
  ken.refSpriteW = p2Data.refSpriteW || 80;
  ken.refSpriteH = p2Data.refSpriteH || 100;

  // Ken flip logic: if Ken sprites face left by default
  // Actually we handle this in draw based on name

  projectiles = []; particles.length = 0;
  gameState = STATE.INTRO; stateTimer = 180; roundTimer = 99; round = 1; timerAccum = 0;
  screenShake = 0;
  snd('round', 0.4);
  startBGM();

  loaded = true;
  if (!window._gameLoopStarted) {
    window._gameLoopStarted = true;
    requestAnimationFrame(gameLoop);
  }
}

function showMessage(text, dur = 60) {
  msgEl.textContent = text;
  msgEl.style.display = 'block';
  setTimeout(() => { msgEl.style.display = 'none'; }, dur * 16.67);
}

function gameLoop(ts) {
  if (!loaded) return;
  const dt = ts - lastTime;
  lastTime = ts;

  switch (gameState) {
    case STATE.INTRO:
      stateTimer--;
      if (stateTimer===120) { snd('you',0.3); showMessage('YOU!',40); }
      if (stateTimer===60) { snd('fight',0.4); showMessage('FIGHT!',40); }
      if (stateTimer<=0) { gameState=STATE.FIGHT; roundTimer=99; timerAccum=0; }
      break;
    case STATE.FIGHT:
      timerAccum += dt;
      if (timerAccum >= 1000) { timerAccum -= 1000; roundTimer--; if (roundTimer <= 0) endRound(); }
      const rAct = ryu.update(ken);
      const kAct = ken.update(ryu);
      if (rAct==='hadouken') {
        const p = new Projectile(ryu.x+ryu.facing*50, ryu.y-DISPLAY_H*0.5, ryu.facing, 'hadouken', ryu, assets.hadouken.sheet, assets.hadouken.mapping);
        projectiles.push(p); snd('hadouken',0.4);
      }
      if (kAct==='hadouken') {
        const p = new Projectile(ken.x+ken.facing*50, ken.y-DISPLAY_H*0.5, ken.facing, 'kenhadouken', ken, assets.kenhadouken.sheet, assets.kenhadouken.mapping);
        projectiles.push(p); snd('hadouken',0.4);
      }
      for (const p of projectiles) {
        p.update();
        if (Math.floor(p.frame)%20===0) snd('hadouken_fly',0.1);
        const tgt = p.owner===ryu ? ken : ryu;
        if (p.active && Math.abs(p.x-tgt.x)<45 && Math.abs(p.y-(tgt.y-DISPLAY_H*0.5))<55 && tgt.invincible<=0) {
          if (tgt.blocking) { tgt.hp-=3; tgt.vx=p.facing*4; tgt.hitStun=12; snd('block',0.4); }
          else { tgt.hp-=14; tgt.hitStun=22; tgt.vx=p.facing*6; spawnParticles(p.x,p.y,20); snd('hit_hard',0.5); screenShake=12; }
          p.active = false;
        }
      }
      projectiles = projectiles.filter(p => p.active);
      const pd = Math.abs(ryu.x-ken.x);
      if (pd<45) { const push=(45-pd)/2; if(ryu.x<ken.x){ryu.x-=push;ken.x+=push;}else{ryu.x+=push;ken.x-=push;} }
      if (ryu.hp<=0) { ryu.hp=0; endRound('ken'); }
      if (ken.hp<=0) { ken.hp=0; endRound('ryu'); }
      break;
    case STATE.ROUND_END:
      stateTimer--;
      if (stateTimer<=0) {
        if (ryu.wins>=2||ken.wins>=2) {
          const w = ryu.wins>=2 ? ryu : ken;
          snd('final',0.4);
          showResultScreen(w);
          return;
        } else {
          round++; startRound();
        }
      }
      break;
  }

  for (let i=particles.length-1;i>=0;i--) { particles[i].update(); if(particles[i].life<=0) particles.splice(i,1); }
  if (screenShake>0) screenShake--;

  draw();
  requestAnimationFrame(gameLoop);
}

function endRound(winner) {
  gameState = STATE.ROUND_END; stateTimer = 150;
  if (winner==='ryu') { ryu.wins++; snd('win',0.4); ryu.state='win'; ken.state='ko'; }
  else if (winner==='ken') { ken.wins++; snd('win',0.4); ken.state='win'; ryu.state='ko'; }
  else { if(ryu.hp>ken.hp){ryu.wins++;ryu.state='win';ken.state='ko';} else if(ken.hp>ryu.hp){ken.wins++;ken.state='win';ryu.state='ko';} else showMessage('DRAW!',60); }
  snd('ko',0.5); showMessage('K.O.!',80); screenShake=15;
}

function startRound() {
  [ryu,ken].forEach(f => { f.x=f===ryu?250:710; f.y=f.groundY; f.hp=100; f.state='idle'; f.stateFrame=0; f.charge=0; f.hitStun=0; f.grounded=true; f.vx=0; f.vy=0; f.invincible=60; });
  projectiles=[]; particles.length=0;
  gameState=STATE.INTRO; stateTimer=180; roundTimer=99; timerAccum=0;
  snd('round',0.4);
}

function draw() {
  ctx.save();
  if (screenShake>0) ctx.translate((Math.random()-0.5)*screenShake*2,(Math.random()-0.5)*screenShake*2);
  if (bgImage) ctx.drawImage(bgImage,0,0,W,H);
  else { const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#1a0a2e'); g.addColorStop(1,'#16213e'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
  ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fillRect(0,H-40,W,40);
  ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0,H-40); ctx.lineTo(W,H-40); ctx.stroke();
  ryu.draw(ctx); ken.draw(ctx);
  for (const p of projectiles) p.draw(ctx);
  for (const p of particles) p.draw(ctx);
  drawHUD();
  ctx.restore();
}

function drawHUD() {
  const bw=350, bh=25, by=20, gap=10;
  ctx.fillStyle='#333'; ctx.fillRect(gap,by,bw,bh);
  ctx.fillStyle=`hsl(${120*ryu.hp/100},80%,50%)`; ctx.fillRect(gap,by,bw*ryu.hp/100,bh);
  ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.strokeRect(gap,by,bw,bh);

  const kx=W-gap-bw;
  ctx.fillStyle='#333'; ctx.fillRect(kx,by,bw,bh);
  ctx.fillStyle=`hsl(${120*ken.hp/100},80%,50%)`; ctx.fillRect(kx+bw*(1-ken.hp/100),by,bw*ken.hp/100,bh);
  ctx.strokeRect(kx,by,bw,bh);

  ctx.fillStyle='#fff'; ctx.font='bold 16px Arial'; ctx.textAlign='left'; ctx.fillText('P1: '+ryu.name,gap+5,by+18);
  ctx.textAlign='right'; ctx.fillText('P2: '+ken.name,W-gap-5,by+18);

  ctx.textAlign='left';
  for(let i=0;i<ryu.wins;i++){ctx.fillStyle='#ffeb3b';ctx.beginPath();ctx.arc(gap+bw+15+i*20,by+bh/2,6,0,Math.PI*2);ctx.fill();}
  ctx.textAlign='right';
  for(let i=0;i<ken.wins;i++){ctx.fillStyle='#ffeb3b';ctx.beginPath();ctx.arc(kx-15-i*20,by+bh/2,6,0,Math.PI*2);ctx.fill();}

  ctx.fillStyle='#000'; ctx.fillRect(W/2-30,by-5,60,bh+10);
  ctx.strokeStyle='#ffeb3b'; ctx.strokeRect(W/2-30,by-5,60,bh+10);
  ctx.fillStyle=roundTimer<=10?'#f44336':'#fff'; ctx.font='bold 24px Arial'; ctx.textAlign='center'; ctx.fillText(Math.ceil(roundTimer),W/2,by+22);
  ctx.fillStyle='#fff'; ctx.font='14px Arial'; ctx.fillText('ROUND '+round,W/2,by-10);

  drawCharge(ryu,20,H-50,'P1');
  drawCharge(ken,W-170,H-50,'P2');

  if(ryu.comboCount>1&&ryu.comboTimer>0){ctx.fillStyle='#ffeb3b';ctx.font='bold 28px Arial';ctx.textAlign='left';ctx.fillText(ryu.comboCount+' HIT COMBO!',20,H-70);}
  if(ken.comboCount>1&&ken.comboTimer>0){ctx.fillStyle='#ffeb3b';ctx.font='bold 28px Arial';ctx.textAlign='right';ctx.fillText(ken.comboCount+' HIT COMBO!',W-20,H-70);}
}

function drawCharge(f,x,y,label) {
  const w=150,h=12;
  ctx.fillStyle='#222'; ctx.fillRect(x,y,w,h);
  const p=f.charge/f.maxCharge;
  ctx.fillStyle=p>=0.5?'#ff5722':(p>=0.3?'#ff9800':'#2196f3');
  ctx.fillRect(x,y,w*p,h);
  ctx.strokeStyle='#666'; ctx.lineWidth=1; ctx.strokeRect(x,y,w,h);
  ctx.fillStyle='#aaa'; ctx.font='10px Arial'; ctx.textAlign='left'; ctx.fillText(label,x,y-4);
  if(p>=0.5){ctx.fillStyle='#ff5722';ctx.font='bold 10px Arial';ctx.fillText('SPECIAL [F]',x,y+h+12);}
}

// Start
init();
