/* =========================================================
   script.js - MY COMEBACK ERA logic.
   Sections: 1 State  2 Helpers  3 Views  4 Events  5 Timer
   ========================================================= */

/* ---------- 1. STATE (saved in LocalStorage) ---------- */
const KEY = 'interviewos.v1';
const LV = { B: 'Beginner', I: 'Intermediate', A: 'Advanced' };
const MINS = { B: 10, I: 20, A: 30 };       // estimated minutes per topic level
const SUBMINS = { B: 5, I: 10, A: 15 };     // estimated minutes per subtopic
const STATUS = ['Not Started', 'In Progress', 'Completed'];
const REV = ['—', 'Need Revision', 'Revising', 'Mastered'];

// S.t[id] = {s: status 0/1/2, n: notes, u: url, r: revision 0-3, rc: revision count}
let S = { t: {}, plan: {}, goal: 3, min: {}, act: {}, done: [], ready: { coding: 0, quiz: 0, proj: 0 }, cur: {}, last: 'py' };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore corrupt data */ }
const save = () => localStorage.setItem(KEY, JSON.stringify(S));

/* ---------- 2. HELPERS ---------- */
// Flat list of every checkable item (topics + subtopics) in learning order
const ALL = [], BYID = {}, BYS = {};
SUBJECTS.forEach(s => {
  BYS[s.id] = [];
  s.modules.forEach((m, mi) => m.items.forEach(it => {
    [it, ...it.kids].forEach(x => {
      x.sid = s.id; x.mi = mi; x.mod = m.name;
      x.mins = x.p ? SUBMINS[x.level] : MINS[x.level];
      ALL.push(x); BYID[x.id] = x; BYS[s.id].push(x);
    });
  }));
});
const $ = q => document.querySelector(q);
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const today = () => fmt(new Date());
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return fmt(d); };
const T = id => S.t[id] || (S.t[id] = { s: 0, n: '', u: '', r: 0, rc: 0 });
const st = id => (S.t[id] || {}).s || 0;
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const OPEN = new Set();                      // which expanders are open
const V = { q: '', f: 'All' };               // subject-page search / filter

function stats(list) {
  const done = list.filter(x => st(x.id) === 2).length;
  const prog = list.filter(x => st(x.id) === 1).length;
  return { total: list.length, done, prog, left: list.length - done, p: pct(done, list.length) };
}
const subj = id => SUBJECTS.find(s => s.id === id);
const nextOf = (sid, from = 0) => {          // first incomplete topic at/after index
  const l = BYS[sid];
  for (let i = from; i < l.length; i++) if (st(l[i].id) !== 2) return i;
  for (let i = 0; i < from; i++) if (st(l[i].id) !== 2) return i;
  return -1;
};
const streak = () => {
  let n = 0, i = S.act[today()] || S.min[today()] ? 0 : 1;
  while (S.act[daysAgo(i)] || S.min[daysAgo(i)]) { n++; i++; }
  return n;
};

function setStatus(id, v) {                  // the single place that changes a topic's status
  const t = T(id); t.s = v;
  S.done = S.done.filter(x => x !== id);
  if (v === 2) { t.d = today(); S.act[today()] = 1; S.done.unshift(id); S.done = S.done.slice(0, 30); }
  S.last = BYID[id].sid;
  save();
}

/* ---------- 3. VIEWS ---------- */
const ring = (p, size = 90, col = 'var(--pu)') => {
  const r = 36, c = 2 * Math.PI * r;
  return `<span class="ring"><svg width="${size}" height="${size}" viewBox="0 0 90 90"><circle cx="45" cy="45" r="${r}" stroke="var(--line)"/><circle cx="45" cy="45" r="${r}" stroke="${col}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}" transform="rotate(-90 45 45)"/></svg><b>${p}%</b></span>`;
};
const bar = p => `<div class="bar"><i style="width:${p}%"></i></div>`;

// One checklist row (used everywhere). opts.kids = expandable subtopics
function row(x, opts = {}) {
  const t = S.t[x.id] || {}, s = t.s || 0, nk = 'n-' + x.id;
  const kids = !x.p && x.kids && x.kids.length;
  const kd = kids ? x.kids.filter(k => st(k.id) === 2).length : 0;
  return `<div class="row ${s === 2 ? 'done' : ''}">
    ${kids ? `<button class="tog" data-a="tog" data-k="k-${x.id}">${OPEN.has('k-' + x.id) ? '▾' : '▸'}</button>` : ''}
    <input type="checkbox" data-a="chk" data-id="${x.id}" ${s === 2 ? 'checked' : ''}>
    <span class="nm">${esc(x.name)}${kids ? ` <span class="mu sm">(${kd}/${x.kids.length})</span>` : ''}${opts.sub ? ` <span class="mu sm">· ${esc(subj(x.sid).name)}</span>` : ''}</span>
    <span class="lv ${x.level}">${LV[x.level]}</span><span class="tm">${x.mins}m</span>
    <select data-a="st" data-id="${x.id}">${STATUS.map((n, i) => `<option value="${i}" ${i === s ? 'selected' : ''}>${n}</option>`).join('')}</select>
    <button class="btn sm" data-a="plan" data-id="${x.id}" title="Add to today's plan">＋Today</button>
    <button class="btn sm" data-a="rev" data-id="${x.id}" title="Mark for revision">${t.r ? '↻ ' + REV[t.r] : '↻ Revise'}</button>
    <button class="btn sm" data-a="tog" data-k="${nk}">📝${t.n || t.u ? '•' : ''}</button>
  </div>
  ${OPEN.has(nk) ? `<div class="notes"><textarea data-a="note" data-id="${x.id}" placeholder="Notes (autosaved)...">${esc(t.n)}</textarea><input type="url" data-a="url" data-id="${x.id}" placeholder="Resource URL (optional)" value="${esc(t.u)}">${t.u ? `<a class="sm" style="color:var(--cy)" href="${esc(t.u)}" target="_blank" rel="noopener">Open resource ↗</a>` : ''}</div>` : ''}
  ${kids && OPEN.has('k-' + x.id) ? `<div class="kids">${x.kids.map(k => { Object.assign(k, { sid: x.sid }); return row(BYID[k.id]); }).join('')}</div>` : ''}`;
}

function viewDash() {
  const a = stats(ALL), subs = SUBJECTS.map(s => ({ s, ...stats(BYS[s.id]) }));
  const weakest = [...subs].sort((x, y) => x.p - y.p)[0];
  const lastS = subj(S.last) || SUBJECTS[0], li = nextOf(lastS.id);
  const wi = nextOf(weakest.s.id);
  const week = [6, 5, 4, 3, 2, 1, 0].map(n => { const d = new Date(); d.setDate(d.getDate() - n); return { l: 'SMTWTFS'[d.getDay()], m: S.min[fmt(d)] || 0 }; });
  const mx = Math.max(30, ...week.map(w => w.m));
  return `<h1>Dashboard</h1><p class="sub">Your interview preparation at a glance.</p>
  <div class="grid g4">
    <div class="card flex">${ring(a.p, 90)}<div class="stat"><b>${a.done}/${a.total}</b><span>Overall roadmap</span></div></div>
    ${[['Total subjects', SUBJECTS.length], ['Total topics', a.total], ['Completed', a.done], ['Remaining', a.left], ['In progress', a.prog], ['Study streak', streak() + ' days'], ["Today's study", (S.min[today()] || 0) + ' min']].map(x => `<div class="card stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('')}
  </div><br>
  <div class="grid g2">
    <div class="card"><h2>Continue learning</h2><b>${esc(lastS.name)}</b>
      <p class="mu">${li < 0 ? 'All topics complete 🎉' : 'Next: ' + esc(BYS[lastS.id][li].name) + ' · ' + esc(BYS[lastS.id][li].mod)}</p><br>
      <a class="btn pri" href="#/learn/${lastS.id}">Continue →</a></div>
    <div class="card"><h2>Recommended next topic</h2><b>${wi < 0 ? '—' : esc(BYS[weakest.s.id][wi].name)}</b>
      <p class="mu">Weakest subject: ${esc(weakest.s.name)} (${weakest.p}%)</p><br>
      <a class="btn" href="#/learn/${weakest.s.id}">Study it →</a></div>
    <div class="card"><h2>Weekly activity (minutes)</h2><div class="week">${week.map(w => `<div title="${w.m} min"><i style="height:${w.m / mx * 90}px"></i>${w.l}</div>`).join('')}</div></div>
    <div class="card"><h2>Recently completed</h2>${S.done.slice(0, 8).map(id => `<div class="sm">✓ ${esc(BYID[id].name)} <span class="mu">· ${esc(subj(BYID[id].sid).name)}</span></div>`).join('') || '<p class="mu">Nothing completed yet. Tick your first topic!</p>'}</div>
  </div><br>
  <div class="card"><h2>Subject-wise progress</h2><div class="grid g2">${subs.map(x => `<a href="#/subject/${x.s.id}"><div class="flex sp sm"><span>${x.s.icon} ${esc(x.s.name)}</span><span class="mu">${x.done}/${x.total} · ${x.p}%</span></div>${bar(x.p)}</a>`).join('')}</div></div>`;
}

function subjCard(s) {
  const x = stats(BYS[s.id]), ni = nextOf(s.id);
  const cur = ni < 0 ? '—' : BYS[s.id][ni].mod;
  return `<div class="card subj"><div class="flex sp"><span class="ic">${s.icon}</span>${ring(x.p, 54)}</div>
    <b>${esc(s.name)}</b><span class="mu sm">${x.done}/${x.total} topics · ${s.modules.length} modules</span>${bar(x.p)}
    <span class="sm"><span class="mu">Module:</span> ${esc(cur)}</span>
    <span class="sm"><span class="mu">Next:</span> ${ni < 0 ? 'All done 🎉' : esc(BYS[s.id][ni].name)}</span>
    <div class="flex"><a class="btn pri" href="#/learn/${s.id}">${x.done ? 'Continue' : 'Start'}</a><a class="btn" href="#/subject/${s.id}">Roadmap</a></div></div>`;
}
function subjBody() {                         // grid + search hits (re-rendered on typing)
  const q = V.q.toLowerCase();
  const list = SUBJECTS.filter(s => {
    const x = stats(BYS[s.id]), state = x.done === x.total ? 'Completed' : (x.done || x.prog) ? 'In Progress' : 'Not Started';
    return (V.f === 'All' || V.f === state) && (!q || s.name.toLowerCase().includes(q));
  });
  const hits = q ? ALL.filter(x => x.name.toLowerCase().includes(q)).slice(0, 40) : [];
  return `<div class="grid g3">${list.map(subjCard).join('') || '<p class="mu">No subjects match.</p>'}</div>` +
    (q ? `<br><div class="card"><h2>Topic matches (${hits.length}${hits.length === 40 ? '+' : ''})</h2>${hits.map(x => row(x, { sub: 1 })).join('') || '<p class="mu">No topics match.</p>'}</div>` : '');
}
function viewSubjects() {
  return `<h1>Subjects</h1><p class="sub">13 roadmaps, every concept individually checkable.</p>
  <div class="flex" style="margin-bottom:16px"><input type="text" id="q" placeholder="Search subjects and topics..." value="${esc(V.q)}" style="min-width:240px">
  <div class="chips">${['All', 'Not Started', 'In Progress', 'Completed'].map(f => `<button class="chip ${V.f === f ? 'on' : ''}" data-a="filter" data-f="${f}">${f}</button>`).join('')}</div></div>
  <div id="body">${subjBody()}</div>`;
}

function viewSubject(id) {
  const s = subj(id); if (!s) return viewSubjects();
  const x = stats(BYS[id]);
  return `<a class="mu" href="#/subjects">← Subjects</a>
  <div class="flex sp" style="margin:10px 0 18px"><div class="flex">${ring(x.p, 80)}<div><h1>${s.icon} ${esc(s.name)}</h1><span class="mu">${x.done}/${x.total} complete · ${x.prog} in progress</span></div></div>
  <a class="btn pri" href="#/learn/${id}">▶ Start Learning</a></div>
  ${s.modules.map((m, mi) => {
    const ms = stats(BYS[id].filter(t => t.mi === mi)), k = `m-${id}-${mi}`, open = OPEN.has(k);
    return `<div class="card mod"><div class="mod-h" data-a="tog" data-k="${k}"><span>${open ? '▾' : '▸'} <b>Module ${mi + 1}: ${esc(m.name)}</b> <span class="lv ${m.level}">${LV[m.level]}</span></span><span class="mu sm">${ms.done}/${ms.total} · ${ms.p}%</span></div>
    ${open ? `<div class="mod-b">${m.items.map(it => row(it)).join('')}</div>` : ''}</div>`;
  }).join('')}`;
}

function viewLearn(id) {
  const s = subj(id); if (!s) return viewSubjects();
  const l = BYS[id]; S.last = id;
  let i = S.cur[id]; if (i == null || i >= l.length) i = Math.max(0, nextOf(id));
  S.cur[id] = i; const c = l[i], t = S.t[c.id] || {};
  const nx = l[i + 1], rem = l.filter((z, j) => j !== i && st(z.id) !== 2).length;
  const x = stats(l);
  return `<a class="mu" href="#/subject/${id}">← ${esc(s.name)} roadmap</a>
  <div class="flex sp" style="margin:10px 0"><h1>${s.icon} Learning mode</h1><span class="mu">${x.done}/${x.total} · ${x.p}%</span></div>${bar(x.p)}<br>
  <div class="path"><div class="card cur"><small>CURRENT TOPIC</small><h3>${esc(c.name)}</h3><span class="mu sm">${esc(c.mod)} · ${LV[c.level]} · ~${c.mins} min · ${i + 1}/${l.length}</span></div>
  <div class="card"><small>NEXT TOPIC</small><h3>${nx ? esc(nx.name) : '—'}</h3></div>
  <div class="card"><small>REMAINING TOPICS</small><h3>${rem}</h3></div></div><br>
  <div class="card"><div class="flex">
    <button class="btn" data-a="prev">← Previous</button>
    <button class="btn" data-a="inprog" data-id="${c.id}">In Progress</button>
    <button class="btn pri" data-a="complete" data-id="${c.id}">${st(c.id) === 2 ? '✓ Completed' : '✓ Mark complete'}</button>
    <button class="btn" data-a="next">Next →</button></div>
    <p class="mu sm" style="margin:10px 0 4px">Status: ${STATUS[st(c.id)]} · navigate freely, nothing is locked.</p>
    <textarea data-a="note" data-id="${c.id}" placeholder="Notes for this topic (autosaved)...">${esc(t.n)}</textarea>
    <input type="url" style="margin-top:6px;width:100%" data-a="url" data-id="${c.id}" placeholder="Resource URL (optional)" value="${esc(t.u)}"></div><br>
  <div class="card upl"><h2>Up next in order</h2>${l.slice(i, i + 12).map((z, j) => `<button class="${j ? '' : 'now'}" data-a="goto" data-i="${i + j}"><span>${st(z.id) === 2 ? '✓' : '○'}</span><span>${z.p ? '↳ ' : ''}${esc(z.name)}</span></button>`).join('')}</div>`;
}

function viewPlan() {
  const d = today(), ids = S.plan[d] || [], dn = ids.filter(id => st(id) === 2).length;
  const q = (V.pq || '').toLowerCase();
  const hits = q ? ALL.filter(x => x.name.toLowerCase().includes(q) && !ids.includes(x.id)).slice(0, 12) : [];
  return `<h1>Daily planner</h1><p class="sub">${d}</p>
  <div class="grid g2"><div class="card flex">${ring(pct(dn, Math.max(S.goal, ids.length) || 1), 90, 'var(--cy)')}<div><b>${dn} / ${S.goal} goals done</b><br><span class="mu sm">Daily goal (topics):</span> <input type="number" min="1" max="50" value="${S.goal}" data-a="goal" style="width:70px"></div></div>
  <div class="card"><h2>Add a topic to today</h2><input type="text" id="pq" placeholder="Search any topic..." value="${esc(V.pq || '')}" style="width:100%"><div id="phits">${hits.map(x => `<div class="flex sp sm" style="margin-top:6px"><span>${esc(x.name)} <span class="mu">· ${esc(subj(x.sid).name)}</span></span><button class="btn sm" data-a="plan" data-id="${x.id}">＋ Add</button></div>`).join('')}</div></div></div><br>
  <div class="card"><h2>Today's list (${ids.length})</h2>${ids.map(id => row(BYID[id], { sub: 1 }) + `<button class="btn sm" data-a="unplan" data-id="${id}" style="margin-left:34px">remove from plan</button>`).join('') || '<p class="mu">Nothing planned. Use search above or the ＋Today button on any topic.</p>'}</div>`;
}

function viewRevise() {
  const l = ALL.filter(x => (S.t[x.id] || {}).r);
  const sug = ALL.filter(x => st(x.id) === 2 && !(S.t[x.id] || {}).r).slice(0, 5);
  const cnt = r => l.filter(x => S.t[x.id].r === r).length;
  return `<h1>Revision tracker</h1><p class="sub">Need Revision: ${cnt(1)} · Revising: ${cnt(2)} · Mastered: ${cnt(3)}</p>
  <div class="card">${l.map(x => `<div class="row"><span class="nm">${esc(x.name)} <span class="mu sm">· ${esc(subj(x.sid).name)}</span></span><span class="pill">Revised ${S.t[x.id].rc}×</span>
   <select data-a="revset" data-id="${x.id}">${[1, 2, 3].map(i => `<option value="${i}" ${S.t[x.id].r === i ? 'selected' : ''}>${REV[i]}</option>`).join('')}</select>
   <button class="btn sm" data-a="revplus" data-id="${x.id}">+1 revision</button><button class="btn sm" data-a="revoff" data-id="${x.id}">✕</button></div>`).join('') || '<p class="mu">No topics marked yet. Press ↻ Revise on any topic.</p>'}</div>
  ${sug.length ? `<br><div class="card"><h2>Completed topics you could revise</h2>${sug.map(x => `<div class="flex sp sm"><span>${esc(x.name)}</span><button class="btn sm" data-a="rev" data-id="${x.id}">↻ Mark</button></div>`).join('')}</div>` : ''}`;
}

function readiness() {
  const a = stats(ALL), r = S.ready, done = ALL.filter(x => st(x.id) === 2).length;
  const mastered = ALL.filter(x => (S.t[x.id] || {}).r === 3).length;
  const parts = [
    ['Topics completed (40%)', a.p, 40], ['Coding questions (20%, goal 150)', Math.min(100, r.coding / 150 * 100), 20],
    ['Practice quizzes (15%, goal 30)', Math.min(100, r.quiz / 30 * 100), 15], ['Revision (15%, mastered vs completed)', Math.min(100, pct(mastered, Math.max(done, 1))), 15],
    ['Projects (10%, goal 5)', Math.min(100, r.proj / 5 * 100), 10]];
  return { parts, score: Math.round(parts.reduce((t, p) => t + p[1] * p[2] / 100, 0)) };
}
function viewReady() {
  const R = readiness(), r = S.ready;
  return `<h1>Interview readiness</h1><p class="sub">An estimate from your own tracked effort.</p>
  <div class="grid g2"><div class="card flex">${ring(R.score, 130, 'var(--cy)')}<div><b style="font-size:20px">${R.score < 35 ? 'Just starting' : R.score < 65 ? 'Getting there' : R.score < 85 ? 'Nearly ready' : 'Interview ready'}</b></div></div>
  <div class="card"><h2>Log your practice</h2><div class="grid">
   ${[['coding', 'Coding questions solved'], ['quiz', 'Practice quizzes taken'], ['proj', 'Projects completed']].map(([k, n]) => `<label class="flex sp">${n}<input type="number" min="0" value="${r[k]}" data-a="ready" data-k="${k}" style="width:90px"></label>`).join('')}</div></div></div><br>
  <div class="card"><h2>Breakdown</h2>${R.parts.map(p => `<div class="sm flex sp"><span>${p[0]}</span><span class="mu">${Math.round(p[1])}%</span></div>${bar(p[1])}<br>`).join('')}</div>`;
}

function viewTimer() {
  return `<h1>Pomodoro timer</h1><p class="sub">Focus sessions count toward today's study time.</p>
  <div class="card" style="max-width:520px"><div class="chips" style="justify-content:center;margin-bottom:10px">${[['focus', 'Focus 25'], ['short', 'Break 5'], ['long', 'Long break 15']].map(([m, n]) => `<button class="chip ${P.mode === m ? 'on' : ''}" data-a="pmode" data-m="${m}">${n}</button>`).join('')}</div>
  <div class="timer" id="tm">${clock()}</div>
  <div class="flex" style="justify-content:center;margin-top:10px"><button class="btn pri" data-a="pstart" id="pbtn">${P.run ? 'Pause' : 'Start'}</button><button class="btn" data-a="preset">Reset</button></div>
  <p class="mu sm" style="text-align:center;margin-top:12px" id="pinfo">Today: ${S.min[today()] || 0} min studied · ${P.cycles} focus sessions this visit</p></div><br>
  <div class="card flex" style="max-width:520px">Log study time manually: <input type="number" id="logm" min="1" value="30" style="width:80px"> min <button class="btn" data-a="log">Add</button></div>`;
}

/* ---------- Router ---------- */
const NAV = [['dash', '🏠 Dashboard'], ['subjects', '📚 Subjects'], ['plan', '🗓️ Daily planner'], ['revise', '↻ Revision'], ['timer', '⏱️ Pomodoro'], ['ready', '🎯 Readiness']];
function render(keepScroll = true) {
  const y = scrollY, [, v, a] = (location.hash || '#/dash').split('/');
  const map = { dash: viewDash, subjects: viewSubjects, subject: () => viewSubject(a), learn: () => viewLearn(a), plan: viewPlan, revise: viewRevise, ready: viewReady, timer: viewTimer };
  $('#app').innerHTML = (map[v] || viewDash)();
  const cur = v === 'subject' || v === 'learn' ? 'subjects' : v;
  $('#nav').innerHTML = NAV.map(n => `<a href="#/${n[0]}" class="${n[0] === cur ? 'on' : ''}">${n[1]}</a>`).join('');
  const a2 = stats(ALL); $('#sideProg').innerHTML = `Overall ${a2.p}%${bar(a2.p)}<div style="margin-top:6px">${a2.done}/${a2.total} topics</div>`;
  keepScroll ? scrollTo(0, y) : scrollTo(0, 0);
  $('#side').classList.remove('open');
}
window.addEventListener('hashchange', () => render(false));

/* ---------- 4. EVENTS (one delegated handler for the whole app) ---------- */
document.addEventListener('click', e => {
  if (e.target.id === 'burger') return $('#side').classList.toggle('open');
  const el = e.target.closest('[data-a]'); if (!el) return;
  const a = el.dataset.a, id = el.dataset.id, sid = (location.hash.split('/')[2]);
  if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.type === 'url' || el.type === 'number') return;
  switch (a) {
    case 'tog': OPEN.has(el.dataset.k) ? OPEN.delete(el.dataset.k) : OPEN.add(el.dataset.k); break;
    case 'chk': e.preventDefault(); setStatus(id, st(id) === 2 ? 0 : 2); break;
    case 'plan': { const d = today(); S.plan[d] = S.plan[d] || []; if (!S.plan[d].includes(id)) S.plan[d].push(id); save(); break; }
    case 'unplan': S.plan[today()] = (S.plan[today()] || []).filter(x => x !== id); save(); break;
    case 'rev': { const t = T(id); t.r = t.r ? 0 : 1; save(); break; }
    case 'revplus': T(id).rc++; save(); break;
    case 'revoff': T(id).r = 0; save(); break;
    case 'filter': V.f = el.dataset.f; break;
    case 'prev': S.cur[sid] = Math.max(0, (S.cur[sid] || 0) - 1); save(); break;
    case 'next': S.cur[sid] = Math.min(BYS[sid].length - 1, (S.cur[sid] || 0) + 1); save(); break;
    case 'goto': S.cur[sid] = +el.dataset.i; save(); break;
    case 'inprog': setStatus(id, 1); break;
    case 'complete': { setStatus(id, 2); const n = nextOf(sid, S.cur[sid] + 1); if (n >= 0) S.cur[sid] = n; save(); break; }
    case 'pmode': setMode(el.dataset.m); break;
    case 'pstart': P.run ? pausePomo() : startPomo(); return;
    case 'preset': setMode(P.mode); break;
    case 'log': { const m = +$('#logm').value; if (m > 0) { S.min[today()] = (S.min[today()] || 0) + m; save(); } break; }
    default: return;
  }
  render();
});
document.addEventListener('change', e => {         // dropdowns
  const el = e.target, a = el.dataset.a; if (!a) return;
  if (a === 'st') setStatus(el.dataset.id, +el.value);
  else if (a === 'revset') { T(el.dataset.id).r = +el.value; save(); }
  else return;
  render();
});
document.addEventListener('input', e => {          // typing: autosave without re-rendering (keeps focus)
  const el = e.target, a = el.dataset.a;
  if (a === 'note') { T(el.dataset.id).n = el.value; save(); }
  else if (a === 'url') { T(el.dataset.id).u = el.value.trim(); save(); }
  else if (a === 'goal') { S.goal = Math.max(1, +el.value || 1); save(); }
  else if (a === 'ready') { S.ready[el.dataset.k] = Math.max(0, +el.value || 0); save(); }
  else if (el.id === 'q') { V.q = el.value; $('#body').innerHTML = subjBody(); }
  else if (el.id === 'pq') { V.pq = el.value; const p = viewPlan(); const d = document.createElement('div'); d.innerHTML = p; $('#phits').innerHTML = d.querySelector('#phits').innerHTML; }
});
$('#burger').addEventListener('click', () => $('#side').classList.toggle('open'));

/* ---------- 5. POMODORO TIMER ---------- */
const LEN = { focus: 25, short: 5, long: 15 };
const P = { mode: 'focus', left: 1500, run: false, end: 0, iv: null, cycles: 0 };
const clock = () => { const s = Math.max(0, Math.round(P.left)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
function setMode(m) { clearInterval(P.iv); Object.assign(P, { mode: m, left: LEN[m] * 60, run: false }); }
function startPomo() {
  P.run = true; P.end = Date.now() + P.left * 1000;
  P.iv = setInterval(() => {
    P.left = (P.end - Date.now()) / 1000;
    if (P.left <= 0) return finishPomo();
    const t = $('#tm'); if (t) t.textContent = clock();
    document.title = clock() + ' · MY COMEBACK ERA';
  }, 250);
  render();
}
function pausePomo() { clearInterval(P.iv); P.run = false; P.left = (P.end - Date.now()) / 1000; render(); }
function finishPomo() {
  clearInterval(P.iv); const was = P.mode;
  if (was === 'focus') { S.min[today()] = (S.min[today()] || 0) + 25; S.act[today()] = 1; P.cycles++; save(); }
  try { const c = new AudioContext(), o = c.createOscillator(); o.connect(c.destination); o.start(); o.stop(c.currentTime + .4); } catch (e) { }
  document.title = 'MY COMEBACK ERA — Complete Learning Roadmap';
  setMode(was === 'focus' ? (P.cycles % 4 === 0 ? 'long' : 'short') : 'focus'); render();
}

render(false);
