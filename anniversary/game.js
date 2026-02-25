// ============================================================
// Anna & Andrey – Anniversary Roller Runner
// A love story on wheels. Open index.html to play!
// ============================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = 800, H = 500;

// ── Milestones (collect in order) ───────────────────
const MILESTONES = [
  { key:'ring',   label:'The Ring',       emoji:'\uD83D\uDC8D', caption:'"She said yes!"',               color:'#FFD700' },
  { key:'car',    label:'The EV',         emoji:'\uD83D\uDE97', caption:'"California mode activated!"',  color:'#66BB6A' },
  { key:'house',  label:'First Home',     emoji:'\uD83C\uDFE0', caption:'"Home sweet home!"',            color:'#CD853F' },
  { key:'alisa',  label:'Alisa',          emoji:'\uD83D\uDC67', caption:'"Welcome, Alisa!"',             color:'#FF69B4' },
  { key:'arisha', label:'Arisha',         emoji:'\uD83D\uDC76', caption:'"The gang\'s all here!"',       color:'#DDA0DD' },
  { key:'family', label:'Family Photo',   emoji:'\uD83D\uDCF8', caption:'"Together forever!"',           color:'#FF4444' },
];

// ── Asset loading (graceful fallback) ───────────────
const imgs = {};
function tryLoad(k, src) {
  const i = new Image(); i.src = src;
  i.onload = () => { imgs[k] = i; };
}
tryLoad('couple', 'assets/sprites/couple.png');
tryLoad('alisa-icon', 'assets/sprites/alisa-icon.png');
tryLoad('arisha-icon', 'assets/sprites/arisha-icon.png');
MILESTONES.forEach(m => tryLoad(m.key, 'assets/photos/photo-' + m.key + '.jpg'));

// ── Synthesized sound effects ───────────────────────
let ac;
function initAudio() { ac = new (window.AudioContext || window.webkitAudioContext)(); }
function beep(freq, dur, type, vol) {
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type || 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(vol || 0.1, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
  o.connect(g).connect(ac.destination);
  o.start(); o.stop(ac.currentTime + dur);
}
function sfxCollect() { beep(660, 0.1); setTimeout(() => beep(880, 0.12), 80); }
function sfxHit() { beep(120, 0.25, 'sawtooth', 0.12); }
function sfxWin() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.3), i * 150)); }

// ── Game state ──────────────────────────────────────
const LANES = [200, 400, 600];
const PY = H - 85;
let state = 'title'; // title | play | popup | win | over
let lane = 1, playerX = LANES[1], jumpY = 0, jumpV = 0, jumping = false;
let lives = 3, score = 0, speed = 3, msIdx = 0;
let ents = [], spawnT = 0, spawnI = 80;
let inv = 0, shakeT = 0;
let magnet = false, magT = 0, magCD = 0;
let bgOff = 0, confetti = [];

// ── DOM refs for popup ──────────────────────────────
const popupEl  = document.getElementById('popup');
const popupImg = document.getElementById('popup-img');
const popupPH  = document.getElementById('popup-placeholder');
const popupTtl = document.getElementById('popup-title');
const popupCap = document.getElementById('popup-caption');

// ── Input ───────────────────────────────────────────
const held = {};
document.addEventListener('keydown', e => {
  if (held[e.code]) return;
  held[e.code] = true;
  if (['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault();

  if (e.code === 'Space') {
    if (state === 'title') { initAudio(); reset(); state = 'play'; return; }
    if (state === 'popup') { closePopup(); return; }
    if (state === 'win' || state === 'over') { state = 'title'; return; }
    if (state === 'play' && !jumping) { jumping = true; jumpV = -11; }
  }
  if (state !== 'play') return;
  if (e.code === 'ArrowLeft'  && lane > 0) lane--;
  if (e.code === 'ArrowRight' && lane < 2) lane++;
  if (e.code === 'KeyH' && magCD <= 0) { magnet = true; magT = 180; magCD = 600; }
});
document.addEventListener('keyup', e => { held[e.code] = false; });

// ── Core logic ──────────────────────────────────────
function reset() {
  lane = 1; playerX = LANES[1]; jumpY = 0; jumpV = 0; jumping = false;
  lives = 3; score = 0; speed = 3; msIdx = 0;
  ents = []; spawnT = 0; spawnI = 80; inv = 0; shakeT = 0;
  magnet = false; magT = 0; magCD = 0; confetti = [];
}

function spawn() {
  const l = Math.floor(Math.random() * 3);
  if (Math.random() < 0.3 && msIdx < MILESTONES.length)
    ents.push({ type: 'ms', lane: l, y: -40 });
  else
    ents.push({ type: Math.random() < 0.5 ? 'cone' : 'puddle', lane: l, y: -40 });
}

function update() {
  if (state !== 'play') return;
  score += Math.ceil(speed);
  bgOff = (bgOff + speed) % 40;
  speed = 3 + score / 6000;

  // Smooth lane movement
  playerX += (LANES[lane] - playerX) * 0.25;

  // Jump
  if (jumping) { jumpV += 0.65; jumpY += jumpV; if (jumpY >= 0) { jumpY = 0; jumping = false; } }
  if (inv > 0) inv--;
  if (shakeT > 0) shakeT--;
  if (magnet) { magT--; if (magT <= 0) magnet = false; }
  if (magCD > 0) magCD--;

  // Spawn
  if (++spawnT >= spawnI) { spawnT = 0; spawn(); spawnI = Math.max(35, 80 - score / 800); }

  // Move + collide
  const py = PY + jumpY;
  ents.forEach(e => {
    e.y += speed + 1;
    if (magnet && e.type === 'ms') {
      const dx = lane - e.lane;
      if (dx && Math.abs(e.y - py) < 250) e.lane += dx * 0.04;
    }
  });
  ents = ents.filter(e => {
    if (e.y > H + 50) return false;
    const ex = LANES[Math.round(e.lane)];
    if (Math.abs(playerX - ex) < 45 && Math.abs(py - e.y) < 40) {
      if (e.type === 'ms') { sfxCollect(); showPopup(); return false; }
      if (jumping && jumpY < -20) return true;
      if (inv > 0) return true;
      sfxHit(); lives--; inv = 90; shakeT = 12;
      if (lives <= 0) state = 'over';
      return false;
    }
    return true;
  });
}

// ── Popup ───────────────────────────────────────────
function showPopup() {
  state = 'popup';
  const ms = MILESTONES[msIdx];
  const photo = imgs[ms.key];
  if (photo) {
    popupImg.src = photo.src; popupImg.style.display = 'block'; popupPH.style.display = 'none';
  } else {
    popupImg.style.display = 'none'; popupPH.style.display = 'block';
    popupPH.textContent = '\uD83D\uDCF7 TODO: drop photo-' + ms.key + '.jpg into assets/photos/';
  }
  popupTtl.textContent = ms.emoji + ' ' + ms.label;
  popupCap.textContent = ms.caption;
  popupEl.classList.remove('hidden');
}

function closePopup() {
  popupEl.classList.add('hidden');
  msIdx++;
  if (msIdx >= MILESTONES.length) {
    sfxWin(); state = 'win';
    for (let i = 0; i < 80; i++)
      confetti.push({ x: Math.random() * W, y: -Math.random() * H,
        vy: 1 + Math.random() * 3, vx: (Math.random() - 0.5) * 2,
        c: ['#FF69B4','#FFD700','#4169E1','#66BB6A','#FF6347'][i % 5],
        s: 3 + Math.random() * 5 });
  } else { state = 'play'; }
}

// ── Drawing ─────────────────────────────────────────
function drawBG() {
  // Sky
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#87CEEB'); g.addColorStop(1, '#c8e6c9');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // Grass
  ctx.fillStyle = '#5a9e3e'; ctx.fillRect(0, 0, 115, H); ctx.fillRect(685, 0, 115, H);
  ctx.fillStyle = '#4a8530'; ctx.fillRect(110, 0, 5, H); ctx.fillRect(685, 0, 5, H);
  // Path
  ctx.fillStyle = '#c4b89a'; ctx.fillRect(115, 0, 570, H);
  // Lane dashes
  ctx.strokeStyle = '#b0a080'; ctx.lineWidth = 2;
  ctx.setLineDash([20, 20]); ctx.lineDashOffset = -bgOff;
  [300, 500].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); });
  ctx.setLineDash([]); ctx.lineDashOffset = 0;
}

function drawPlayer() {
  const py = PY + jumpY;
  if (inv > 0 && Math.floor(inv / 4) % 2) return; // blink

  if (imgs.couple) {
    ctx.drawImage(imgs.couple, playerX - 30, py - 50, 60, 80);
  } else {
    // Andrey (blue)
    ctx.fillStyle = '#4169E1';
    ctx.beginPath(); ctx.arc(playerX + 9, py - 42, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(playerX + 2, py - 32, 16, 28);
    // Anna (pink)
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath(); ctx.arc(playerX - 9, py - 38, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(playerX - 15, py - 29, 14, 25);
    // Rollerblades
    ctx.fillStyle = '#555';
    ctx.fillRect(playerX - 18, py - 2, 16, 4);
    ctx.fillRect(playerX + 2, py - 2, 16, 4);
    ctx.fillStyle = '#333';
    for (let i = 0; i < 4; i++) { ctx.fillRect(playerX - 17 + i * 5, py + 2, 3, 3); }
    for (let i = 0; i < 4; i++) { ctx.fillRect(playerX + 3 + i * 5, py + 2, 3, 3); }
  }
  // Hold-hands hearts
  if (magnet) {
    ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('\u2764\uFE0F', playerX, py - 58);
    ctx.textAlign = 'left';
  }
  // Jump shadow
  if (jumping) {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(playerX, PY + 5, 22, 5, 0, 0, Math.PI * 2); ctx.fill();
  }
}

function drawEnts() {
  ents.forEach(e => {
    const ex = LANES[Math.round(e.lane)];
    if (e.type === 'ms' && msIdx < MILESTONES.length) {
      const ms = MILESTONES[msIdx];
      // Try custom icon for alisa/arisha
      const icon = ms.key === 'alisa' ? imgs['alisa-icon'] : ms.key === 'arisha' ? imgs['arisha-icon'] : null;
      ctx.shadowColor = ms.color; ctx.shadowBlur = 14;
      if (icon) {
        ctx.drawImage(icon, ex - 20, e.y - 20, 40, 40);
      } else {
        ctx.font = '34px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(ms.emoji, ex, e.y + 10);
      }
      ctx.shadowBlur = 0; ctx.textAlign = 'left';
    } else if (e.type === 'cone') {
      ctx.fillStyle = '#FF6600';
      ctx.beginPath(); ctx.moveTo(ex, e.y - 20); ctx.lineTo(ex - 13, e.y + 8); ctx.lineTo(ex + 13, e.y + 8); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillRect(ex - 6, e.y - 8, 12, 3);
      ctx.fillStyle = '#FF8800'; ctx.fillRect(ex - 16, e.y + 8, 32, 5);
    } else if (e.type === 'puddle') {
      ctx.fillStyle = 'rgba(60,130,220,0.45)';
      ctx.beginPath(); ctx.ellipse(ex, e.y, 28, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(60,130,220,0.25)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(ex, e.y, 34, 13, 0, 0, Math.PI * 2); ctx.stroke();
    }
  });
}

function drawHUD() {
  ctx.font = 'bold 18px sans-serif'; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
  const s = 'Score: ' + score;
  ctx.strokeText(s, 15, 28); ctx.fillText(s, 15, 28);
  // Lives
  ctx.font = '20px sans-serif';
  for (let i = 0; i < 3; i++) ctx.fillText(i < lives ? '\u2764\uFE0F' : '\uD83D\uDDA4', W - 88 + i * 28, 28);
  // Milestone target
  if (msIdx < MILESTONES.length) {
    const ms = MILESTONES[msIdx];
    ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
    const t = 'Collect: ' + ms.emoji + ' ' + ms.label;
    ctx.strokeText(t, W / 2, 25); ctx.fillText(t, W / 2, 25);
    // Progress dots
    for (let i = 0; i < MILESTONES.length; i++) {
      ctx.fillStyle = i < msIdx ? '#FFD700' : i === msIdx ? '#fff' : '#666';
      ctx.beginPath(); ctx.arc(W / 2 - 50 + i * 20, 42, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.textAlign = 'left';
  }
  // Magnet status
  ctx.font = '13px sans-serif';
  ctx.fillStyle = magnet ? '#FFD700' : magCD > 0 ? '#888' : '#ddd';
  ctx.fillText(magnet ? '[H] Holding Hands!' : magCD > 0 ? '[H] Cooldown ' + Math.ceil(magCD / 60) + 's' : '[H] Hold Hands Ready', 15, H - 12);
  // Controls
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
  ctx.fillText('\u2190 \u2192 Move  |  SPACE Jump  |  H Hold Hands', W / 2, H - 8);
  ctx.textAlign = 'left';
}

// ── Screens ─────────────────────────────────────────
function drawTitle() {
  drawBG();
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillText('Anna & Andrey', W / 2, 140);
  ctx.font = '22px Georgia, serif'; ctx.fillStyle = '#FFD700';
  ctx.fillText('\uD83D\uDEFC Anniversary Roller Runner \uD83D\uDEFC', W / 2, 185);
  ctx.font = '16px Georgia, serif'; ctx.fillStyle = '#ccc';
  ctx.fillText('Married 25 February 2011  \u2022  15 Years of Love', W / 2, 222);
  ctx.fillStyle = '#eee'; ctx.font = '15px sans-serif';
  ctx.fillText('\u2190 \u2192  Move between lanes', W / 2, 290);
  ctx.fillText('SPACE  Jump over obstacles', W / 2, 315);
  ctx.fillText('H  Hold hands (magnet boost)', W / 2, 340);
  ctx.fillStyle = '#FFD700'; ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Press SPACE to Start', W / 2, 410);
  ctx.font = '26px sans-serif';
  MILESTONES.forEach((m, i) => ctx.fillText(m.emoji, W / 2 - 62 + i * 25, 455));
  ctx.textAlign = 'left';
}

function drawWin() {
  drawBG();
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, W, H);
  // Confetti
  confetti.forEach(c => {
    c.y += c.vy; c.x += c.vx; if (c.y > H) { c.y = -10; c.x = Math.random() * W; }
    ctx.fillStyle = c.c; ctx.fillRect(c.x, c.y, c.s, c.s);
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD700'; ctx.font = 'bold 40px Georgia, serif';
  ctx.fillText('\uD83C\uDF89 15 Years of Love \uD83C\uDF89', W / 2, 100);
  ctx.fillStyle = '#fff'; ctx.font = '24px Georgia, serif';
  ctx.fillText('Happy Anniversary, Anna & Andrey!', W / 2, 150);
  ctx.fillStyle = '#ccc'; ctx.font = '16px Georgia, serif';
  ctx.fillText('25 February 2011 \u2013 25 February 2026', W / 2, 185);
  // Family photo polaroid
  ctx.save(); ctx.translate(W / 2, 320); ctx.rotate(-0.04);
  ctx.fillStyle = '#fff'; ctx.fillRect(-135, -95, 270, 210);
  if (imgs.family) { ctx.drawImage(imgs.family, -125, -85, 250, 180); }
  else {
    ctx.fillStyle = '#f0e6d3'; ctx.fillRect(-125, -85, 250, 180);
    ctx.fillStyle = '#999'; ctx.font = '13px sans-serif'; ctx.fillText('\uD83D\uDCF7 photo-family.jpg', 0, 10);
  }
  ctx.fillStyle = '#333'; ctx.font = 'italic 13px Georgia, serif';
  ctx.fillText('The beautiful family', 0, 130);
  ctx.restore();
  ctx.fillStyle = '#FFD700'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Score: ' + score + '  |  Press SPACE to play again', W / 2, H - 15);
  ctx.textAlign = 'left';
}

function drawGameOver() {
  drawBG(); drawEnts(); drawPlayer(); drawHUD();
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.fillStyle = '#FF6347';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.fillText('Wiped Out! \uD83E\uDD15', W / 2, 200);
  ctx.fillStyle = '#fff'; ctx.font = '20px sans-serif';
  ctx.fillText('Score: ' + score, W / 2, 255);
  ctx.fillStyle = '#FFD700'; ctx.font = '16px sans-serif';
  ctx.fillText('Press SPACE to try again', W / 2, 310);
  ctx.textAlign = 'left';
}

// ── Main loop ───────────────────────────────────────
function frame() {
  update();
  ctx.save();
  if (shakeT > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  if (state === 'title') drawTitle();
  else if (state === 'win') drawWin();
  else if (state === 'over') drawGameOver();
  else { drawBG(); drawEnts(); drawPlayer(); drawHUD(); }
  ctx.restore();
  requestAnimationFrame(frame);
}
frame();
