/* KMC Connect — main application (vanilla JS, no build step).
 * All data is stored locally in the browser (localStorage). No server, no tracking.
 */
'use strict';

/* ---------- storage ---------- */
const KEY = 'kmcconnect.v1';
const APP_VERSION = '1.0.0';
function defaults() {
  return {
    settings: { lang: 'en', mode: null, emergency: (window.CONFIG && CONFIG.emergency) || '999',
      hospitalName: (window.CONFIG && CONFIG.hospitalName) || '', hospitalPhone: (window.CONFIG && CONFIG.hospitalPhone) || '' },
    babies: [], activeBaby: null, sessions: [], feeds: [], weights: [], temps: [], timers: {},
    learner: null, quiz: {}, read: {}, parentRead: {}, skills: {}
  };
}
function load() {
  const d = defaults();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!raw) return d;
    const s = Object.assign(d, raw);
    s.settings = Object.assign(defaults().settings, raw.settings || {});
    return s;
  } catch (e) { return d; }
}
var S = load();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast('Could not save — storage is full or blocked'); }
}

/* ---------- helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const MIN = 60000, HR = 3600000, DAY = 86400000;
const pad = n => String(n).padStart(2, '0');
function dayStart(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
function fmtDate(ts) { const d = new Date(ts); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function fmtTime(ts) { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }
function fmtDT(ts) { return fmtDate(ts) + ' ' + fmtTime(ts); }
function toLocalInput(ts) { return fmtDate(ts) + 'T' + fmtTime(ts); }
function parseLocalInput(str) { const v = new Date(str).getTime(); return isNaN(v) ? null : v; }
function parseDateOnly(str) { if (!str) return null; const [y, m, d] = str.split('-').map(Number); return new Date(y, m - 1, d).getTime(); }
function hms(ms) { const s = Math.max(0, Math.floor(ms / 1000)); return `${Math.floor(s / 3600)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`; }
function fmtMins(m) { m = Math.round(m); const h = Math.floor(m / 60), r = m % 60; return h ? `${h} ${t('hours')} ${r} ${t('minutes')}` : `${r} ${t('minutes')}`; }
function download(name, text, type) {
  const blob = new Blob([text], { type: type || 'text/plain' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('on'), 2200);
}

/* ---------- icons ---------- */
const IC = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  book: '<path d="M4 4h10a4 4 0 014 4v12H8a4 4 0 01-4-4z"/><path d="M8 20a4 4 0 01-4-4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  grad: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  check: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 12l3 3 5-6"/>',
  tool: '<path d="M14 6a4 4 0 105 5l-8 8-4 1 1-4z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c3 0 5 2 5 5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>'
};
const icon = (name, size = 24) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[name] || ''}</svg>`;

/* ---------- baby / tracking calculations ---------- */
const babyById = id => S.babies.find(b => b.id === id);
const isMother = who => who === 'mother';
function sscMinutes(babyId, from, to, group) {
  // group: undefined = all, 'mother', 'other'
  let m = 0;
  const add = (st, en, who) => {
    if (group && (group === 'mother') !== isMother(who)) return;
    const a = Math.max(st, from), b = Math.min(en, to);
    if (b > a) m += (b - a) / MIN;
  };
  for (const s of S.sessions) if (s.babyId === babyId) add(s.start, s.end, s.who);
  const tm = S.timers[babyId]; if (tm) add(tm.start, Date.now(), tm.who);
  return m;
}
function feedsIn(babyId, from, to, type) {
  return S.feeds.filter(f => f.babyId === babyId && f.time >= from && f.time < to && (!type || f.type === type));
}
function latest(arr, babyId, key) {
  const xs = arr.filter(x => x.babyId === babyId).sort((a, b) => b[key] - a[key]);
  return xs[0] || null;
}
function ageDays(b, at = Date.now()) { const dob = parseDateOnly(b.dob); return dob == null ? null : Math.floor((dayStart(at) - dob) / DAY); }
function cgaDays(b, at = Date.now()) {
  const a = ageDays(b, at); if (a == null || !b.gaW) return null;
  return Number(b.gaW) * 7 + Number(b.gaD || 0) + a;
}
const fmtGA = d => d == null ? '—' : `${Math.floor(d / 7)}+${d % 7} ${t('weeks')}`;
function velocity(babyId) {
  const ws = S.weights.filter(w => w.babyId === babyId).sort((a, b) => a.date - b.date);
  if (ws.length < 2) return null;
  const last = ws[ws.length - 1];
  // choose the earlier weight closest to 7 days before (min 3 days apart)
  let best = null;
  for (const w of ws) { const d = (last.date - w.date) / DAY; if (d >= 3 && (!best || Math.abs(d - 7) < Math.abs((last.date - best.date) / DAY - 7))) best = w; }
  if (!best) return null;
  const days = (last.date - best.date) / DAY;
  const avgKg = (Number(last.g) + Number(best.g)) / 2 / 1000;
  return { v: (last.g - best.g) / avgKg / days, days: Math.round(days) };
}

/* ---------- charts (inline SVG) ---------- */
function ringSvg(hours) {
  const r = 52, c = 2 * Math.PI * r, f = Math.min(hours / 24, 1);
  const col = hours >= 8 ? '#15803d' : '#e76f51';
  const ang = (8 / 24) * 2 * Math.PI - Math.PI / 2, mx = 60 + r * Math.cos(ang), my = 60 + r * Math.sin(ang);
  return `<svg class="ring" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="#e5e7eb" stroke-width="12"/>
    ${f > 0 ? `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 60 60)"/>` : ''}
    <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="5" fill="#1f2937"/>
    <text x="60" y="60" text-anchor="middle" font-size="24" font-weight="700" fill="#1f2937">${hours.toFixed(1)}</text>
    <text x="60" y="80" text-anchor="middle" font-size="11" fill="#6b7280">/ 24 h</text></svg>`;
}
function barChart(vals, labels) {
  const W = 340, H = 170, pl = 28, pb = 22, pt = 14;
  const max = Math.max(12, ...vals.map(v => Math.ceil(v)));
  const bw = (W - pl - 6) / vals.length, y = v => pt + (H - pt - pb) * (1 - v / max);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('last7'))}">`;
  for (const g of [0, 8, max]) s += `<text x="${pl - 5}" y="${y(g) + 4}" text-anchor="end" font-size="10" fill="#6b7280">${g}</text>`;
  s += `<line x1="${pl}" x2="${W}" y1="${y(0)}" y2="${y(0)}" stroke="#d1d5db"/>`;
  s += `<line x1="${pl}" x2="${W}" y1="${y(8)}" y2="${y(8)}" stroke="#e76f51" stroke-dasharray="4 4"/>`;
  vals.forEach((v, i) => {
    const x = pl + i * bw + bw * 0.18, w = bw * 0.64, yy = y(v);
    s += `<rect x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${w.toFixed(1)}" height="${(y(0) - yy).toFixed(1)}" rx="4" fill="${v >= 8 ? '#0f766e' : '#f4a261'}"/>`;
    s += `<text x="${(x + w / 2).toFixed(1)}" y="${(yy - 3).toFixed(1)}" text-anchor="middle" font-size="10" fill="#1f2937">${v ? v.toFixed(1) : ''}</text>`;
    s += `<text x="${(x + w / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="10" fill="#6b7280">${esc(labels[i])}</text>`;
  });
  return s + '</svg>';
}
function lineChart(pts) {
  if (pts.length < 2) return '';
  const W = 340, H = 160, pl = 40, pb = 22, pt = 12, pr = 10;
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), yMin = Math.min(...ys) - 50, yMax = Math.max(...ys) + 50;
  const X = x => pl + (W - pl - pr) * ((x - x0) / Math.max(1, x1 - x0)), Y = v => pt + (H - pt - pb) * (1 - (v - yMin) / (yMax - yMin));
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('weightTrend'))}">`;
  for (const g of [yMin + 50, (yMin + yMax) / 2, yMax - 50]) s += `<text x="${pl - 5}" y="${Y(g) + 4}" text-anchor="end" font-size="10" fill="#6b7280">${Math.round(g)}</text><line x1="${pl}" x2="${W - pr}" y1="${Y(g)}" y2="${Y(g)}" stroke="#f1f5f9"/>`;
  if (yMin < 2500 && yMax > 2500) s += `<line x1="${pl}" x2="${W - pr}" y1="${Y(2500)}" y2="${Y(2500)}" stroke="#15803d" stroke-dasharray="4 4"/><text x="${W - pr}" y="${Y(2500) - 3}" text-anchor="end" font-size="9" fill="#15803d">2500 g</text>`;
  s += `<polyline fill="none" stroke="#0f766e" stroke-width="2.5" points="${pts.map(p => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ')}"/>`;
  pts.forEach(p => { s += `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="3.5" fill="#0f766e"/>`; });
  s += `<text x="${pl}" y="${H - 5}" font-size="10" fill="#6b7280">${fmtDate(x0).slice(5)}</text><text x="${W - pr}" y="${H - 5}" text-anchor="end" font-size="10" fill="#6b7280">${fmtDate(x1).slice(5)}</text>`;
  return s + '</svg>';
}
/* original line-drawing of the KMC position with translated labels */
function positionFigure() {
  const lb = k => esc(L(FIG_LABELS[k]));
  return `<div class="fig"><svg viewBox="0 0 480 330" role="img" aria-label="KMC position">
    <rect width="480" height="330" rx="16" fill="#f0fdfa"/>
    <path d="M90 330 C95 250 120 200 210 190 C300 200 325 250 330 330 Z" fill="#f6d5c3" stroke="#c99a83" stroke-width="2"/>
    <circle cx="210" cy="120" r="44" fill="#f6d5c3" stroke="#c99a83" stroke-width="2"/>
    <path d="M168 104 C175 70 245 70 252 104 C240 92 182 92 168 104Z" fill="#5b4636"/>
    <ellipse cx="210" cy="268" rx="40" ry="52" fill="#fbe3d6" stroke="#c99a83" stroke-width="2"/>
    <circle cx="214" cy="205" r="25" fill="#fbe3d6" stroke="#c99a83" stroke-width="2"/>
    <path d="M190 196 C195 176 233 176 238 196 Z" fill="#7dd3c8" stroke="#0f766e" stroke-width="1.5"/>
    <circle cx="226" cy="207" r="2" fill="#5b4636"/><path d="M228 216 q4 2 7 -1" stroke="#5b4636" fill="none"/>
    <path d="M178 258 C168 236 180 226 194 234" stroke="#c99a83" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M242 258 C252 236 240 226 226 234" stroke="#c99a83" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M186 304 C170 300 168 286 182 282" stroke="#c99a83" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M234 304 C250 300 252 286 238 282" stroke="#c99a83" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M100 236 L320 236 L326 300 L94 300 Z" fill="#0f766e" opacity=".28"/>
    <line x1="100" y1="236" x2="320" y2="236" stroke="#0f766e" stroke-width="3"/>
    <g font-size="12" fill="#1f2937" font-family="system-ui,sans-serif">
      <line x1="244" y1="196" x2="300" y2="160" stroke="#e76f51"/><circle cx="244" cy="196" r="3" fill="#e76f51"/>
      <text x="302" y="150">${lb('head')}</text>
      <line x1="232" y1="224" x2="300" y2="190" stroke="#e76f51"/><circle cx="232" cy="224" r="3" fill="#e76f51"/>
      <text x="302" y="186">${lb('neck')}</text>
      <line x1="120" y1="236" x2="60" y2="196" stroke="#e76f51"/><circle cx="120" cy="236" r="3" fill="#e76f51"/>
      <text x="8" y="186">${lb('binder')}</text>
      <line x1="182" y1="284" x2="60" y2="300" stroke="#e76f51"/><circle cx="182" cy="284" r="3" fill="#e76f51"/>
      <text x="8" y="318">${lb('limbs')}</text>
      <line x1="252" y1="270" x2="320" y2="318" stroke="#e76f51"/><circle cx="252" cy="270" r="3" fill="#e76f51"/>
      <text x="472" y="324" text-anchor="end">${lb('chest')}</text>
    </g></svg></div>`;
}

/* ---------- dialog forms ---------- */
function openForm(title, inner, onSubmit, extraBtns = '') {
  const dlg = $('#dlg');
  dlg.innerHTML = `<form method="dialog"><h2>${esc(title)}</h2>${inner}
    <div class="btnrow" style="margin-top:1rem">${extraBtns}<span style="flex:1"></span>
    <button type="button" class="btn sec" data-cancel>${esc(t('cancel'))}</button>
    <button type="submit" class="btn">${esc(t('save'))}</button></div></form>`;
  const form = $('form', dlg);
  $('[data-cancel]', dlg).onclick = () => dlg.close();
  form.onsubmit = e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form).entries());
    if (onSubmit(fd, form) !== false) { dlg.close(); }
  };
  dlg.showModal();
  const first = $('input,select', dlg); if (first) first.focus();
  return dlg;
}
const whoSeg = (sel = 'mother') => `<div class="seg">${['mother', 'father', 'other'].map(w =>
  `<label><input type="radio" name="who" value="${w}" ${w === sel ? 'checked' : ''}><span>${esc(t(w === 'other' ? 'otherFamily' : w))}</span></label>`).join('')}</div>`;
const whoLabel = w => t(w === 'other' ? 'otherFamily' : w);

/* ---------- layout / nav ---------- */
function setNav(mode) {
  const nav = $('#bottomnav'); const h = location.hash || '#/';
  let items;
  if (mode === 'hcp') items = [['#/h', 'home', 'Home'], ['#/h/modules', 'grad', 'Modules'], ['#/h/skills', 'check', 'Skills'], ['#/h/tools', 'tool', 'Tools'], ['#/h/unit', 'users', 'Unit'], ['#/p', 'users', 'Parents']];
  else if (mode === 'parent') items = [['#/p', 'home', t('home')], ['#/p/learn', 'book', t('learn')], ['#/p/track', 'clock', t('track')], ['#/p/danger', 'alert', t('danger'), 'dangerlink']];
  else { nav.classList.add('hidden'); return; }
  nav.classList.remove('hidden');
  nav.innerHTML = items.map(([href, ic, label, cls]) => {
    const active = h === href || (href.length > 4 && h.startsWith(href));
    return `<a href="${href}" class="${active ? 'active' : ''} ${cls || ''}">${icon(ic)}<span>${esc(label)}</span></a>`;
  }).join('');
}
function updatePill() {
  const pill = $('#timerpill'); const ids = Object.keys(S.timers);
  if (!ids.length) { pill.classList.remove('on'); return; }
  const id = ids[0], tm = S.timers[id];
  pill.classList.add('on'); pill.href = '#/track/' + id;
  pill.textContent = '⏱ ' + hms(Date.now() - tm.start);
}
setInterval(() => {
  $$('[data-clock]').forEach(el => { const tm = S.timers[el.dataset.clock]; if (tm) el.textContent = hms(Date.now() - tm.start); });
  updatePill();
}, 1000);

function backLink(href, label) { return `<p class="noprint"><a href="${href}">← ${esc(label || t('back'))}</a></p>`; }
function langSelect(id) {
  return `<select id="${id}" aria-label="${esc(t('language'))}">${LANGS.map(l => `<option value="${l.code}" ${S.settings.lang === l.code ? 'selected' : ''}>${l.label}</option>`).join('')}</select>`;
}
function bindLang(id) {
  const el = document.getElementById(id); if (!el) return;
  el.onchange = () => { S.settings.lang = el.value; save(); applyLang(); router(); };
}
function applyLang() {
  document.documentElement.lang = S.settings.lang === 'zh' ? 'zh-Hans' : S.settings.lang;
  $('#topLang').value = S.settings.lang;
  $('#brandTag').textContent = 'KMC Connect';
}

/* ---------- views: start ---------- */
function viewStart() {
  return `<div class="hero"><img src="icons/icon-192.png" alt="KMC Connect logo" style="width:84px;height:84px;border-radius:20px;float:right;margin-left:.8rem"><h1>KMC Connect</h1><p>${esc(t('appTagline'))}</p></div>
  <div class="card"><label for="startLang">${esc(t('language'))}</label>${langSelect('startLang')}</div>
  <h2>${esc(t('chooseRole'))}</h2>
  <button class="rolebtn" data-role="parent"><span class="em">🤱</span><span><b>${esc(t('iAmParent'))}</b><span>${esc(t('iAmParentSub'))}</span></span></button>
  <button class="rolebtn" data-role="hcp"><span class="em">🩺</span><span><b>${esc(t('iAmHcp'))}</b><span>${esc(t('iAmHcpSub'))}</span></span></button>
  <p class="small muted center">${esc(t('privacy'))}</p>`;
}
function bindStart() {
  bindLang('startLang');
  $$('[data-role]').forEach(b => b.onclick = () => {
    S.settings.mode = b.dataset.role; save();
    location.hash = b.dataset.role === 'hcp' ? '#/h' : '#/p';
  });
}

/* ---------- views: parent ---------- */
function viewParentHome() {
  const b = activeParentBaby();
  let status = '';
  if (b) {
    const today = sscMinutes(b.id, dayStart(Date.now()), Date.now()) / 60;
    status = `<a class="card flat" href="#/p/track" style="display:flex;align-items:center;gap:1rem;text-decoration:none;color:inherit">
      ${ringSvg(today)}<div><b>${esc(b.name)}</b><div class="small muted">${esc(t('correctedAge'))}: ${esc(fmtGA(cgaDays(b)))}</div>
      <div class="small">${today >= 8 ? '✅ ' + esc(t('goalMet')) : esc(t('goalNotMet'))}</div></div></a>`;
  }
  S.parentRead = S.parentRead || {};
  const completed = LESSONS.filter(l => S.parentRead[l.id]).length;
  const nextLesson = LESSONS.find(l => !S.parentRead[l.id]) || LESSONS[0];
  const progress = Math.round(completed / LESSONS.length * 100);
  const progressCard = `<div class="card"><div style="display:flex;justify-content:space-between;gap:.8rem;align-items:center"><div><b>${esc(L({en:'Your KMC learning journey',ms:'Perjalanan pembelajaran KMC anda',zh:'您的袋鼠护理学习进度'}))}</b><div class="small muted">${completed}/${LESSONS.length} ${esc(L({en:'lessons opened',ms:'pelajaran dibuka',zh:'个课程已打开'}))}</div></div><b>${progress}%</b></div><div class="progress" role="progressbar" aria-label="${esc(L({en:'Lesson progress',ms:'Kemajuan pelajaran',zh:'课程进度'}))}" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${LESSONS.length}"><i style="width:${progress}%"></i></div><a class="btn sec block" href="#/p/learn/${nextLesson.id}">${completed === LESSONS.length ? esc(L({en:'Review lessons again',ms:'Ulang kaji pelajaran',zh:'重新复习课程'})) : esc(L({en:'Continue learning',ms:'Teruskan pembelajaran',zh:'继续学习'}))} → ${esc(L(nextLesson.title))}</a></div>`;
  return `<div class="hero"><img src="icons/icon-192.png" alt="KMC Connect logo" style="width:84px;height:84px;border-radius:20px;float:right;margin-left:.8rem"><h1>KMC Connect</h1><p>${esc(t('appTagline'))}</p></div>
  ${status}
  ${progressCard}
  <div class="card flat"><b>${esc(L({en:'KMC position: remember these 3 checks',ms:'Posisi KMC: ingat 3 perkara ini',zh:'袋鼠护理姿势：记住这3点'}))}</b><div class="grid g3" style="margin-top:.7rem"><div class="center"><div style="font-size:2rem">👃</div><b class="small">${esc(L({en:'Airway clear',ms:'Saluran nafas terbuka',zh:'呼吸道通畅'}))}</b></div><div class="center"><div style="font-size:2rem">🤱</div><b class="small">${esc(L({en:'Chest-to-chest',ms:'Dada ke dada',zh:'胸贴胸'}))}</b></div><div class="center"><div style="font-size:2rem">🎀</div><b class="small">${esc(L({en:'Binder secure',ms:'Pengikat kemas',zh:'背带稳固'}))}</b></div></div><a class="small" href="#/p/position">${esc(L({en:'See the illustrated positioning guide',ms:'Lihat panduan posisi bergambar',zh:'查看图解姿势指南'}))} →</a></div>
  <div class="grid">
    <a class="tile teal" href="#/p/learn"><span class="em">📖</span><b>${esc(t('learn'))}</b><span>${esc(t('learnSub'))}</span></a>
    <a class="tile teal" href="#/p/position"><span class="em">🫶</span><b>${esc(t('howToHold'))}</b><span>${esc(t('howToHoldSub'))}</span></a>
    <a class="tile coral" href="#/p/track"><span class="em">⏱️</span><b>${esc(t('tracker'))}</b><span>${esc(t('trackSub'))}</span></a>
    <a class="tile red" href="#/p/danger"><span class="em">🚨</span><b>${esc(t('danger'))}</b><span>${esc(t('dangerSub'))}</span></a>
    <a class="tile" href="#/p/videos"><span class="em">🎬</span><b>${esc(t('videos'))}</b><span>${esc(t('videosSub'))}</span></a>
    <a class="tile" href="#/settings"><span class="em">⚙️</span><b>${esc(t('settings'))}</b><span>${esc(t('language'))} · ${esc(t('backup'))}</span></a>
  </div>
  <p class="small muted center" style="margin-top:1rem">${esc(t('disclaimer'))} · <a href="#/about">${esc(t('about'))}</a></p>`;
}
function viewLessons(base = '#/p/learn') {
  const isH = base.startsWith('#/h');
  return `${isH ? backLink('#/h') + `<div class="card flat"><b>Counselling mode</b><p class="small muted" style="margin:.3rem 0">Show these screens to parents in their language. Sections 1–4: antenatal · 1–10: first postnatal session · 5–10: daily until discharge.</p><label for="cLang">${esc(t('language'))}</label>${langSelect('cLang')}</div>` : ''}
  <h1>${esc(t('learn'))}</h1>
  <div class="card">${LESSONS.map(l => `<a class="linkrow" href="${base}/${l.id}"><span class="em">${l.icon}</span><span class="grow"><span class="small muted">${esc(t('lesson'))} ${l.id}</span><b>${esc(L(l.title))}</b></span><span>›</span></a>`).join('')}
  <a class="linkrow" href="${base}/danger"><span class="em">🚨</span><span class="grow"><b style="color:var(--red)">${esc(t('danger'))}</b></span><span>›</span></a></div>`;
}
function viewLesson(id, base = '#/p/learn') {
  if (id === 'danger') return viewDanger(base);
  const l = LESSONS.find(x => String(x.id) === String(id)); if (!l) return notFound();
  S.parentRead = S.parentRead || {};
  if (!S.parentRead[l.id]) { S.parentRead[l.id] = Date.now(); save(); }
  const prev = LESSONS.find(x => x.id === l.id - 1), next = LESSONS.find(x => x.id === l.id + 1);
  const v = l.video ? VIDEOS.find(x => x.n === l.video) : null;
  const body = l.steps ? positionBody() : `<div class="card"><h3>${esc(t('keyMessages'))}</h3><ul class="msgs">${L(l.msgs).map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>`;
  return `${backLink(base)}
  <div class="hero"><div style="font-size:2.4rem">${l.icon}</div><p class="small">${esc(t('lesson'))} ${l.id} / ${LESSONS.length}</p><h1>${esc(L(l.title))}</h1></div>
  ${l.steps || l.id === 6 ? positionFigure() + '<div style="height:1rem"></div>' : ''}
  ${body}
  ${v ? `<a class="btn sec block" href="${v.url}" target="_blank" rel="noopener">▶ ${esc(t('watchVideo'))}: ${esc(L(v.title))}</a>` : ''}
  <div class="btnrow" style="margin-top:1rem;justify-content:space-between">
    ${prev ? `<a class="btn ghost" href="${base}/${prev.id}">← ${esc(t('prev'))}</a>` : '<span></span>'}
    ${next ? `<a class="btn" href="${base}/${next.id}">${esc(t('next'))} →</a>` : `<a class="btn red" href="${base}/danger">🚨 ${esc(t('danger'))}</a>`}
  </div>`;
}
function positionBody() {
  return `${POSITION_STEPS.map((s, i) => `<div class="step"><div class="num">${i + 1}</div><div class="em">${s.e}</div><div>${esc(L(s.t))}</div></div>`).join('')}
  <div class="callout green">💋 ${esc(t('checkPosition'))}</div>
  <div class="callout amber">🏥 ${esc(t('sickBabyNote'))}</div>`;
}
function viewPosition(base = '#/p') {
  const v = VIDEOS.find(x => x.n === 7), v2 = VIDEOS.find(x => x.n === 2);
  return `${backLink(base)}<h1>${esc(t('howToHold'))}</h1>${positionFigure()}<div style="height:1rem"></div>${positionBody()}
    <a class="btn sec block" href="${v.url}" target="_blank" rel="noopener">▶ ${esc(L(v.title))}</a>
    <div style="height:.5rem"></div><a class="btn sec block" href="${v2.url}" target="_blank" rel="noopener">▶ ${esc(L(v2.title))}</a>`;
}
function viewDanger(base = '#/p') {
  const em = S.settings.emergency || '999';
  const v = VIDEOS.find(x => x.n === 10);
  return `${backLink(base)}<div class="dangerhead"><h1>🚨 ${esc(t('dangerTitle'))}</h1></div>
  <div class="card"><ul class="list dangerlist">${DANGER_SIGNS.map(d => `<li><span class="em">${d.e}</span><span>${esc(L(d.t))}</span></li>`).join('')}</ul></div>
  <div class="callout red"><b>${esc(t('dangerAction'))}</b></div>
  <div class="callout amber">${esc(t('breathingPause'))}</div>
  <div class="btnrow">
    <a class="btn red" href="tel:${esc(em)}" style="flex:1">📞 ${esc(t('callEmergency'))} ${esc(em)}</a>
    ${S.settings.hospitalPhone ? `<a class="btn coral" href="tel:${esc(S.settings.hospitalPhone)}" style="flex:1">🏥 ${esc(S.settings.hospitalName || t('callHospital'))}</a>` : ''}
  </div>
  ${!S.settings.hospitalPhone ? `<p class="small muted"><a href="#/settings">${esc(t('settings'))}</a> → ${esc(t('hospitalPhone'))}</p>` : ''}
  <div style="height:.6rem"></div><a class="btn sec block" href="${v.url}" target="_blank" rel="noopener">▶ ${esc(L(v.title))}</a>`;
}
function viewVideos(aud) {
  const list = VIDEOS.filter(v => aud === 'hcp' || v.aud === 'both');
  return `${backLink(aud === 'hcp' ? '#/h' : '#/p')}<h1>${esc(t('videos'))}</h1>
  <p class="small muted">${aud === 'hcp' ? 'All videos referenced in WHO “Kangaroo mother care: a clinical practice guide” (2025). Opens in a new tab.' : esc(t('videosSub'))}</p>
  <div class="card">${list.map(v => `<a class="linkrow" href="${v.url}" target="_blank" rel="noopener"><span class="em">▶️</span><span class="grow"><b>${aud === 'hcp' ? 'Video ' + v.n + ': ' : ''}${esc(aud === 'hcp' ? v.title.en : L(v.title))}</b><span class="small muted">${esc(v.src)}</span></span><span>↗</span></a>`).join('')}</div>
  <p class="small"><a href="${PARENT_GUIDE_URL}" target="_blank" rel="noopener">WHO Parent counselling guide on KMC ↗</a> · <a href="${CLINICAL_GUIDE_URL}" target="_blank" rel="noopener">WHO KMC clinical practice guide ↗</a></p>`;
}

/* ---------- tracker ---------- */
function activeParentBaby() {
  const ps = S.babies.filter(b => b.owner === 'p');
  return ps.find(b => b.id === S.activeBaby) || ps[0] || null;
}
function babyForm(owner, b) {
  const unit = owner === 'u';
  const inner = `<label>${unit ? 'Baby ID / bed (avoid full names)' : esc(t('babyName'))}</label><input type="text" name="name" required value="${esc(b ? b.name : '')}" maxlength="40">
    <label>${esc(t('dob'))}</label><input type="date" name="dob" required value="${esc(b ? b.dob : fmtDate(Date.now()))}" max="${fmtDate(Date.now())}">
    <label>${esc(t('gaBirth'))}</label><div class="row2"><input type="number" name="gaW" min="22" max="44" required placeholder="${esc(t('weeks'))}" value="${esc(b ? b.gaW : '')}"><input type="number" name="gaD" min="0" max="6" placeholder="${esc(t('days'))}" value="${esc(b ? b.gaD : '0')}"></div>
    <label>${esc(t('birthWeight'))}</label><input type="number" name="bw" min="300" max="6000" required value="${esc(b ? b.bw : '')}">`;
  const extra = b ? `<button type="button" class="btn ghost" data-delbaby style="color:var(--red)">${esc(t('delete'))}</button>${unit ? `<button type="button" class="btn ghost" data-archive>${b.archived ? 'Restore' : 'Discharge / archive'}</button>` : ''}` : '';
  const dlg = openForm(b ? t('editBaby') : t('addBaby'), inner, fd => {
    const rec = b || { id: uid(), owner, created: Date.now() };
    Object.assign(rec, { name: fd.name.trim(), dob: fd.dob, gaW: Number(fd.gaW), gaD: Number(fd.gaD || 0), bw: Number(fd.bw) });
    if (!b) { S.babies.push(rec); if (bw0(rec)) S.weights.push({ id: uid(), babyId: rec.id, date: parseDateOnly(rec.dob), g: rec.bw, note: 'birth weight' }); }
    if (owner === 'p') S.activeBaby = rec.id;
    save(); toast(t('saved')); router();
  }, extra);
  const del = $('[data-delbaby]', dlg);
  if (del) del.onclick = () => {
    if (!confirm(t('confirmDelete'))) return;
    const id = b.id;
    S.babies = S.babies.filter(x => x.id !== id);
    for (const k of ['sessions', 'feeds', 'weights', 'temps']) S[k] = S[k].filter(x => x.babyId !== id);
    delete S.timers[id]; if (S.activeBaby === id) S.activeBaby = null;
    save(); dlg.close(); location.hash = owner === 'u' ? '#/h/unit' : '#/p/track'; router();
  };
  const arc = $('[data-archive]', dlg);
  if (arc) arc.onclick = () => { b.archived = !b.archived; if (b.archived) stopTimer(b.id); save(); dlg.close(); location.hash = '#/h/unit'; };
}
const bw0 = r => r.bw && r.dob;
function startTimer(babyId, who) { S.timers[babyId] = { start: Date.now(), who }; save(); }
function stopTimer(babyId) {
  const tm = S.timers[babyId]; if (!tm) return;
  const end = Date.now();
  if (end - tm.start >= MIN) S.sessions.push({ id: uid(), babyId, start: tm.start, end, who: tm.who });
  delete S.timers[babyId]; save();
}
function viewTrackerParent() {
  const b = activeParentBaby();
  if (!b) return `${backLink('#/p')}<h1>${esc(t('tracker'))}</h1><div class="card center"><div style="font-size:3rem">👶</div><p>${esc(t('noBaby'))}</p><button class="btn" data-addbaby="p">+ ${esc(t('addBaby'))}</button></div>`;
  return viewTracker(b);
}
function viewTracker(b) {
  if (!b) return notFound();
  const id = b.id, now = Date.now(), unit = b.owner === 'u';
  const today = sscMinutes(id, dayStart(now), now) / 60;
  const tm = S.timers[id];
  const days = [], labels = [];
  for (let i = 6; i >= 0; i--) { const d0 = dayStart(now) - i * DAY; days.push(sscMinutes(id, d0, d0 + DAY) / 60); labels.push(new Date(d0).getDate() + ''); }
  const f24 = feedsIn(id, now - DAY, now + 1);
  const fb = f24.filter(f => f.type === 'breast').length, fe = f24.filter(f => f.type === 'ebm').length, fo = f24.filter(f => f.type === 'other').length;
  const lw = latest(S.weights, id, 'date'), lt = latest(S.temps, id, 'time');
  const cga = cgaDays(b), ad = ageDays(b);
  const vel = velocity(id);
  const ready = (lw && lw.g >= 2500) || (cga != null && cga >= 38 * 7);
  const others = S.babies.filter(x => x.owner === b.owner && !x.archived);
  const wpts = S.weights.filter(w => w.babyId === id).sort((a, c) => a.date - c.date).slice(-14).map(w => ({ x: w.date, y: Number(w.g) }));
  let tempMsg = '';
  if (lt) tempMsg = lt.c < 36.5 ? `<div class="callout red">${esc(t('tempLow'))}</div>` : lt.c > 37.5 ? `<div class="callout red">${esc(t('tempHigh'))}</div>` : `<div class="callout green">${esc(t('tempOk'))}</div>`;

  const hist = [
    ...S.sessions.filter(s => s.babyId === id).map(s => ({ k: 'sessions', id: s.id, ts: s.start, em: '🤱', txt: `${t('session')} · ${fmtTime(s.start)}–${fmtTime(s.end)} · ${fmtMins((s.end - s.start) / MIN)} · ${whoLabel(s.who)}` })),
    ...S.feeds.filter(f => f.babyId === id).map(f => ({ k: 'feeds', id: f.id, ts: f.time, em: f.type === 'breast' ? '🤱' : f.type === 'ebm' ? '🥄' : '🍼', txt: `${t(f.type === 'breast' ? 'logBreast' : f.type === 'ebm' ? 'logEbm' : 'logOther')}${f.ml ? ' · ' + f.ml + ' mL' : ''}${f.note ? ' · ' + f.note : ''}` })),
    ...S.weights.filter(w => w.babyId === id).map(w => ({ k: 'weights', id: w.id, ts: w.date, dateOnly: true, em: '⚖️', txt: `${t('weight')} · ${w.g} g` })),
    ...S.temps.filter(x => x.babyId === id).map(x => ({ k: 'temps', id: x.id, ts: x.time, em: '🌡️', txt: `${t('temp')} · ${x.c} °C` }))
  ].sort((a, c) => c.ts - a.ts).slice(0, 25);

  return `${backLink(unit ? '#/h/unit' : '#/p')}
  <div class="babybar noprint">
    ${others.length > 1 ? `<select id="babySel" aria-label="${esc(t('switchBaby'))}">${others.map(x => `<option value="${x.id}" ${x.id === id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>` : `<h1 style="flex:1;margin:0">${esc(b.name)}</h1>`}
    <button class="btn sm sec" data-editbaby="${id}">✏️</button>
    <button class="btn sm sec" data-addbaby="${b.owner}">+ ${esc(t('addBaby'))}</button>
  </div>
  <p class="small muted">${esc(t('age'))}: ${ad == null ? '—' : ad + ' ' + esc(t('dayOld'))} · ${esc(t('correctedAge'))}: <b>${esc(fmtGA(cga))}</b> · ${esc(t('birthWeight'))}: ${esc(b.bw)}</p>

  <div class="card timer">
    ${tm ? `<div class="small muted">${esc(t('inKmcWith'))} <b>${esc(whoLabel(tm.who))}</b> · ${fmtTime(tm.start)}</div>
      <div class="clock" data-clock="${id}">${hms(now - tm.start)}</div>
      <button class="btn coral block" data-stop="${id}">■ ${esc(t('stopKmc'))}</button>`
    : `<h3>${esc(t('startKmc'))}</h3><div class="whobtns">
      <button class="btn" data-start="mother"><span class="em">👩</span>${esc(t('mother'))}</button>
      <button class="btn" data-start="father"><span class="em">👨</span>${esc(t('father'))}</button>
      <button class="btn" data-start="other"><span class="em">👵</span>${esc(t('otherFamily'))}</button></div>`}
  </div>

  <div class="card"><div class="ringwrap">${ringSvg(today)}<div class="ringtxt"><span class="small muted">${esc(t('today'))}</span><b>${today.toFixed(1)} ${esc(t('hoursToday'))}</b>
    <div class="small">${today >= 8 ? '✅ ' + esc(t('goalMet')) : esc(t('goalNotMet'))}</div></div></div>
    <p class="small muted" style="margin-bottom:0">${esc(t('goalMin'))}</p></div>

  <div class="card"><div class="quick">
    <button data-quick="breast"><span class="em">🤱</span>${esc(t('logBreast'))}</button>
    <button data-quick="ebm"><span class="em">🥄</span>${esc(t('logEbm'))}</button>
    <button data-quick="other"><span class="em">🍼</span>${esc(t('logOther'))}</button>
    <button data-form="weight"><span class="em">⚖️</span>${esc(t('logWeight'))}</button>
    <button data-form="temp"><span class="em">🌡️</span>${esc(t('logTemp'))}</button>
    <button data-form="past"><span class="em">🕒</span>${esc(t('addPast'))}</button>
  </div></div>

  ${tempMsg}
  ${ready ? `<div class="callout green">🎉 ${esc(t('readyStop'))}</div>` : ''}

  <div class="card"><h3>${esc(t('feeds24'))}: ${f24.length}</h3>
    <p class="small" style="margin:.2rem 0">🤱 ${fb} · 🥄 ${fe} · 🍼 ${fo}</p>
    <div class="progress"><i style="width:${Math.min(100, f24.length / 8 * 100)}%"></i></div>
    <p class="small muted" style="margin-bottom:0">${esc(t('feedsGoal'))}</p></div>

  <div class="card chart"><h3>${esc(t('last7'))}</h3>${barChart(days, labels)}</div>

  <div class="card"><div class="stat">
    <div><span class="small muted">${esc(t('latestWeight'))}</span><b>${lw ? lw.g + ' g' : '—'}</b><span class="small muted">${lw ? fmtDate(lw.date) : ''}</span></div>
    <div><span class="small muted">${esc(t('latestTemp'))}</span><b>${lt ? lt.c + ' °C' : '—'}</b><span class="small muted">${lt ? fmtDT(lt.time) : ''}</span></div>
    <div><span class="small muted">${esc(t('velocity'))}</span><b>${vel ? vel.v.toFixed(1) + ' g/kg/d' : '—'}</b><span class="small muted">${vel ? vel.days + ' ' + esc(t('days')) : esc(t('velocityGoal'))}</span></div>
    <div><span class="small muted">${esc(t('correctedAge'))}</span><b>${esc(fmtGA(cga))}</b></div>
  </div>${wpts.length > 1 ? `<div class="chart" style="margin-top:.8rem">${lineChart(wpts)}</div>` : ''}
  <p class="small muted" style="margin-bottom:0">${esc(t('velocityGoal'))}</p></div>

  <div class="btnrow noprint" style="margin-bottom:1rem">
    <a class="btn sec" href="#/chart/${id}">📋 ${esc(t('dailyChart'))}</a>
    <button class="btn sec" data-csv="${id}">⬇ ${esc(t('exportCsv'))}</button>
  </div>

  <div class="card"><h3>${esc(t('history'))}</h3>
    ${hist.length ? `<ul class="list">${hist.map(h => `<li><span class="em">${h.em}</span><span style="flex:1"><span class="small muted">${h.dateOnly ? fmtDate(h.ts) : fmtDT(h.ts)}</span><br>${esc(h.txt)}</span><button class="iconbtn" style="color:var(--muted)" data-del="${h.k}:${h.id}" aria-label="${esc(t('delete'))}">🗑</button></li>`).join('')}</ul>` : '<p class="muted">—</p>'}
  </div>`;
}
function bindTracker(b) {
  if (!b) { $$('[data-addbaby]').forEach(x => x.onclick = () => babyForm(x.dataset.addbaby)); return; }
  const id = b.id;
  const sel = $('#babySel'); if (sel) sel.onchange = () => { if (b.owner === 'p') { S.activeBaby = sel.value; save(); router(); } else location.hash = '#/track/' + sel.value; };
  $$('[data-addbaby]').forEach(x => x.onclick = () => babyForm(x.dataset.addbaby));
  $$('[data-editbaby]').forEach(x => x.onclick = () => babyForm(b.owner, b));
  $$('[data-start]').forEach(x => x.onclick = () => { startTimer(id, x.dataset.start); router(); });
  $$('[data-stop]').forEach(x => x.onclick = () => { stopTimer(id); toast(t('saved')); router(); });
  $$('[data-quick]').forEach(x => x.onclick = () => {
    if (x.dataset.quick === 'breast') { S.feeds.push({ id: uid(), babyId: id, time: Date.now(), type: 'breast' }); save(); toast('🤱 ' + t('saved')); router(); return; }
    openForm(t(x.dataset.quick === 'ebm' ? 'logEbm' : 'logOther'), `<label>${esc(t('time'))}</label><input type="datetime-local" name="time" required value="${toLocalInput(Date.now())}">
      <label>mL (optional)</label><input type="number" name="ml" min="0" max="500" step="0.5">
      <label>${esc(t('note'))}</label><input type="text" name="note" maxlength="80">`, fd => {
      const tm = parseLocalInput(fd.time); if (!tm) return false;
      S.feeds.push({ id: uid(), babyId: id, time: tm, type: x.dataset.quick, ml: fd.ml ? Number(fd.ml) : null, note: fd.note || '' }); save(); toast(t('saved')); router();
    });
  });
  $$('[data-form]').forEach(x => x.onclick = () => {
    const k = x.dataset.form;
    if (k === 'weight') openForm(t('logWeight'), `<label>${esc(t('date'))}</label><input type="date" name="date" required value="${fmtDate(Date.now())}" max="${fmtDate(Date.now())}">
      <label>${esc(t('weightG'))}</label><input type="number" name="g" min="300" max="8000" required inputmode="numeric">`, fd => {
      const d = parseDateOnly(fd.date); if (d == null) return false;
      S.weights = S.weights.filter(w => !(w.babyId === id && w.date === d)); // one weight per day
      S.weights.push({ id: uid(), babyId: id, date: d, g: Number(fd.g) }); save(); toast(t('saved')); router();
    });
    if (k === 'temp') openForm(t('logTemp'), `<label>${esc(t('time'))}</label><input type="datetime-local" name="time" required value="${toLocalInput(Date.now())}">
      <label>${esc(t('tempC'))}</label><input type="number" name="c" min="30" max="42" step="0.1" required inputmode="decimal">`, fd => {
      const tm = parseLocalInput(fd.time); if (!tm) return false;
      S.temps.push({ id: uid(), babyId: id, time: tm, c: Number(fd.c) }); save(); router();
    });
    if (k === 'past') openForm(t('addPast'), `<label>${esc(t('start'))}</label><input type="datetime-local" name="start" required value="${toLocalInput(Date.now() - 2 * HR)}">
      <label>${esc(t('end'))}</label><input type="datetime-local" name="end" required value="${toLocalInput(Date.now())}">
      <label>${esc(t('who'))}</label>${whoSeg()}`, (fd, form) => {
      const st = parseLocalInput(fd.start), en = parseLocalInput(fd.end);
      if (!st || !en || en <= st || en > Date.now() + MIN) { alert(`${t('end')} > ${t('start')}`); return false; }
      if (en - st > DAY) { alert('Max 24 h'); return false; }
      S.sessions.push({ id: uid(), babyId: id, start: st, end: en, who: fd.who || 'mother' }); save(); toast(t('saved')); router();
    });
  });
  $$('[data-del]').forEach(x => x.onclick = () => {
    if (!confirm(t('confirmDelete'))) return;
    const [k, rid] = x.dataset.del.split(':'); S[k] = S[k].filter(r => r.id !== rid); save(); router();
  });
  $$('[data-csv]').forEach(x => x.onclick = () => exportCsv(b));
}
function exportCsv(b) {
  const rows = [['baby', 'record', 'start_or_time', 'end', 'duration_min', 'who_or_type', 'value', 'note']];
  const q = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
  S.sessions.filter(s => s.babyId === b.id).forEach(s => rows.push([b.name, 'skin_to_skin', fmtDT(s.start), fmtDT(s.end), Math.round((s.end - s.start) / MIN), s.who, '', '']));
  S.feeds.filter(f => f.babyId === b.id).forEach(f => rows.push([b.name, 'feed', fmtDT(f.time), '', '', f.type, f.ml || '', f.note || '']));
  S.weights.filter(w => w.babyId === b.id).forEach(w => rows.push([b.name, 'weight_g', fmtDate(w.date), '', '', '', w.g, w.note || '']));
  S.temps.filter(x => x.babyId === b.id).forEach(x => rows.push([b.name, 'temperature_c', fmtDT(x.time), '', '', '', x.c, '']));
  download(`kmc-${b.name.replace(/\W+/g, '_')}-${fmtDate(Date.now())}.csv`, rows.map(r => r.map(q).join(',')).join('\n'), 'text/csv');
}

/* Daily chart: WHO Annex 4a (hourly, for mothers) + Annex 4b (6-hourly, for health workers) */
function viewDailyChart(id, dateStr) {
  const b = babyById(id); if (!b) return notFound();
  const d = parseDateOnly(dateStr) || dayStart(Date.now());
  const base = d + 8 * HR;
  let rows = '', tot = [[0, 0, 0, 0], [0, 0, 0, 0]];
  for (let i = 0; i < 24; i++) {
    const a = base + i * HR, z = a + HR;
    const mm = Math.round(sscMinutes(id, a, z, 'mother')), om = Math.round(sscMinutes(id, a, z, 'other'));
    const br = feedsIn(id, a, z, 'breast').length > 0, eb = feedsIn(id, a, z, 'ebm').length > 0;
    const half = i < 12 ? 0 : 1; tot[half][0] += mm; tot[half][1] += om; tot[half][2] += br ? 1 : 0; tot[half][3] += eb ? 1 : 0;
    rows += `<tr><td>${fmtTime(a)}–${fmtTime(z)}</td><td class="num">${a > Date.now() ? '' : mm}</td><td class="num">${a > Date.now() ? '' : om}</td><td>${a > Date.now() ? '' : br ? t('yes') : t('no')}</td><td>${a > Date.now() ? '' : eb ? t('yes') : t('no')}</td></tr>`;
    if (i === 11 || i === 23) rows += `<tr style="font-weight:700;background:#f0fdfa"><td>${esc(t('total12'))}</td><td class="num">${fmtMins(tot[half][0])}</td><td class="num">${fmtMins(tot[half][1])}</td><td>${tot[half][2]}</td><td>${tot[half][3]}</td></tr>`;
  }
  // 6-hourly summary for last 8 days ending on selected date
  let six = '';
  for (let k = 7; k >= 0; k--) {
    const d0 = d - k * DAY;
    const w = S.weights.find(x => x.babyId === id && x.date === d0);
    for (let p = 0; p < 4; p++) {
      const a = d0 + p * 6 * HR, z = a + 6 * HR;
      if (a > Date.now()) continue;
      const temps = S.temps.filter(x => x.babyId === id && x.time >= a && x.time < z).sort((x, y) => y.time - x.time);
      const ssc = sscMinutes(id, a, z) / 60, nf = feedsIn(id, a, z).length;
      six += `<tr>${p === 0 ? `<td rowspan="4">${fmtDate(d0)}</td>` : ''}<td>${pad(p * 6)}:00–${pad(p * 6 + 6 === 24 ? 0 : p * 6 + 6)}:00</td><td class="num">${temps[0] ? temps[0].c : ''}</td><td class="num">${p === 0 && w ? w.g : ''}</td><td class="num">${ssc.toFixed(1)}</td><td class="num">${nf}</td></tr>`;
    }
  }
  return `${backLink('#/track/' + id)}
  <h1>${esc(t('dailyChart'))}</h1>
  <div class="card flat noprint"><label for="chartDate">${esc(t('date'))}</label><input type="date" id="chartDate" value="${fmtDate(d)}" max="${fmtDate(Date.now())}">
    <div style="height:.5rem"></div><button class="btn sec" onclick="window.print()">🖨 ${esc(t('print'))}</button></div>
  <div class="card"><p><b>${esc(b.name)}</b> · ${esc(t('dob'))}: ${esc(b.dob)} · ${esc(t('birthWeight'))}: ${esc(b.bw)} · ${esc(t('date'))}: ${fmtDate(d)} 08:00 → ${fmtDate(d + DAY)} 08:00</p>
  <div class="tablewrap"><table><thead><tr><th>${esc(t('hour'))}</th><th class="num">${esc(t('motherMin'))}</th><th class="num">${esc(t('otherMin'))}</th><th>${esc(t('putToBreast'))}</th><th>${esc(t('ebmGiven'))}</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="small muted">Format adapted from WHO KMC clinical practice guide, Annex 4a.</p></div>
  <div class="card"><h3>6-hourly summary (Annex 4b)</h3><div class="tablewrap"><table><thead><tr><th>${esc(t('date'))}</th><th>${esc(t('time'))}</th><th class="num">°C</th><th class="num">g</th><th class="num">SSC h</th><th class="num">${esc(t('feed'))}</th></tr></thead><tbody>${six}</tbody></table></div></div>`;
}

/* ---------- HCP views ---------- */
const ROLES = ['Doctor', 'Nurse', 'Medical Assistant', 'Midwife', 'Community health worker', 'Student', 'Other'];
function learnerForm() {
  const l = S.learner || {};
  openForm('Learner profile', `<label>Full name (for certificate)</label><input type="text" name="name" required maxlength="80" value="${esc(l.name || '')}">
    <label>Role</label><select name="role">${ROLES.map(r => `<option ${l.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select>
    <label>Facility / unit</label><input type="text" name="facility" maxlength="80" value="${esc(l.facility || '')}">`, fd => {
    S.learner = Object.assign({ started: Date.now() }, S.learner || {}, { name: fd.name.trim(), role: fd.role, facility: fd.facility.trim() }); save(); router();
  });
}
const passed = m => S.quiz[m.id] && S.quiz[m.id].best >= PASS_MARK;
const competent = s => S.skills[s.id] && S.skills[s.id].last && S.skills[s.id].last.competent;
function viewHcpHome() {
  const np = MODULES.filter(passed).length, ns = SKILLS.filter(competent).length;
  const l = S.learner;
  return `<div class="hero"><img src="icons/icon-192.png" alt="KMC Connect logo" style="width:84px;height:84px;border-radius:20px;float:right;margin-left:.8rem"><h1>KMC Connect · Provider</h1><p>Structured KMC training based on WHO <i>Kangaroo mother care: a clinical practice guide</i> (2025).</p></div>
  <div class="card">${l ? `<div style="display:flex;gap:.6rem;align-items:center"><div style="flex:1"><b>${esc(l.name)}</b><div class="small muted">${esc(l.role)}${l.facility ? ' · ' + esc(l.facility) : ''}</div></div><button class="btn sm sec" data-learner>Edit</button></div>`
    : `<p>Create a learner profile to track progress and print a certificate.</p><button class="btn" data-learner>Create profile</button>`}
    <div style="margin-top:.8rem"><div class="small">Knowledge modules passed: <b>${np}/${MODULES.length}</b></div><div class="progress"><i style="width:${np / MODULES.length * 100}%"></i></div></div>
    <div style="margin-top:.6rem"><div class="small">Skills signed off competent: <b>${ns}/${SKILLS.length}</b></div><div class="progress"><i style="width:${ns / SKILLS.length * 100}%;background:var(--coral)"></i></div></div>
  </div>
  <div class="grid g3">
    <a class="tile teal" href="#/h/modules"><span class="em">🎓</span><b>Training modules</b><span>${MODULES.length} modules · quizzes (pass ${PASS_MARK}%)</span></a>
    <a class="tile teal" href="#/h/skills"><span class="em">✅</span><b>Skills checklists</b><span>${SKILLS.length} OSCE-style competencies</span></a>
    <a class="tile coral" href="#/h/counsel"><span class="em">🗣️</span><b>Counselling mode</b><span>Parent lessons in EN / BM / 中文</span></a>
    <a class="tile" href="#/h/unit"><span class="em">🏥</span><b>Unit KMC monitor</b><span>SSC hours, feeds, indicators</span></a>
    <a class="tile" href="#/h/tools"><span class="em">🧮</span><b>Clinical tools</b><span>CGA, growth velocity, volumes</span></a>
    <a class="tile" href="#/h/videos"><span class="em">🎬</span><b>WHO video library</b><span>17 videos</span></a>
    <a class="tile" href="#/h/cert"><span class="em">🏅</span><b>Certificate</b><span>Print when complete</span></a>
    <a class="tile" href="#/settings"><span class="em">⚙️</span><b>Settings</b><span>Backup, language</span></a>
    <a class="tile" href="#/about"><span class="em">ℹ️</span><b>About & sources</b><span>Licence, disclaimer</span></a>
    <a class="tile teal" href="#/p" aria-label="Open parent and family section"><span class="em">🤱</span><b>Parent & family section</b><span>Open parent home, education lessons, KMC tracker and danger signs</span></a>
  </div>
  <div class="card flat"><b>Switch to parent view</b><p class="small muted">You can move between healthcare-provider training and the parent-facing section at any time. Your learning progress and parent records remain saved on this device.</p><a class="btn sec block" href="#/p">Open parent section →</a></div>`;
}
function viewModules() {
  return `${backLink('#/h')}<h1>Training modules</h1><p class="small muted">Read each module, watch the linked WHO videos, then pass the quiz (≥${PASS_MARK}%).</p>
  <div class="card">${MODULES.map((m, i) => {
    const q = S.quiz[m.id];
    const chip = passed(m) ? `<span class="chip green">Passed ${q.best}%</span>` : q ? `<span class="chip amber">Best ${q.best}%</span>` : S.read[m.id] ? '<span class="chip">Read</span>' : '';
    return `<a class="linkrow" href="#/h/m/${m.id}"><span class="em">${passed(m) ? '✅' : i + 1}</span><span class="grow"><b>${esc(m.title)}</b><span class="small muted">~${m.mins} min · ${m.quiz.length} questions</span></span>${chip}</a>`;
  }).join('')}</div>`;
}
function viewModule(id) {
  const m = MODULES.find(x => x.id === id); if (!m) return notFound();
  if (!S.read[id]) { S.read[id] = Date.now(); save(); }
  const i = MODULES.indexOf(m), next = MODULES[i + 1];
  return `${backLink('#/h/modules', 'Modules')}
  <div class="hero"><p class="small">Module ${i + 1} of ${MODULES.length} · ~${m.mins} min</p><h1>${esc(m.title)}</h1></div>
  <div class="card"><h3>Learning objectives</h3><ul class="msgs">${m.obj.map(o => `<li>${esc(o)}</li>`).join('')}</ul></div>
  ${m.sec.map(s => `<div class="card"><h3>${esc(s.h)}</h3><ul class="msgs">${s.b.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}
  ${m.videos.length ? `<div class="card"><h3>Videos</h3>${m.videos.map(n => { const v = VIDEOS.find(x => x.n === n); return `<a class="linkrow" href="${v.url}" target="_blank" rel="noopener"><span class="em">▶️</span><span class="grow"><b>Video ${n}: ${esc(v.title.en)}</b><span class="small muted">${esc(v.src)}</span></span>↗</a>`; }).join('')}</div>` : ''}
  <div class="btnrow"><a class="btn" href="#/h/quiz/${m.id}" style="flex:1">📝 Take the quiz</a>${next ? `<a class="btn sec" href="#/h/m/${next.id}">Next module →</a>` : ''}</div>
  <p class="small muted" style="margin-top:1rem">Source: WHO. Kangaroo mother care: a clinical practice guide. 2025. Follow national and hospital protocols where they differ.</p>`;
}
function viewQuiz(id) {
  const m = MODULES.find(x => x.id === id); if (!m) return notFound();
  const q = S.quiz[id];
  return `${backLink('#/h/m/' + id, m.title)}<h1>Quiz: ${esc(m.title)}</h1>
  ${q ? `<p class="small muted">Best score ${q.best}% · attempts ${q.attempts}</p>` : ''}
  <form id="quizForm" class="card">${m.quiz.map((qq, qi) => `<div class="q" data-q="${qi}"><p>${qi + 1}. ${esc(qq.q)}</p>
    ${qq.o.map((o, oi) => `<label class="opt"><input type="radio" name="q${qi}" value="${oi}" required> <span>${esc(o)}</span></label>`).join('')}
    <p class="expl hidden"></p></div>`).join('')}
    <div id="quizResult"></div>
    <button type="submit" class="btn block">Submit answers</button></form>`;
}
function bindQuiz(id) {
  const m = MODULES.find(x => x.id === id); const form = $('#quizForm'); if (!form) return;
  form.onsubmit = e => {
    e.preventDefault();
    let correct = 0;
    m.quiz.forEach((qq, qi) => {
      const sel = form.querySelector(`input[name=q${qi}]:checked`); const v = sel ? Number(sel.value) : -1;
      if (v === qq.a) correct++;
      const box = form.querySelector(`[data-q="${qi}"]`);
      $$('.opt', box).forEach((lab, oi) => { lab.classList.toggle('right', oi === qq.a); lab.classList.toggle('wrong', oi === v && v !== qq.a); $('input', lab).disabled = true; });
      const ex = $('.expl', box); ex.textContent = (v === qq.a ? '✔ ' : '✘ ') + qq.x; ex.classList.remove('hidden');
    });
    const pct = Math.round(correct / m.quiz.length * 100);
    const prev = S.quiz[id] || { best: 0, attempts: 0 };
    S.quiz[id] = { best: Math.max(prev.best, pct), attempts: prev.attempts + 1, last: pct, passedAt: pct >= PASS_MARK ? (prev.passedAt || Date.now()) : prev.passedAt };
    save();
    const i = MODULES.indexOf(m), next = MODULES[i + 1];
    $('#quizResult').innerHTML = `<div class="callout ${pct >= PASS_MARK ? 'green' : 'amber'}"><b>Score: ${correct}/${m.quiz.length} (${pct}%)</b> — ${pct >= PASS_MARK ? 'Passed 🎉' : 'Not yet passed. Review the module and try again.'}</div>
      <div class="btnrow"><a class="btn sec" href="#/h/quiz/${id}" onclick="setTimeout(router,0)">↻ Retake</a>${next ? `<a class="btn" href="#/h/m/${next.id}">Next module →</a>` : `<a class="btn" href="#/h/cert">🏅 Certificate</a>`}</div>`;
    $('button[type=submit]', form).remove();
    $('#quizResult').scrollIntoView({ behavior: 'smooth' });
  };
}
function viewSkills() {
  return `${backLink('#/h')}<h1>Skills checklists</h1>
  <p class="small muted">Practise, then ask a supervisor or trainer to observe you. <span class="crit">★</span> = critical step. Competent = all critical steps + ≥80% of all steps.</p>
  <div class="card">${SKILLS.map(s => {
    const r = S.skills[s.id] && S.skills[s.id].last;
    const chip = r ? (r.competent ? `<span class="chip green">Competent</span>` : `<span class="chip amber">Not yet</span>`) : '';
    return `<a class="linkrow" href="#/h/skill/${s.id}"><span class="em">${r && r.competent ? '✅' : '🩺'}</span><span class="grow"><b>${esc(s.title)}</b><span class="small muted">${s.steps.length} steps · ${esc(s.ref)}</span></span>${chip}</a>`;
  }).join('')}</div>`;
}
function viewSkill(id) {
  const s = SKILLS.find(x => x.id === id); if (!s) return notFound();
  const rec = S.skills[id] || { history: [] };
  const v = VIDEOS.find(x => x.n === s.video);
  return `${backLink('#/h/skills', 'Skills')}<h1>${esc(s.title)}</h1><p class="small muted">WHO KMC clinical practice guide · ${esc(s.ref)}</p>
  ${v ? `<a class="btn sec block" href="${v.url}" target="_blank" rel="noopener">▶ Video ${v.n}: ${esc(v.title.en)}</a><div style="height:.8rem"></div>` : ''}
  <form id="skillForm" class="card">
    ${s.steps.map((st, i) => `<label class="check"><input type="checkbox" name="s${i}"><span>${st.c ? '<span class="crit">★</span> ' : ''}${esc(st.t)}</span></label>`).join('')}
    <div class="row2" style="margin-top:.6rem"><div><label>Assessment type</label><select name="type"><option value="observed">Observed by assessor</option><option value="self">Self-practice</option></select></div>
    <div><label>Date</label><input type="date" name="date" value="${fmtDate(Date.now())}" required></div></div>
    <label>Assessor name & designation</label><input type="text" name="assessor" maxlength="80" placeholder="e.g. Sister A, NICU">
    <label>Comments</label><input type="text" name="comment" maxlength="160">
    <div id="skillResult"></div>
    <button type="submit" class="btn block" style="margin-top:.8rem">Record assessment</button>
  </form>
  ${rec.history.length ? `<div class="card"><h3>Previous assessments</h3><div class="tablewrap"><table><thead><tr><th>Date</th><th>Type</th><th>Score</th><th>Result</th><th>Assessor</th></tr></thead><tbody>
    ${rec.history.slice().reverse().map(h => `<tr><td>${esc(h.date)}</td><td>${esc(h.type)}</td><td>${h.score}%</td><td>${h.competent ? '✅ Competent' : 'Not yet'}</td><td>${esc(h.assessor || '')}</td></tr>`).join('')}</tbody></table></div></div>` : ''}`;
}
function bindSkill(id) {
  const s = SKILLS.find(x => x.id === id); const form = $('#skillForm'); if (!form) return;
  form.onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(form);
    const done = s.steps.map((_, i) => fd.get('s' + i) === 'on');
    const score = Math.round(done.filter(Boolean).length / s.steps.length * 100);
    const critOk = s.steps.every((st, i) => !st.c || done[i]);
    const type = fd.get('type'), assessor = (fd.get('assessor') || '').trim();
    const competentNow = critOk && score >= 80 && type === 'observed' && !!assessor;
    const rec = S.skills[id] || { history: [] };
    const entry = { date: fd.get('date'), type, assessor, comment: fd.get('comment') || '', score, critOk, competent: competentNow, done };
    rec.history.push(entry);
    if (competentNow || !rec.last || !rec.last.competent) rec.last = entry;
    S.skills[id] = rec; save();
    const why = !critOk ? 'One or more critical steps were missed.' : score < 80 ? 'Less than 80% of steps completed.' : type !== 'observed' ? 'Self-practice recorded — competency requires an observed assessment.' : !assessor ? 'Enter the assessor’s name to sign off.' : '';
    $('#skillResult').innerHTML = `<div class="callout ${competentNow ? 'green' : 'amber'}"><b>${score}% — ${competentNow ? 'Competent ✅' : 'Not yet competent'}</b>${why ? '<br>' + esc(why) : ''}</div>`;
    toast('Assessment saved');
  };
}
function viewTools() {
  return `${backLink('#/h')}<h1>Clinical tools</h1>
  <p class="small muted">Educational aids. Always follow your unit protocol and clinical judgement.</p>
  <div class="card"><h3>Corrected gestational age</h3>
    <div class="row2"><div><label>GA at birth (weeks)</label><input type="number" id="cgaW" min="22" max="42" value="32"></div><div><label>+ days</label><input type="number" id="cgaD" min="0" max="6" value="0"></div></div>
    <div class="row2"><div><label>Date of birth</label><input type="date" id="cgaDob" value="${fmtDate(Date.now() - 14 * DAY)}"></div><div><label>On date</label><input type="date" id="cgaOn" value="${fmtDate(Date.now())}"></div></div>
    <div class="callout" id="cgaOut"></div></div>
  <div class="card"><h3>Growth velocity (g/kg/day)</h3>
    <div class="row2"><div><label>Earlier weight (g)</label><input type="number" id="gv1" value="1500"></div><div><label>Date</label><input type="date" id="gvd1" value="${fmtDate(Date.now() - 7 * DAY)}"></div></div>
    <div class="row2"><div><label>Later weight (g)</label><input type="number" id="gv2" value="1680"></div><div><label>Date</label><input type="date" id="gvd2" value="${fmtDate(Date.now())}"></div></div>
    <div class="callout" id="gvOut"></div><p class="small muted">Average-weight method: (W2 − W1) ÷ [(W1 + W2)/2 kg] ÷ days. Target ≈ 15–20 g/kg/day.</p></div>
  <div class="card"><h3>Enteral feed volume (educational)</h3>
    <div class="row2"><div><label>Weight (g)</label><input type="number" id="fvW" value="1500"></div><div><label>mL/kg/day</label><input type="number" id="fvR" value="80" step="10"></div></div>
    <label>Feeds per day</label><select id="fvN"><option value="12">12 (2-hourly)</option><option value="8" selected>8 (3-hourly)</option></select>
    <div class="callout" id="fvOut"></div>
    <p class="small muted">WHO guide: start 60–80 mL/kg/day, increase by 30–40 mL/kg/day as tolerated to ~180 mL/kg/day (some up to 200). Protocols vary.</p></div>
  <div class="card"><h3>Expected expressed breast milk (Table 5)</h3><div class="tablewrap"><table>
    <thead><tr><th>Time since birth</th><th>Per session (both breasts)</th><th>Per day</th></tr></thead><tbody>
    <tr><td>Day 1–2</td><td>Drops – 20 mL</td><td>Drops – 120 mL</td></tr><tr><td>Day 3</td><td>25–45 mL</td><td>160–360 mL</td></tr>
    <tr><td>Day 4–5</td><td>50–60 mL</td><td>400–600 mL</td></tr><tr><td>Day 6–9</td><td>75–90 mL</td><td>600–720 mL</td></tr>
    <tr><td>Day 10+</td><td>≥ 90 mL</td><td>≈ 720 mL</td></tr></tbody></table></div>
    <p class="small muted">Expected with ≥8 pumping + hand-expression sessions per 24 h.</p></div>
  <div class="card"><h3>Quick reference</h3><ul class="msgs">
    <li>SSC: ideally 24 h/day, minimum 8 h/day; sessions ≥1 h.</li><li>Vital signs in KMC: at least 6-hourly. Temperature 36.5–37.5 °C.</li>
    <li>Apnoea: ≥20 s, or shorter with HR &lt;100, cyanosis, pallor or SpO₂ &lt;85%.</li><li>Feeds 8–12 / 24 h; expressing 8–12 / 24 h incl. ≥1 at night.</li>
    <li>Iron 2–4 mg/kg/day once enteral feeds established.</li><li>Stop KMC: ~2500 g or 38–40 weeks CGA (wriggles out). Continue at home to 40 weeks CGA.</li></ul></div>`;
}
function bindTools() {
  const v = id => document.getElementById(id).value;
  const calc = () => {
    const dob = parseDateOnly(v('cgaDob')), on = parseDateOnly(v('cgaOn'));
    const w = Number(v('cgaW')), d = Number(v('cgaD') || 0);
    if (dob != null && on != null && w) {
      const age = Math.round((on - dob) / DAY), c = w * 7 + d + age;
      $('#cgaOut').innerHTML = `Chronological age <b>${age} days</b> (${Math.floor(age / 7)}w ${age % 7}d) · Corrected GA <b>${Math.floor(c / 7)}+${c % 7} weeks</b>${c >= 280 ? ' · term-equivalent reached' : ''}`;
    }
    const w1 = Number(v('gv1')), w2 = Number(v('gv2')), d1 = parseDateOnly(v('gvd1')), d2 = parseDateOnly(v('gvd2'));
    if (w1 && w2 && d1 != null && d2 != null && d2 > d1) {
      const days = (d2 - d1) / DAY, gv = (w2 - w1) / ((w1 + w2) / 2000) / days;
      $('#gvOut').innerHTML = `<b>${gv.toFixed(1)} g/kg/day</b> over ${Math.round(days)} days — ${gv < 15 ? '⚠️ below target: review feeding, KMC duration and illness (Annex 2)' : gv <= 20 ? '✅ within target' : 'above typical range'}`;
    } else $('#gvOut').textContent = 'Enter two weights with the later date after the earlier date.';
    const fw = Number(v('fvW')), fr = Number(v('fvR')), fn = Number(v('fvN'));
    if (fw && fr) { const day = fw / 1000 * fr; $('#fvOut').innerHTML = `<b>${day.toFixed(0)} mL/day</b> → <b>${(day / fn).toFixed(1)} mL</b> per feed × ${fn}`; }
  };
  $$('main input, main select').forEach(el => el.oninput = calc); calc();
}
function viewUnit() {
  const now = Date.now();
  const all = S.babies.filter(b => b.owner === 'u');
  const act = all.filter(b => !b.archived), arch = all.filter(b => b.archived);
  const rows = act.map(b => {
    const h24 = sscMinutes(b.id, now - DAY, now) / 60, today = sscMinutes(b.id, dayStart(now), now) / 60;
    const f = feedsIn(b.id, now - DAY, now + 1); const other = f.some(x => x.type === 'other');
    const lt = latest(S.temps, b.id, 'time'), lw = latest(S.weights, b.id, 'date');
    return { b, h24, today, nf: f.length, ebf: f.length > 0 && !other, lt, lw, run: !!S.timers[b.id] };
  });
  const n = rows.length, met = rows.filter(r => r.h24 >= 8).length, ebf = rows.filter(r => r.ebf).length;
  return `${backLink('#/h')}<h1>Unit KMC monitor</h1>
  <div class="callout amber small">Training & quality-improvement aid. Data are stored only on this device and are not a medical record. Use bed numbers or IDs, not names. Follow your hospital’s data-protection policy.</div>
  <div class="btnrow" style="margin-bottom:1rem"><button class="btn" data-addbaby="u">+ Add newborn</button></div>
  <div class="card"><div class="stat">
    <div><span class="small muted">Newborns in KMC</span><b>${n}</b></div>
    <div><span class="small muted">≥8 h SSC in last 24 h</span><b>${n ? Math.round(met / n * 100) : 0}%</b><span class="small muted">${met}/${n}</span></div>
    <div><span class="small muted">Exclusive breast milk (24 h)</span><b>${n ? Math.round(ebf / n * 100) : 0}%</b><span class="small muted">${ebf}/${n}</span></div>
    <div><span class="small muted">Mean SSC (24 h)</span><b>${n ? (rows.reduce((a, r) => a + r.h24, 0) / n).toFixed(1) : '0.0'} h</b></div>
  </div></div>
  ${n ? `<div class="card"><div class="tablewrap"><table><thead><tr><th>ID / bed</th><th>CGA</th><th class="num">SSC 24 h</th><th class="num">Today</th><th class="num">Feeds 24 h</th><th class="num">Temp</th><th class="num">Weight</th></tr></thead><tbody>
    ${rows.map(r => `<tr class="${r.h24 < 8 || (r.lt && (r.lt.c < 36.5 || r.lt.c > 37.5)) ? 'flag' : ''}"><td><a href="#/track/${r.b.id}">${r.run ? '⏱ ' : ''}${esc(r.b.name)}</a></td><td>${esc(fmtGA(cgaDays(r.b)).replace(' ' + t('weeks'), ''))}</td><td class="num">${r.h24.toFixed(1)}</td><td class="num">${r.today.toFixed(1)}</td><td class="num">${r.nf}${r.ebf ? '' : r.nf ? ' *' : ''}</td><td class="num">${r.lt ? r.lt.c : '—'}</td><td class="num">${r.lw ? r.lw.g : '—'}</td></tr>`).join('')}
    </tbody></table></div><p class="small muted">Red rows: &lt;8 h SSC in the last 24 h or temperature outside 36.5–37.5 °C. * includes non-breast-milk feeds.</p></div>` : `<div class="card center muted">No newborns yet. Add a newborn to start monitoring.</div>`}
  ${arch.length ? `<div class="card"><h3>Discharged / archived (${arch.length})</h3>${arch.map(b => `<a class="linkrow" href="#/track/${b.id}"><span class="grow">${esc(b.name)}</span>›</a>`).join('')}</div>` : ''}`;
}
function certId() {
  const s = (S.learner ? S.learner.name : '') + MODULES.map(m => (S.quiz[m.id] || {}).passedAt || '').join('');
  let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 'KMC-' + h.toString(36).toUpperCase().padStart(7, '0');
}
function viewCert() {
  const all = MODULES.every(passed), l = S.learner;
  if (!l) return `${backLink('#/h')}<h1>Certificate</h1><div class="card"><p>Create a learner profile first.</p><button class="btn" data-learner>Create profile</button></div>`;
  if (!all) return `${backLink('#/h')}<h1>Certificate</h1><div class="card"><p>Pass all ${MODULES.length} module quizzes (≥${PASS_MARK}%) to unlock your certificate.</p>
    <ul class="list">${MODULES.map(m => `<li><span class="em">${passed(m) ? '✅' : '⬜'}</span><a href="#/h/m/${m.id}">${esc(m.title)}</a></li>`).join('')}</ul></div>`;
  const lastPass = Math.max(...MODULES.map(m => S.quiz[m.id].passedAt || 0));
  const sk = SKILLS.filter(competent);
  return `${backLink('#/h')}<div class="btnrow noprint" style="margin-bottom:1rem"><button class="btn" onclick="window.print()">🖨 Print / save as PDF</button></div>
  <div class="cert"><img src="icons/icon-192.png" alt="" style="width:80px;height:80px;border-radius:18px"><p class="muted" style="margin:0">KMC Connect</p>
    <h1>Certificate of Completion</h1><p>This certifies that</p><div class="name">${esc(l.name)}</div>
    <p>${esc(l.role)}${l.facility ? ', ' + esc(l.facility) : ''}</p>
    <p>has successfully completed the <b>Kangaroo Mother Care Healthcare Provider Training</b><br>(${MODULES.length} knowledge modules, pass mark ${PASS_MARK}%)</p>
    <p>Date of completion: <b>${fmtDate(lastPass)}</b> · Certificate ID: <b>${certId()}</b></p>
    ${sk.length ? `<table><thead><tr><th>Competency (observed)</th><th>Date</th><th>Assessor</th></tr></thead><tbody>${sk.map(s => `<tr><td>${esc(s.title)}</td><td>${esc(S.skills[s.id].last.date)}</td><td>${esc(S.skills[s.id].last.assessor)}</td></tr>`).join('')}</tbody></table>` : '<p class="small muted">No observed competencies recorded yet.</p>'}
    <p class="small muted" style="margin-top:1.2rem">Content based on WHO. Kangaroo mother care: a clinical practice guide. Geneva: WHO; 2025 (CC BY-NC-SA 3.0 IGO). This certificate is issued by the training programme using KMC Connect, not by WHO.</p>
    <div class="row2" style="margin-top:2rem"><div style="border-top:1px solid #999;padding-top:.3rem" class="small">Trainer / supervisor</div><div style="border-top:1px solid #999;padding-top:.3rem" class="small">Head of Department</div></div>
  </div>`;
}

/* ---------- settings / about ---------- */
function viewSettings() {
  const st = S.settings;
  return `${backLink(st.mode === 'hcp' ? '#/h' : st.mode === 'parent' ? '#/p' : '#/')}<h1>${esc(t('settings'))}</h1>
  <div class="card"><label for="setLang">${esc(t('language'))}</label>${langSelect('setLang')}
    <label>${esc(t('emergencyNo'))}</label><input type="tel" id="setEm" value="${esc(st.emergency)}">
    <label>${esc(t('hospitalName'))}</label><input type="text" id="setHn" value="${esc(st.hospitalName)}">
    <label>${esc(t('hospitalPhone'))}</label><input type="tel" id="setHp" value="${esc(st.hospitalPhone)}">
    <div style="height:.8rem"></div><button class="btn" id="setSave">${esc(t('save'))}</button></div>
  <div class="card"><a class="btn sec block" href="#/start">🔁 ${esc(t('switchRole'))}</a></div>
  <div class="card"><h3>${esc(t('backup'))}</h3><p class="small muted">${esc(t('privacy'))}</p>
    <div class="btnrow"><button class="btn sec" id="bkOut">⬇ ${esc(t('exportJson'))}</button>
    <label class="btn sec" style="margin:0">⬆ ${esc(t('importJson'))}<input type="file" id="bkIn" accept="application/json,.json" hidden></label></div>
    <div style="height:.8rem"></div><button class="btn red" id="bkReset">${esc(t('resetAll'))}</button></div>
  <p class="small muted center">KMC Connect v${APP_VERSION} · <a href="#/about">${esc(t('about'))}</a></p>`;
}
function bindSettings() {
  bindLang('setLang');
  $('#setSave').onclick = () => { S.settings.emergency = $('#setEm').value.trim() || '999'; S.settings.hospitalName = $('#setHn').value.trim(); S.settings.hospitalPhone = $('#setHp').value.trim(); save(); toast(t('saved')); };
  $('#bkOut').onclick = () => download(`kmc-connect-backup-${fmtDate(Date.now())}.json`, JSON.stringify(S, null, 1), 'application/json');
  $('#bkIn').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { const d = JSON.parse(r.result); if (!Array.isArray(d.babies)) throw 0; if (!confirm(t('importJson') + '?')) return;
        localStorage.setItem(KEY, JSON.stringify(d)); S = load(); applyLang(); toast(t('saved')); router(); }
      catch (err) { alert('Invalid backup file'); }
    };
    r.readAsText(f);
  };
  $('#bkReset').onclick = () => { if (confirm(t('resetConfirm'))) { localStorage.removeItem(KEY); S = load(); applyLang(); location.hash = '#/start'; router(); } };
}
function viewAbout() {
  return `${backLink(S.settings.mode === 'hcp' ? '#/h' : '#/p')}<h1>${esc(t('about'))}</h1>
  <div class="card"><p><b>KMC Connect</b> supports Kangaroo Mother Care (KMC) for preterm and low-birth-weight newborns in two complementary ways: a structured learning and competency platform for doctors, nurses, medical assistants and other healthcare workers, and a simple, visual, multilingual guide that helps parents practise KMC safely in hospital and at home — with a tracker for skin-to-skin hours, feeds, weight and temperature.</p>
  <p class="small">${esc(t('disclaimer'))}</p></div>
  <div class="card"><h3>Sources</h3><ul class="msgs">
    <li><a href="${CLINICAL_GUIDE_URL}" target="_blank" rel="noopener">WHO. Kangaroo mother care: a clinical practice guide. Geneva: World Health Organization; 2025.</a> Licence: CC BY-NC-SA 3.0 IGO.</li>
    <li><a href="${PARENT_GUIDE_URL}" target="_blank" rel="noopener">WHO. Parent counselling guide on kangaroo mother care (KMC). Geneva: World Health Organization; 2025.</a> Licence: CC BY-NC-SA 3.0 IGO.</li>
    <li>Videos: WHO (St John’s Medical College Hospital, Bangalore; WHO Western Pacific Regional Office) and Global Health Media, as linked in the WHO guide.</li></ul></div>
  <div class="card"><h3>Licence & disclaimers</h3><ul class="msgs small">
    <li>This app is an adaptation of WHO material and is shared under the same licence, CC BY-NC-SA 3.0 IGO, for non-commercial use. WHO does not endorse this app or any organisation, product or service.</li>
    <li>The Bahasa Melayu and Chinese translations were not created by WHO. WHO is not responsible for their content or accuracy. The original English edition is the binding and authentic edition.</li>
    <li>Illustrations in this app are original simple drawings, not WHO illustrations.</li>
    <li>${esc(t('privacy'))}</li></ul></div>`;
}
function notFound() { return `<div class="card center"><p>Page not found.</p><a class="btn" href="#/">Home</a></div>`; }

/* ---------- router ---------- */
function router() {
  const h = location.hash || '#/';
  const main = $('#app');
  let m, html = '', after = null, mode = S.settings.mode;
  const route = (re) => (m = h.match(re));
  if (h === '#/' || h === '' || h === '#') {
    if (S.settings.mode === 'parent') { location.replace('#/p'); return; }
    if (S.settings.mode === 'hcp') { location.replace('#/h'); return; }
    html = viewStart(); after = bindStart; mode = null;
  }
  else if (route(/^#\/start$/)) { html = viewStart(); after = bindStart; mode = null; }
  else if (route(/^#\/p$/)) { mode = 'parent'; html = viewParentHome(); }
  else if (route(/^#\/p\/learn$/)) { mode = 'parent'; html = viewLessons(); }
  else if (route(/^#\/p\/learn\/(\w+)$/)) { mode = 'parent'; html = viewLesson(m[1]); }
  else if (route(/^#\/p\/position$/)) { mode = 'parent'; html = viewPosition(); }
  else if (route(/^#\/p\/danger$/)) { mode = 'parent'; html = viewDanger(); }
  else if (route(/^#\/p\/videos$/)) { mode = 'parent'; html = viewVideos('parent'); }
  else if (route(/^#\/p\/track$/)) { mode = 'parent'; html = viewTrackerParent(); after = () => bindTracker(activeParentBaby()); }
  else if (route(/^#\/track\/(\w+)$/)) { const b = babyById(m[1]); mode = b && b.owner === 'u' ? 'hcp' : 'parent'; if (b && b.owner === 'p') { S.activeBaby = b.id; save(); } html = viewTracker(b); after = () => bindTracker(b); }
  else if (route(/^#\/chart\/(\w+)(?:\?d=([\d-]+))?$/)) { const b = babyById(m[1]); mode = b && b.owner === 'u' ? 'hcp' : 'parent'; html = viewDailyChart(m[1], m[2]); after = () => { const el = $('#chartDate'); if (el) el.onchange = () => { location.hash = `#/chart/${m[1]}?d=${el.value}`; }; }; }
  else if (route(/^#\/h$/)) { mode = 'hcp'; html = viewHcpHome(); }
  else if (route(/^#\/h\/modules$/)) { mode = 'hcp'; html = viewModules(); }
  else if (route(/^#\/h\/m\/(\w+)$/)) { mode = 'hcp'; html = viewModule(m[1]); }
  else if (route(/^#\/h\/quiz\/(\w+)$/)) { mode = 'hcp'; html = viewQuiz(m[1]); after = () => bindQuiz(m[1]); }
  else if (route(/^#\/h\/skills$/)) { mode = 'hcp'; html = viewSkills(); }
  else if (route(/^#\/h\/skill\/(\w+)$/)) { mode = 'hcp'; html = viewSkill(m[1]); after = () => bindSkill(m[1]); }
  else if (route(/^#\/h\/videos$/)) { mode = 'hcp'; html = viewVideos('hcp'); }
  else if (route(/^#\/h\/tools$/)) { mode = 'hcp'; html = viewTools(); after = bindTools; }
  else if (route(/^#\/h\/unit$/)) { mode = 'hcp'; html = viewUnit(); }
  else if (route(/^#\/h\/cert$/)) { mode = 'hcp'; html = viewCert(); }
  else if (route(/^#\/h\/counsel$/)) { mode = 'hcp'; html = viewLessons('#/h/counsel'); after = () => bindLang('cLang'); }
  else if (route(/^#\/h\/counsel\/(\w+)$/)) { mode = 'hcp'; html = viewLesson(m[1], '#/h/counsel'); }
  else if (route(/^#\/settings$/)) { html = viewSettings(); after = bindSettings; }
  else if (route(/^#\/about$/)) { html = viewAbout(); }
  else html = notFound();

  if (mode && mode !== S.settings.mode && (h.startsWith('#/p') || h.startsWith('#/h'))) { S.settings.mode = mode; save(); }
  main.innerHTML = html;
  setNav(mode);
  // generic bindings
  $$('[data-learner]').forEach(b => b.onclick = learnerForm);
  $$('[data-addbaby]').forEach(b => b.onclick = () => babyForm(b.dataset.addbaby));
  if (after) after();
  updatePill();
  window.scrollTo(0, 0);
}

/* ---------- boot ---------- */
window.addEventListener('hashchange', router);
document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  $('#topLang').onchange = e => { S.settings.lang = e.target.value; save(); applyLang(); router(); };
  router();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
});
